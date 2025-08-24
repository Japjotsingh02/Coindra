import { Theme } from "@/types/theme";

export const dark: Theme = {
  colorPalette: {
    volatility: {
      low: { 
        bg: '#0f1a13',
        backgroundImage: "linear-gradient(135deg, rgba(22,163,74,0.15) 0%, rgba(22,163,74,0.10) 30%, rgba(22,163,74,0.06) 60%, rgba(22,163,74,0.02) 100%)",
        border: "#1e1e1e"
      },
      medium: { 
        bg: '#1a0d0d',
        backgroundImage: "linear-gradient(135deg, rgba(251,191,36,0.15) 0%, rgba(251,191,36,0.10) 30%, rgba(251,191,36,0.06) 60%, rgba(251,191,36,0.02) 100%)",
        border: "#1e1e1e"
      },
      high: { 
        bg: '#1a150f',
        backgroundImage: "linear-gradient(135deg, rgba(248,113,113,0.15) 0%, rgba(248,113,113,0.10) 30%, rgba(248,113,113,0.06) 60%, rgba(248,113,113,0.02) 100%)",
        border: "#1e1e1e"
      },
      neutral: { 
        bg: '#141414',
        backgroundImage: "linear-gradient(135deg, rgba(75,85,99,0.15) 0%, rgba(75,85,99,0.10) 30%, rgba(75,85,99,0.06) 60%, rgba(75,85,99,0.02) 100%)",
        border: "#1e1e1e"
      },
    },
    performance: {
      positive: { 
        backgroundImage: "linear-gradient(135deg, rgba(34,197,94,0.15) 0%, rgba(34,197,94,0.10) 30%, rgba(34,197,94,0.06) 60%, rgba(34,197,94,0.02) 100%)",
        border: "#402321"
      },
      negative: { 
        backgroundImage: "linear-gradient(135deg, rgba(220,38,38,0.15) 0%, rgba(220,38,38,0.10) 30%, rgba(220,38,38,0.06) 60%, rgba(220,38,38,0.02) 100%)",
        border: "#1a1c25"
      },
      neutral: { 
        backgroundImage: "linear-gradient(135deg, rgba(156,163,175,0.15) 0%, rgba(156,163,175,0.10) 30%, rgba(156,163,175,0.06) 60%, rgba(156,163,175,0.02) 100%)",
        border: "#1a1c25"
      },
    },
  },
};
