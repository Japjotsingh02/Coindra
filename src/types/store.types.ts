import { Candle, OHLC } from "./candle";
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

export enum ModalTypes {
  Description = "description",
}

export type ModalProps = {
  cell: HeatmapCell;
  history: HeatmapCell[];
};

export type ModalState = {
  type: ModalTypes | null; 
  props?: ModalProps;
  onClose?: () => void;
};

export type DescriptionPanelProps = {
  cell: HeatmapCell;
  history: HeatmapCell[];
};

export type DescriptionPanelState = {
  open: boolean;
  props?: DescriptionPanelProps;
  onClose?: () => void;
};

export type RealtimeData = {
  price: number | null;
  volume24h: number | null;
  priceChange24h: number | null;
  priceChangePercent24h: number | null;
  high24h: number | null;
  low24h: number | null;
  lastUpdate: Date | null;
};

export interface AppState {
  filters: Filters;
  setFilters: (filters: Partial<Filters>) => void;
  selectedDate: Date | null;
  setSelectedDate: (date: Date | null) => void;
  viewMode: "daily" | "weekly" | "monthly";
  setViewMode: (mode: "daily" | "weekly" | "monthly") => void;
  candles: Candle[];
  setCandles: (candles: Candle[]) => void;
  processedHeatmapData: HeatmapCell[];
  modal: ModalState;
  openModal: (type: ModalTypes | null, props?: ModalProps, onClose?: () => void) => void;
  closeModal: () => void;
  descriptionPanel: DescriptionPanelState;
  openDescriptionPanel: (props: DescriptionPanelProps, onClose?: () => void) => void;
  closeDescriptionPanel: () => void;
  realtime: RealtimeData;
  setRealtime: (partial: Partial<RealtimeData>) => void;
  latestCandle: OHLC | null;
  setLatestCandle: (candle: OHLC) => void;
  viewMonth: Date;
  setViewMonth: (date: Date) => void;
}