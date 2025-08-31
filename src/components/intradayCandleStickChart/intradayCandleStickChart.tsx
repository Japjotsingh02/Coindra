import React, { useMemo } from "react";
import { useIntradayCandles } from "@/hooks/useBinanceData";
import ChartCard from "../uielements/chartCard/ChartCard";
import { getCandlestickOption } from "@/lib/charts";

export default function IntradayCandlestickChart({
  symbol,
}: {
  symbol: string;
}) {
  const candles = useIntradayCandles(symbol);

  const candlestickOpt = useMemo(() => {
    return getCandlestickOption(candles);
  }, [candles]);

//   <div className="text-sm text-[#7c8796]">
//   {candles.length > 0 ? `${candles.length} candles` : 'Loading...'}
// </div>

  return (
    <ChartCard title="Intraday Candlestick" option={candlestickOpt}>
       {candles.length > 0 && (
          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-xs text-[#7c8796] font-medium uppercase tracking-wide mb-1">
                Current Price
              </div>
              <div className="text-lg font-bold text-white">
                ${candles[candles.length - 1]?.close?.toFixed(2) || '0.00'}
              </div>
            </div>
            <div>
              <div className="text-xs text-[#7c8796] font-medium uppercase tracking-wide mb-1">
                Today&apos;s High
              </div>
              <div className="text-lg font-bold text-green-400">
                ${Math.max(...candles.map(c => c.high)).toFixed(2)}
              </div>
            </div>
            <div>
              <div className="text-xs text-[#7c8796] font-medium uppercase tracking-wide mb-1">
                Today&apos;s Low
              </div>
              <div className="text-lg font-bold text-red-400">
                ${Math.min(...candles.map(c => c.low)).toFixed(2)}
              </div>
            </div>
            <div>
              <div className="text-xs text-[#7c8796] font-medium uppercase tracking-wide mb-1">
                Total Volume
              </div>
              <div className="text-lg font-bold text-white">
                {candles.reduce((sum, c) => sum + c.volume, 0).toLocaleString()}
              </div>
            </div>
          </div>
        )}
    </ChartCard>
  );
}
