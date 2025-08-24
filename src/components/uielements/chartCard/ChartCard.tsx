import React, { memo } from "react";
import ReactECharts from "echarts-for-react";
import { EChartsOption } from "echarts-for-react";

interface ChartCardProps {
  title: string;
  option: EChartsOption;
}

const ChartCard = memo(({ title, option }: ChartCardProps) => {
  return (
    <div className="bg-gradient-to-br from-[#1e2126] to-[#2a2d36] p-6 rounded-2xl shadow-lg border border-[#2a2d36] hover:border-[#bb9c2d]/30 transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        <div className="h-2 w-2 rounded-full bg-[#bb9c2d]"></div>
      </div>
      <ReactECharts
        option={option}
        style={{ height: 320 }} 
        className="rounded-lg"
      />
    </div>
  );
});

ChartCard.displayName = "ChartCard";

export default ChartCard;
