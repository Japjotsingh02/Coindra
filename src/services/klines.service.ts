import { prisma } from "@/lib/db";
import axios from "axios";
import { isStale } from "@/helpers/isStale";

export async function getKlinesData(queryParams: Record<string, string | number>) {
    const symbol = queryParams.symbol as string;
    const interval = queryParams.interval as string;
    const limit = (queryParams.limit as number) || 500;
    const startTime = queryParams.startTime as number | undefined;
    const endTime = queryParams.endTime as number | undefined;

    let dbQueryStartTime = startTime ? new Date(startTime) : undefined;
    let dbQueryEndTime = endTime ? new Date(endTime) : undefined;

    const whereClause: any = {
      symbol,
      interval,
    };

    if (dbQueryStartTime || dbQueryEndTime) {
      whereClause.openTime = {};
      if (dbQueryStartTime) whereClause.openTime.gte = dbQueryStartTime;
      if (dbQueryEndTime) whereClause.openTime.lte = dbQueryEndTime;
    }

    let orderBy: any = { openTime: 'asc' };
    let needsReverse = false;

    if (!startTime) {
      orderBy = { openTime: 'desc' };
      needsReverse = true;
    }

    const dbKlines = await prisma.kline.findMany({
      where: whereClause,
      orderBy,
      take: limit,
    });

    if (needsReverse) {
      dbKlines.reverse();
    }

    const dataIsStale = isStale({ dbKlines, limit, interval, startTime, endTime });

    if (!dataIsStale) {
        return { source: 'PostgreSQL', data: dbKlines };
    }

    const res = await axios.get(
      `https://api.binance.com/api/v3/klines`, { params: queryParams }
    );

    if (!res.data || !Array.isArray(res.data)) {
      throw new Error('Invalid API response format');
    }

    const parsedBinanceData = res.data.map((candle: any[]) => ({
      openTime: new Date(candle[0]),
      date: new Date(candle[0]).toISOString().split("T")[0],
      open: parseFloat(candle[1]),
      high: parseFloat(candle[2]),
      low: parseFloat(candle[3]),
      close: parseFloat(candle[4]),
      volume: parseFloat(candle[5]),
    }));

    if (parsedBinanceData.length > 0) {
      await prisma.kline.createMany({
        data: parsedBinanceData.map((k) => ({
          symbol,
          interval,
          openTime: k.openTime,
          open: k.open,
          high: k.high,
          low: k.low,
          close: k.close,
          volume: k.volume,
        })),
        skipDuplicates: true,
      });
      console.log(`Saved ${parsedBinanceData.length} records to PostgreSQL`);
    }

    return { source: 'Binance API', data: parsedBinanceData };
}
