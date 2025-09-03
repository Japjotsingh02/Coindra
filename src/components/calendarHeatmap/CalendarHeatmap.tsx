"use client";

import { isSameDay, isSameMonth } from "date-fns";
import CalendarCell from "./CalendarCell";
import { useAppStore } from "@/store/useAppStore";
import CalendarHeader from "./CalendarHeader";
import { useCallback, useState, useMemo } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import type { HeatmapCell } from "@/types/heatmap";
import { TooltipProvider } from "@/components/ui/tooltip";
import DailyHeatmap from "./DailyHeatmap";
import { getCalendarDays } from "@/helpers/calendar";
import { cn } from "@/lib/utils";

export type ViewMode = "monthly" | "weekly" | "daily";
interface CalendarHeatmapProps {
  progress?: number;
  isStreaming?: boolean;
}

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const CalendarDays = ({ viewMode }: { viewMode: ViewMode }) => {
  if (viewMode === "daily") return null;

  return (
    <div className="grid grid-cols-7 gap-1.5 lg:gap-2 2xl:gap-3 px-2 py-2">
      {DAYS.map((day) => (
        <div
          key={day}
          className="text-center text-xs sm:text-sm md:text-base xl:text-sm 2xl:text-base font-medium text-gray-500"
        >
          {day}
        </div>
      ))}
    </div>
  );
};

type CalendarGridProps = {
  viewMonth: Date;
  selectedDate: Date | null;
  onDateClick: (date: Date, cell?: HeatmapCell) => void;
  isStreaming: boolean;
  progress: number;
  days: Date[];
  viewMode: ViewMode;
};

function CalendarGrid({
  viewMonth,
  selectedDate,
  onDateClick,
  isStreaming,
  progress,
  days,
  viewMode,
}: CalendarGridProps) {
  return (
    <TooltipProvider delayDuration={150}>
      <div className="grid grid-cols-7 gap-1.5 lg:gap-2 2xl:gap-3 pt-2 text-xs sm:text-sm md:text-base xl:text-sm 2xl:text-lg">
        {days.map((day, index) => {
          let isInView = false;

          if (viewMode === "monthly") {
            isInView = isSameMonth(day, viewMonth);
          } else if (viewMode === "weekly") {
            isInView = true;
          } else if (viewMode === "daily") {
            isInView = isSameDay(day, viewMonth);
          }

          if (isStreaming && index >= Math.floor(days.length * progress)) {
            return (
              <div key={day.getTime()} className="relative">
                <Skeleton
                  className={cn(
                    "w-full",
                    viewMode === "weekly"
                      ? "h-20 sm:h-40 xl:h-45 2xl:h-52"
                      : "h-12 sm:h-18 lg:h-19 2xl:h-24"
                  )}
                />
                <div className="absolute inset-0 bg-brand/5 rounded-md" />
              </div>
            );
          }

          return (
            <CalendarCell
              key={day.getTime()}
              selectedDate={selectedDate}
              day={day}
              isCurrentMonth={isInView}
              viewMode={viewMode}
              onDateClick={(cell) => onDateClick(day, cell)}
            />
          );
        })}
      </div>
    </TooltipProvider>
  );
}

export default function CalendarHeatmap({
  progress = 1,
  isStreaming = false,
}: CalendarHeatmapProps) {
  const {
    processedHeatmapData: heatmapData,
    openDescriptionPanel,
    viewMonth,
    setViewMonth,
    viewMode,
    setViewMode,
  } = useAppStore();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const allDays = useMemo(
    () => getCalendarDays(viewMonth, viewMode),
    [viewMonth, viewMode]
  );

  // const filteredHeatmapData = useMemo(() => {
  //   if (!heatmapData || heatmapData.length === 0) return [];

  //   return heatmapData.filter((cell) => {
  //     const cellDate = new Date(cell.date);

  //     switch (viewMode) {
  //       case "monthly":
  //         return isSameMonth(cellDate, viewMonth);
  //       case "weekly":
  //         return isSameWeek(cellDate, viewMonth, { weekStartsOn: 1 });
  //       case "daily":
  //         return isSameDay(cellDate, viewMonth);
  //       default:
  //         return false;
  //     }
  //   });
  // }, [heatmapData, viewMonth, viewMode]);

  const filteredHeatmapData = useMemo(() => {
    if (!heatmapData || heatmapData.length === 0) return [];

    const daySet = new Set(allDays.map((d) => d.toDateString()));
    return heatmapData.filter((cell) => {
      const cellDate = new Date(cell.date);
      return daySet.has(cellDate.toDateString());
    });
  }, [heatmapData, allDays]);

  const handleMonthChange = useCallback((newMonth: Date) => {
    console.log("newMonth", newMonth);
    setViewMonth(newMonth);
  }, []);

  const handleViewModeChange = useCallback((mode: ViewMode) => {
    setViewMode(mode);
    // Reset to current month when changing view modes
    // setCurrentMonth(startOfMonth(new Date()));
  }, []);

  const handleDateClick = useCallback(
    (date: Date, cell?: HeatmapCell) => {
      if (!cell) return;
      setSelectedDate(date);
      const index = heatmapData.findIndex((d) => d.date === cell.date);
      const history = heatmapData.slice(Math.max(0, index - 30), index + 1);
      openDescriptionPanel({ cell, history }, () => {
        setSelectedDate(null);
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [heatmapData]
  );

  const handleClickTodayCTA = useCallback(() => {
    const today = new Date();
    const cell = heatmapData.find((d) =>
      isSameDay(new Date(`${d.date}T00:00:00Z`), today)
    );
    if (cell) {
      handleDateClick(today, cell);
    }
  }, [heatmapData, handleDateClick]);

  const renderHeatmap = () => {
    switch (viewMode) {
      case "monthly":
        return (
          <CalendarGrid
            viewMonth={viewMonth}
            selectedDate={selectedDate}
            onDateClick={handleDateClick}
            isStreaming={isStreaming}
            progress={progress}
            days={allDays}
            viewMode={viewMode}
          />
        );
      // TODO: Remove this once we have a proper weekly view
      case "weekly":
        return (
          <CalendarGrid
            viewMonth={viewMonth}
            selectedDate={selectedDate}
            onDateClick={handleDateClick}
            isStreaming={isStreaming}
            progress={progress}
            days={allDays}
            viewMode={viewMode}
          />
        );

      case "daily":
        return (
          <DailyHeatmap
            heatmapData={filteredHeatmapData}
            viewMonth={viewMonth}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="rounded-lg shadow-md overflow-hidden border border-[#20232E] bg-background-dark p-3 sm:p-4 xl:p-5 2xl:p-6">
      <CalendarHeader
        viewMonth={viewMonth}
        onMonthChange={handleMonthChange}
        viewMode={viewMode}
        onViewModeChange={handleViewModeChange}
        onClickToday={handleClickTodayCTA}
      />

      <CalendarDays viewMode={viewMode} />

      {renderHeatmap()}
    </div>
  );
}
