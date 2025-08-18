'use client';

import CalendarHeatmap from '@/components/calendarHeatmap/CalendarHeatmap';
import Sidebar from '@/components/sidebar/Sidebar';
import useBinanceRealTimeData, { useBinanceQuery } from '@/hooks/useBinanceData';
import { useAppStore } from '@/store/useAppStore';
import { Filters } from '@/types/store.types';
import { useEffect } from 'react';

export default function Home() {
  const { filters, setCandles } = useAppStore();
  const symbol = filters.symbol;
  const { isLoading, data: candles } = useBinanceQuery(symbol);
  // const livePrice = useBinanceRealTimeData(symbol);

  useEffect(() => {
    if (candles) setCandles(candles);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [candles]);

  const handleFilterChange = (filters: Filters) => {
    console.log("Active Filters:", filters);
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <main className="min-h-screen px-4 py-5" aria-label="Coindra (Crypto Market Explorer)">
      <div className="flex gap-5">
        <Sidebar onChange={handleFilterChange} />
        <div className="flex-1 overflow-auto" aria-label="calendar-heatmap">
          <CalendarHeatmap />
        </div>
      </div>
    </main>
  );
}

