"use client";

import CalendarHeatmap from "@/components/calendarHeatmap/CalendarHeatmap";
import { useMonthlyCandles } from "@/hooks/useBinanceData";
import { useAppStore } from "@/store/useAppStore";
import { useEffect } from "react";
import {
  ModernCalendarSkeleton,
  ModernWelcomeSkeleton,
} from "@/components/ui/modern-skeleton";
import { useStreamingTransform } from "@/hooks/useStreamingTransform";
import CellDetailedView from "@/components/cellDetailedView/CellDetailedView";
import { VisualizationLegend } from "@/components/uielements/visualizationLegend/VisualizationLegend";
import ResponsiveSidebar from "@/components/sidebar/ResponsiveSidebar";

function CalendarHeatmapView() {
  const { filters, setCandles, viewMonth } = useAppStore();
  const symbol = filters.symbol;

  const {
    data: candles,
    isLoading,
    error,
    refetch,
  } = useMonthlyCandles(symbol, viewMonth);
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
          <h2 className="text-2xl font-semibold text-red-500 mb-2">
            Error Loading Data
          </h2>
          <p className="text-muted-secondary mb-4">
            Failed to load market data. Please try again.
          </p>
          <button
            onClick={() => refetch()}
            className="px-4 py-2 bg-brand text-label rounded-lg hover:bg-brand/90 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return <ModernCalendarSkeleton />;
  }

  return <CalendarHeatmap progress={progress} isStreaming={true} />;
}

export default function Home() {
  const { filters, descriptionPanel, closeDescriptionPanel } = useAppStore();
  const symbol = filters.symbol;

  if (!symbol) {
    return (
      <main
        className="min-h-screen px-2 px-3 2xl:px-4 py-4 2xl:py-5"
        aria-label="Coindra (Crypto Market Explorer)"
      >
        <div className="flex flex-col xl:flex-row gap-2 sm:gap-3 md:gap-4 xl:gap-4 2xl:gap-6">
          <ResponsiveSidebar />
          <ModernWelcomeSkeleton />
        </div>
      </main>
    );
  }

  return (
    <main
      className="min-h-screen px-3 2xl:px-4 py-4 2xl:py-5"
      aria-label="Coindra (Crypto Market Explorer)"
    >
      <div className="flex flex-col lg:flex-row gap-2 sm:gap-3 md:gap-4 xl:gap-4 2xl:gap-5">
        <ResponsiveSidebar/>
        <div className="flex-1 overflow-auto min-h-0" aria-label="calendar-heatmap">
          {/* <Suspense fallback={<ModernCalendarSkeleton />}> */}
          <CalendarHeatmapView />
          {/* </Suspense> */}
          <VisualizationLegend />
        </div>
      </div>
      {descriptionPanel.props && (
        <CellDetailedView
          open={descriptionPanel.open}
          onChange={closeDescriptionPanel}
          cell={descriptionPanel.props.cell}
          history={descriptionPanel.props.history}
        />
      )}
    </main>
  );
}
