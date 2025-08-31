import React, { useMemo } from "react";
import ReactECharts, { EChartsOption } from "echarts-for-react";
import { useIntradayCandles } from "@/hooks/useBinanceData";
import ChartCard from "../uielements/chartCard/ChartCard";

interface IntradayCandlestickChartProps {
  symbol: string;
  intraday?: [number, number, number, number];
}

export default function IntradayCandlestickChart({
  symbol,
  intraday,
}: IntradayCandlestickChartProps) {
  // Use the new hook for real-time intraday data
  const candles = useIntradayCandles(symbol);

  // Fallback to legacy intraday data if hook returns empty
  const fallbackCandle = useMemo(() => {
    if (intraday && intraday.length === 4) {
      return {
        date: new Date().toISOString().split("T")[0],
        open: intraday[0],
        high: intraday[1],
        low: intraday[2],
        close: intraday[3],
        volume: 0,
      };
    }
    return null;
  }, [intraday]);

  const chartOption = useMemo((): EChartsOption => {
    // Use real-time candles if available, otherwise fallback
    const chartData =
      candles.length > 0 ? candles : fallbackCandle ? [fallbackCandle] : [];

    if (chartData.length === 0) {
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

    // Prepare data for ECharts candlestick format
    const candlestickData = chartData.map((candle) => [
      candle.open,
      candle.close,
      candle.low,
      candle.high,
    ]);

    // Create time labels for x-axis
    const timeLabels = chartData.map((candle) => {
      const date = new Date(candle.date);
      return date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
    });

    // Calculate price range for y-axis
    const allPrices = chartData.flatMap((c) => [
      c.open,
      c.high,
      c.low,
      c.close,
    ]);
    const minPrice = Math.min(...allPrices);
    const maxPrice = Math.max(...allPrices);
    const priceRange = maxPrice - minPrice;
    const yAxisMin = minPrice - priceRange * 0.1;
    const yAxisMax = maxPrice + priceRange * 0.1;

    return {
      backgroundColor: "transparent",
      title: {
        text: `${symbol} Intraday (1m)`,
        textStyle: {
          color: "#bb9c2d",
          fontSize: 16,
          fontWeight: "bold",
        },
        left: "center",
        top: "2%",
      },
      tooltip: {
        trigger: "axis",
        backgroundColor: "#1a1d24",
        borderColor: "#2a2d36",
        textStyle: { color: "#ffffff" },
        axisPointer: {
          type: "cross",
          lineStyle: { color: "#bb9c2d", width: 1 },
        },
        formatter: (params: { data: number[]; dataIndex: number }[]) => {
          const data = params[0]?.data;
          const timeIndex = params[0]?.dataIndex;
          const time = timeLabels[timeIndex];
          const candle = chartData[timeIndex];

          if (!data || !candle) return "";

          const isBullish = data[1] >= data[0]; // close >= open
          const color = isBullish ? "#22c55e" : "#ef4444";

          return `
            <div style="padding: 8px;">
              <div style="font-weight: bold; color: #bb9c2d; margin-bottom: 4px;">${time}</div>
              <div style="color: #7c8796;">Open: <span style="color: ${color};">$${data[0].toFixed(
            2
          )}</span></div>
              <div style="color: #7c8796;">Close: <span style="color: ${color};">$${data[1].toFixed(
            2
          )}</span></div>
              <div style="color: #7c8796;">Low: <span style="color: ${color};">$${data[2].toFixed(
            2
          )}</span></div>
              <div style="color: #7c8796;">High: <span style="color: ${color};">$${data[3].toFixed(
            2
          )}</span></div>
              <div style="color: #7c8796;">Volume: <span style="color: #ffffff;">${candle.volume.toLocaleString()}</span></div>
              <div style="color: #7c8796;">Change: <span style="color: ${color};">${(
            ((data[1] - data[0]) / data[0]) *
            100
          ).toFixed(2)}%</span></div>
            </div>
          `;
        },
      },
      legend: {
        data: ["Price", "Volume"],
        textStyle: { color: "#7c8796" },
        top: "8%",
      },
      grid: [
        {
          left: "10%",
          right: "10%",
          top: "20%",
          height: "60%",
        },
        {
          left: "10%",
          right: "10%",
          top: "85%",
          height: "10%",
        },
      ],
      xAxis: [
        {
          type: "category",
          data: timeLabels,
          gridIndex: 0,
          axisLabel: {
            color: "#7c8796",
            fontSize: 10,
            rotate: timeLabels.length > 20 ? 45 : 0,
            formatter: (value: string, index: number) => {
              // Show every 5th label to avoid overcrowding
              return index % 5 === 0 ? value : "";
            },
          },
          axisLine: { lineStyle: { color: "#2a2d36" } },
          axisTick: { show: false },
        },
        {
          type: "category",
          data: timeLabels,
          gridIndex: 1,
          axisLabel: { show: false },
          axisLine: { lineStyle: { color: "#2a2d36" } },
          axisTick: { show: false },
        },
      ],
      yAxis: [
        {
          scale: true,
          gridIndex: 0,
          axisLabel: { color: "#7c8796", fontSize: 10 },
          axisLine: { show: false },
          axisTick: { show: false },
          splitLine: {
            lineStyle: { color: "#2a2d36", opacity: 0.3, type: "dashed" },
          },
          min: yAxisMin,
          max: yAxisMax,
        },
        {
          scale: true,
          gridIndex: 1,
          axisLabel: { color: "#7c8796", fontSize: 10 },
          axisLine: { show: false },
          axisTick: { show: false },
          splitLine: { show: false },
        },
      ],
      dataZoom: [
        {
          type: "inside",
          xAxisIndex: [0, 1],
          start: Math.max(
            0,
            ((timeLabels.length - 60) / timeLabels.length) * 100
          ), // Show last 60 candles
          end: 100,
        },
        {
          show: true,
          xAxisIndex: [0, 1],
          type: "slider",
          bottom: "0%",
          start: Math.max(
            0,
            ((timeLabels.length - 60) / timeLabels.length) * 100
          ),
          end: 100,
          height: 20,
          borderColor: "#2a2d36",
          fillerColor: "rgba(187, 156, 45, 0.1)",
          handleStyle: {
            color: "#bb9c2d",
            borderColor: "#bb9c2d",
          },
          textStyle: { color: "#7c8796" },
        },
      ],
      series: [
        {
          name: "Price",
          type: "candlestick",
          xAxisIndex: 0,
          yAxisIndex: 0,
          data: candlestickData,
          itemStyle: {
            color: "#22c55e", // bullish
            color0: "#ef4444", // bearish
            borderColor: "#22c55e",
            borderColor0: "#ef4444",
            borderWidth: 1,
          },
          emphasis: {
            itemStyle: {
              shadowBlur: 20,
              shadowColor: "rgba(187, 156, 45, 0.5)",
              shadowOffsetX: 0,
              shadowOffsetY: 0,
            },
          },
        },
        {
          name: "Volume",
          type: "bar",
          xAxisIndex: 1,
          yAxisIndex: 1,
          data: chartData.map((c) => c.volume),
          itemStyle: {
            color: (params: { dataIndex: number }) => {
              const candle = chartData[params.dataIndex];
              if (!candle) return "rgba(119, 200, 119, 0.6)";
              return candle.close >= candle.open
                ? "rgba(34, 197, 94, 0.6)"
                : "rgba(239, 68, 68, 0.6)";
            },
          },
        },
      ],
      animation: true,
      animationDuration: 300,
      animationEasing: "cubicOut",
    };
  }, [candles, fallbackCandle, symbol]);

  return (
    <ChartCard title="Intraday Candlestick" option={chartOption}>
      <ReactECharts
        option={chartOption}
        style={{ height: "100%", width: "100%" }}
        opts={{ renderer: "canvas" }}
      />

      {candles.length > 0 && (
        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-xs text-muted-secondary font-medium uppercase tracking-wide mb-1">
              Current Price
            </div>
            <div className="text-lg font-bold text-white">
              ${candles[candles.length - 1]?.close?.toFixed(2) || "0.00"}
            </div>
          </div>
          <div>
            <div className="text-xs text-muted-secondary font-medium uppercase tracking-wide mb-1">
              Today&apos;s High
            </div>
            <div className="text-lg font-bold text-green-400">
              ${Math.max(...candles.map((c) => c.high)).toFixed(2)}
            </div>
          </div>
          <div>
            <div className="text-xs text-muted-secondary font-medium uppercase tracking-wide mb-1">
              Today&apos;s Low
            </div>
            <div className="text-lg font-bold text-red-400">
              ${Math.min(...candles.map((c) => c.low)).toFixed(2)}
            </div>
          </div>
          <div>
            <div className="text-xs text-muted-secondary font-medium uppercase tracking-wide mb-1">
              Total Volume
            </div>
            <div className="text-lg font-bold text-white">
              {candles.reduce((sum, c) => sum + c.volume, 0).toLocaleString()}
            </div>
          </div>
        </div>
      )}
    </ChartCard>
  );
}
