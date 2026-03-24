import React from "react";
import { useIntradayCandles } from "@/hooks/useBinanceData";
import ChartCard from "../uielements/chartCard/ChartCard";
import { useCandlestickOption } from "@/hooks/useCandleStickOption";

export default function IntradayCandlestickChart({
  symbol,
}: {
  symbol: string;
}) {
  const candles = useIntradayCandles(symbol);

  const { option, showVolume, setShowVolume } = useCandlestickOption(
    candles,
    "ETH/BTC"
  );

  const handleVolumeToggle = () => {
    setShowVolume((prev) => !prev);
  };

  return (
    <div>
      <button
        className="px-3 py-1 rounded bg-brand text-white text-sm mb-2"
        onClick={handleVolumeToggle}
      >
        {showVolume ? "Hide Volume" : "Show Volume"}
      </button>
      <ChartCard title="Intraday Candlestick" option={option}></ChartCard>
        
    </div>
  );

  //   <div className="text-sm text-muted-secondary">
  //   {candles.length > 0 ? `${candles.length} candles` : 'Loading...'}
  // </div>

  // return (
  //   <ChartCard title="Intraday Candlestick" option={candlestickOpt}>
  //     {candles.length > 0 && (
  //       <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 text-center">
  //         <div>
  //           <div className="text-xs text-muted-secondary font-medium uppercase tracking-wide mb-1">
  //             Current Price
  //           </div>
  //           <div className="text-sm sm:text-lg font-bold text-label">
  //             ${candles[candles.length - 1]?.close?.toFixed(2) || "0.00"}
  //           </div>
  //         </div>
  //         <div>
  //           <div className="text-xs text-muted-secondary font-medium uppercase tracking-wide mb-1">
  //             Today&apos;s High
  //           </div>
  //           <div className="text-sm sm:text-lg font-bold text-green-400">
  //             ${Math.max(...candles.map((c) => c.high)).toFixed(2)}
  //           </div>
  //         </div>
  //         <div>
  //           <div className="text-xs text-muted-secondary font-medium uppercase tracking-wide mb-1">
  //             Today&apos;s Low
  //           </div>
  //           <div className="text-sm sm:text-lg font-bold text-red-400">
  //             ${Math.min(...candles.map((c) => c.low)).toFixed(2)}
  //           </div>
  //         </div>
  //         <div>
  //           <div className="text-xs text-muted-secondary font-medium uppercase tracking-wide mb-1">
  //             Total Volume
  //           </div>
  //           <div className="text-sm sm:text-lg font-bold text-label">
  //             {candles.reduce((sum, c) => sum + c.volume, 0).toLocaleString()}
  //           </div>
  //         </div>
  //       </div>
  //     )}
  //   </ChartCard>
  // );
}
