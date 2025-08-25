import { processHeatmapData } from "@/helpers/processData";
import { OHLC } from "@/types/candle";
import { AppState } from "@/types/store.types";
import { create } from "zustand";

export const useAppStore = create<AppState>((set) => ({
  filters: {
    symbol: "BTCUSDT",
    volatility: true,
    liquidity: true,
    performance: true,
    dateRange: {
      startDate: new Date(),
      endDate: new Date(),
    },
  },
  candles: [],
  processedHeatmapData: [],
  selectedDate: null,
  viewMode: "monthly",
  modal: {
    type: null,
  },
  realtime: {
    price: null,
    volume24h: null,
    priceChange24h: null,
    priceChangePercent24h: null,
    high24h: null,
    low24h: null,
    lastUpdate: null,
  },
  latestCandle: null,
  descriptionPanel: {
    open: false,
  },
  setRealtime: (partial) =>
    set((state) => ({
      realtime: {
        ...state.realtime,
        ...partial,
        lastUpdate: new Date(),
      },
    })),
  setLatestCandle: (candle: OHLC) => set({ latestCandle: candle }),
  openModal: (type, props, onClose) => set({ modal: { type, props, onClose } }),
  closeModal: () => set((state) => {
    state.modal.onClose?.();
    return { modal: { type: null } };
  }),
  openDescriptionPanel: (props, onClose) => set({ descriptionPanel: { open: true, props, onClose } }),
  closeDescriptionPanel: () => set((state) => {
    state.descriptionPanel.onClose?.();
    return { descriptionPanel: { open: false } };
  }),
  setFilters: (filters) => 
    set((state) => {
    console.log(filters, state);
      return ({
      filters: { ...state.filters, ...filters },
    })
  }),
  setCandles: (candles) =>
    set({
      candles,
      processedHeatmapData: processHeatmapData(candles),
    }),
  setSelectedDate: (date) => set({ selectedDate: date }),
  setViewMode: (mode) => set({ viewMode: mode }),
}));
