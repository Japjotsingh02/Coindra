import { TooltipContent } from "@/components/ui/tooltip";
import { dark } from "@/settings/theme";
import { HeatmapCell } from "@/types/heatmap";
import { ColorVariant } from "@/types/theme";
import { cn } from "@/lib/utils";

const TooltipMetric = ({
  title,
  value,
}: {
  title: string;
  value: string | number;
}) => (
  <div className="text-center">
    <div className="text-xs text-[#7c8796] font-medium uppercase tracking-wide mb-1">
      {title}
    </div>
    <div className="text-lg font-bold text-white">{value}</div>
  </div>
);

const TooltipPriceMetric = ({
  title,
  value,
}: {
  title: string;
  value: string | number;
}) => (
  <div className="text-center">
    <div className="text-xs text-[#7c8796] font-medium uppercase tracking-wide mb-1">
      {title}
    </div>
    <div className="text-base font-bold text-white">
      <span className="text-xs text-[#7c8796]">₹</span>
      {value}
    </div>
  </div>
);

const RiskLevelBadge = ({ cell }: { cell: HeatmapCell }) => {
  const getRiskInfo = (color: ColorVariant) => {
    if (color === dark.colorPalette.volatility.low) {
      return {
        text: "Low Risk",
        classes: "bg-green-500/20 text-green-400 border-green-500/30",
      };
    } else if (color === dark.colorPalette.volatility.medium) {
      return {
        text: "Medium Risk",
        classes: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
      };
    } else if (color === dark.colorPalette.volatility.high) {
      return {
        text: "High Risk",
        classes: "bg-orange-500/20 text-orange-400 border-orange-500/30",
      };
    } else if (color === dark.colorPalette.volatility.neutral) {
      return {
        text: "Very High Risk",
        classes: "bg-red-500/20 text-red-400 border-red-500/30",
      };
    } else {
      return {
        text: "Unknown Risk",
        classes: "bg-gray-500/20 text-gray-400 border-gray-500/30",
      };
    }
  };

  const riskInfo = getRiskInfo(cell.color);

  return (
    <div className="text-center">
      <div className="text-xs text-[#7c8796] font-medium uppercase tracking-wide mb-1">
        Risk Level
      </div>
      <div
        className={cn(
          "text-sm font-bold px-3 py-1 rounded-full inline-block border",
          riskInfo.classes
        )}
      >
        {riskInfo.text}
      </div>
    </div>
  );
};

export const CalendarCellTooltip = ({
  cell,
  iso,
}: {
  cell?: HeatmapCell;
  iso: string;
}) => (
  <TooltipContent
    side="top"
    align="center"
    className={`p-4 bg-[#1a1d24] border border-[#2a2d36] shadow-2xl rounded-lg min-w-[${
      !cell ? "200px" : "280px"
    }] -mt-6`}
  >
    <div className={`space-y-${!cell ? "2" : "3"}`}>
      <div className="text-center">
        <h3 className="text-lg font-bold text-[#bb9c2d]">{iso}</h3>
        {cell ? (
          <>
            <div className="grid grid-cols-2 gap-4">
              <TooltipMetric
                title="Vol (Daily)"
                value={`${cell.volatilityDaily.toFixed(2)}%`}
              />
              <TooltipMetric
                title="Vol (Rolling)"
                value={
                  cell.volatilityRolling !== null
                    ? `${cell.volatilityRolling.toFixed(2)}%`
                    : "—"
                }
              />
              <TooltipMetric
                title="Liquidity"
                value={formatCompact(cell.liquidity)}
              />
              <TooltipMetric
                title="Performance"
                value={`${
                  cell.performancePct >= 0 ? "+" : ""
                }${cell.performancePct.toFixed(2)}%`}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <TooltipPriceMetric
                title="High"
                value={cell.high?.toFixed(2) || "—"}
              />
              <TooltipPriceMetric
                title="Low"
                value={cell.low?.toFixed(2) || "—"}
              />
            </div>

            <RiskLevelBadge cell={cell} />
          </>
        ) : (
          <p className="text-sm text-[#7c8796]">No market data available</p>
        )}
      </div>
    </div>
  </TooltipContent>
);

function formatCompact(n: number) {
  try {
    return Intl.NumberFormat("en", {
      notation: "compact",
      maximumFractionDigits: 2,
    }).format(n);
  } catch {
    if (n >= 1_000_000_000) return (n / 1_000_000_000).toFixed(1) + "B";
    if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
    if (n >= 1_000) return (n / 1_000).toFixed(1) + "K";
    return String(n);
  }
}
