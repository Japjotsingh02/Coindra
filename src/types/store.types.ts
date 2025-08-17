import { Candle } from "./candle";
import { HeatmapCell } from "./heatmap";

type DateRange = {
  startDate: Date;
  endDate: Date;
};

export type Filters = {
  symbol: string;
  volatility: boolean;
  liquidity: boolean;
  performance: boolean;
  dateRange: DateRange;
};

export interface AppState {
  filters: Filters;
  setFilters: (filters: Partial<Filters>) => void;
  selectedDate: Date | null;
  setSelectedDate: (date?: Date) => void;
  viewMode: "day" | "week" | "month";
  setViewMode: (mode: "day" | "week" | "month") => void;
  candles: Candle[];
  setCandles: (candles: Candle[]) => void;
  processedHeatmapData: HeatmapCell[];
}