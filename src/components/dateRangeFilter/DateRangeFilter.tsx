"use client";

import * as React from "react";
import { addDays, format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

// const QuickFilters = [
//   { label: "Today", range: [new Date(), new Date()] },
//   { label: "This Week", range: [new Date(), addDays(new Date(), 7)] },
//   { label: "This Month", range: [new Date(), addDays(new Date(), 30)] },
// ];

export function DateRangeFilter({
  onChange,
  initialRange,
}: {
  onChange: (range: { start: Date; end: Date }) => void;
  initialRange?: { start: Date; end: Date };
}) {
  const [date, setDate] = React.useState<{
    from: Date | undefined;
    to?: Date | undefined;
  }>({
    from: initialRange?.start || new Date(),
    to: initialRange?.end || addDays(new Date(), 0),
  });

  return (
    <div className="grid gap-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal bg-background-input border border-surface-border px-3 py-2.5 text-ash text-xs 2xl:text-base font-medium rounded transition-all duration-200 hover:border-brand/30 hover:text-brand hover:bg-surface-light focus:border-brand focus:ring-1 focus:ring-brand/20 h-8 2xl:h-11",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4 text-brand" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "MMM dd")} -{" "}
                  {format(date.to, "MMM dd, yyyy")}
                </>
              ) : (
                format(date.from, "MMM dd, yyyy")
              )
            ) : (
              <span>Select date range</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-auto p-4 border border-surface-border bg-background-input rounded-lg shadow-2xl z-[9999]"
          align="start"
          side="bottom"
          sideOffset={8}
          avoidCollisions={false}
          forceMount
        >
          {/* Quick Filters */}
          {/* <div className="flex gap-2 mb-3">
            {QuickFilters.map((filter) => (
              <button
                key={filter.label}
                className="text-sm px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded"
                onClick={() => applyQuickFilter(filter.range)}
              >
                {filter.label}
              </button>
            ))}
          </div> */}

          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date.from || new Date()}
            selected={date}
            onSelect={(range) => {
              if (range?.from) {
                setDate(range);
                if (range.to) {
                  onChange({ start: range.from, end: range.to });
                }
              }
            }}
            numberOfMonths={2}
            classNames={{
              months:
                "flex flex-col sm:flex-row space-y-6 sm:space-x-6 sm:space-y-0",
              month: "space-y-4",
              caption:
                "flex justify-center pt-1 relative items-center text-brand font-semibold text-lg min-h-[2.5rem]",
              caption_label: "text-brand font-bold text-lg tracking-wide",
              nav: "space-x-1 flex items-center",
              nav_button:
                "h-7 w-7 bg-surface-border p-0 opacity-80 hover:opacity-100 text-brand hover:text-brand hover:bg-brand/10 rounded-md transition-all duration-200 border border-surface-border hover:border-brand/30",
              nav_button_previous: "absolute left-2",
              nav_button_next: "absolute right-2",
              table: "w-full border-collapse space-y-1",
              head_row: "flex mb-2",
              head_cell:
                "text-muted-secondary rounded-md w-9 font-medium text-xs tracking-wide uppercase",
              row: "flex w-full mt-1",
              cell: "h-9 w-9 text-center text-sm p-0 relative hover:bg-surface-light rounded-lg focus-within:relative focus-within:z-20 transition-all duration-200",
              day: "h-9 w-9 p-0 font-medium aria-selected:opacity-100 text-ash hover:text-white transition-colors duration-200",
              day_selected:
                "bg-brand text-white hover:bg-brand/90 hover:text-white focus:bg-brand focus:text-white font-bold shadow-lg",
              day_today:
                "bg-surface-border text-brand border-2 border-brand font-bold",
              day_outside:
                "text-muted-secondary opacity-40 aria-selected:bg-brand/20 aria-selected:text-brand",
              day_disabled: "text-muted-secondary opacity-30",
              day_range_middle:
                "aria-selected:bg-brand/20 aria-selected:text-brand font-medium",
              day_range_start:
                "aria-selected:bg-brand aria-selected:text-white font-bold",
              day_range_end:
                "aria-selected:bg-brand aria-selected:text-white font-bold",
              day_hidden: "invisible",
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
