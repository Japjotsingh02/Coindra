import { Candle, OHLC } from "@/types/candle";
import { EChartsOption } from "echarts-for-react";

// export function getCandlestickOption(intradayData: OHLC[] | OHLC): EChartsOption {
//   // Handle both single OHLC and array of OHLC
//   let candles: number[][];
//   let xAxisData: string[];
  
//   if (Array.isArray(intradayData[0])) {
//     // Multiple candlesticks - array of OHLC arrays
//     candles = (intradayData as OHLC[]).map(([o, h, l, c]) => [o, c, l, h]); // ECharts order: [open, close, low, high]
//     xAxisData = candles.map((_, index) => `Period ${index + 1}`);
//   } else {
//     // Single candlestick - single OHLC array
//     const [o = 0, h = 0, l = 0, c = 0] = intradayData as OHLC;
//     candles = [[o, c, l, h]]; // ECharts order: [open, close, low, high]
//     xAxisData = ["Today"];
//   }

//   return {
//     backgroundColor: 'transparent',
//     tooltip: { 
//       trigger: "axis",
//       backgroundColor: '#1a1d24',
//       borderColor: '#2a2d36',
//       textStyle: { color: '#ffffff' },
//       axisPointer: {
//         type: 'cross',
//         lineStyle: { color: '#bb9c2d', width: 1 }
//       },
//       formatter: (params: { data: number[]; dataIndex: number }[]) => {
//         const data = params[0].data;
//         const period = xAxisData[params[0].dataIndex];
//         return `
//           <div style="padding: 8px;">
//             <div style="font-weight: bold; color: #bb9c2d; margin-bottom: 4px;">${period}</div>
//             <div style="color: #7c8796;">Open: <span style="color: #ffffff;">$${data[0].toFixed(2)}</span></div>
//             <div style="color: #7c8796;">Close: <span style="color: #ffffff;">$${data[1].toFixed(2)}</span></div>
//             <div style="color: #7c8796;">Low: <span style="color: #ffffff;">$${data[2].toFixed(2)}</span></div>
//             <div style="color: #7c8796;">High: <span style="color: #ffffff;">$${data[3].toFixed(2)}</span></div>
//           </div>
//         `;
//       }
//     },
//     grid: { 
//       left: '10%', 
//       right: '10%', 
//       top: '15%', 
//       bottom: '15%' 
//     },
//     xAxis: { 
//       type: "category", 
//       data: xAxisData,
//       axisLabel: { 
//         color: '#7c8796', 
//         fontSize: 10,
//         rotate: candles.length > 5 ? 45 : 0
//       },
//       axisLine: { lineStyle: { color: '#2a2d36' } },
//       axisTick: { show: false }
//     },
//     yAxis: { 
//       scale: true, 
//       axisLabel: { color: '#7c8796', fontSize: 10 },
//       axisLine: { show: false },
//       axisTick: { show: false },
//       splitLine: { 
//         lineStyle: { color: '#2a2d36', opacity: 0.3, type: 'dashed' } 
//       }
//     },
//     series: [
//       {
//         type: "candlestick",
//         data: candles,
//         itemStyle: {
//           color: "#22c55e",  // bullish
//           color0: "#ef4444", // bearish
//           borderColor: "#22c55e",
//           borderColor0: "#ef4444",
//           borderWidth: 1,
//         },
//         emphasis: {
//           itemStyle: {
//             shadowBlur: 20,
//             shadowColor: 'rgba(34, 197, 94, 0.5)',
//             shadowOffsetX: 0,
//             shadowOffsetY: 0
//           }
//         }
//       },
//     ],
//     animation: true,
//     animationDuration: 800,
//     animationEasing: 'cubicOut',
//     animationDelay: (idx: number) => idx * 100
//   };
// }

// export function getTimeSeriesCandlestickOption(
//   data: { date: string; open: number; high: number; low: number; close: number; volume?: number }[]
// ): EChartsOption {
//   if (!data.length) return {};

//   const candles = data.map(({ open, close, low, high }) => [open, close, low, high]);
//   const dates = data.map(d => d.date);
//   const volumes = data.map(d => d.volume || 0);

//   return {
//     backgroundColor: 'transparent',
//     tooltip: { 
//       trigger: "axis",
//       backgroundColor: '#1a1d24',
//       borderColor: '#2a2d36',
//       textStyle: { color: '#ffffff' },
//       axisPointer: {
//         type: 'cross',
//         lineStyle: { color: '#bb9c2d', width: 1 }
//       },
//       formatter: (params: { data: number[]; axisValue: string }[]) => {
//         const candleData = params[0]?.data;
//         const volumeData = params[1]?.data;
//         const date = params[0]?.axisValue;
        
//         if (!candleData) return '';
        
//         return `
//           <div style="padding: 8px;">
//             <div style="font-weight: bold; color: #bb9c2d; margin-bottom: 4px;">${date}</div>
//             <div style="color: #7c8796;">Open: <span style="color: #ffffff;">$${candleData[0].toFixed(2)}</span></div>
//             <div style="color: #7c8796;">Close: <span style="color: #ffffff;">$${candleData[1].toFixed(2)}</span></div>
//             <div style="color: #7c8796;">Low: <span style="color: #ffffff;">$${candleData[2].toFixed(2)}</span></div>
//             <div style="color: #7c8796;">High: <span style="color: #ffffff;">$${candleData[3].toFixed(2)}</span></div>
//             ${volumeData ? `<div style="color: #7c8796;">Volume: <span style="color: #ffffff;">${volumeData.toLocaleString()}</span></div>` : ''}
//           </div>
//         `;
//       }
//     },
//     legend: {
//       data: ['Price', 'Volume'],
//       textStyle: { color: '#7c8796' },
//       top: '2%'
//     },
//     grid: [
//       {
//         left: '10%',
//         right: '10%',
//         top: '20%',
//         height: '60%'
//       },
//       {
//         left: '10%',
//         right: '10%',
//         top: '85%',
//         height: '10%'
//       }
//     ],
//     xAxis: [
//       {
//         type: "category",
//         data: dates,
//         gridIndex: 0,
//         axisLabel: { 
//           color: '#7c8796', 
//           fontSize: 10,
//           rotate: dates.length > 10 ? 45 : 0
//         },
//         axisLine: { lineStyle: { color: '#2a2d36' } },
//         axisTick: { show: false }
//       },
//       {
//         type: "category",
//         data: dates,
//         gridIndex: 1,
//         axisLabel: { show: false },
//         axisLine: { lineStyle: { color: '#2a2d36' } },
//         axisTick: { show: false }
//       }
//     ],
//     yAxis: [
//       {
//         scale: true,
//         gridIndex: 0,
//         axisLabel: { color: '#7c8796', fontSize: 10 },
//         axisLine: { show: false },
//         axisTick: { show: false },
//         splitLine: { 
//           lineStyle: { color: '#2a2d36', opacity: 0.3, type: 'dashed' } 
//         }
//       },
//       {
//         scale: true,
//         gridIndex: 1,
//         axisLabel: { color: '#7c8796', fontSize: 10 },
//         axisLine: { show: false },
//         axisTick: { show: false },
//         splitLine: { show: false }
//       }
//     ],
//     dataZoom: [
//       {
//         type: 'inside',
//         xAxisIndex: [0, 1],
//         start: 0,
//         end: 100
//       },
//       {
//         show: true,
//         xAxisIndex: [0, 1],
//         type: 'slider',
//         bottom: '0%',
//         start: 0,
//         end: 100,
//         height: 20,
//         borderColor: '#2a2d36',
//         fillerColor: 'rgba(187, 156, 45, 0.1)',
//         handleStyle: {
//           color: '#bb9c2d',
//           borderColor: '#bb9c2d'
//         }
//       }
//     ],
//     series: [
//       {
//         name: 'Price',
//         type: "candlestick",
//         xAxisIndex: 0,
//         yAxisIndex: 0,
//         data: candles,
//         itemStyle: {
//           color: "#22c55e",  // bullish
//           color0: "#ef4444", // bearish
//           borderColor: "#22c55e",
//           borderColor0: "#ef4444",
//           borderWidth: 1,
//         },
//         emphasis: {
//           itemStyle: {
//             shadowBlur: 20,
//             shadowColor: 'rgba(34, 197, 94, 0.5)',
//             shadowOffsetX: 0,
//             shadowOffsetY: 0
//           }
//         }
//       },
//       {
//         name: 'Volume',
//         type: 'bar',
//         xAxisIndex: 1,
//         yAxisIndex: 1,
//         data: volumes,
//         itemStyle: {
//           color: (params: { dataIndex: number }) => {
//             const candle = candles[params.dataIndex];
//             return candle[1] >= candle[0] ? 'rgba(34, 197, 94, 0.6)' : 'rgba(239, 68, 68, 0.6)';
//           }
//         }
//       }
//     ],
//     animation: true,
//     animationDuration: 1000,
//     animationEasing: 'cubicOut',
//     animationDelay: (idx: number) => idx * 50
//   };
// }

export function getCandlestickOption(candles: Candle[]) {
  const dates = candles.map((c) => c.date);
  const ohlc = candles.map((c) => [c.open, c.close, c.low, c.high]);

  return {
    backgroundColor: "transparent",
    tooltip: {
      trigger: "axis",
      axisPointer: { type: "cross" },
      backgroundColor: "#1a1d24",
      borderColor: "#2a2d36",
      textStyle: { color: "#fff" },
      formatter: (params: { data: [number, number, number, number]; axisValue: string }[]) => {
        const d = params[0];
        const [open, close, low, high] = d.data;
        return `
          <div style="padding:6px">
            <div style="color:#bb9c2d;font-weight:bold;">${d.axisValue}</div>
            <div>Open: <span style="color:#fff">${open.toFixed(2)}</span></div>
            <div>Close: <span style="color:#fff">${close.toFixed(2)}</span></div>
            <div>High: <span style="color:#fff">${high.toFixed(2)}</span></div>
            <div>Low: <span style="color:#fff">${low.toFixed(2)}</span></div>
          </div>
        `;
      },
    },
    grid: { left: 50, right: 20, top: 30, bottom: 40 },
    xAxis: {
      type: "category",
      data: dates,
      boundaryGap: false,
      axisLine: { lineStyle: { color: "#2a2d36" } },
      axisLabel: { color: "#7c8796", fontSize: 10 },
    },
    yAxis: {
      scale: true,
      axisLine: { lineStyle: { color: "#2a2d36" } },
      axisLabel: { color: "#7c8796", fontSize: 10 },
      splitLine: { lineStyle: { color: "#2a2d36", type: "dashed", opacity: 0.2 } },
    },
    dataZoom: [
      { type: "inside", start: 70, end: 100 },
      { type: "slider", start: 70, end: 100, bottom: 5, height: 15 },
    ],
    series: [
      {
        type: "candlestick",
        name: "Price",
        data: ohlc,
        itemStyle: {
          color: "#16a34a",      // bullish
          color0: "#dc2626",     // bearish
          borderColor: "#16a34a",
          borderColor0: "#dc2626",
        },
      },
    ],
    animation: true,
    animationDuration: 500,
  };
}

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

