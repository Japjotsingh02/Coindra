import React, { memo } from 'react';
import ReactECharts from 'echarts-for-react';
import { EChartsOption } from 'echarts-for-react';
import { Card } from '@/components/elements/card/Card';

interface ChartCardProps {
  title: string;
  option: EChartsOption;
  children?: React.ReactNode;
  forceKey?: string | number;
  /** Rendered on the right side of the card header (e.g. a badge or toggle). */
  titleSiblingComponent?: React.ReactNode;
}

const ChartCard = memo(
  ({ title, option, children, forceKey, titleSiblingComponent }: ChartCardProps) => {
    return (
      <Card header={title} headerAction={titleSiblingComponent}>
        <ReactECharts
          key={forceKey}
          option={option}
          style={{ height: 320 }}
          className="rounded-[4px]"
        />
        {children}
      </Card>
    );
  }
);

ChartCard.displayName = 'ChartCard';

export default ChartCard;
