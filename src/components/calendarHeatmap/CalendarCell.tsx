"use client";

import { useMemo } from "react";
import { isSameDay, isToday } from "date-fns";
import type { HeatmapCell } from "@/types/heatmap";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipTrigger } from "@/components/ui/tooltip";
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
        viewMode === "monthly" ? "bottom-3" : "bottom-4"
      } left-1 right-1 flex justify-center`}
    >
      <div
        className="w-[60px] h-[20px] overflow-hidden"
        role="img"
        aria-label={`7-day trend: ${cell.performance}`}
      >
        <Sparklines data={cell.prices7d} width={60} height={20} margin={2}>
          <SparklinesLine
            color={
              cell.performance === "positive"
                ? "#22c55e"
                : cell.performance === "negative"
                ? "#dc2626"
                : "#9ca3af"
            }
            style={{
              strokeWidth: 2,
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
      icon: "✨",
      glow: "rgba(59,130,246,0.6)",
      bg: "bg-[rgba(59,130,246,0.2)]",
      text: "text-blue-300",
    },
    {
      threshold: 40,
      color: "from-yellow-400 to-yellow-500",
      label: "Moderate",
      icon: "⭐",
      glow: "rgba(234,179,8,0.6)",
      bg: "bg-[rgba(234,179,8,0.2)]",
      text: "text-yellow-300",
    },
    {
      threshold: 20,
      color: "from-orange-400 to-orange-500",
      label: "Low",
      icon: "⚠️",
      glow: "rgba(249,115,22,0.6)",
      bg: "bg-[rgba(249,115,22,0.2)]",
      text: "text-orange-300",
    },
    {
      threshold: 0,
      color: "from-red-400 to-red-500",
      label: "Very Low",
      icon: "🚨",
      glow: "rgba(239,68,68,0.6)",
      bg: "bg-[rgba(239,68,68,0.2)]",
      text: "text-red-300",
    },
  ];

  const current = levels.find((l) => normalizedScore >= l.threshold)!;

  return (
    <div
      className={cn(
        "absolute left-2 right-2",
        viewMode === "weekly" ? "bottom-20" : "bottom-16"
      )}
    >
      {/* Score Header with Icon */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-1">
          <span className="text-xs font-medium text-gray-400">Liquidity</span>
          <span className="text-xs opacity-70">{current.icon}</span>
        </div>
        <span
          className={cn(
            "text-xs font-bold px-2 py-0.5 rounded-full transition-all duration-300",
            current.bg,
            current.text
          )}
        >
          {current.label}
        </span>
      </div>
      <div className="relative w-full h-3 rounded-full bg-gray-800/40 border border-gray-700/30 overflow-visible backdrop-blur-sm">
        {/* Track Pattern */}
        <div className="absolute inset-0 bg-gradient-to-r from-gray-700/30 to-gray-600/30" />

        {/* Fill */}
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
      {/* Score Percentage */}
      <div className="text-right mt-2">
        <span
          className={cn(
            "text-xs font-bold px-2 py-1 rounded-md transition-all duration-300",
            current.bg,
            current.text
          )}
        >
          {Math.round(normalizedScore)}%
        </span>
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
            "relative w-full rounded-md transition-all duration-150 p-3 flex",
            "hover:scale-[1.02] focus:outline-none",
            {
              "h-24": viewMode !== "weekly",
              "h-56": viewMode === "weekly", // More height for weekly view
              "opacity-60": !isCurrentMonth,
              "ring-2 ring-[#bc7129] ring-offset-0": selected,
              "bg-gradient-to-br from-[#1a1d24] to-[#1e2126] border border-[#2a2d36]":
                !hasData,
              "hover:border-[#bb9c2d]/30": !hasData,
              "hover:shadow-lg hover:shadow-[#bb9c2d]/5": !hasData,
            },
            className
          )}
          style={background ? { background } : undefined}
        >
          <span
            className={cn("text-xl font-medium", {
              "text-[#bb9c2d]": hasData,
              "text-[#6b7280]": !isCurrentMonth,
              "text-[#9ca3af]": !hasData && isCurrentMonth,
            })}
          >
            {day.getDate()}
          </span>

          {today && (
            <span
              className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[#bc7129]"
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
                <div className="w-full h-full bg-gradient-to-br from-[#bb9c2d] to-transparent rounded-md" />
              </div>

              {/* No data indicator */}
              <div
                className={cn(
                  "absolute left-1 right-1",
                  viewMode === "weekly" ? "bottom-3" : "bottom-2"
                )}
              >
                <div className="h-3 bg-gradient-to-r from-[#2a2d36] to-[#1e2126] rounded opacity-40" />
              </div>

              {/* Subtle corner accent */}
              <div className="absolute top-2 right-2">
                <div className="h-1.5 w-1.5 bg-[#bb9c2d]/20 rounded-full" />
              </div>
            </>
          )}
        </button>
      </TooltipTrigger>

      <CalendarCellTooltip cell={cell} iso={iso} />
    </Tooltip>
  );
}
