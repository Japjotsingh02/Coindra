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
      <div className="bg-[#1e2126] rounded-lg p-6 border border-[#2a2d36]">
        <h3 className="text-xl font-semibold text-[#bb9c2d] mb-4">
          {format(viewMonth, "EEEE, MMMM d, yyyy")}
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
                {(dayData.liquidity ?? 0).toLocaleString()}
              </p>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-[#7c8796]">No data available for this date</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default DailyHeatmap;
