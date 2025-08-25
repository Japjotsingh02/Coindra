import { dark, light } from "@/settings/theme";
import { Candle, OHLC } from "@/types/candle";
import { HeatmapCell } from "@/types/heatmap";

export function processHeatmapData(
  candles: Candle[],
  rollingWindow: number = 7
): HeatmapCell[] {
  if (candles.length === 0) return [];

  // Intraday volatility
  const dailyVolatilities = candles.map((c) => ({
    date: c.date,
    value: c.close > 0 ? ((c.high - c.low) / c.close) * 100 : 0,
  }));

  // Rolling volatility (7-day returns)
  const rollingVolatilities: Record<string, number> = {};

  for (let i = 1; i < candles.length; i++) {
    const windowSize = Math.min(i, rollingWindow);
    const window = candles.slice(i - windowSize, i);

    if (window.some((c) => c.close <= 0)) continue;

    const logReturns = window
      .map((c, idx) =>
        idx > 0 ? Math.log(c.close / window[idx - 1].close) : 0
      )
      .slice(1);

    if (logReturns.length === 0) continue;

    const mean = logReturns.reduce((a, b) => a + b, 0) / logReturns.length;
    const variance =
      logReturns.reduce((a, b) => a + Math.pow(b - mean, 2), 0) /
      logReturns.length;
    rollingVolatilities[window[window.length - 1].date] =
      Math.sqrt(variance) * 100;
  }

  const allRollingVols = Object.values(rollingVolatilities);
  const maxVolatility = Math.max(Math.max(...allRollingVols), 0.001);
  const volThreshold = maxVolatility * 0.1;

  return candles.map((candle, idx) => {
    const volatilityDaily = dailyVolatilities[idx].value;
    let volatilityRolling = rollingVolatilities[candle.date] ?? null;

    if (volatilityRolling === null) {
      volatilityRolling = volatilityDaily;
    }

    const performancePct =
      candle.open !== 0
        ? ((candle.close - candle.open) / candle.open) * 100
        : 0;

    const performance =
      performancePct > volThreshold
        ? "positive"
        : performancePct < -volThreshold
        ? "negative"
        : "neutral";

    const color = (() => {
      const percentile = volatilityRolling / maxVolatility;

      if (percentile > 0.75) return dark.colorPalette.volatility.high;
      if (percentile > 0.5) return dark.colorPalette.volatility.medium;
      if (percentile > 0.25) return dark.colorPalette.volatility.low;
      return dark.colorPalette.volatility.neutral;
    })();

    const prices7d = candles
      .slice(Math.max(0, idx - 6), idx + 1)
      .map((c) => c.close);

    const intraday = [candle.open, candle.high, candle.low, candle.close] as OHLC;

    return {
      ...candle,
      liquidity: candle.volume,
      volatilityDaily,
      volatilityRolling,
      performancePct,
      performance,
      color,
      prices7d,
      intraday,
    };
  });
}
