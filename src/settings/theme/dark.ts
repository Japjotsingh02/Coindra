import { Theme } from '@/types/theme';

const cellFill = (rgb: string) => `linear-gradient(135deg, ${rgb} 0%, #111 100%)`;

export const dark: Theme = {
  colorPalette: {
    volatility: {
      low: {
        bg: cellFill('#0d1515'),
        textColor: 'text-emerald-300',
        textShadow: 'drop-shadow-[0_0_8px_rgba(0,255,102,0.55)]',
      },
      medium: {
        bg: cellFill('#141000'),
      },
      high: {
        bg: cellFill('#1a0d0d'),
      },
      neutral: {
        bg: cellFill('148, 163, 184'),
      },
    },
    performance: {
      positive: {
        sparklineColor: '#00FF66',
        sparklineGlow: 'rgba(0, 255, 102, 0.85)',
      },
      negative: {
        sparklineColor: '#FF643C',
        sparklineGlow: 'rgba(255, 100, 60, 0.55)',
      },
      neutral: {
        sparklineColor: '#777777',
        sparklineGlow: 'rgba(0, 0, 0, 0.35)',
      },
    },
    liquidity: {
      low: {
        barGradient: 'from-rose-400/90 to-rose-500/80',
        barBadge: 'bg-rose-500/15 text-rose-300/95 border-rose-500/20',
      },
      medium: {
        barGradient: 'from-orange-400/90 to-orange-500/80',
        barBadge: 'bg-orange-500/15 text-orange-300/95 border-orange-500/20',
      },
      high: {
        barGradient: 'from-amber-400/90 to-amber-500/80',
        barBadge: 'bg-amber-500/15 text-amber-300/95 border-amber-500/20',
      },
      veryHigh: {
        barGradient: 'from-sky-400/90 to-blue-500/80',
        barBadge: 'bg-sky-500/15 text-sky-300/95 border-sky-500/20',
      },
      excellent: {
        barGradient: 'from-emerald-400/90 to-emerald-500/80',
        barBadge: 'bg-emerald-500/15 text-emerald-300/95 border-emerald-500/20',
      },
    },
  },
};
