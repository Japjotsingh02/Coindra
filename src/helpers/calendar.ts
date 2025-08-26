import {
  eachDayOfInterval,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  getDay,
  addMonths,
} from "date-fns";

export type ViewMode = "monthly" | "weekly" | "daily";

export function getCalendarDays(viewMonth: Date, viewMode: ViewMode): Date[] {
  switch (viewMode) {
    case "monthly":
      const monthStart = startOfMonth(viewMonth);
      const monthEnd = endOfMonth(viewMonth);
      const startDay = getDay(monthStart);
      const daysFromPrevMonth = startDay === 0 ? 6 : startDay - 1;

      const prevMonthDays = eachDayOfInterval({
        start: addMonths(monthStart, -1),
        end: addMonths(monthEnd, -1),
      }).slice(-daysFromPrevMonth);

      const currentMonthDays = eachDayOfInterval({
        start: monthStart,
        end: monthEnd,
      });

      const totalCells = Math.ceil((daysFromPrevMonth + currentMonthDays.length) / 7) * 7;
      const daysFromNextMonth = totalCells - (daysFromPrevMonth + currentMonthDays.length);

      const nextMonthDays = eachDayOfInterval({
        start: addMonths(monthStart, 1),
        end: addMonths(monthEnd, 1),
      }).slice(0, daysFromNextMonth);

      return [...prevMonthDays, ...currentMonthDays, ...nextMonthDays];

    case "weekly":
      const weekStart = startOfWeek(viewMonth, { weekStartsOn: 1 });
      return eachDayOfInterval({
        start: weekStart,
        end: endOfWeek(viewMonth, { weekStartsOn: 1 }),
      });

    case "daily":
      return [viewMonth];

    default:
      return [];
  }
}