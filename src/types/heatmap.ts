import { Candle, OHLC } from './candle';
import { VolatilityVariant, PerformanceVariant, LiquidityVariant } from './theme';

export interface HeatmapCell extends Candle {
  liquidity: number;
  liquidityScore: number;
  volatilityDaily: number;
  volatilityRolling: number;
  performancePct: number;
  performance: 'positive' | 'negative' | 'neutral';
  volatilityColor: VolatilityVariant;
  performanceColor: PerformanceVariant;
  liquidityColor: LiquidityVariant;
  prices7d: number[];
  intraday: OHLC;
}
