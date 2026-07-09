import { HeatmapCell } from '@/types/heatmap';
import { format, isSameDay } from 'date-fns';
import React, { useMemo } from 'react';
import { cn } from '@/lib/utils';
import { ui } from '@/lib/ui-styles';

function DailyHeatmap({
  heatmapData,
  viewMonth,
}: {
  heatmapData?: HeatmapCell[];
  viewMonth: Date;
}) {
  const dayData = useMemo(
    () => heatmapData?.find((cell) => isSameDay(new Date(cell.date), viewMonth)),
    [heatmapData, viewMonth]
  );

  const cards = [
    { label: 'Open', value: dayData?.open, color: 'text-label' },
    { label: 'Close', value: dayData?.close, color: 'text-label' },
    { label: 'High', value: dayData?.high, color: 'text-emerald-400' },
    { label: 'Low', value: dayData?.low, color: 'text-red-400' },
  ] as const;

  return (
    <div className="pt-4">
      <div className={cn(ui.panel, 'p-4 sm:p-6')}>
        <h3 className="text-xl font-semibold text-label tracking-tight mb-4">
          {format(viewMonth, 'EEEE, MMMM d, yyyy')}
        </h3>
        {dayData ? (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-4">
              {cards.map(({ label, value, color }) => (
                <div key={label} className={cn(ui.elevated, 'p-4 sm:p-5')}>
                  <p className={cn(ui.sectionLabel, 'mb-2')}>{label}</p>
                  <p className={cn('text-2xl font-medium', ui.numeric, color)}>${value}</p>
                </div>
              ))}
            </div>
            <div className={cn(ui.elevated, 'p-4 sm:p-5')}>
              <p className={cn(ui.sectionLabel, 'mb-2')}>Volume</p>
              <p className={cn('text-2xl font-medium text-brand', ui.numeric)}>
                {(dayData.liquidity ?? 0).toLocaleString()}
              </p>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className={cn('text-sm', ui.muted)}>No data available for this date</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default DailyHeatmap;
