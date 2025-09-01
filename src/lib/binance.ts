import { BinanceExchangeInfo, BinanceKline, BinanceSymbol } from "@/types/candle";
import axios from "axios";

export interface BinanceCandleParams {
  symbol: string;
  interval?: '1m' | '3m' | '5m' | '15m' | '30m' | '1h' | '2h' | '4h' | '6h' | '8h' | '12h' | '1d' | '3d' | '1w' | '1M';
  limit?: number;
  startTime?: number;
  endTime?: number;
}

export const fetchBinanceCandles = async (params: BinanceCandleParams) => {
  const {
    symbol,
    interval = '1d',
    limit,
    startTime,
    endTime
  } = params;

  const normalizedSymbol = symbol.replace('/', '').toUpperCase();
  const queryParams: Record<string, string | number> = {
    symbol: normalizedSymbol,
    interval,
  };
  
  if (startTime) queryParams.startTime = startTime;
  
  if (endTime) queryParams.endTime = endTime;
  
  if (limit) queryParams.limit = limit;

    const res = await axios.get(
      `https://api.binance.com/api/v3/klines`, { params: queryParams }
    );

    if (!res.data || !Array.isArray(res.data)) {
      throw new Error('Invalid API response format');
    }

    // Transform the data with additional metadata
    return res.data.map((candle: BinanceKline) => ({
      date: new Date(candle[0]).toISOString().split("T")[0],
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

// Convenience functions for common use cases
// export const fetchBinanceCandlesDaily = async (symbol: string, days: number = 30) => {
//   const endDate = new Date();
//   const startDate = new Date();
//   startDate.setDate(endDate.getDate() - days);
  
//   return fetchBinanceCandles({
//     symbol,
//     interval: '1d',
//     startTime: startDate.getTime(),
//     endTime: endDate.getTime(),
//     limit: days
//   });
// };

// export const fetchBinanceCandlesHourly = async (symbol: string, hours: number = 24) => {
//   const endDate = new Date();
//   const startDate = new Date();
//   startDate.setHours(endDate.getHours() - hours);
  
//   return fetchBinanceCandles({
//     symbol,
//     interval: '1h',
//     startTime: startDate.getTime(),
//     endTime: endDate.getTime(),
//     limit: hours
//   });
// };

// export const fetchBinanceCandlesMinute = async (symbol: string, minutes: number = 60, interval: '1m' | '5m' | '15m' = '1m') => {
//   const endDate = new Date();
//   const startDate = new Date();
//   startDate.setMinutes(endDate.getMinutes() - minutes);
  
//   return fetchBinanceCandles({
//     symbol,
//     interval,
//     startTime: startDate.getTime(),
//     endTime: endDate.getTime(),
//     limit: Math.min(minutes, 1000)
//   });
// };

// // Function to get real-time price data
// export const fetchBinancePrice = async (symbol: string) => {
//   const normalizedSymbol = symbol.replace('/', '').toUpperCase();
  
//   try {
//     const res = await axios.get(`https://api.binance.com/api/v3/ticker/price?symbol=${normalizedSymbol}`);
    
//     if (!res.data || !res.data.price) {
//       throw new Error('Invalid price response format');
//     }
    
//     return {
//       symbol: res.data.symbol,
//       price: parseFloat(res.data.price),
//       timestamp: Date.now()
//     };
//   } catch (error) {
//     if (axios.isAxiosError(error)) {
//       throw new Error(`Failed to fetch price: ${error.response?.data?.msg || error.message}`);
//     }
//     throw error;
//   }
// };

// // Function to get 24hr ticker statistics
// export const fetchBinance24hrStats = async (symbol: string) => {
//   const normalizedSymbol = symbol.replace('/', '').toUpperCase();
  
//   try {
//     const res = await axios.get(`https://api.binance.com/api/v3/ticker/24hr?symbol=${normalizedSymbol}`);
    
//     if (!res.data) {
//       throw new Error('Invalid 24hr stats response format');
//     }
    
//     return {
//       symbol: res.data.symbol,
//       priceChange: parseFloat(res.data.priceChange),
//       priceChangePercent: parseFloat(res.data.priceChangePercent),
//       weightedAvgPrice: parseFloat(res.data.weightedAvgPrice),
//       prevClosePrice: parseFloat(res.data.prevClosePrice),
//       lastPrice: parseFloat(res.data.lastPrice),
//       lastQty: parseFloat(res.data.lastQty),
//       bidPrice: parseFloat(res.data.bidPrice),
//       askPrice: parseFloat(res.data.askPrice),
//       openPrice: parseFloat(res.data.openPrice),
//       highPrice: parseFloat(res.data.highPrice),
//       lowPrice: parseFloat(res.data.lowPrice),
//       volume: parseFloat(res.data.volume),
//       quoteVolume: parseFloat(res.data.quoteVolume),
//       openTime: res.data.openTime,
//       closeTime: res.data.closeTime,
//       count: res.data.count,
//       timestamp: Date.now()
//     };
//   } catch (error) {
//     if (axios.isAxiosError(error)) {
//       throw new Error(`Failed to fetch 24hr stats: ${error.response?.data?.msg || error.message}`);
//     }
//     throw error;
//   }
// };

export async function fetchSymbols(): Promise<string[]> {
  const res = await fetch("https://api.binance.com/api/v3/exchangeInfo");
  const data: BinanceExchangeInfo = await res.json();
  return data.symbols
    .filter((s: BinanceSymbol) => s.status === "TRADING")
    .map((s: BinanceSymbol) => `${s.baseAsset}/${s.quoteAsset}`);
}

// Utility functions for data analysis
// export const calculateCandleStatistics = (candles: EnhancedBinanceCandle[]) => {
//   if (!candles.length) return null;
  
//   const prices = candles.map(c => c.close);
//   const volumes = candles.map(c => c.volume);
  
//   return {
//     totalCandles: candles.length,
//     priceStats: {
//       min: Math.min(...prices),
//       max: Math.max(...prices),
//       avg: prices.reduce((sum, price) => sum + price, 0) / prices.length,
//       first: prices[0],
//       last: prices[prices.length - 1],
//       change: prices[prices.length - 1] - prices[0],
//       changePercent: ((prices[prices.length - 1] - prices[0]) / prices[0]) * 100
//     },
//     volumeStats: {
//       total: volumes.reduce((sum, vol) => sum + vol, 0),
//       avg: volumes.reduce((sum, vol) => sum + vol, 0) / volumes.length,
//       max: Math.max(...volumes)
//     },
//     volatility: {
//       daily: candles.map(c => ((c.high - c.low) / c.close) * 100),
//       average: candles.reduce((sum, c) => sum + ((c.high - c.low) / c.close) * 100, 0) / candles.length
//     }
//   };
// };

// Function to get multiple symbols at once
// export const fetchMultipleSymbols = async (symbols: string[], interval: BinanceCandleParams['interval'] = '1d', limit: number = 100) => {
//   const promises = symbols.map(symbol => 
//     fetchBinanceCandles({ symbol, interval, limit })
//       .catch(error => ({ symbol, error: error.message, data: [] }))
//   );
  
//   const results = await Promise.allSettled(promises);
  
//   return results.map((result, index) => {
//     if (result.status === 'fulfilled') {
//       return { symbol: symbols[index], data: result.value };
//     } else {
//       return { symbol: symbols[index], error: result.reason?.message || 'Unknown error', data: [] };
//     }
//   });
// };

// // Function to get historical data with automatic pagination for large datasets
// export const fetchBinanceCandlesPaginated = async (
//   params: BinanceCandleParams & { maxCandles?: number }
// ) => {
//   const { maxCandles = 10000, ...candleParams } = params;
//   const allCandles: EnhancedBinanceCandle[] = [];
//   let currentStartTime = candleParams.startTime || (candleParams.startDate?.getTime());
//   const endTime = candleParams.endTime || (candleParams.endDate?.getTime());
  
//   while (allCandles.length < maxCandles) {
//     const batchParams = {
//       ...candleParams,
//       startTime: currentStartTime,
//       limit: Math.min(1000, maxCandles - allCandles.length) // Binance max per request
//     };
    
//     const batch = await fetchBinanceCandles(batchParams);
    
//     if (!batch.length) break;
    
//     allCandles.push(...batch);
    
//     // Update start time for next batch
//     const lastCandle = batch[batch.length - 1];
//     currentStartTime = lastCandle.closeTime + 1;
    
//     // Check if we've reached the end time
//     if (endTime && currentStartTime >= endTime) break;
    
//     // Add small delay to avoid rate limiting
//     await new Promise(resolve => setTimeout(resolve, 100));
//   }
  
//   return allCandles;
// };
