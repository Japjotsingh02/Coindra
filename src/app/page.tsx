'use client';

import CalendarHeatmap from '@/components/calendarHeatmap/CalendarHeatmap';
import { useMonthlyCandles } from '@/hooks/useBinanceData';
import { useAppStore } from '@/store/useAppStore';
import { useEffect, useRef } from 'react';
import { useStreamingTransform } from '@/hooks/useStreamingTransform';
import CellDetailedView from '@/components/cellDetailedView/CellDetailedView';
import { VisualizationLegend } from '@/components/elements/visualizationLegend/VisualizationLegend';
import ResponsiveSidebar from '@/components/sidebar/ResponsiveSidebar';
import { Button } from '@/components/ui/button';

function CalendarHeatmapView() {
  const { filters, setCandles, viewMonth } = useAppStore();
  const symbol = filters.symbol;

  const { data: candles, isLoading, error, refetch } = useMonthlyCandles(symbol, viewMonth);
  const { progress } = useStreamingTransform(candles);

  useEffect(() => {
    if (candles && candles.length > 0) {
      setCandles(candles);
    }
  }, [candles, setCandles]);

  if (error) {
    return (
      <div className="flex-1 overflow-auto flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-red-500 mb-2">Error Loading Data</h2>
          <p className="text-muted-secondary mb-4">Failed to load market data. Please try again.</p>
          <Button onClick={() => refetch()} variant="default" size="sm">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return <CalendarHeatmap progress={progress} isStreaming={isLoading} />;
}

export default function Home() {
  const { descriptionPanel, closeDescriptionPanel } = useAppStore();
  const chartsRef = useRef<HTMLDivElement>(null);

  return (
    <main
      className="min-h-screen px-3 2xl:px-4 py-4 2xl:py-5"
      aria-label="Coindra (Crypto Market Explorer)"
    >
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-4 2xl:gap-5">
        <ResponsiveSidebar />
        <div
          className="flex-1 overflow-auto min-h-0 flex flex-col gap-4 2xl:gap-5"
          aria-label="calendar-heatmap"
        >
          <CalendarHeatmapView />
          <VisualizationLegend />
          {descriptionPanel.props && (
            <div ref={chartsRef} data-charts-section>
              <CellDetailedView
                open={descriptionPanel.open}
                onChange={closeDescriptionPanel}
                cell={descriptionPanel.props.cell}
                history={descriptionPanel.props.history}
              />
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
