import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { fetchBinanceCandles } from "@/lib/binance";
import { useEffect, useState } from "react";
import { Candle } from "@/types/candle";

export const useBinanceQuery = (symbol: string) => 
  useQuery<Candle[], Error>({
    queryKey: ["binanceCandles", symbol],
    queryFn: () => fetchBinanceCandles(symbol),
    refetchInterval: 60 * 1000,
    staleTime: 30 * 1000,
  });

export default function useBinanceRealTimeData(symbol: string = "BTCUSDT") {
  const [realtimePrice, setRealtimePrice] = useState<number | null>(null);

  useEffect(() => {
    const ws = new WebSocket(
      `wss://stream.binance.com:9443/ws/${symbol.toLowerCase()}@trade`
    );

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setRealtimePrice(parseFloat(data.p));
    };

    return () => ws.close();
  }, [symbol]);

  return realtimePrice;
}
