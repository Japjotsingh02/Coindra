import { NextResponse } from 'next/server';
import { redis } from '@/lib/redis';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const cacheKey = 'binance:exchangeInfo';
    const cachedData = await redis.get(cacheKey);

    if (cachedData) {
      console.log('CACHE HIT: /api/binance/exchangeInfo');
      return NextResponse.json(cachedData);
    }
    
    console.log('CACHE MISS: /api/binance/exchangeInfo');
    const res = await fetch("https://api.binance.com/api/v3/exchangeInfo");
    const data = await res.json();
    
    const symbols = data.symbols
      .filter((s: any) => s.status === "TRADING")
      .map((s: any) => `${s.baseAsset}/${s.quoteAsset}`);

    // Cache for 1 day
    await redis.setex(cacheKey, 86400, symbols);

    return NextResponse.json(symbols);
  } catch (error: any) {
    console.error("Error fetching exchangeInfo:", error);
    return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
  }
}
