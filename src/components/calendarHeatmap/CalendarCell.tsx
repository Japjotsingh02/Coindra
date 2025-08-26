"use client";

import { useMemo } from "react";
import { isSameDay, isToday } from "date-fns";
import type { HeatmapCell } from "@/types/heatmap";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipProvider,
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
  onDateClick?: (cell?: HeatmapCell) => void;
  onCloseModal?: () => void;
};

const Sparkline = ({ cell }: { cell: HeatmapCell }) => {
  return (
    <div className="absolute bottom-3 left-1 right-1 flex justify-center">
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

export default function CalendarCell({
  day,
  selectedDate,
  isCurrentMonth = true,
  className,
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
            "relative h-24 w-full rounded-md transition-all duration-150 p-3 flex",
            "hover:scale-[1.02] focus:outline-none",
            {
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
              className="absolute right-2 top-2 h-2 w-2 rounded-full"
              style={{ backgroundColor: "#bc7129" }}
              aria-label="Today"
            />
          )}

          {hasData && cell?.prices7d && <Sparkline cell={cell} />}

          {/* Empty state styling for cells without data */}
          {!hasData && isCurrentMonth && (
            <>
              {/* Subtle pattern overlay */}
              <div className="absolute inset-0 opacity-5">
                <div className="w-full h-full bg-gradient-to-br from-[#bb9c2d] to-transparent rounded-md" />
              </div>

              {/* No data indicator */}
              <div className="absolute bottom-2 left-1 right-1">
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
