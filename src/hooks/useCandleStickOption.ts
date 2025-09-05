import { Candle } from "@/types/candle";
import { EChartsOption } from "echarts-for-react";
import { useMemo, useState } from "react";

export function useCandlestickOption(candles: Candle[], symbol: string) {
  const [showVolume, setShowVolume] = useState(false);

  const option: EChartsOption = useMemo(() => {
    if (candles.length === 0) {
      return {
        backgroundColor: "transparent",
        title: {
          text: "No intraday data available",
          textStyle: { color: "#7c8796", fontSize: 14 },
          left: "center",
          top: "center",
        },
      };
    }

    const ohlc = candles.map((c) => [c.open, c.close, c.low, c.high]);
    const volumes = candles.map((c) => c.volume);
    const dates = candles.map((c) => c.date);

    return {
      backgroundColor: "transparent",
      tooltip: {
        trigger: "axis",
        axisPointer: { type: "cross" },
        backgroundColor: "#1a1d24",
        borderColor: "#2a2d36",
        textStyle: { color: "#fff" },
      },
      grid: showVolume
        ? [
            { left: "8%", right: "8%", top: "15%", height: "60%" }, // candlestick
            { left: "8%", right: "8%", top: "80%", height: "12%" }, // volume
          ]
        : { left: "8%", right: "8%", top: "15%", bottom: "13%" },
      xAxis: showVolume
        ? [
            {
              type: "category",
              data: dates,
              gridIndex: 0,
              axisLine: { lineStyle: { color: "#2a2d36" } },
              axisLabel: { color: "#7c8796", fontSize: 10 },
            },
            {
              type: "category",
              data: dates,
              gridIndex: 1,
              axisLine: { lineStyle: { color: "#2a2d36" } },
              axisLabel: { color: "#7c8796", fontSize: 10 },
            },
          ]
        : {
            type: "category",
            data: dates,
            axisLine: { lineStyle: { color: "#2a2d36" } },
            axisLabel: { color: "#7c8796", fontSize: 10 },
          },
      yAxis: showVolume
        ? [
            {
              scale: true,
              gridIndex: 0,
              axisLine: { lineStyle: { color: "#2a2d36" } },
              axisLabel: { color: "#7c8796", fontSize: 10 },
              splitLine: {
                lineStyle: { color: "#2a2d36", type: "dashed", opacity: 0.2 },
              },
            },
            {
              scale: true,
              gridIndex: 1,
              axisLine: { lineStyle: { color: "#2a2d36" } },
              axisLabel: { color: "#7c8796", fontSize: 10 },
              splitLine: {
                lineStyle: { color: "#2a2d36", type: "dashed", opacity: 0.2 },
              },
            },
          ]
        : {
            scale: true,
            axisLine: { lineStyle: { color: "#2a2d36" } },
            axisLabel: { color: "#7c8796", fontSize: 10 },
            splitLine: {
              lineStyle: { color: "#2a2d36", type: "dashed", opacity: 0.2 },
            },
          },
      series: [
        {
          type: "candlestick",
          name: "Price",
          data: ohlc,
          itemStyle: {
            color: "#22c55e", // bullish
            color0: "#ef4444", // bearish
            borderColor: "#22c55e",
            borderColor0: "#ef4444",
          },
        },
        ...(showVolume
          ? [
              {
                type: "bar",
                name: "Volume",
                data: volumes,
                xAxisIndex: 1,
                yAxisIndex: 1,
                itemStyle: {
                  color: (p: { dataIndex: number }) =>
                    ohlc[p.dataIndex][1] >= ohlc[p.dataIndex][0]
                      ? "rgba(34,197,94,0.6)"
                      : "rgba(239,68,68,0.6)",
                },
              },
            ]
          : []),
      ],
      dataZoom: [
        {
          type: "inside",
          xAxisIndex: showVolume ? [0, 1] : [0],
          start: 70,
          end: 100,
        },
        {
          type: "slider",
          xAxisIndex: showVolume ? [0, 1] : [0],
          start: 70,
          end: 100,
          bottom: 5,
          height: 15,
        },
      ],
    };
  }, [candles, showVolume, symbol]);

  return { option, showVolume, setShowVolume };
}
