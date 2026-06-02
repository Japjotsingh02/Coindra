import React from 'react';
import { useIntradayCandles } from '@/hooks/useBinanceData';
import ChartCard from '../elements/chartCard/ChartCard';
import { useCandlestickOption } from '@/hooks/useCandleStickOption';
import { Button } from '@/components/ui/button';

export default function IntradayCandlestickChart({ symbol }: { symbol: string }) {
  const candles = useIntradayCandles(symbol);

  const { option, showVolume, setShowVolume } = useCandlestickOption(candles);

  return (
    <div>
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="mb-2 border-brand/30 text-brand hover:bg-brand/10 hover:text-brand"
        onClick={() => setShowVolume((prev) => !prev)}
      >
        {showVolume ? 'Hide Volume' : 'Show Volume'}
      </Button>
      <ChartCard title="Intraday Candlestick" option={option} />
    </div>
  );
}
