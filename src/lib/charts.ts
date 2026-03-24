import { EChartsOption } from "echarts-for-react";

export function getLiquidityContextOption(
  todayVol: number,
  avgVol: number
): EChartsOption {
  return {
    backgroundColor: "transparent",
    tooltip: {
      trigger: "axis",
      backgroundColor: "#1a1d24",
      borderColor: "#2a2d36",
      textStyle: { color: "#ffffff" },
      axisPointer: {
        type: "shadow",
        shadowStyle: { color: "rgba(187, 156, 45, 0.1)" },
      },
    },
    grid: {
      left: "15%",
      right: "10%",
      top: "20%",
      bottom: "15%",
    },
    xAxis: {
      type: "category",
      data: ["7d Avg", "Today"],
      axisLabel: { color: "#7c8796", fontSize: 11, fontWeight: "500" },
      axisLine: { lineStyle: { color: "#2a2d36" } },
      axisTick: { show: false },
    },
    yAxis: {
      type: "value",
      axisLabel: { color: "#7c8796", fontSize: 10 },
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: {
        lineStyle: { color: "#2a2d36", opacity: 0.3, type: "dashed" },
      },
    },
    series: [
      {
        type: "bar",
        data: [
          {
            value: avgVol,
            itemStyle: {
              color: {
                type: "linear",
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  { offset: 0, color: "#3b82f6" },
                  { offset: 1, color: "#1d4ed8" },
                ],
              },
              borderRadius: [4, 4, 0, 0],
              shadowBlur: 10,
              shadowColor: "rgba(59, 130, 246, 0.3)",
            },
          },
          {
            value: todayVol,
            itemStyle: {
              color: {
                type: "linear",
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  { offset: 0, color: "#f59e0b" },
                  { offset: 1, color: "#d97706" },
                ],
              },
              borderRadius: [4, 4, 0, 0],
              shadowBlur: 10,
              shadowColor: "rgba(245, 158, 11, 0.3)",
            },
          },
        ],
        emphasis: {
          itemStyle: {
            shadowBlur: 20,
            shadowColor: "rgba(187, 156, 45, 0.4)",
          },
        },
      },
    ],
    animation: true,
    animationDuration: 1200,
    animationEasing: "elasticOut",
  };
}

export function getVolatilityBreakdownOption(
  history: { date: string; intradayVol: number; openCloseMove: number }[]
): EChartsOption {
  return {
    backgroundColor: "transparent",
    tooltip: {
      trigger: "axis",
      backgroundColor: "#1a1d24",
      borderColor: "#2a2d36",
      textStyle: { color: "#ffffff" },
      axisPointer: {
        type: "line",
        lineStyle: { color: "#bb9c2d", width: 1 },
      },
    },
    grid: {
      left: "8%",
      right: "5%",
      top: "12%",
      bottom: "12%",
    },
    xAxis: {
      type: "category",
      data: history.map((h) => h.date),
      axisLabel: { color: "#7c8796", fontSize: 10 },
      axisLine: { lineStyle: { color: "#2a2d36" } },
      axisTick: { show: false },
    },
    yAxis: {
      type: "value",
      axisLabel: { color: "#7c8796", fontSize: 10, formatter: "{value}%" },
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: {
        lineStyle: { color: "#2a2d36", opacity: 0.3, type: "dashed" },
      },
    },
    series: [
      {
        name: "Intraday Vol",
        type: "line",
        smooth: true,
        symbol: "none",
        data: history.map((h) => h.intradayVol.toFixed(2)),
        lineStyle: { color: "#3b82f6", width: 2 },
        itemStyle: { color: "#3b82f6" },
        color: {
          type: "linear",
          x: 0, y: 0, x2: 0, y2: 1,
          colorStops: [
            { offset: 0, color: "rgba(59,130,246,0.3)" },
            { offset: 1, color: "rgba(59,130,246,0)" },
          ],
        },
      },
      {
        name: "Open Close Move",
        type: "line",
        smooth: true,
        symbol: "none",
        data: history.map((h) => h.openCloseMove.toFixed(2)),
        lineStyle: { color: "#22c55e", width: 2 },
        itemStyle: { color: "#22c55e" },
        areaStyle: {
          color: {
            type: "linear",
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: "rgba(34,197,94,0.3)" },
              { offset: 1, color: "rgba(34,197,94,0)" },
            ],
          },
        },
      },
    ],
    animationDuration: 800,
    animationEasing: "cubicOut",
  };
}

export function getRiskQuadrantScatterOption(
  data: { date: string; risk: number; return: number; volume: number }[],
  highlightDate?: string
) {
  if (!data.length) return {};

  const risks = data.map(d => d.risk).sort((a, b) => a - b);
  const returns = data.map(d => d.return).sort((a, b) => a - b);

  const mid = Math.floor(data.length / 2);
  const medianRisk =
    data.length % 2 ? risks[mid] : (risks[mid - 1] + risks[mid]) / 2;
  const medianReturn =
    data.length % 2 ? returns[mid] : (returns[mid - 1] + returns[mid]) / 2;

  const highlightPoint = data.find((d) => d.date === highlightDate);

  const getColorByQuadrant = (r: number, ret: number) => {
    if (r <= medianRisk && ret >= medianReturn) return "#22c55e";
    if (r > medianRisk && ret >= medianReturn) return "#f59e0b";
    if (r <= medianRisk && ret < medianReturn) return "#3b82f6";
    return "#ef4444";
  };

  return {
    backgroundColor: "transparent",
    tooltip: {
      trigger: "item",
      backgroundColor: "#1a1d24",
      borderColor: "#2a2d36",
      textStyle: { color: "#ffffff" },
      formatter: (params: { data: [number, number, string, number] }) => {
        const [risk, ret, date, volume] = params.data;
        return `
          <div style="padding: 8px;">
            <div style="font-weight: bold; color: #bb9c2d; margin-bottom: 4px;">${date}</div>
            <div style="color: #7c8796;">Risk: <span style="color: #ffffff;">${risk.toFixed(2)}%</span></div>
            <div style="color: #7c8796;">Return: <span style="color: #ffffff;">${ret.toFixed(2)}%</span></div>
            <div style="color: #7c8796;">Liquidity: <span style="color: #ffffff;">${volume.toLocaleString()}</span></div>
          </div>
        `;
      },
    },
    xAxis: {
      name: "Risk (Volatility %)",
      nameLocation: "middle",
      nameGap: 30,
      axisLabel: { color: "#7c8796", fontSize: 10 },
      splitLine: { lineStyle: { type: "dashed", color: "#2a2d36", opacity: 0.2 } },
    },
    yAxis: {
      name: "Return (%)",
      nameLocation: "middle",
      nameGap: 40,
      axisLabel: { color: "#7c8796", fontSize: 10 },
      splitLine: { lineStyle: { type: "dashed", color: "#2a2d36", opacity: 0.2 } },
    },
    series: [
      {
        type: "scatter",
        symbolSize: (val: [number, number, string, number]) => {
          const volume = val[3] || 0;
          return Math.min(40, Math.max(10, Math.sqrt(volume) / 50));
        },
        data: data.map((d) => [
          d.risk,
          d.return,
          d.date,
          d.volume,
          getColorByQuadrant(d.risk, d.return),
        ]),
        itemStyle: {
          color: (p: { data: [number, number, string, number, string] }) => p.data[4],
          opacity: 0.85,
          borderWidth: 1,
        },
      },
      ...(highlightPoint
        ? [
            {
              type: "effectScatter",
              rippleEffect: { scale: 4, brushType: "stroke" },
              symbolSize: 25,
              data: [[highlightPoint.risk, highlightPoint.return, highlightPoint.date]],
              itemStyle: {
                color: "#fbbf24",
                borderColor: "#f59e0b",
                borderWidth: 2,
              },
              z: 5,
            },
          ]
        : []),
    ],
    markLine: {
      silent: true,
      lineStyle: { type: "dashed", color: "#555" },
      data: [
        { xAxis: medianRisk },
        { yAxis: medianReturn },
      ],
    },
    animation: true,
    animationDuration: 1200,
    animationEasing: "elasticOut",
  };
}

