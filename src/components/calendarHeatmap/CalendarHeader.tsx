import {
  format,
  addMonths,
  subMonths,
  startOfWeek,
  isSameMonth,
} from "date-fns";
import { Button } from "@/components/ui/button";
import { Calendar, ChevronLeft, ChevronRight, Grid, List } from "lucide-react";
import { ViewMode } from "./CalendarHeatmap";
import { useCallback } from "react";

type CalendarHeaderProps = {
  currMonth: Date;
  onMonthChange: (date: Date) => void;
  viewMode: ViewMode;
  onViewModeChange: (viewMode: ViewMode) => void;
};

const CalendarHeader = ({
  currMonth,
  onMonthChange,
  viewMode,
  onViewModeChange,
}: CalendarHeaderProps) => {
  const changeDate = useCallback(
    (amount: number) => {
      let newDate = new Date(currMonth);
      switch (viewMode) {
        case "monthly":
          newDate = amount > 0 ? addMonths(currMonth, amount) : subMonths(currMonth, -amount);
          break;
        case "weekly":
          newDate.setDate(currMonth.getDate() + (7 * amount));
          break;
        case "daily":
          newDate.setDate(currMonth.getDate() + amount);
          break;
      }
      onMonthChange(newDate);
    },
    [currMonth, onMonthChange, viewMode]
  );

  const onToday = useCallback(() => {
    const today = new Date();
    onMonthChange(today);
  }, [onMonthChange]);

  const getTitle = () => {
    switch (viewMode) {
      case "monthly":
        return format(currMonth, "MMMM yyyy");
      case "weekly":
        const weekStart = startOfWeek(currMonth, { weekStartsOn: 1 });
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6);

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
        return format(currMonth, "EEEE, MMMM d, yyyy");
      default:
        return format(currMonth, "MMMM yyyy");
    }
  };

  return (
    <div className="flex items-center justify-between pt-2 pb-4">
      <div className="flex items-center space-x-4">
        <h2 className="text-2xl font-semibold text-white">{getTitle()}</h2>
        <Button
          variant="outline"
          size="lg"
          onClick={onToday}
          className="text-lg"
        >
          Today
        </Button>
      </div>

      <div className="flex items-center space-x-2">
        <div className="flex items-center border border-[#1e2126] rounded-lg bg-[#1e2126] overflow-hidden">
          <Button
            variant="ghost"
            size="lg"
            onClick={() => onViewModeChange("monthly")}
            className={`rounded-none border-0 h-10 px-4 transition-all duration-200 ${
              viewMode === "monthly"
                ? "bg-[#bb9c2d] text-white hover:bg-[#bb9c2d]/90"
                : "bg-transparent text-white hover:bg-[#bb9c2d]/10 hover:text-[#bb9c2d]"
            }`}
          >
            <Calendar className="size-5" />
          </Button>
          <Button
            variant="ghost"
            size="lg"
            onClick={() => onViewModeChange("weekly")}
            className={`rounded-none border-0 h-10 px-4 transition-all duration-200 ${
              viewMode === "weekly"
                ? "bg-[#bb9c2d] text-white hover:bg-[#bb9c2d]/90"
                : "bg-transparent text-white hover:bg-[#bb9c2d]/10 hover:text-[#bb9c2d]"
            }`}
          >
            <Grid className="size-5" />
          </Button>
          <Button
            variant="ghost"
            size="lg"
            onClick={() => onViewModeChange("daily")}
            className={`rounded-none border-0 h-10 px-4 transition-all duration-200 ${
              viewMode === "daily"
                ? "bg-[#bb9c2d] text-white hover:bg-[#bb9c2d]/90"
                : "bg-transparent text-white hover:bg-[#bb9c2d]/10 hover:text-[#bb9c2d]"
            }`}
          >
            <List className="size-5" />
          </Button>
        </div>
        <Button variant="outline" size="lg" onClick={() => changeDate(-1)}>
          <ChevronLeft className="size-5" />
        </Button>
        <Button variant="outline" size="lg" onClick={() => changeDate(1)}>
          <ChevronRight className="size-5" />
        </Button>
      </div>
    </div>
  );
};

export default CalendarHeader;
