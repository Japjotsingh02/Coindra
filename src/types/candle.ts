export interface Candle {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

//   export interface EnhancedBinanceCandle extends Candle {
//   timestamp: number;
//   closeTime: number;
//   quoteAssetVolume: number;
//   numberOfTrades: number;
//   takerBuyBaseAssetVolume: number;
//   takerBuyQuoteAssetVolume: number;
//   priceChange: number;
//   priceChangePercent: number;
//   highLowRange: number;
//   volumeWeightedAveragePrice: number;
//   index: number;
// }

export type OHLC = [number, number, number, number];

// Binance API response types
export interface BinanceKline {
  0: number;   // Open time
  1: string;   // Open
  2: string;   // High
  3: string;   // Low
  4: string;   // Close
  5: string;   // Volume
  6: number;   // Close time
  7: string;   // Quote asset volume
  8: number;   // Number of trades
  9: string;   // Taker buy base asset volume
  10: string; // Taker buy quote asset volume
  11: string; // Ignore
}

export interface BinanceSymbol {
  symbol: string;
  status: string;
  baseAsset: string;
  quoteAsset: string;
  isSpotTradingAllowed: boolean;
}

export interface BinanceExchangeInfo {
  symbols: BinanceSymbol[];
}

export interface BinanceRealTimeData {
  price: number | null;
  volume24h: number | null;
  priceChange24h: number | null;
  priceChangePercent24h: number | null;
  high24h: number | null;
  low24h: number | null;
  lastUpdate: Date | null;
}

export interface TickerData {
  v: string;
  P: string;
  p: string;
  h: string;
  l: string;
}

export interface KlineData {
  k: {
    t: number; // start time
    T: number; // end time
    s: string; // symbol
    i: string; // interval
    f: number; // first trade ID
    L: number; // last trade ID
    o: string; // open
    c: string; // close
    h: string; // high
    l: string; // low
    v: string; // volume
    n: number; // number of trades
    x: boolean; // candle closed
    q: string; // quote asset volume
    V: string; // taker buy base asset volume
    Q: string; // taker buy quote asset volume
    B: string; // ignore
  };
}