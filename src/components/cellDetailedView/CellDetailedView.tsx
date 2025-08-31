"use client";
import React, { useMemo, useState, useEffect } from "react";
import { isToday } from "date-fns";
import {
  getVolatilityBreakdownOption,
  getLiquidityContextOption,
  getRiskQuadrantScatterOption,
} from "@/lib/charts";
import { HeatmapCell } from "@/types/heatmap";
import ChartCard from "../uielements/chartCard/ChartCard";
import { useAppStore } from "@/store/useAppStore";
import IntradayCandleStickChart from "../intradayCandleStickChart";
import IntradayNewCandleStick from "../intradayCandleStickChart/IntradayNewCandleStick";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft } from "lucide-react";

interface DescriptionModalProps {
  open: boolean;
  onChange: () => void;
  cell: HeatmapCell;
  history: HeatmapCell[];
}

export const DetailedViewSummaryCard = ({
  title,
  value,
}: {
  title: string;
  value: string;
}) => {
  return (
    <div className="text-center">
      <div className="text-xs text-[#7c8796] font-medium uppercase tracking-wide mb-1">
        {title}
      </div>
      <div className="text-lg font-bold text-white">{value}</div>
    </div>
  );
};

export const DetailedViewSummary = ({
  cell,
  avgVol,
}: {
  cell: HeatmapCell;
  avgVol: number;
}) => {
  return (
    <div className="mt-6">
      <div className="bg-gradient-to-r from-[#bb9c2d]/10 to-[#bc7129]/10 p-4 rounded-xl border border-[#bb9c2d]/20">
        <h4 className="text-lg font-semibold text-[#bb9c2d] mb-3 text-center">
          Quick Summary
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <DetailedViewSummaryCard
            title="Daily Volatility"
            value={cell.volatilityDaily.toFixed(2)}
          />
          <DetailedViewSummaryCard
            title="Rolling Volatility"
            value={cell.volatilityRolling?.toFixed(2) ?? "N/A"}
          />
          <DetailedViewSummaryCard
            title="Avg Liquidity"
            value={avgVol.toFixed(0)}
          />
        </div>
      </div>
    </div>
  );
};

const DetailedViewContent = ({
  cell,
  history,
  isCollapsed,
  setIsCollapsed,
  onChange,
}: {
  cell: HeatmapCell;
  history: HeatmapCell[];
  isCollapsed: boolean;
  setIsCollapsed: (isCollapsed: boolean) => void;
  onChange: () => void;
}) => {
  const { filters } = useAppStore();
  const symbol = filters.symbol;

  const volHistory = history.map((c) => {
    const intradayVol = c.volatilityDaily;
    const openCloseMove = c.performancePct;

    return {
      date: c.date,
      intradayVol,
      openCloseMove,
    };
  });

  const riskQuadrantData = history.map((c) => ({
    date: c.date,
    risk: c?.volatilityRolling ?? c?.volatilityDaily ?? 0,
    return: c?.performancePct ?? 0,
    volume: c?.liquidity ?? 0,
  }));

  const last7 = history.slice(-7);
  const avgVol =
    last7.reduce((sum, c) => sum + (c.liquidity ?? 0), 0) /
    Math.max(last7.length, 1);

  const volBreakdownOpt = useMemo(
    () => getVolatilityBreakdownOption(volHistory),
    [volHistory]
  );

  const riskQuadrantOpt = useMemo(
    () => getRiskQuadrantScatterOption(riskQuadrantData, cell.date),
    [riskQuadrantData, cell.date]
  );

  const liquidityOpt = useMemo(
    () => getLiquidityContextOption(cell.liquidity ?? 0, avgVol),
    [cell.liquidity, avgVol]
  );

  // Check if the selected date is today
  const isSelectedDateToday = useMemo(() => {
    try {
      const cellDate = new Date(cell.date);
      return isToday(cellDate);
    } catch {
      return false;
    }
  }, [cell.date]);

  return (
    <>
      <div
        className={`flex items-center justify-between px-6 py-5 border-b border-[#2a2d36] ${
          isCollapsed ? "justify-center" : ""
        }`}
      >
        {!isCollapsed && (
          <div className="flex items-center space-x-3">
            <h3 className="text-2xl font-semibold text-[#bb9c2d]">
              Market Analysis
            </h3>
            <span className="text-sm text-[#7c8796] bg-[#2a2d36] px-2 py-1 rounded">
              {cell.date}
            </span>
          </div>
        )}
        <div className="flex items-center space-x-2">
          {/* Collapse/Expand Button */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 hover:bg-[#2a2d36] rounded-lg transition-colors"
            title={isCollapsed ? "Expand" : "Collapse"}
          >
            <ChevronLeft size={16} className="text-[#7c8796]" />
          </button>

          {/* Close Button */}
          <button
            onClick={onChange}
            className="p-2 hover:bg-[#2a2d36] rounded-lg transition-colors"
            title="Close"
          >
            <X size={16} className="text-[#7c8796]" />
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {!isCollapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 overflow-y-auto"
            style={{
              overflowY: 'scroll',
              maxHeight: 'calc(100vh - 70px)'
            }}
          >
            {/* Main Content */}
            <div className="px-6 py-6">
              {isSelectedDateToday && (
                <div className="mb-6 space-y-4">
                  <IntradayCandleStickChart symbol={symbol} />
                  <IntradayNewCandleStick symbol={symbol} />
                </div>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <ChartCard
                  title="Volatility Breakdown"
                  option={volBreakdownOpt}
                />
                <ChartCard title="Risk Quadrant" option={riskQuadrantOpt} />
                <ChartCard title="Liquidity Context" option={liquidityOpt} />
              </div>

              <DetailedViewSummary cell={cell} avgVol={avgVol} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default function CellDetailedView({
  open,
  onChange,
  cell,
  history,
}: DescriptionModalProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile vs desktop
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Close panel on escape key (desktop only)
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isMobile) {
        onChange();
      }
    };

    if (open && !isMobile) {
      document.addEventListener("keydown", handleEscape);
      return () => document.removeEventListener("keydown", handleEscape);
    }
  }, [open, onChange, isMobile]);

  // Prevent body scroll when panel is open (desktop only)
  useEffect(() => {
    if (open && !isMobile) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [open, isMobile]);

  const slideVariants = {
    hidden: {
      x: "100%",
      opacity: 0,
    },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        type: "spring" as const,
        damping: 25,
        stiffness: 200,
      },
    },
    exit: {
      x: "100%",
      opacity: 0,
      transition: {
        type: "spring" as const,
        damping: 25,
        stiffness: 200,
      },
    },
  };

  if (!cell) return null;

  // Mobile: Use regular modal
  if (isMobile) {
    return (
      <DetailedViewContent
        cell={cell}
        history={history}
        isCollapsed={false}
        setIsCollapsed={() => {}}
        onChange={onChange}
      />
    );
  }

  // Desktop: Use slideable right sidebar
  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40"
            onClick={onChange}
          />

          {/* Slideable Panel */}
          <motion.div
            variants={slideVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed top-0 right-0 h-full z-50 bg-[#1a1d24] border border-[#2a2d36] shadow-2xl"
            style={{
              width: isCollapsed ? "60px" : "600px",
              maxWidth: "600px",
            }}
          >
            <DetailedViewContent
              cell={cell}
              history={history}
              isCollapsed={isCollapsed}
              setIsCollapsed={setIsCollapsed}
              onChange={onChange}
            />

            {/* Collapsed State Indicator */}
            {isCollapsed && (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-8 h-8 bg-[#bb9c2d]/20 rounded-lg flex items-center justify-center mb-2">
                    <span className="text-[#bb9c2d] text-lg font-bold">M</span>
                  </div>
                  <div className="text-xs text-[#7c8796] font-medium">
                    Analysis
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
