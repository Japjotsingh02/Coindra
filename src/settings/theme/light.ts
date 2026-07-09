import { Theme } from '@/types/theme';

export const light: Theme = {
  colorPalette: {
    volatility: {
      low: {
        bg: 'var(--heatmap-vol-low-bg)',
        textColor: 'text-emerald-700',
      },
      medium: {
        bg: 'var(--heatmap-vol-medium-bg)',
      },
      high: {
        bg: 'var(--heatmap-vol-high-bg)',
      },
      neutral: {
        bg: 'var(--heatmap-vol-neutral-bg)',
      },
    },
    performance: {
      positive: {
        sparklineColor: 'var(--heatmap-sparkline-positive)',
        sparklineGlow: 'var(--heatmap-sparkline-positive-glow)',
      },
      negative: {
        sparklineColor: 'var(--heatmap-sparkline-negative)',
        sparklineGlow: 'var(--heatmap-sparkline-negative-glow)',
      },
      neutral: {
        sparklineColor: 'var(--heatmap-sparkline-neutral)',
        sparklineGlow: 'var(--heatmap-sparkline-neutral-glow)',
      },
    },
    liquidity: {
      low: {
        barGradient: 'from-rose-400/90 to-rose-500/80',
        barBadge: 'bg-rose-500/15 text-rose-600/95 border-rose-500/30',
      },
      medium: {
        barGradient: 'from-orange-400/90 to-orange-500/80',
        barBadge: 'bg-orange-500/15 text-orange-600/95 border-orange-500/30',
      },
      high: {
        barGradient: 'from-amber-400/90 to-amber-500/80',
        barBadge: 'bg-amber-500/15 text-amber-600/95 border-amber-500/30',
      },
      veryHigh: {
        barGradient: 'from-sky-400/90 to-blue-500/80',
        barBadge: 'bg-sky-500/15 text-sky-600/95 border-sky-500/30',
      },
      excellent: {
        barGradient: 'from-emerald-400/90 to-emerald-500/80',
        barBadge: 'bg-emerald-500/15 text-emerald-600/95 border-emerald-500/30',
      },
    },
  },
};
