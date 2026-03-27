import { NextRequest, NextResponse } from "next/server";
import { redis } from "@/lib/redis";
import transform from "@/helpers/transform";
import { getKlinesData } from "@/services/klines.service";

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const symbol = searchParams.get('symbol');
    const interval = searchParams.get('interval') || '1d';
    const limitParam = searchParams.get('limit');
    let limit = 500;
    if (limitParam) limit = parseInt(limitParam, 10);
    const startTimeParam = searchParams.get('startTime');
    const endTimeParam = searchParams.get('endTime');

    if (!symbol) {
      return NextResponse.json({ error: "Symbol is required" }, { status: 400 });
    }

    const queryParams: Record<string, string | number> = {
      symbol: symbol.toUpperCase(),
      interval,
      limit,
    };
    if (startTimeParam) queryParams.startTime = parseInt(startTimeParam, 10);
    if (endTimeParam) queryParams.endTime = parseInt(endTimeParam, 10);

    const sortedKeys = Object.keys(queryParams).sort();
    const cacheKeyParts = sortedKeys.map(k => `${k}=${queryParams[k]}`).join('&');
    const cacheKey = `binance:klines:${cacheKeyParts}`;

    const cachedData = await redis.get(cacheKey);
    if (cachedData) {
      console.log(`CACHE HIT (Redis): ${cacheKey}`);
      return NextResponse.json(cachedData);
    }

    // Call our new service abstraction
    const { source, data } = await getKlinesData(queryParams);
    
    // Transform formatting mapping 
    const resultData = transform(data);

    let ttl = 60 * 5; 
    if (interval === '1m') ttl = 30;
    else if (interval === '1h') ttl = 60 * 30;
    else if (interval === '1d') ttl = 60 * 60 * 12;
    else if (interval === '1w' || interval === '1M') ttl = 60 * 60 * 24;

    await redis.setex(cacheKey, ttl, resultData);
    console.log(`CACHE MISS (Redis) -> ${source}: ${cacheKey}`);

    return NextResponse.json(resultData);
  } catch (error) {
    console.error("Error fetching Binance klines:", error);
    return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
  }
}
