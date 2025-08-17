export type ColorVariant = {
  bg?: string;
  border?: string;
  backgroundImage?: string;
};

export interface ColorPalette {
  volatility: {
    low: ColorVariant;
    medium: ColorVariant;
    high: ColorVariant;
    neutral: ColorVariant;
  };
  performance: {
    positive: ColorVariant;
    negative: ColorVariant;
    neutral: ColorVariant;
  };
}

export interface Theme {
  colorPalette: ColorPalette;
}
