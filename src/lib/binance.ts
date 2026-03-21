import { BinanceExchangeInfo, BinanceKline, BinanceSymbol } from '@/types/candle';
import axios from 'axios';

export interface BinanceCandleParams {
  symbol: string;
  interval?: '1m' | '3m' | '5m' | '15m' | '30m' | '1h' | '2h' | '4h' | '6h' | '8h' | '12h' | '1d' | '3d' | '1w' | '1M';
  limit?: number;
  startTime?: number;
  endTime?: number;
}

export const fetchBinanceCandles = async (params: BinanceCandleParams) => {
  const { symbol, interval = '1d', limit, startTime, endTime } = params;

  const normalizedSymbol = symbol.replace('/', '').toUpperCase();
  const queryParams: Record<string, string | number> = {
    symbol: normalizedSymbol,
    interval,
  };

  if (startTime) queryParams.startTime = startTime;

  if (endTime) queryParams.endTime = endTime;

  if (limit) queryParams.limit = limit;

  const res = await axios.get(`https://api.binance.com/api/v3/klines`, {
    params: queryParams,
  });

  if (!res.data || !Array.isArray(res.data)) {
    throw new Error('Invalid API response format');
  }

  // Transform the data with additional metadata
  return res.data.map((candle: BinanceKline) => ({
    date: new Date(candle[0]).toISOString().split('T')[0],
    open: parseFloat(candle[1]),
    high: parseFloat(candle[2]),
    low: parseFloat(candle[3]),
    close: parseFloat(candle[4]),
    volume: parseFloat(candle[5]),
    // closeTime: candle[6],
    // quoteAssetVolume: parseFloat(candle[7]),
    // numberOfTrades: candle[8],
    // takerBuyBaseAssetVolume: parseFloat(candle[9]),
    // takerBuyQuoteAssetVolume: parseFloat(candle[10]),
    // // Additional calculated fields
    // priceChange: parseFloat(candle[4]) - parseFloat(candle[1]),
    // priceChangePercent: ((parseFloat(candle[4]) - parseFloat(candle[1])) / parseFloat(candle[1])) * 100,
    // highLowRange: parseFloat(candle[2]) - parseFloat(candle[3]),
    // volumeWeightedAveragePrice: (parseFloat(candle[7]) / parseFloat(candle[5])) || 0,
  }));
};

export async function fetchSymbols(): Promise<string[]> {
  const res = await fetch('https://api.binance.com/api/v3/exchangeInfo');
  const data: BinanceExchangeInfo = await res.json();
  return data.symbols
    .filter((s: BinanceSymbol) => s.status === 'TRADING')
    .map((s: BinanceSymbol) => `${s.baseAsset}/${s.quoteAsset}`);
}
