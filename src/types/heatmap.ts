import { Candle, OHLC } from "./candle";
import { ColorVariant } from "./theme";

export interface HeatmapCell extends Candle {
  liquidity: number;
  liquidityScore: number;
  volatilityDaily: number;
  volatilityRolling: number | null;
  performancePct: number;
  performance: "positive" | "negative" | "neutral";
  color: ColorVariant;
  prices7d: number[];
  intraday: OHLC;
}
