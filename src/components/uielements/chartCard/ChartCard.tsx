import React, { memo } from "react";
import ReactECharts from "echarts-for-react";
import { EChartsOption } from "echarts-for-react";

interface ChartCardProps {
  title: string;
  option: EChartsOption;
  children?: React.ReactNode;
}

const ChartCard = memo(({ title, option, children }: ChartCardProps) => {
  return (
    <div className="bg-gradient-to-r from-surface-border/50 to-surface-ring/50 p-5 rounded-xl shadow-lg border border-surface-ring hover:border-brand/30 transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-brand">{title}</h3>
      </div>
      <ReactECharts
        option={option}
        style={{ height: 320 }}
        className="rounded-lg"
      />
      {children}
    </div>
  );
});

ChartCard.displayName = "ChartCard";

export default ChartCard;
