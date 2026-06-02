import React, { useState, useEffect, useMemo } from 'react';
import { Candle } from '@/types/candle';

interface StreamingTransformState {
  data: Candle[];
  progress: number;
}

export function useStreamingTransform(
  candles: Candle[] | undefined,
  streamingDelay: number = 30
): StreamingTransformState {
  const [state, setState] = useState<StreamingTransformState>({
    data: [],
    progress: 0,
  });

  useEffect(() => {
    if (!candles || candles.length === 0) {
      setState({ data: [], progress: 0 });
      return;
    }

    let currentIndex = 0;
    const chunkSize = Math.ceil(candles.length / 8);

    const streamData = async () => {
      setState({ data: [], progress: 0 });

      while (currentIndex < candles.length) {
        const chunk = candles.slice(currentIndex, currentIndex + chunkSize);
        const progress = Math.min((currentIndex + chunkSize) / candles.length, 1);

        setState((prev) => ({
          data: [...prev.data, ...chunk],
          progress,
        }));

        currentIndex += chunkSize;

        await new Promise((resolve) => setTimeout(resolve, streamingDelay));
      }

      setState((prev) => ({ ...prev, progress: 1 }));
    };

    streamData();
  }, [candles, streamingDelay]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useMemo(() => state, [state.data, state.progress]);
}
