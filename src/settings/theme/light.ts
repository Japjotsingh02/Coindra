import { Theme } from "@/types/theme";

export const light: Theme = {
  colorPalette: {
    volatility: {
      low: { bg: "#00130b", border: "#234330" },
      medium: { bg: "#5F5314", border: "#4B3F13" },
      high: { bg: "#160e07", border: "#402321" },
      neutral: { bg: "#000000", border: "#1a1c25" },
    },
    performance: {
      positive: { bg: "#22c55e", border: "#402321" },
      negative: { bg: "#dc2626", border: "#1a1c25" },
      neutral: { bg: "#9ca3af", border: "#1a1c25" },
    },
  },
};
