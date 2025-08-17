export interface Candle {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

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