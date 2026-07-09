'use client';

import { useMemo } from 'react';
import { isSameDay, isToday } from 'date-fns';
import type { HeatmapCell } from '@/types/heatmap';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipTrigger } from '@/components/ui/tooltip';
import { useAppStore } from '@/store/useAppStore';
import { Sparklines, SparklinesLine } from 'react-sparklines';
import { CalendarCellTooltip } from '../elements/calendarCellTooltip/CalendarCellTooltip';

type CalendarCellProps = {
  day: Date;
  selectedDate: Date | null;
  isCurrentMonth?: boolean;
  className?: string;
  viewMode?: 'monthly' | 'weekly' | 'daily';
  onDateClick?: (cell?: HeatmapCell) => void;
  onCloseModal?: () => void;
};

const Sparkline = ({
  cell,
  viewMode,
}: {
  cell: HeatmapCell;
  viewMode: 'monthly' | 'weekly' | 'daily';
}) => {
  const { sparklineColor, sparklineGlow } = cell.performanceColor;

  return (
    <div
      className={cn(
        'absolute left-0 right-0 flex justify-center pointer-events-none',
        viewMode === 'monthly'
          ? 'bottom-1.5 sm:bottom-2 md:bottom-3 xl:bottom-2 2xl:bottom-3'
          : 'inset-0 items-center justify-center'
      )}
    >
      <div
        className={cn(
          'w-[70%] h-[20%] sm:w-[55%] sm:h-[15%] xl:w-[45%] xl:h-[12%]',
          'overflow-hidden opacity-90'
        )}
        role="img"
        aria-label={`7-day trend: ${cell.performance}`}
      >
        <Sparklines data={cell.prices7d} svgWidth={'100%'} svgHeight={'100%'} margin={2}>
          <SparklinesLine
            color={sparklineColor}
            style={{
              strokeWidth: 4,
              fill: 'none',
              strokeLinecap: 'round',
              strokeLinejoin: 'round',
              filter: `drop-shadow(0 0 4px ${sparklineGlow})`,
            }}
          />
        </Sparklines>
      </div>
    </div>
  );
};

const LiquidityScoreBar = ({
  cell,
  viewMode,
}: {
  cell: HeatmapCell;
  viewMode: 'monthly' | 'weekly' | 'daily';
}) => {
  const normalizedScore = Math.min(Math.max(cell.liquidityScore, 0), 100);
  const { barGradient, barBadge } = cell.liquidityColor;

  return (
    <div
      className={cn(
        'absolute left-1.5 right-1.5 sm:left-2 sm:right-2',
        viewMode === 'weekly'
          ? 'bottom-1 sm:bottom-2'
          : 'bottom-1.5 sm:bottom-2 md:bottom-3 xl:bottom-2 2xl:bottom-3'
      )}
    >
      <div className="flex justify-end mb-1 lg:mb-1.5">
        <span
          className={cn(
            'text-[4px] md:text-[8px] 2xl:text-xs lg:text-[8px] font-semibold tabular-nums',
            'py-[2px] px-[3px] lg:px-1.5 lg:py-0.5 rounded-md border backdrop-blur-md',
            'transition-colors duration-300',
            barBadge
          )}
        >
          {Math.round(normalizedScore)}%
        </span>
      </div>
      <div
        className={cn(
          'relative w-full h-1 sm:h-1.5 md:h-1.5 rounded-full overflow-hidden',
          'bg-surface-light border border-surface-border backdrop-blur-sm'
        )}
      >
        <div
          className={cn(
            'h-full rounded-full bg-gradient-to-r relative',
            'transition-[width] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]',
            barGradient
          )}
          style={{ width: `${normalizedScore}%` }}
        >
          <div
            className={cn(
              'absolute inset-0 bg-gradient-to-r from-transparent',
              'via-white/15 to-transparent animate-[shimmer_2.5s_ease-in-out_infinite]'
            )}
          />
        </div>
      </div>
    </div>
  );
};

export default function CalendarCell({
  day,
  selectedDate,
  isCurrentMonth = true,
  className,
  viewMode = 'monthly',
  onDateClick,
}: CalendarCellProps) {
  const { processedHeatmapData, filters } = useAppStore();
  const { volatility, liquidity, performance } = filters;

  const iso = useMemo(() => day.toISOString().slice(0, 10), [day]);
  const cell = useMemo(() => {
    return processedHeatmapData.find((d) => isSameDay(new Date(`${d.date}T00:00:00Z`), day));
  }, [processedHeatmapData, day]);

  if (!isCurrentMonth) return <div />;

  const hasData = !!cell;

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
            'group relative w-full overflow-hidden rounded-[4px] backdrop-blur-sm cursor-pointer',
            'transition-all duration-200 p-1.5 lg:p-2 xl:p-3 flex',
            'hover:brightness-[var(--cell-hover-brightness)] hover:scale-[1.02] hover:z-10 hover:border-surface-ring',
            'focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/50',
            'focus-visible:ring-offset-2 focus-visible:ring-offset-ring-offset',
            {
              'h-12 sm:h-18 lg:h-19 2xl:h-24': viewMode !== 'weekly',
              'h-20 sm:h-40 xl:h-45 2xl:h-52': viewMode === 'weekly',
              'ring-2 ring-brand ring-offset-2 ring-offset-ring-offset shadow-[0_0_16px_var(--color-brand-ring-glow)] z-10':
                selected,
              'bg-surface-light border border-surface-border': !hasData,
              'border border-surface-border': hasData,
            },
            className
          )}
          style={
            hasData && volatility && cell.volatilityColor.bg
              ? { background: cell.volatilityColor.bg }
              : undefined
          }
        >
          <span
            className={cn(
              'relative z-[1] text-xs sm:text-sm md:text-base xl:text-sm 2xl:text-lg font-medium tabular-nums tracking-tight',
              hasData && cell.volatilityColor.textColor
                ? cell.volatilityColor.textColor
                : hasData
                  ? 'text-label/70'
                  : undefined,
              hasData && cell.volatilityColor.textShadow,
              !hasData && 'text-label/25'
            )}
          >
            {day.getDate()}
          </span>

          {today && (
            <span
              className={cn(
                'absolute right-1.5 top-1.5 md:right-2 md:top-2 z-[2]',
                'h-1 w-1 md:h-1.5 md:w-1.5 rounded-full',
                'bg-brand shadow-[0_0_0_2px_var(--color-brand-dot-ring),0_0_8px_var(--color-brand-dot-glow)]'
              )}
              aria-label="Today"
            />
          )}

          {hasData && cell?.prices7d && performance && (
            <Sparkline cell={cell} viewMode={viewMode} />
          )}

          {hasData && cell?.liquidityScore !== undefined && liquidity && viewMode !== 'monthly' && (
            <LiquidityScoreBar cell={cell} viewMode={viewMode} />
          )}
        </button>
      </TooltipTrigger>

      <CalendarCellTooltip cell={cell} iso={iso} />
    </Tooltip>
  );
}
