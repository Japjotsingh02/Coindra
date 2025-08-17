import { BinanceExchangeInfo, BinanceKline, BinanceSymbol } from "@/types/candle";
import axios from "axios";

export const fetchBinanceCandles = async (symbol: string) => {
  const start = new Date("2025-08-01T00:00:00Z").getTime();
  const end = new Date("2025-08-31T23:59:59Z").getTime();

  const res = await axios.get(
    `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=1d&startTime=${start}&endTime=${end}`
  );

  return res.data.map((candle: BinanceKline) => ({
    date: new Date(candle[0]).toISOString().split("T")[0],
    open: parseFloat(candle[1]),
    high: parseFloat(candle[2]),
    low: parseFloat(candle[3]),
    close: parseFloat(candle[4]),
    volume: parseFloat(candle[5]),
  }));
};

export async function fetchSymbols(): Promise<string[]> {
  const res = await fetch("https://api.binance.com/api/v3/exchangeInfo");
  const data: BinanceExchangeInfo = await res.json();
  return data.symbols
    .filter((s: BinanceSymbol) => s.status === "TRADING")
    .map((s: BinanceSymbol) => `${s.baseAsset}/${s.quoteAsset}`);
}
