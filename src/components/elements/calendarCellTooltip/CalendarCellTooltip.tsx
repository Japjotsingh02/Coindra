import { HeatmapCell } from '@/types/heatmap';
import { cn } from '@/lib/utils';
import { TooltipContent } from '@/components/ui/tooltip';

function formatCompact(n: number) {
  try {
    return Intl.NumberFormat('en', {
      notation: 'compact',
      maximumFractionDigits: 2,
    }).format(n);
  } catch {
    if (n >= 1_000_000_000) return (n / 1_000_000_000).toFixed(1) + 'B';
    if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M';
    if (n >= 1_000) return (n / 1_000).toFixed(1) + 'K';
    return String(n);
  }
}

export const CalendarCellTooltip = ({ cell, iso }: { cell?: HeatmapCell; iso: string }) => (
  <TooltipContent
    side="top"
    align="center"
    className={cn(
      'z-50 p-3 rounded-xl',
      'bg-[#0D0F14]/95 backdrop-blur-xl',
      'border border-white/[0.08]',
      'shadow-xl shadow-black/50',
      'min-w-[160px]'
    )}
  >
    {/* Date label */}
    <p className="text-[10px] uppercase tracking-[0.12em] text-white/30 font-mono mb-2.5">{iso}</p>

    {!cell ? (
      <p className="text-xs text-white/20">No data</p>
    ) : (
      <div className="grid grid-cols-2 gap-x-4 gap-y-2.5">
        <Metric
          label="Perf"
          value={`${cell.performancePct >= 0 ? '+' : ''}${cell.performancePct.toFixed(2)}%`}
          color={cell.performancePct >= 0 ? '#00FF66' : '#FF643C'}
        />
        <Metric label="Vol" value={`${cell.volatilityDaily.toFixed(2)}%`} />
        <Metric label="High" value={`$${cell.high?.toFixed(2) ?? '—'}`} />
        <Metric label="Low" value={`$${cell.low?.toFixed(2) ?? '—'}`} />
        <Metric label="Liquidity" value={formatCompact(cell.liquidity)} />
        {cell.volatilityRolling !== null && (
          <Metric label="Vol (7d)" value={`${cell.volatilityRolling?.toFixed(2)}%`} />
        )}
      </div>
    )}

    {/* Arrow — fill matches the tooltip background */}
    {/* <TooltipPrimitive.Arrow
      width={11}
      height={6}
      style={{ fill: BG }}
      className="drop-shadow-[0_1px_0_rgba(255,255,255,0.06)]"
    /> */}
  </TooltipContent>
);

const Metric = ({ label, value, color }: { label: string; value: string; color?: string }) => (
  <div>
    <p className="text-[9px] uppercase tracking-wider text-white/25 mb-0.5">{label}</p>
    <p
      className={cn('text-xs font-mono font-medium', !color && 'text-white/70')}
      style={color ? { color } : undefined}
    >
      {value}
    </p>
  </div>
);
