"use client";

import {
  eachDayOfInterval,
  startOfMonth,
  endOfMonth,
  format,
  isToday,
  getDay,
  addMonths,
  isSameDay,
  isSameMonth,
} from "date-fns";
import CalendarCell from "./CalendarCell";
import { useAppStore } from "@/store/useAppStore";

type Props = {
  month: Date;
  onDateClick: (date: string) => void;
};

type CalendarHeaderProps = {
  curMonth: Date;
};

const CalendarHeader = ({ curMonth }: CalendarHeaderProps) => (
  // const [currentMonth, setCurrentMonth] = useState<Date>(new Date());

  // const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  // const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));

  <div className="flex items-center justify-center pt-2 pb-4">
    {/* <div className="flex items-center space-x-4">
      <button
        onClick={prevMonth}
        className="p-1 rounded-full hover:bg-gray-200"
        aria-label="Previous month"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>
    </div> */}

    <div className="text-center">
      <h2 className="text-2xl font-semibold text-white">
        {format(curMonth, "MMMM yyyy")}
      </h2>
    </div>

    {/* <div className="flex items-center space-x-4">
      <button
        onClick={nextMonth}
        className="p-1 rounded-full hover:bg-gray-200"
        aria-label="Next month"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>
    </div> */}
  </div>
);

const CalendarDays = () => (
  <div className="grid grid-cols-7 gap-3 px-2 py-2">
    {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
      <div key={day} className="text-center text-lg font-medium text-gray-500">
        {day}
      </div>
    ))}
  </div>
);

export default function CalendarHeatmap() {
  const {selectedDate, setSelectedDate, processedHeatmapData: heatmapData} = useAppStore();
  // const [hoverData, setHoverData] = useState<HeatmapCell | null>(null);

  const currentMonth = startOfMonth(selectedDate ?? new Date());
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

  console.log(heatmapData);

  const allDays = [...prevMonthDays, ...currentMonthDays, ...nextMonthDays];

  return (
    <div className="rounded-lg shadow-md overflow-hidden border border-[#20232E] bg-[#0a0a0a] px-12 py-6">
      <CalendarHeader curMonth={currentMonth} />

      <CalendarDays />

      <div className="grid grid-cols-7 gap-3 pt-2 text-lg">
        {allDays.map((day) => 
          <CalendarCell key={day.toISOString()} day={day} isCurrentMonth={isSameMonth(day, currentMonth)} />
        )}
      </div>
    </div>
  );
}
