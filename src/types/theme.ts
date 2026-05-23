export type VolatilityVariant = {
  bg: string;
  textColor?: string;
  textShadow?: string;
};

export type PerformanceVariant = {
  sparklineColor: string;
  sparklineGlow: string;
};

export type LiquidityVariant = {
  barGradient: string;
  barBadge: string;
};

export type ColorPalette = {
  volatility: {
    low: VolatilityVariant;
    medium: VolatilityVariant;
    high: VolatilityVariant;
    neutral: VolatilityVariant;
  };
  performance: {
    positive: PerformanceVariant;
    negative: PerformanceVariant;
    neutral: PerformanceVariant;
  };
  liquidity: {
    low: LiquidityVariant;
    medium: LiquidityVariant;
    high: LiquidityVariant;
    veryHigh: LiquidityVariant;
    excellent: LiquidityVariant;
  };
};

export type Theme = {
  colorPalette: ColorPalette;
};
