import {
  eachDayOfInterval,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
} from "date-fns";

export type ViewMode = "monthly" | "weekly" | "daily";

export function getCalendarDays(viewMonth: Date, viewMode: ViewMode): Date[] {
  switch (viewMode) {
    case "monthly": {
      const monthStart = startOfMonth(viewMonth);
      const monthEnd = endOfMonth(viewMonth);

      const gridStart = startOfWeek(monthStart, { weekStartsOn: 1 });
      const gridEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });

      return eachDayOfInterval({ start: gridStart, end: gridEnd });
    }

    case "weekly": {
      const weekStart = startOfWeek(viewMonth, { weekStartsOn: 1 });
      const weekEnd = endOfWeek(viewMonth, { weekStartsOn: 1 });

      return eachDayOfInterval({
        start: weekStart,
        end: weekEnd,
      });
    }

    case "daily": {
      return [viewMonth];
    }

    default:
      return [];
  }
}