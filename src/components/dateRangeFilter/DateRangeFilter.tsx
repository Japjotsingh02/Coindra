'use client';

import * as React from 'react';
import { addDays, format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ui } from '@/lib/ui-styles';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

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
            size="xl"
            className={cn('w-full justify-start text-left font-normal', !date && ui.muted)}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, 'MMM dd')} - {format(date.to, 'MMM dd, yyyy')}
                </>
              ) : (
                format(date.from, 'MMM dd, yyyy')
              )
            ) : (
              <span>Select date range</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className={cn(ui.panel, 'w-auto p-4 shadow-2xl z-[9999]')}
          align="start"
          side="bottom"
          sideOffset={8}
          avoidCollisions={false}
          forceMount
        >
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
              months: 'flex flex-col sm:flex-row space-y-6 sm:space-x-6 sm:space-y-0',
              month: 'space-y-4',
              caption:
                'flex justify-center pt-1 relative items-center text-label font-semibold text-sm min-h-[2.5rem]',
              caption_label: 'text-label font-semibold text-sm tracking-wide',
              nav: 'space-x-1 flex items-center',
              nav_button: cn(
                ui.elevated,
                'h-7 w-7 p-0 opacity-80 hover:opacity-100 text-[#888888] hover:text-label'
              ),
              nav_button_previous: 'absolute left-2',
              nav_button_next: 'absolute right-2',
              table: 'w-full border-collapse space-y-1',
              head_row: 'flex mb-2',
              head_cell: cn(ui.subheading, 'rounded-[4px] w-9'),
              row: 'flex w-full mt-1',
              cell: 'h-9 w-9 text-center text-sm p-0 relative hover:bg-[#111111] rounded-[4px] focus-within:relative focus-within:z-20 transition-all duration-200',
              day: cn(
                'h-9 w-9 p-0 font-medium aria-selected:opacity-100',
                ui.muted,
                'hover:text-label transition-colors duration-200'
              ),
              day_selected:
                'bg-brand text-[#050505] hover:bg-brand/90 hover:text-[#050505] focus:bg-brand focus:text-[#050505] font-semibold',
              day_today: cn(ui.elevated, 'text-brand border border-brand font-semibold'),
              day_outside: cn(
                ui.muted,
                'opacity-40 aria-selected:bg-brand/20 aria-selected:text-brand'
              ),
              day_disabled: cn(ui.muted, 'opacity-30'),
              day_range_middle: 'aria-selected:bg-brand/20 aria-selected:text-brand font-medium',
              day_range_start: 'aria-selected:bg-brand aria-selected:text-[#050505] font-semibold',
              day_range_end: 'aria-selected:bg-brand aria-selected:text-[#050505] font-semibold',
              day_hidden: 'invisible',
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
