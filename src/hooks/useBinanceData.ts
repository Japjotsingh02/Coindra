import { useQuery } from '@tanstack/react-query';
import { fetchBinanceCandles } from '@/lib/binance';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Candle } from '@/types/candle';

export function useMonthlyCandles(symbol: string, currentMonth: Date) {
  const { startDate, endDate } = useMemo(() => {
    const start = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
    const end = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0, 23, 59, 59);

    const paddedStart = new Date(start);
    paddedStart.setDate(start.getDate() - 7);

    return { startDate: paddedStart, endDate: end };
  }, [currentMonth]);

  const query = useQuery({
    queryKey: ['candles', symbol, startDate, endDate],
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

export function useIntradayCandles(symbol: string = 'BTCUSDT') {
  const [candles, setCandles] = useState<Candle[]>([]);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!symbol) return;
    const formatted = symbol.replace('/', '').toUpperCase();

    let isMounted = true;

    const fetchPastData = async () => {
      try {
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);

        const endTime = Date.now();

        const data = await fetchBinanceCandles({
          symbol: formatted,
          interval: '1m',
          startTime: startOfDay.getTime(),
          endTime: endTime,
          limit: 1440,
        });

        if (!isMounted) return;

        setCandles(data);
      } catch (error) {
        console.error('Error fetching initial candles:', error);
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
          date: new Date(k.t).toISOString().split('T')[0],
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
        console.error('WS kline parse error', err);
      }
    };

    return () => {
      isMounted = false;
      ws.close();
    };
  }, [symbol]);

  return candles;
}
