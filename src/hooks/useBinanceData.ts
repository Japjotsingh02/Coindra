import { useQuery } from "@tanstack/react-query";
import { fetchBinanceCandles } from "@/lib/binance";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  // BinanceRealTimeData,
  Candle,
  // KlineData,
  // OHLC,
  // TickerData,
} from "@/types/candle";
// import { useAppStore } from "@/store/useAppStore";
// import { RealtimeData } from "@/types/store.types";

// export const useBinanceQuery = (symbol: string) =>
//   useQuery<Candle[], Error>({
//     queryKey: ["binanceCandles", symbol],
//     queryFn: () => fetchBinanceCandles({ symbol, interval: "1d", limit: 100 }),
//     refetchInterval: 60 * 1000,
//     staleTime: 30 * 1000,
//     enabled: !!symbol,
//   });

export function useMonthlyCandles(symbol: string, currentMonth: Date) {
  const { startDate, endDate } = useMemo(() => {
    const start = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      1
    );
    const end = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth() + 1,
      0,
      23,
      59,
      59
    );

    const paddedStart = new Date(start);
    paddedStart.setDate(start.getDate() - 7);

    return { startDate: paddedStart, endDate: end };
  }, [currentMonth]);
  
  const query = useQuery({
    queryKey: ["candles", symbol, startDate, endDate],
    queryFn: () =>
      fetchBinanceCandles({
        symbol,
        startTime: startDate.getTime(),
        endTime: endDate.getTime(),
      }),
    enabled: !!symbol,
    staleTime: 1000 * 60 * 5,
  });

  return query;
}

// export default function useBinanceRealTimeData(symbol: string = "BTCUSDT") {
//   const setRealtime = useAppStore((s) => s.setRealtime);
//   const setLatestCandle = useAppStore((s) => s.setLatestCandle);

//   const frameRequestRef = useRef<number | null>(null);
//   const queuedUpdate = useRef<Partial<BinanceRealTimeData> | null>(null);

//   const scheduleUpdate = (partial: Partial<RealtimeData>) => {
//     queuedUpdate.current = { ...queuedUpdate.current, ...partial };
//     if (!frameRequestRef.current) {
//       frameRequestRef.current = requestAnimationFrame(() => {
//         setRealtime(queuedUpdate.current || {});
//         queuedUpdate.current = null;
//         frameRequestRef.current = null;
//       });
//     }
//   };

//   useEffect(() => {
//     if (!symbol) return;
//     const formatted = symbol.replace("/", "").toLowerCase();

//     const tickerWs = new WebSocket(
//       `wss://stream.binance.com:9443/ws/${formatted}@ticker`
//     );
//     const klineWs = new WebSocket(
//       `wss://stream.binance.com:9443/ws/${formatted}@kline_1m`
//     );

//     tickerWs.onmessage = (event) => {
//       try {
//         const data = JSON.parse(event.data) as TickerData;
//         scheduleUpdate({
//           volume24h: parseFloat(data.v),
//           priceChange24h: parseFloat(data.p),
//           priceChangePercent24h: parseFloat(data.P),
//           high24h: parseFloat(data.h),
//           low24h: parseFloat(data.l),
//         });
//       } catch (error) {
//         console.error("Error parsing ticker data:", error);
//       }
//     };

//     klineWs.onmessage = (event) => {
//       try {
//         const data = JSON.parse(event.data) as KlineData;
//         if (!data.k) return;
//         const k = data.k;
//         const liveCandle = [
//           parseFloat(k.o),
//           parseFloat(k.h),
//           parseFloat(k.l),
//           parseFloat(k.c),
//         ] as OHLC;
//         setLatestCandle(liveCandle);
//         scheduleUpdate({ price: parseFloat(k.c) });
//       } catch (error) {
//         console.error("Error parsing kline data:", error);
//       }
//     };

//     return () => {
//       tickerWs.close();
//       klineWs.close();
//       if (frameRequestRef.current)
//         cancelAnimationFrame(frameRequestRef.current);
//     };
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [symbol, setRealtime]);

//   return useAppStore((s) => s.realtime);
// }

export function useIntradayCandles(symbol: string = "BTCUSDT") {
  const [candles, setCandles] = useState<Candle[]>([]);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!symbol) return;
    const formatted = symbol.replace("/", "").toUpperCase();

    let isMounted = true;

    const fetchPastData = async () => {
      try {
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);

        const endTime = Date.now();

        const data = await fetchBinanceCandles({
          symbol: formatted,
          interval: "1m",
          startTime: startOfDay.getTime(),
          endTime: endTime,
          limit: 1440,
        });

        if (!isMounted) return;

        setCandles(data);
      } catch (error) {
        console.error("Error fetching initial candles:", error);
      }
    };

    fetchPastData();

    // 2. Subscribe to WebSocket for live updates
    const ws = new WebSocket(
      `wss://stream.binance.com:9443/ws/${formatted.toLowerCase()}@kline_1m`
    );
    wsRef.current = ws;

    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);
        const k = msg.k;

        const newCandle: Candle = {
          date: new Date(k.t).toISOString().split("T")[0],
          open: parseFloat(k.o),
          high: parseFloat(k.h),
          low: parseFloat(k.l),
          close: parseFloat(k.c),
          volume: parseFloat(k.v),
        };

        setCandles((prev) => {
          if (!prev.length) return [newCandle];

          const last = prev[prev.length - 1];
          if (last.date === newCandle.date) {
            // update current candle (still forming)
            return [...prev.slice(0, -1), newCandle];
          } else {
            // new minute candle, append
            return [...prev, newCandle];
          }
        });
      } catch (err) {
        console.error("WS kline parse error", err);
      }
    };

    return () => {
      isMounted = false;
      ws.close();
    };
  }, [symbol]);

  return candles;
}

// Hook specifically for DescriptionModal with enhanced data
// export function useDescriptionModalRealTimeData(symbol: string) {
//   const realtimeData = useBinanceRealTimeData(symbol);

//   // Calculate additional metrics
//   const currentVolatility = useMemo(() => {
//     if (!realtimeData.high24h || !realtimeData.low24h || !realtimeData.price)
//       return null;
//     return (
//       ((realtimeData.high24h - realtimeData.low24h) / realtimeData.price) * 100
//     );
//   }, [realtimeData.high24h, realtimeData.low24h, realtimeData.price]);

//   const priceChangeColor = useMemo(() => {
//     if (!realtimeData.priceChangePercent24h) return "text-gray-400";
//     return realtimeData.priceChangePercent24h >= 0
//       ? "text-green-400"
//       : "text-red-400";
//   }, [realtimeData.priceChangePercent24h]);

//   return {
//     ...realtimeData,
//     currentVolatility,
//     priceChangeColor,
//   };
// }
