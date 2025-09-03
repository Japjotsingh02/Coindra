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
} from "date-fns";
import { Button } from "@/components/ui/button";
import { Calendar, ChevronLeft, ChevronRight, Grid, List } from "lucide-react";
import { ViewMode } from "./CalendarHeatmap";
import { useCallback } from "react";

type CalendarHeaderProps = {
  viewMonth: Date;
  onMonthChange: (date: Date) => void;
  viewMode: ViewMode;
  onViewModeChange: (viewMode: ViewMode) => void;
  onClickToday: () => void;
};

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
        case "monthly": {
          newDate =
            amount > 0
              ? addMonths(viewMonth, amount)
              : subMonths(viewMonth, -amount);
          newDate = startOfMonth(newDate);
          break;
        }
        case "weekly": {
          newDate =
            amount > 0
              ? addWeeks(viewMonth, amount)
              : subWeeks(viewMonth, -amount);

          const weekStart = startOfWeek(newDate, { weekStartsOn: 1 });
          const weekEnd = endOfWeek(newDate, { weekStartsOn: 1 });

          const startMonth = getMonth(weekStart);
          const endMonth = getMonth(weekEnd);

          if (startMonth !== endMonth) {
            newDate = startOfMonth(weekEnd);
          }
          break;
        }
        case "daily": {
          newDate =
            amount > 0
              ? addDays(viewMonth, amount)
              : subDays(viewMonth, -amount);
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
  }, [onMonthChange]);

  const getTitle = () => {
    switch (viewMode) {
      case "monthly":
        return format(viewMonth, "MMMM yyyy");
      case "weekly":
        const weekStart = startOfWeek(viewMonth, { weekStartsOn: 1 });
        const weekEnd = addDays(weekStart, 6);

        if (isSameMonth(weekStart, weekEnd)) {
          return `${format(weekStart, "MMM d")} - ${format(
            weekEnd,
            "d, yyyy"
          )}`;
        } else {
          return `${format(weekStart, "MMM d")} - ${format(
            weekEnd,
            "MMM d, yyyy"
          )}`;
        }
      case "daily":
        return format(viewMonth, "EEEE, MMMM d, yyyy");
      default:
        return format(viewMonth, "MMMM yyyy");
    }
  };

  const disableNext = useCallback(() => {
    switch (viewMode) {
      case "monthly":
        return isAfter(addMonths(viewMonth, 1), startOfMonth(new Date()));
      case "weekly":
        return isAfter(addWeeks(viewMonth, 1), new Date());
      case "daily":
        return isAfter(addDays(viewMonth, 1), new Date());
      default:
        return false;
    }
  }, [viewMonth, viewMode]);

  return (
    <div className="flex flex-col lg:flex-row sm:items-center justify-between pb-3 sm:pb-4 xl:pb-6 2xl:pb-8 gap-2 sm:gap-3 xl:gap-2 2xl:gap-4">
      <div className="flex items-center justify-between lg:justify-normal lg:space-x-5 2xl:space-x-7 w-full">
        <h3 className="font-semibold text-label">{getTitle()}</h3>
        <Button
          variant="outline"
          size="sm"
          onClick={onToday}
          className="text-xs sm:text-sm md:text-base xl:text-sm 2xl:text-lg cursor-pointer"
        >
          Today
        </Button>
      </div>

      <div className="flex items-center justify-between lg:justify-end lg:space-x-3 w-full">
        <div className="flex items-center border border-surface-border rounded-md bg-surface-border overflow-hidden">
          <Button
            variant="ghost"
            size="lg"
            onClick={() => onViewModeChange("monthly")}
            className={`rounded-none border-0 h-7 sm:h-7 md:h-8 xl:h-7 2xl:h-8 px-1.5 sm:px-2 md:px-4 xl:px-3! 2xl:px-4! transition-all duration-200 ${
              viewMode === "monthly"
                ? "bg-surface text-brand border-brand/20"
                : "bg-transparent text-white hover:bg-brand/10 hover:text-brand"
            }`}
          >
            <Calendar className="size-3 sm:size-3.5 md:size-4.5 xl:size-3.5 2xl:size-4.5" />
          </Button>
          <Button
            variant="ghost"
            size="lg"
            onClick={() => onViewModeChange("weekly")}
            className={`rounded-none border-0 h-7 sm:h-7 md:h-8 xl:h-7 2xl:h-8 px-1.5 sm:px-2 md:px-4 xl:px-3! 2xl:px-4! transition-all duration-200 ${
              viewMode === "weekly"
                ? "bg-surface text-brand border-brand/20"
                : "bg-transparent text-white hover:bg-brand/10 hover:text-brand"
            }`}
          >
            <Grid className="size-3 sm:size-3.5 md:size-4.5 xl:size-3.5 2xl:size-4.5" />
          </Button>
          <Button
            variant="ghost"
            size="lg"
            onClick={() => onViewModeChange("daily")}
            className={`rounded-none border-0 h-7 sm:h-7 md:h-8 xl:h-7 2xl:h-8 px-1.5 sm:px-2 md:px-4 xl:px-3! 2xl:px-4! transition-all duration-200 ${
              viewMode === "daily"
                ? "bg-surface text-brand border-brand/20"
                : "bg-transparent text-white hover:bg-brand/10 hover:text-brand"
            }`}
          >
            <List className="size-3 sm:size-3.5 md:size-4.5 xl:size-3.5 2xl:size-4.5" />
          </Button>
        </div>
        <div className="space-x-1">
          <Button
            variant="outline"
            size="lg"
            onClick={() => changeDate(-1)}
            className="h-7 sm:h-7 md:h-8 xl:h-7 2xl:h-8 px-1.5 sm:px-2 md:px-4 xl:px-3! 2xl:px-4!"
          >
            <ChevronLeft className="size-3 sm:size-3.5 md:size-4.5 xl:size-3.5 2xl:size-4.5" />
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={() => changeDate(1)}
            disabled={disableNext()}
            className="disabled:opacity-50 disabled:cursor-not-allowed h-7 sm:h-7 md:h-8 xl:h-7 2xl:h-8 px-1.5 sm:px-2 md:px-4 xl:px-3! 2xl:px-4!"
          >
            <ChevronRight className="size-3 sm:size-3.5 md:size-4.5 xl:size-3.5 2xl:size-4.5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CalendarHeader;
