// import {
//   fetchBinanceCandles,
//   fetchBinanceCandlesDaily,
//   fetchBinanceCandlesHourly,
//   fetchBinanceCandlesMinute,
//   fetchBinancePrice,
//   fetchBinance24hrStats,
//   fetchMultipleSymbols,
//   fetchBinanceCandlesPaginated,
//   calculateCandleStatistics,
//   BinanceCandleParams
// } from './binance';

// // Example 1: Basic daily candles for the last 30 days
// export const getDailyCandlesExample = async () => {
//   try {
//     const candles = await fetchBinanceCandlesDaily('BTC/USDT', 30);
//     console.log(`Fetched ${candles.length} daily candles for BTC/USDT`);
    
//     // Calculate statistics
//     const stats = calculateCandleStatistics(candles);
//     console.log('Price Statistics:', stats?.priceStats);
//     console.log('Volume Statistics:', stats?.volumeStats);
//     console.log('Volatility:', stats?.volatility);
    
//     return candles;
//   } catch (error) {
//     console.error('Error fetching daily candles:', error);
//     throw error;
//   }
// };

// // Example 2: Hourly candles for the last 48 hours
// export const getHourlyCandlesExample = async () => {
//   try {
//     const candles = await fetchBinanceCandlesHourly('ETH/USDT', 48);
//     console.log(`Fetched ${candles.length} hourly candles for ETH/USDT`);
//     return candles;
//   } catch (error) {
//     console.error('Error fetching hourly candles:', error);
//     throw error;
//   }
// };

// // Example 3: Minute-level data for the last 2 hours
// export const getMinuteCandlesExample = async () => {
//   try {
//     const candles = await fetchBinanceCandlesMinute('SOL/USDT', 120, '5m');
//     console.log(`Fetched ${candles.length} 5-minute candles for SOL/USDT`);
//     return candles;
//   } catch (error) {
//     console.error('Error fetching minute candles:', error);
//     throw error;
//   }
// };

// // Example 4: Custom time range with specific interval
// export const getCustomTimeRangeExample = async () => {
//   try {
//     const startDate = new Date('2024-01-01');
//     const endDate = new Date('2024-01-31');
    
//     const params: BinanceCandleParams = {
//       symbol: 'ADA/USDT',
//       interval: '4h',
//       startDate,
//       endDate
//     };
    
//     const candles = await fetchBinanceCandles(params);
//     console.log(`Fetched ${candles.length} 4-hour candles for ADA/USDT`);
//     return candles;
//   } catch (error) {
//     console.error('Error fetching custom time range:', error);
//     throw error;
//   }
// };

// // Example 5: Using timestamp instead of dates
// export const getTimestampExample = async () => {
//   try {
//     const now = Date.now();
//     const oneWeekAgo = now - (7 * 24 * 60 * 60 * 1000);
    
//     const params: BinanceCandleParams = {
//       symbol: 'DOT/USDT',
//       interval: '1d',
//       startTime: oneWeekAgo,
//       endTime: now
//     };
    
//     const candles = await fetchBinanceCandles(params);
//     console.log(`Fetched ${candles.length} daily candles using timestamps`);
//     return candles;
//   } catch (error) {
//     console.error('Error fetching with timestamps:', error);
//     throw error;
//   }
// };

// // Example 6: Multiple symbols at once
// export const getMultipleSymbolsExample = async () => {
//   try {
//     const symbols = ['BTC/USDT', 'ETH/USDT', 'BNB/USDT', 'ADA/USDT'];
//     const results = await fetchMultipleSymbols(symbols, '1d', 7);
    
//     results.forEach(result => {
//       if (result.error) {
//         console.error(`Error fetching ${result.symbol}:`, result.error);
//       } else {
//         console.log(`${result.symbol}: ${result.data.length} candles`);
//       }
//     });
    
//     return results;
//   } catch (error) {
//     console.error('Error fetching multiple symbols:', error);
//     throw error;
//   }
// };

// // Example 7: Large dataset with pagination
// export const getLargeDatasetExample = async () => {
//   try {
//     const startDate = new Date('2023-01-01');
//     const endDate = new Date('2024-01-01');
    
//     const candles = await fetchBinanceCandlesPaginated({
//       symbol: 'BTC/USDT',
//       interval: '1d',
//       startDate,
//       endDate,
//       maxCandles: 5000
//     });
    
//     console.log(`Fetched ${candles.length} candles with pagination`);
//     return candles;
//   } catch (error) {
//     console.error('Error fetching large dataset:', error);
//     throw error;
//   }
// };

// // Example 8: Real-time price and 24hr stats
// export const getRealTimeDataExample = async () => {
//   try {
//     const [price, stats] = await Promise.all([
//       fetchBinancePrice('BTC/USDT'),
//       fetchBinance24hrStats('BTC/USDT')
//     ]);
    
//     console.log('Current Price:', price);
//     console.log('24hr Stats:', stats);
    
//     return { price, stats };
//   } catch (error) {
//     console.error('Error fetching real-time data:', error);
//     throw error;
//   }
// };

// // Example 9: Advanced analysis with calculated fields
// export const getAdvancedAnalysisExample = async () => {
//   try {
//     const candles = await fetchBinanceCandles({
//       symbol: 'BTC/USDT',
//       interval: '1d',
//       limit: 100
//     });
    
//     // Analyze the enhanced data
//     const analysis = {
//       totalCandles: candles.length,
//       bullishDays: candles.filter(c => c.priceChange > 0).length,
//       bearishDays: candles.filter(c => c.priceChange < 0).length,
//       averageVolume: candles.reduce((sum, c) => sum + c.volume, 0) / candles.length,
//       highestVolatility: Math.max(...candles.map(c => c.highLowRange)),
//       volumeWeightedAvgPrice: candles.reduce((sum, c) => sum + c.volumeWeightedAveragePrice, 0) / candles.length
//     };
    
//     console.log('Advanced Analysis:', analysis);
//     return { candles, analysis };
//   } catch (error) {
//     console.error('Error in advanced analysis:', error);
//     throw error;
//   }
// };

// // Example 10: Error handling and retry logic
// export const getWithRetryExample = async (maxRetries = 3) => {
//   for (let attempt = 1; attempt <= maxRetries; attempt++) {
//     try {
//       const candles = await fetchBinanceCandles({
//         symbol: 'BTC/USDT',
//         interval: '1h',
//         limit: 24
//       });
      
//       console.log(`Successfully fetched ${candles.length} candles on attempt ${attempt}`);
//       return candles;
//     } catch (error) {
//       console.error(`Attempt ${attempt} failed:`, error);
      
//       if (attempt === maxRetries) {
//         throw new Error(`Failed after ${maxRetries} attempts: ${error}`);
//       }
      
//       // Wait before retrying (exponential backoff)
//       const delay = Math.min(1000 * Math.pow(2, attempt - 1), 10000);
//       await new Promise(resolve => setTimeout(resolve, delay));
//     }
//   }
// };

// // Example 11: Batch processing with rate limiting
// export const getBatchProcessingExample = async () => {
//   try {
//     const symbols = ['BTC/USDT', 'ETH/USDT', 'BNB/USDT', 'SOL/USDT', 'ADA/USDT'];
//     const results = [];
    
//     // Process in batches to avoid rate limiting
//     for (let i = 0; i < symbols.length; i += 2) {
//       const batch = symbols.slice(i, i + 2);
//       const batchResults = await fetchMultipleSymbols(batch, '1d', 7);
//       results.push(...batchResults);
      
//       // Add delay between batches
//       if (i + 2 < symbols.length) {
//         await new Promise(resolve => setTimeout(resolve, 500));
//       }
//     }
    
//     console.log(`Processed ${results.length} symbols in batches`);
//     return results;
//   } catch (error) {
//     console.error('Error in batch processing:', error);
//     throw error;
//   }
// };

// // Example 12: Data validation and filtering
// export const getValidatedDataExample = async () => {
//   try {
//     const candles = await fetchBinanceCandles({
//       symbol: 'BTC/USDT',
//       interval: '1d',
//       limit: 100
//     });
    
//     // Validate and filter data
//     const validCandles = candles.filter(candle => {
//       return (
//         candle.open > 0 &&
//         candle.high > 0 &&
//         candle.low > 0 &&
//         candle.close > 0 &&
//         candle.volume > 0 &&
//         candle.high >= candle.low &&
//         candle.high >= candle.open &&
//         candle.high >= candle.close &&
//         candle.low <= candle.open &&
//         candle.low <= candle.close
//       );
//     });
    
//     console.log(`Validated ${validCandles.length} out of ${candles.length} candles`);
//     return validCandles;
//   } catch (error) {
//     console.error('Error in data validation:', error);
//     throw error;
//   }
// };
