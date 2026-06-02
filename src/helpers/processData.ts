import { dark, light } from '@/settings/theme';
import { Candle, OHLC } from '@/types/candle';
import { HeatmapCell } from '@/types/heatmap';

function getThemePalette() {
  const isLight =
    typeof document !== 'undefined' && document.documentElement.classList.contains('light');
  return (isLight ? light : dark).colorPalette;
}

function computeDailyVolatilities(candles: Candle[]) {
  return candles.map((c) => ({
    date: c.date,
    value: c.close > 0 ? ((c.high - c.low) / c.close) * 100 : 0,
  }));
}

function computeRollingVolatilities(candles: Candle[], rollingWindow: number) {
  const result: Record<string, number> = {};

  for (let i = 1; i < candles.length; i++) {
    const windowSize = Math.min(i, rollingWindow);
    const window = candles.slice(i - windowSize, i);

    if (window.some((c) => c.close <= 0)) continue;

    const logReturns = window
      .map((c, idx) => (idx > 0 ? Math.log(c.close / window[idx - 1].close) : 0))
      .slice(1);

    if (logReturns.length === 0) continue;

    const mean = logReturns.reduce((a, b) => a + b, 0) / logReturns.length;
    const variance = logReturns.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / logReturns.length;

    result[window[window.length - 1].date] = Math.sqrt(variance) * 100;
  }

  return result;
}

function findVolatilityColor(
  volatilityRolling: number,
  maxVolatility: number,
  palette: ReturnType<typeof getThemePalette>
) {
  const percentile = volatilityRolling / maxVolatility;
  if (percentile > 0.75) return palette.volatility.high;
  if (percentile > 0.5) return palette.volatility.medium;
  if (percentile > 0.25) return palette.volatility.low;
  return palette.volatility.neutral;
}

function findPerformanceColor(
  performance: 'positive' | 'negative' | 'neutral',
  palette: ReturnType<typeof getThemePalette>
) {
  return palette.performance[performance];
}

function findLiquidityColor(liquidityScore: number, palette: ReturnType<typeof getThemePalette>) {
  if (liquidityScore > 80) return palette.liquidity.excellent;
  if (liquidityScore > 60) return palette.liquidity.veryHigh;
  if (liquidityScore > 40) return palette.liquidity.high;
  if (liquidityScore > 20) return palette.liquidity.medium;
  return palette.liquidity.low;
}

export function processHeatmapData(candles: Candle[], rollingWindow: number = 7): HeatmapCell[] {
  if (candles.length === 0) return [];

  const palette = getThemePalette();
  const dailyVolatilities = computeDailyVolatilities(candles);
  const rollingVolatilities = computeRollingVolatilities(candles, rollingWindow);

  const allRollingVols = Object.values(rollingVolatilities);
  const maxVolatility = Math.max(Math.max(...allRollingVols), 0.001);
  const volThreshold = maxVolatility * 0.1;
  const volumes = candles.map((c) => c.volume);
  const maxVolume = Math.max(...volumes, 1);

  return candles.map((candle, index) => {
    const volatilityDaily = dailyVolatilities[index].value;
    let volatilityRolling = rollingVolatilities[candle.date] ?? null;

    if (volatilityRolling === null) {
      volatilityRolling = volatilityDaily;
    }

    const performancePct =
      candle.open !== 0 ? ((candle.close - candle.open) / candle.open) * 100 : 0;

    const performance =
      performancePct > volThreshold
        ? 'positive'
        : performancePct < -volThreshold
          ? 'negative'
          : 'neutral';

    const liquidityRaw = candle.volume;
    const liquidityScore = (liquidityRaw / maxVolume) * 100;

    const volatilityColor = findVolatilityColor(volatilityRolling, maxVolatility, palette);
    const performanceColor = findPerformanceColor(performance, palette);
    const liquidityColor = findLiquidityColor(liquidityScore, palette);
    const prices7d = candles.slice(Math.max(0, index - 6), index + 1).map((c) => c.close);
    const intraday = [candle.open, candle.high, candle.low, candle.close] as OHLC;

    return {
      ...candle,
      liquidity: liquidityRaw,
      liquidityScore,
      volatilityDaily,
      volatilityRolling,
      performancePct,
      performance,
      volatilityColor,
      performanceColor,
      liquidityColor,
      prices7d,
      intraday,
    };
  });
}
