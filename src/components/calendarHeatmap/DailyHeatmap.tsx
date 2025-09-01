import { HeatmapCell } from "@/types/heatmap";
import { format, isSameDay } from "date-fns";
import React, { useMemo } from "react";

function DailyHeatmap({
  heatmapData,
  viewMonth,
}: {
  heatmapData?: HeatmapCell[];
  viewMonth: Date;
}) {
  //   const key = format(viewMonth, "yyyy-MM-dd");
  const dayData = useMemo(
    () => heatmapData?.find((cell) => isSameDay(new Date(cell.date), viewMonth)),
    [heatmapData, viewMonth]
  );

  return (
    <div className="pt-4">
      <div className="bg-surface-border rounded-lg p-6 border border-surface-ring">
        <h3 className="text-xl font-semibold text-brand mb-4">
          {format(viewMonth, "EEEE, MMMM d, yyyy")}
        </h3>
        {dayData ? (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-background-input p-3 rounded border border-surface-ring">
                <p className="text-sm text-muted-secondary">Open</p>
                <p className="text-lg font-semibold text-label">
                  ${dayData.open}
                </p>
              </div>
              <div className="bg-background-input p-3 rounded border border-surface-ring">
                <p className="text-sm text-muted-secondary">Close</p>
                <p className="text-lg font-semibold text-label">
                  ${dayData.close}
                </p>
              </div>
              <div className="bg-background-input p-3 rounded border border-surface-ring">
                <p className="text-sm text-muted-secondary">High</p>
                <p className="text-lg font-semibold text-label">
                  ${dayData.high}
                </p>
              </div>
              <div className="bg-background-input p-3 rounded border border-surface-ring">
                <p className="text-sm text-muted-secondary">Low</p>
                <p className="text-lg font-semibold text-label">
                  ${dayData.low}
                </p>
              </div>
            </div>
            <div className="bg-background-input p-3 rounded border border-surface-ring">
              <p className="text-sm text-muted-secondary">Volume</p>
              <p className="text-lg font-semibold text-label">
                {(dayData.liquidity ?? 0).toLocaleString()}
              </p>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-secondary">No data available for this date</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default DailyHeatmap;
