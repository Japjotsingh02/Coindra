import { processHeatmapData } from "@/helpers/processData";
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
  
  viewMode: "month",

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
