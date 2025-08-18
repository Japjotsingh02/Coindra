"use client";

import {
  eachDayOfInterval,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  getDay,
  addMonths,
  isSameDay,
  isSameMonth,
  isSameWeek,
  format,
} from "date-fns";
import CalendarCell from "./CalendarCell";
import { useAppStore } from "@/store/useAppStore";
import CalendarHeader from "./CalendarHeader";
import { useCallback, useState, useMemo } from "react";

export type ViewMode = "monthly" | "weekly" | "daily";

const CalendarDays = ({ viewMode }: { viewMode: ViewMode }) => {
  if (viewMode === "daily") {
    return (
      <div className="text-center text-lg font-medium text-gray-500 py-2">
        Daily View
      </div>
    );
  }

  return (
    <div className="grid grid-cols-7 gap-3 px-2 py-2">
      {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
        <div
          key={day}
          className="text-center text-lg font-medium text-gray-500"
        >
          {day}
        </div>
      ))}
    </div>
  );
};

export default function CalendarHeatmap() {
  const {
    selectedDate,
    setSelectedDate,
    processedHeatmapData: heatmapData,
  } = useAppStore();
  const [currentMonth, setCurrentMonth] = useState<Date>(
    startOfMonth(selectedDate ?? new Date())
  );
  const [viewMode, setViewMode] = useState<ViewMode>("monthly");

  // Calculate date ranges based on view mode
  // const dateRange = useMemo(() => {
  //   switch (viewMode) {
  //     case "monthly":
  //       return {
  //         start: startOfMonth(currentMonth),
  //         end: endOfMonth(currentMonth),
  //       };
  //     case "weekly":
  //       const weekStart = startOfWeek(currentMonth, { weekStartsOn: 1 }); // Monday start
  //       return {
  //         start: weekStart,
  //         end: endOfWeek(currentMonth, { weekStartsOn: 1 }),
  //       };
  //     case "daily":
  //       return {
  //         start: startOfDay(currentMonth),
  //         end: endOfDay(currentMonth),
  //       };
  //     default:
  //       return {
  //         start: startOfMonth(currentMonth),
  //         end: endOfMonth(currentMonth),
  //       };
  //   }
  // }, [currentMonth, viewMode]);

  const allDays = useMemo(() => {
    switch (viewMode) {
      case "monthly":
        const monthStart = startOfMonth(currentMonth);
        const monthEnd = endOfMonth(currentMonth);
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

        const totalDays = currentMonthDays.length;
        const daysFromNextMonth = 5 * 7 - (daysFromPrevMonth + totalDays);

        const nextMonthDays = eachDayOfInterval({
          start: addMonths(monthStart, 1),
          end: addMonths(monthEnd, 1),
        }).slice(0, daysFromNextMonth);

        return [...prevMonthDays, ...currentMonthDays, ...nextMonthDays];

      case "weekly":
        const weekStart = startOfWeek(currentMonth, { weekStartsOn: 1 });
        return eachDayOfInterval({
          start: weekStart,
          end: endOfWeek(currentMonth, { weekStartsOn: 1 }),
        });

      case "daily":
        return [currentMonth];

      default:
        return [];
    }
  }, [currentMonth, viewMode]);

  const filteredHeatmapData = useMemo(() => {
    if (!heatmapData || heatmapData.length === 0) return [];

    return heatmapData.filter((cell) => {
      const cellDate = new Date(cell.date);

      switch (viewMode) {
        case "monthly":
          return isSameMonth(cellDate, currentMonth);
        case "weekly":
          return isSameWeek(cellDate, currentMonth, { weekStartsOn: 1 });
        case "daily":
          return isSameDay(cellDate, currentMonth);
        default:
          return false;
      }
    });
  }, [heatmapData, currentMonth, viewMode]);

  const handleMonthChange = useCallback((newMonth: Date) => {
    setCurrentMonth(newMonth);
  }, []);

  const handleViewModeChange = useCallback((mode: ViewMode) => {
    setViewMode(mode);
    // Reset to current month when changing view modes
    // setCurrentMonth(startOfMonth(new Date()));
  }, []);

  const handleDateClick = useCallback(
    (date: Date) => {
      setSelectedDate(date);
    },
    [setSelectedDate]
  );

  const handleCloseModal = useCallback(() => {
    setSelectedDate(null);
  }, [setSelectedDate]);

  const renderHeatmap = () => {
    switch (viewMode) {
      case "monthly":
        return (
          <div className="grid grid-cols-7 gap-3 pt-2 text-lg">
            {allDays.map((day) => (
              <CalendarCell
                key={day.toISOString()}
                day={day}
                isCurrentMonth={isSameMonth(day, currentMonth)}
                onDateClick={(iso, cell) => handleDateClick(day)}
                onCloseModal={handleCloseModal}
              />
            ))}
          </div>
        );

      case "weekly":
        return (
          <div className="grid grid-cols-7 gap-3 pt-2 text-lg">
            {allDays.map((day) => (
              <CalendarCell
                key={day.toISOString()}
                day={day}
                isCurrentMonth={true}
                onDateClick={(iso, cell) => handleDateClick(day)}
              />
            ))}
          </div>
        );

      case "daily":
        const dayData = filteredHeatmapData.find((cell) =>
          isSameDay(new Date(cell.date), currentMonth)
        );

        return (
          <div className="pt-4">
            <div className="bg-[#1e2126] rounded-lg p-6 border border-[#2a2d36]">
              <h3 className="text-xl font-semibold text-[#bb9c2d] mb-4">
                {format(currentMonth, "EEEE, MMMM d, yyyy")}
              </h3>
              {dayData ? (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-[#16171E] p-3 rounded border border-[#2a2d36]">
                      <p className="text-sm text-[#7c8796]">Open</p>
                      <p className="text-lg font-semibold text-white">
                        ${dayData.open}
                      </p>
                    </div>
                    <div className="bg-[#16171E] p-3 rounded border border-[#2a2d36]">
                      <p className="text-sm text-[#7c8796]">Close</p>
                      <p className="text-lg font-semibold text-white">
                        ${dayData.close}
                      </p>
                    </div>
                    <div className="bg-[#16171E] p-3 rounded border border-[#2a2d36]">
                      <p className="text-sm text-[#7c8796]">High</p>
                      <p className="text-lg font-semibold text-white">
                        ${dayData.high}
                      </p>
                    </div>
                    <div className="bg-[#16171E] p-3 rounded border border-[#2a2d36]">
                      <p className="text-sm text-[#7c8796]">Low</p>
                      <p className="text-lg font-semibold text-white">
                        ${dayData.low}
                      </p>
                    </div>
                  </div>
                  <div className="bg-[#16171E] p-3 rounded border border-[#2a2d36]">
                    <p className="text-sm text-[#7c8796]">Volume</p>
                    <p className="text-lg font-semibold text-white">
                      {dayData.volume.toLocaleString()}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-[#7c8796]">
                    No data available for this date
                  </p>
                </div>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="rounded-lg shadow-md overflow-hidden border border-[#20232E] bg-[#0a0a0a] px-12 py-6">
      <CalendarHeader
        currMonth={currentMonth}
        onMonthChange={handleMonthChange}
        viewMode={viewMode}
        onViewModeChange={handleViewModeChange}
      />

      <CalendarDays viewMode={viewMode} />

      {renderHeatmap()}
    </div>
  );
}
