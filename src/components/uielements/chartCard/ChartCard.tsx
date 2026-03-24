import React, { memo } from "react";
import ReactECharts from "echarts-for-react";
import { EChartsOption } from "echarts-for-react";

interface ChartCardProps {
  title: string;
  option: EChartsOption;
  children?: React.ReactNode;
  forceKey?: string | number;
  titleSiblingComponent?: React.ReactNode;
}

const ChartCard = memo(({ title, option, children, forceKey, titleSiblingComponent }: ChartCardProps) => {
  return (
    <div className="bg-gradient-to-r from-surface-border/50 to-surface-ring/50 p-3 sm:p-4 2xl:p-5 rounded-xl shadow-lg border border-surface-ring hover:border-brand/30 transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <h5 className="text-brand">{title}</h5>
        {titleSiblingComponent}
      </div>
      <ReactECharts
        key={forceKey}
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
