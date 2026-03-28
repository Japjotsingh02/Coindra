export function getIntervalMs(interval: string): number {
  const map: Record<string, number> = {
    '1m': 60 * 1000,
    '3m': 3 * 60 * 1000,
    '5m': 5 * 60 * 1000,
    '15m': 15 * 60 * 1000,
    '30m': 30 * 60 * 1000,
    '1h': 60 * 60 * 1000,
    '2h': 2 * 60 * 60 * 1000,
    '4h': 4 * 60 * 60 * 1000,
    '6h': 6 * 60 * 60 * 1000,
    '8h': 8 * 60 * 60 * 1000,
    '12h': 12 * 60 * 60 * 1000,
    '1d': 24 * 60 * 60 * 1000,
    '3d': 3 * 24 * 60 * 60 * 1000,
    '1w': 7 * 24 * 60 * 60 * 1000,
    '1M': 30 * 24 * 60 * 60 * 1000,
  };
  return map[interval] || 24 * 60 * 60 * 1000;
}

interface IsStaleParams {
  dbKlines: { openTime: Date }[];
  limit: number;
  interval: string;
  startTime?: number;
  endTime?: number;
}

export function isStale({ dbKlines, limit, interval, startTime, endTime }: IsStaleParams): boolean {
  if (!startTime && !endTime) {
    if (dbKlines.length === limit) {
      const lastCandleTime = dbKlines[dbKlines.length - 1].openTime.getTime();
      const now = Date.now();
      const intervalMs = getIntervalMs(interval);
      if (now - lastCandleTime <= intervalMs * 3) {
        return false;
      }
    }
  } else if (startTime && !endTime) {
    if (dbKlines.length === limit) return false;
  } else if (!startTime && endTime) {
    if (dbKlines.length === limit) return false;
  } else if (startTime && endTime) {
    if (dbKlines.length > 0) {
      const firstCandleTime = dbKlines[0].openTime.getTime();
      const lastCandleTime = dbKlines[dbKlines.length - 1].openTime.getTime();
      const intervalMs = getIntervalMs(interval);
      if (firstCandleTime <= startTime + intervalMs && lastCandleTime >= endTime - intervalMs) {
        return false;
      } else if (dbKlines.length === limit) {
        return false;
      }
    }
  }
  return true;
}
