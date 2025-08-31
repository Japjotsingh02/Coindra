"use client";

import CalendarHeatmap from "@/components/calendarHeatmap/CalendarHeatmap";
import Sidebar from "@/components/sidebar/Sidebar";
import { useMonthlyCandles } from "@/hooks/useBinanceData";
import { useAppStore } from "@/store/useAppStore";
import { useEffect, Suspense } from "react";
import {
  ModernCalendarSkeleton,
  ModernWelcomeSkeleton,
} from "@/components/ui/modern-skeleton";
import { useStreamingTransform } from "@/hooks/useStreamingTransform";
import CellDetailedView from "@/components/cellDetailedView/CellDetailedView";
import { VisualizationLegend } from "@/components/uielements/visualizationLegend/VisualizationLegend";

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
            className="px-4 py-2 bg-brand text-white rounded-lg hover:bg-brand/90 transition-colors"
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
        className="min-h-screen px-4 py-5"
        aria-label="Coindra (Crypto Market Explorer)"
      >
        <div className="flex gap-5">
          <Sidebar />
          <ModernWelcomeSkeleton />
        </div>
      </main>
    );
  }

  return (
    <main
      className="min-h-screen px-4 py-5"
      aria-label="Coindra (Crypto Market Explorer)"
    >
      <div className="flex gap-5">
        <Sidebar />
        <div className="flex-1 overflow-auto" aria-label="calendar-heatmap">
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
