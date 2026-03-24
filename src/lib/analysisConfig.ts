import { FilterKey } from "@/components/uielements/visualizationLegend/VisualizationLegend";
import {
  Activity,
  Target,
  BarChart,
  Zap,
  TrendingUp,
} from "lucide-react";

export type SectionArray = Array<{
  title: string;
  icon?: React.ComponentType<{ className?: string }>;
  items: Array<{
    label: string;
    description?: string;
    color?: string;
    bg?: string;
    text?: string;
    icon?: string;
    variant?: "dot" | "nested" | "icon" | "sparkline";
  }>;
}>;

export const analysisConfig: Record<
  FilterKey,
  {
    icon: React.ComponentType<{ className?: string }>;
    title: string;
    subtitle: string;
    description: string;
    sections: SectionArray;
  }
> = {
  volatility: {
    icon: Activity,
    title: "Volatility Analysis",
    subtitle: "Price fluctuation intensity patterns",
    description:
      "Volatility is measured by price standard deviation. Green indicates stable periods, yellow shows moderate fluctuations, and red signals high volatility periods.",
    sections: [
      {
        title: "Levels",
        items: [
          {
            label: "Low",
            description: "0-30%",
            color: "from-green-400/20 to-green-600/10",
            bg: "bg-green-500/10",
            text: "text-green-400",
          },
          {
            label: "Medium",
            description: "31-80%",
            color: "from-yellow-400/20 to-yellow-600/10",
            bg: "bg-yellow-500/10",
            text: "text-yellow-400",
          },
          {
            label: "High",
            description: "81%+",
            color: "from-red-400/20 to-red-600/10",
            bg: "bg-red-500/10",
            text: "text-red-400",
          },
        ],
      },
    ],
  },
  liquidity: {
    icon: Zap,
    title: "Liquidity Analysis",
    subtitle: "Trading volume and market depth",
    description:
      "Liquidity is measured by trading volume and order book depth. Higher volume indicates better liquidity and more stable price movements.",
    sections: [
      {
        title: "Volume Patterns",
        icon: BarChart,
        items: [
          { 
            label: "Low Volume", 
            color: "bg-red-500/20", 
            text: "text-red-400",
            variant: 'dot' 
          },
          { 
            label: "Medium Volume", 
            color: "bg-orange-500/20", 
            text: "text-orange-400",
            variant: 'dot' 
          },
          { 
            label: "High Volume", 
            color: "bg-yellow-500/20", 
            text: "text-yellow-400",
            variant: 'dot' 
          },
          { 
            label: "Very High Volume", 
            color: "bg-blue-500/20", 
            text: "text-blue-400",
            variant: 'dot' 
          },
          { 
            label: "Excellent Volume", 
            color: "bg-emerald-500/20", 
            text: "text-emerald-400",
            variant: 'dot' 
          },
        ],
      }
    ],
  },
  performance: {
    icon: Target,
    title: "Performance Analysis",
    subtitle: "Price change direction and trends",
    description:
      "Performance is measured by price change direction. Green indicates positive returns, red shows negative returns, and gray represents neutral performance periods.",
    sections: [
      {
        title: "Types",
        items: [
          {
            label: "Positive",
            description: "Price increase",
            color: "from-green-400/20 to-green-600/10",
            bg: "bg-green-500/10",
            text: "text-green-400",
            icon: "↗️",
          },
          {
            label: "Negative",
            description: "Price decrease",
            color: "from-red-400/20 to-red-600/10",
            bg: "bg-red-500/10",
            text: "text-red-400",
            icon: "↘️",
          },
          {
            label: "Neutral",
            description: "No significant change",
            color: "from-gray-400/20 to-gray-600/10",
            bg: "bg-gray-500/10",
            text: "text-gray-400",
            icon: "➡️",
          },
        ],
      },
      
      {
        title: "Trend Indicators",
        icon: TrendingUp,
        items: [
          { 
            label: "7-day price trend", 
            description: "Show weekly positive/negative/neutral shifts", 
            variant: 'sparkline' 
          },
        ],
      },
    ],
  },
};
