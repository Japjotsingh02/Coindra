// 'use client';

// import { cn } from '@/lib/utils';
// import React from 'react';
// import { HeatmapCell } from '@/types/heatmap';
// import { format } from 'date-fns';

// interface CalendarCellProps {
//   cell: HeatmapCell;
//   isSelected?: boolean;
//   onClick?: (cell: HeatmapCell) => void;
//   size?: 'sm' | 'md' | 'lg';
//   showTooltip?: boolean;
// }

// export default function CalendarCell({
//   cell,
//   isSelected = false,
//   onClick,
//   size = 'md',
//   showTooltip = true,
// }: CalendarCellProps) {
//   const sizeClasses = {
//     sm: 'w-6 h-6 text-xs',
//     md: 'w-8 h-8 text-sm',
//     lg: 'w-10 h-10 text-base',
//   };

//   const formatValue = (value: number, type: 'price' | 'percentage' | 'volume') => {
//     switch (type) {
//       case 'price':
//         return `$${value.toFixed(2)}`;
//       case 'percentage':
//         return `${value > 0 ? '+' : ''}${value.toFixed(2)}%`;
//       case 'volume':
//         return value >= 1000000
//           ? `${(value / 1000000).toFixed(1)}M`
//           : value >= 1000
//           ? `${(value / 1000).toFixed(1)}K`
//           : value.toFixed(0);
//       default:
//         return value.toFixed(2);
//     }
//   };

//   const getPerformanceColor = (performance: string) => {
//     switch (performance) {
//       case 'positive':
//         return 'text-green-400';
//       case 'negative':
//         return 'text-red-400';
//       default:
//         return 'text-gray-400';
//     }
//   };

//   const handleClick = () => {
//     if (onClick) {
//       onClick(cell);
//     }
//   };

//   return (
//     <div className="relative group">
//       <div
//         className={`
//           ${sizeClasses[size]}
//           ${cell.color.bg}
//           ${cell.color.border}
//           border rounded cursor-pointer
//           transition-all duration-200 ease-in-out
//           hover:scale-110 hover:shadow-lg
//           ${isSelected ? 'ring-2 ring-amber-400 ring-offset-2 ring-offset-gray-900' : ''}
//           flex items-center justify-center
//           font-mono font-medium
//         `}
//         onClick={handleClick}
//         title={showTooltip ? `${format(new Date(cell.date), 'MMM dd, yyyy')}` : undefined}
//       >
//         <span className={`${getPerformanceColor(cell.performance)} font-bold`}>
//           {cell.performance === 'positive' ? '↗' : cell.performance === 'negative' ? '↘' : '→'}
//         </span>
//       </div>

//       {/* Tooltip */}
//       {showTooltip && (
//         <div className="
//           absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2
//           bg-gray-900 border border-gray-700 rounded-lg shadow-xl
//           text-white text-sm whitespace-nowrap z-50
//           opacity-0 group-hover:opacity-100 transition-opacity duration-200
//           pointer-events-none
//         ">
//           <div className="space-y-1">
//             <div className="font-semibold text-amber-400">
//               {format(new Date(cell.date), 'MMM dd, yyyy')}
//             </div>
//             <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
//               <div>
//                 <span className="text-gray-400">Open:</span>
//                 <span className="ml-2">{formatValue(cell.open, 'price')}</span>
//               </div>
//               <div>
//                 <span className="text-gray-400">Close:</span>
//                 <span className="ml-2">{formatValue(cell.close, 'price')}</span>
//               </div>
//               <div>
//                 <span className="text-gray-400">High:</span>
//                 <span className="ml-2">{formatValue(cell.high, 'price')}</span>
//               </div>
//               <div>
//                 <span className="text-gray-400">Low:</span>
//                 <span className="ml-2">{formatValue(cell.low, 'price')}</span>
//               </div>
//               <div>
//                 <span className="text-gray-400">Volume:</span>
//                 <span className="ml-2">{formatValue(cell.volume, 'volume')}</span>
//               </div>
//               <div>
//                 <span className="text-gray-400">Performance:</span>
//                 <span className={`ml-2 ${getPerformanceColor(cell.performance)}`}>
//                   {formatValue(cell.performancePct, 'percentage')}
//                 </span>
//               </div>
//             </div>
//             <div className="pt-1 border-t border-gray-700">
//               <div className="flex justify-between text-xs">
//                 <span className="text-gray-400">Volatility:</span>
//                 <span className="text-blue-400">{formatValue(cell.volatilityDaily, 'percentage')}</span>
//               </div>
//               <div className="flex justify-between text-xs">
//                 <span className="text-gray-400">Liquidity:</span>
//                 <span className="text-purple-400">{formatValue(cell.liquidity, 'volume')}</span>
//               </div>
//             </div>
//           </div>

//           {/* Tooltip arrow */}
//           <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default function CalendarCell(props) {
//     return (
//         <>
//       <button
//         onClick={handleClick}
//         onMouseEnter={handleMouseEnter}
//         onMouseLeave={handleMouseLeave}
//         onMouseMove={handleMouseMove}
//         className={cn(
//           "relative h-24 w-full border border-gray-200 transition-all duration-200 hover:scale-105 hover:z-10 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:z-10 p-2 overflow-hidden",
//         //   getBackgroundColor(),
//         //   getTextColor(),
//           {
//             "text-gray-400": !isCurrentMonth,
//             "ring-2 ring-orange-500": isSelected,
//             "ring-2 ring-red-500 font-bold": today,
//             "border-blue-300": isInRange && !isRangeStart && !isRangeEnd,
//             "border-blue-400": isRangeStart || isRangeEnd,
//             "hover:shadow-lg": volatilityData,
//             "cursor-crosshair": isRangeSelecting,
//             "hover:ring-2 hover:ring-blue-300": isRangeSelecting,
//           },
//           className,
//         )}
//         style={getInlineStyles()}
//       >
//         {/* Date */}
//         <div className="absolute top-2 left-2">
//           <span className="text-sm font-medium">{date.getDate()}</span>
//         </div>
//         </button>
//     );
// }

"use client";

import React, { useMemo } from "react";
import { isSameDay, isToday } from "date-fns";
import type { HeatmapCell } from "@/types/heatmap";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useAppStore } from "@/store/useAppStore";
import { Sparklines, SparklinesLine } from "react-sparklines";

type CalendarCellProps = {
  day: Date;
  /** Optional: dim cells outside current month */
  isCurrentMonth?: boolean;
  className?: string;
  onDateClick?: (iso: string, cell?: HeatmapCell) => void;
};

export default function CalendarCell({
  day,
  isCurrentMonth = true,
  className,
  onDateClick,
}: CalendarCellProps) {
  const { processedHeatmapData, selectedDate, setSelectedDate } = useAppStore();

  const iso = useMemo(() => day.toISOString().slice(0, 10), [day]);
  const cell = React.useMemo(
    () => processedHeatmapData.find((d) => d.date === iso),
    [processedHeatmapData, iso]
  );

  if (!isCurrentMonth) return <div></div>;

  const bgImage = cell?.color?.backgroundImage ?? cell?.color?.bg;
  const border = cell?.color?.border ?? "#1e2126";

  const selected = selectedDate ? isSameDay(day, selectedDate) : false;
  const today = isToday(day);

  const handleClick = () => {
    setSelectedDate(day);
    onDateClick?.(iso, cell);
  };

  return (
    <TooltipProvider delayDuration={80}>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            onClick={handleClick}
            className={cn(
              "relative h-24 w-full rounded-md transition-transform duration-150 p-3 flex",
              "hover:scale-[1.03] focus:outline-none",
              {
                "opacity-60": !isCurrentMonth,
                "ring-2 ring-[#bc7129] ring-offset-0": selected, // brand accent ring
              },
              className
            )}
            style={{
              background: bgImage,
              //   borderColor: selected ? "#bc7129" : border,
            }}
          >
            <span
              className={cn(
                "text-lg text-[#bb9c2d]",
                !isCurrentMonth && "text-[#6b7280]"
              )}
            >
              {day.getDate()}
            </span>

            {/* Today dot */}
            {today && (
              <span
                className="absolute right-2 top-2 h-2 w-2 rounded-full"
                style={{ backgroundColor: "#bc7129" }}
                aria-label="Today"
              />
            )}

            {cell?.prices7d && (
              <div className="absolute bottom-3 left-1 right-1 flex justify-center">
                <div className="w-[60px] h-[20px] overflow-hidden">
                  <Sparklines
                    data={cell.prices7d}
                    width={60}
                    height={20}
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
                        strokeWidth: 2,
                        fill: "none",
                      }}
                    />
                  </Sparklines>
                </div>
              </div>
            )}

            {/* Optional tiny performance/vol/liquidity badges (subtle, no text) */}
            {/* Example: bottom-left triangle/marker could go here if desired */}
          </button>
        </TooltipTrigger>

        {/* Tooltip w/ metrics (only when data present) */}
        {cell && (
          <TooltipContent side="top" align="center" className="p-3 text-xs">
            <div className="mb-1 font-medium">{iso}</div>
            <div className="grid grid-cols-2 gap-x-3 gap-y-1">
              <span className="text-muted-foreground">Vol (daily)</span>
              <span>{cell.volatilityDaily.toFixed(2)}%</span>

              <span className="text-muted-foreground">Vol (rolling)</span>
              <span>
                {cell.volatilityRolling !== null
                  ? `${cell.volatilityRolling.toFixed(2)}%`
                  : "—"}
              </span>

              <span className="text-muted-foreground">Liquidity</span>
              <span>{formatCompact(cell.liquidity)}</span>

              <span className="text-muted-foreground">Performance</span>
              <span
                className={cn(
                  cell.performance === "positive" && "text-green-500",
                  cell.performance === "negative" && "text-red-500",
                  cell.performance === "neutral" && "text-gray-400"
                )}
              >
                {cell.performancePct >= 0 ? "+" : ""}
                {cell.performancePct.toFixed(2)}%
              </span>
            </div>
          </TooltipContent>
        )}
      </Tooltip>
    </TooltipProvider>
  );
}

function formatCompact(n: number) {
  try {
    return Intl.NumberFormat("en", {
      notation: "compact",
      maximumFractionDigits: 2,
    }).format(n);
  } catch {
    if (n >= 1_000_000_000) return (n / 1_000_000_000).toFixed(1) + "B";
    if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
    if (n >= 1_000) return (n / 1_000).toFixed(1) + "K";
    return String(n);
  }
}
