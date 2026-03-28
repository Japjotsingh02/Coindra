type TransformInput = {
  date?: string;
  openTime?: Date | string | number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
};

const transform = (data: TransformInput[]) => {
  return data.map(k => ({
    date: k.date || (k.openTime ? new Date(k.openTime).toISOString().split('T')[0] : ''),
    open: k.open,
    high: k.high,
    low: k.low,
    close: k.close,
    volume: k.volume,
  }));
};

export default transform;
