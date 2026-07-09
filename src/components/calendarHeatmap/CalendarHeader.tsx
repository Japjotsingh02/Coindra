import { cn } from '@/lib/utils';
import {
  format,
  addMonths,
  subMonths,
  startOfWeek,
  isSameMonth,
  isAfter,
  startOfMonth,
  addWeeks,
  addDays,
  subWeeks,
  subDays,
  endOfWeek,
  getMonth,
} from 'date-fns';
import { Button } from '@/components/ui/button';
import { Calendar, ChevronLeft, ChevronRight, Grid, List } from 'lucide-react';
import { ViewMode } from './CalendarHeatmap';
import { useCallback } from 'react';

type CalendarHeaderProps = {
  viewMonth: Date;
  onMonthChange: (date: Date) => void;
  viewMode: ViewMode;
  onViewModeChange: (viewMode: ViewMode) => void;
  onClickToday: () => void;
};

const pillBtn = cn('shadow-none', 'transition-all duration-200');

const CalendarHeader = ({
  viewMonth,
  onMonthChange,
  viewMode,
  onViewModeChange,
  onClickToday,
}: CalendarHeaderProps) => {
  const changeDate = useCallback(
    (amount: number) => {
      let newDate = new Date(viewMonth);

      switch (viewMode) {
        case 'monthly': {
          newDate = amount > 0 ? addMonths(viewMonth, amount) : subMonths(viewMonth, -amount);
          newDate = startOfMonth(newDate);
          break;
        }
        case 'weekly': {
          newDate = amount > 0 ? addWeeks(viewMonth, amount) : subWeeks(viewMonth, -amount);

          const weekStart = startOfWeek(newDate, { weekStartsOn: 1 });
          const weekEnd = endOfWeek(newDate, { weekStartsOn: 1 });

          const startMonth = getMonth(weekStart);
          const endMonth = getMonth(weekEnd);

          if (startMonth !== endMonth) {
            newDate = startOfMonth(weekEnd);
          }
          break;
        }
        case 'daily': {
          newDate = amount > 0 ? addDays(viewMonth, amount) : subDays(viewMonth, -amount);
          break;
        }
      }

      onMonthChange(newDate);
    },
    [viewMonth, onMonthChange, viewMode]
  );

  const onToday = useCallback(() => {
    const today = new Date();
    onMonthChange(today);
    onClickToday();
  }, [onMonthChange, onClickToday]);

  const getTitle = () => {
    switch (viewMode) {
      case 'monthly':
        return format(viewMonth, 'MMMM yyyy');
      case 'weekly': {
        const weekStart = startOfWeek(viewMonth, { weekStartsOn: 1 });
        const weekEnd = addDays(weekStart, 6);

        if (isSameMonth(weekStart, weekEnd)) {
          return `${format(weekStart, 'MMM d')} - ${format(weekEnd, 'd, yyyy')}`;
        }
        return `${format(weekStart, 'MMM d')} - ${format(weekEnd, 'MMM d, yyyy')}`;
      }
      case 'daily':
        return format(viewMonth, 'EEEE, MMMM d, yyyy');
      default:
        return format(viewMonth, 'MMMM yyyy');
    }
  };

  const disableNext = useCallback(() => {
    switch (viewMode) {
      case 'monthly':
        return isAfter(addMonths(viewMonth, 1), startOfMonth(new Date()));
      case 'weekly':
        return isAfter(addWeeks(viewMonth, 1), new Date());
      case 'daily':
        return isAfter(addDays(viewMonth, 1), new Date());
      default:
        return false;
    }
  }, [viewMonth, viewMode]);

  const viewModes: { mode: ViewMode; icon: typeof Calendar }[] = [
    { mode: 'monthly', icon: Calendar },
    { mode: 'weekly', icon: Grid },
    { mode: 'daily', icon: List },
  ];

  return (
    <div
      className={cn(
        'flex flex-col lg:flex-row sm:items-center justify-between',
        'gap-2 sm:gap-3 xl:gap-2 2xl:gap-4'
      )}
    >
      <div
        className={cn(
          'flex items-center justify-between lg:justify-normal',
          'lg:space-x-5 2xl:space-x-7 w-full'
        )}
      >
        <h3 className="font-semibold text-label">{getTitle()}</h3>
        <Button variant="outline" size="lg" onClick={onToday} className="cursor-pointer">
          Today
        </Button>
      </div>

      <div className="flex items-center justify-between lg:justify-end lg:gap-4 w-full">
        <div
          className={cn(
            'bg-surface-light border border-surface-border text-ash rounded-[4px]',
            'flex items-center gap-2 p-1!'
          )}
        >
          {viewModes.map(({ mode, icon: Icon }) => (
            <Button
              key={mode}
              variant="ghost"
              size="md"
              onClick={() => onViewModeChange(mode)}
              className={viewMode === mode ? 'view-mode-active' : 'text-ash hover:text-label'}
            >
              <Icon className="size-2.5 sm:size-3 md:size-3 xl:size-3 2xl:size-4" />
            </Button>
          ))}
        </div>
        <div className="flex items-center gap-1.5">
          <Button variant="outline" size="lg" onClick={() => changeDate(-1)} className={pillBtn}>
            <ChevronLeft className="size-3 sm:size-3.5 md:size-3.5 xl:size-3.5 2xl:size-4.5" />
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={() => changeDate(1)}
            disabled={disableNext()}
            className={cn(pillBtn, 'disabled:opacity-40 disabled:cursor-not-allowed')}
          >
            <ChevronRight className="size-3 sm:size-3.5 md:size-3.5 xl:size-3.5 2xl:size-4.5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CalendarHeader;
