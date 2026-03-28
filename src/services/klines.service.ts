import { prisma } from '@/lib/db';
import { Prisma } from '@prisma/client';
import axios from 'axios';
import { isStale } from '@/helpers/isStale';

export async function getKlinesData(queryParams: Record<string, string | number>) {
  const symbol = queryParams.symbol as string;
  const interval = queryParams.interval as string;
  const limit = (queryParams.limit as number) || 500;
  const startTime = queryParams.startTime as number | undefined;
  const endTime = queryParams.endTime as number | undefined;

  const dbQueryStartTime = startTime ? new Date(startTime) : undefined;
  const dbQueryEndTime = endTime ? new Date(endTime) : undefined;

  const openTimeFilter: Prisma.DateTimeFilter = {};
  if (dbQueryStartTime) openTimeFilter.gte = dbQueryStartTime;
  if (dbQueryEndTime) openTimeFilter.lte = dbQueryEndTime;

  const whereClause: Prisma.KlineWhereInput = {
    symbol,
    interval,
    ...(dbQueryStartTime || dbQueryEndTime ? { openTime: openTimeFilter } : {}),
  };

  let orderBy: Prisma.KlineOrderByWithRelationInput = { openTime: 'asc' };
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

  const dataIsStale = isStale({
    dbKlines,
    limit,
    interval,
    startTime,
    endTime,
  });

  if (!dataIsStale) {
    return { source: 'PostgreSQL', data: dbKlines };
  }

  const res = await axios.get(`https://api.binance.com/api/v3/klines`, {
    params: queryParams,
  });

  if (!res.data || !Array.isArray(res.data)) {
    throw new Error('Invalid API response format');
  }

  const parsedBinanceData = res.data.map((candle: [number, string, string, string, string, string, ...unknown[]]) => ({
    openTime: new Date(candle[0]),
    date: new Date(candle[0]).toISOString().split('T')[0],
    open: parseFloat(candle[1]),
    high: parseFloat(candle[2]),
    low: parseFloat(candle[3]),
    close: parseFloat(candle[4]),
    volume: parseFloat(candle[5]),
  }));

  if (parsedBinanceData.length > 0) {
    await prisma.kline.createMany({
      data: parsedBinanceData.map(k => ({
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
