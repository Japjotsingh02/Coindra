"use client";

import { useMemo } from "react";
import { isSameDay, isToday } from "date-fns";
import type { HeatmapCell } from "@/types/heatmap";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useAppStore } from "@/store/useAppStore";
import { Sparklines, SparklinesLine } from "react-sparklines";
import { CalendarCellTooltip } from "../uielements/calendarCellTooltip/CalendarCellTooltip";

type CalendarCellProps = {
  day: Date;
  selectedDate: Date | null;
  isCurrentMonth?: boolean;
  className?: string;
  viewMode?: "monthly" | "weekly" | "daily";
  onDateClick?: (cell?: HeatmapCell) => void;
  onCloseModal?: () => void;
};

const Sparkline = ({
  cell,
  viewMode,
}: {
  cell: HeatmapCell;
  viewMode: "monthly" | "weekly" | "daily";
}) => {
  return (
    <div
      className={`absolute ${
        viewMode === "monthly"
          ? "bottom-1.5 sm:bottom-2 md:bottom-3 xl:bottom-2 2xl:bottom-3"
          : "inset-0 items-center justify-center"
      } left-0 right-0 flex justify-center`}
    >
      <div
        className={cn(
          "w-[70%] h-[20%] sm:w-[55%] sm:h-[15%] xl:w-[45%] xl:h-[12%]",
          "overflow-hidden"
        )}
        role="img"
        aria-label={`7-day trend: ${cell.performance}`}
      >
        <Sparklines
          data={cell.prices7d}
          svgWidth={"100%"}
          svgHeight={"100%"}
          margin={2}
        >
          <SparklinesLine
            color={
              cell.performance === "positive"
                ? "#22c55e"
                : cell.performance === "negative"
                ? "#dc2626"
                : "#9ca3af"
            }
            style={{
              strokeWidth: 6,
              fill: "none",
            }}
          />
        </Sparklines>
      </div>
    </div>
  );
};

const LiquidityScoreBar = ({
  score,
  viewMode,
}: {
  score: number;
  viewMode: "monthly" | "weekly" | "daily";
}) => {
  const normalizedScore = Math.min(Math.max(score, 0), 100);

  const levels = [
    {
      threshold: 80,
      color: "from-emerald-400 to-emerald-500",
      label: "High",
      icon: "💎",
      glow: "rgba(16,185,129,0.6)",
      bg: "bg-[rgba(16,185,129,0.2)]",
      text: "text-emerald-300",
    },
    {
      threshold: 60,
      color: "from-blue-400 to-blue-500",
      label: "Good",
      glow: "rgba(59,130,246,0.6)",
      bg: "bg-[rgba(59,130,246,0.2)]",
      text: "text-blue-300",
    },
    {
      threshold: 40,
      color: "from-yellow-400 to-yellow-500",
      label: "Moderate",
      glow: "rgba(234,179,8,0.6)",
      bg: "bg-[rgba(234,179,8,0.2)]",
      text: "text-yellow-300",
    },
    {
      threshold: 20,
      color: "from-orange-400 to-orange-500",
      label: "Low",
      glow: "rgba(249,115,22,0.6)",
      bg: "bg-[rgba(249,115,22,0.2)]",
      text: "text-orange-300",
    },
    {
      threshold: 0,
      color: "from-red-400 to-red-500",
      label: "Very Low",
      glow: "rgba(239,68,68,0.6)",
      bg: "bg-[rgba(239,68,68,0.2)]",
      text: "text-red-300",
    },
  ];

  const current = levels.find((l) => normalizedScore >= l.threshold)!;

  return (
    <div
      className={cn(
        "absolute left-1 right-1 sm:left-2 sm:right-2",
        viewMode === "weekly" ? "bottom-1 sm:bottom-2" : "bottom-1.5 sm:bottom-2 md:bottom-3 xl:bottom-2 2xl:bottom-3"
      )}
    >
      <div className="flex justify-end mb-1 lg:mb-2">
        <span
          className={cn(
            "text-[4px] md:text-[8px] 2xl:text-xs lg:text-[8px] font-bold py-[2px] px-[3px] lg:px-1 lg:py-1 rounded-sm 2xl:rounded-md transition-all duration-300 text-right",
            current.bg,
            current.text
          )}
        >
          {Math.round(normalizedScore)}%
        </span>
      </div>
      <div className="relative w-full h-1 sm:h-1.5 md:h-2 rounded-full bg-gray-800/40 border border-gray-700/30 overflow-visible backdrop-blur-sm">
        {/* Track Pattern */}
        <div className="absolute inset-0 bg-gradient-to-r from-gray-700/30 to-gray-600/30" />
        <div
          className={cn(
            "h-full rounded-full bg-gradient-to-r relative overflow-hidden transition-all duration-700 ease-out",
            current.color
          )}
          style={{ width: `${normalizedScore}%` }}
        >
          {/* Shimmer */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-[shimmer_2s_infinite]" />
        </div>

        <div
          className="absolute top-0 h-full rounded-full blur-md opacity-50 pointer-events-none transition-all duration-1000 ease-out z-5"
          style={{
            width: `${normalizedScore}%`,
            filter: `blur(2px)`,
            boxShadow: `0 0 8px 2px ${current.glow}`,
          }}
        />
      </div>
    </div>
  );
};

export default function CalendarCell({
  day,
  selectedDate,
  isCurrentMonth = true,
  className,
  viewMode = "monthly",
  onDateClick,
}: CalendarCellProps) {
  const { processedHeatmapData } = useAppStore();

  const iso = useMemo(() => day.toISOString().slice(0, 10), [day]);
  const cell = useMemo(() => {
    return processedHeatmapData.find((d) =>
      isSameDay(new Date(`${d.date}T00:00:00Z`), day)
    );
  }, [processedHeatmapData, day]);

  if (!isCurrentMonth) return <div></div>;

  const hasData = !!cell;
  const background = hasData
    ? cell?.color?.backgroundImage ?? cell?.color?.bg
    : undefined;

  const selected = selectedDate ? isSameDay(day, selectedDate) : false;
  const today = isToday(day);

  const handleClick = () => {
    onDateClick?.(cell);
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          onClick={handleClick}
          className={cn(
            "relative w-full rounded-md transition-all duration-150 p-1.5 lg:p-2 xl:p-3 flex",
            "hover:scale-[1.02] focus:outline-none",
            {
              "h-12 sm:h-18 lg:h-19 2xl:h-24": viewMode !== "weekly",
              "h-20 sm:h-40 xl:h-45 2xl:h-52": viewMode === "weekly",
              "opacity-60": !isCurrentMonth,
              "ring-2 ring-[#bc7129] ring-offset-0": selected,
              "bg-gradient-to-br from-surface to-surface-border border border-surface-ring":
                !hasData,
              "hover:border-brand/30": !hasData,
              "hover:shadow-lg hover:shadow-brand/5": !hasData,
            },
            className
          )}
          style={background ? { background } : undefined}
        >
          <span
            className={cn(
              "text-xs sm:text-sm md:text-base xl:text-sm 2xl:text-lg font-medium",
              {
                "text-brand": hasData,
                "text-[#6b7280]": !isCurrentMonth,
                "text-[#9ca3af]": !hasData && isCurrentMonth,
              }
            )}
          >
            {day.getDate()}
          </span>

          {today && (
            <span
              className="absolute right-1.5 top-1.5 md:right-2 md:top-2 h-1 w-1 md:h-1.5 md:w-1.5 2xl:h-2 wxl:w-2 rounded-full bg-[#bc7129]"
              aria-label="Today"
            />
          )}

          {hasData && cell?.prices7d && (
            <Sparkline cell={cell} viewMode={viewMode} />
          )}

          {hasData &&
            cell?.liquidityScore !== undefined &&
            viewMode !== "monthly" && (
              <LiquidityScoreBar
                score={cell.liquidityScore}
                viewMode={viewMode}
              />
            )}

          {/* Empty state styling for cells without data */}
          {!hasData && isCurrentMonth && (
            <>
              {/* Subtle pattern overlay */}
              <div className="absolute inset-0 opacity-5">
                <div className="w-full h-full bg-gradient-to-br from-brand to-transparent rounded-md" />
              </div>

              {/* No data indicator */}
              <div
                className={cn(
                  "absolute left-1 right-1",
                  viewMode === "weekly" ? "bottom-1 sm:bottom-2" : "bottom-2"
                )}
              >
                <div className="h-1 sm:h-1.5 md:h-2 bg-gradient-to-r from-surface-ring to-surface-border rounded opacity-40" />
              </div>

              {/* Corner accent */}
              <div className="absolute right-1.5 top-1.5 md:right-2 md:top-2">
                <div className="h-1 w-1 md:h-1.5 md:w-1.5 2xl:h-2 wxl:w-2 bg-brand/20 rounded-full" />
              </div>
            </>
          )}
        </button>
      </TooltipTrigger>

      <CalendarCellTooltip cell={cell} iso={iso} />
    </Tooltip>
  );
}
