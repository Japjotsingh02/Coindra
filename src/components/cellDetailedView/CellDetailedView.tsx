'use client';
import { cn } from '@/lib/utils';
import React, { useMemo, useState, useEffect } from 'react';
import { isToday } from 'date-fns';
import {
  getVolatilityBreakdownOption,
  getLiquidityContextOption,
  getRiskQuadrantScatterOption,
} from '@/lib/charts';
import { HeatmapCell } from '@/types/heatmap';
import ChartCard from '../elements/chartCard/ChartCard';
import { useAppStore } from '@/store/useAppStore';
import IntradayCandleStickChart from '../intradayCandleStickChart';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ui } from '@/lib/ui-styles';

interface DescriptionModalProps {
  open: boolean;
  onChange: () => void;
  cell: HeatmapCell;
  history: HeatmapCell[];
}

export const DetailedViewSummaryCard = ({ title, value }: { title: string; value: string }) => {
  return (
    <div className="text-center">
      <div className={cn(ui.sectionLabel, 'mb-1')}>{title}</div>
      <div className={cn('text-lg font-bold text-label', ui.numeric)}>{value}</div>
    </div>
  );
};

export const DetailedViewSummary = ({ cell, avgVol }: { cell: HeatmapCell; avgVol: number }) => {
  return (
    <div className="mt-6">
      <div className={cn(ui.elevated, 'p-4')}>
        <h4 className="text-lg font-semibold text-label mb-3 text-center">Quick Summary</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <DetailedViewSummaryCard
            title="Daily Volatility"
            value={cell.volatilityDaily.toFixed(2)}
          />
          <DetailedViewSummaryCard
            title="Rolling Volatility"
            value={cell.volatilityRolling?.toFixed(2) ?? 'N/A'}
          />
          <DetailedViewSummaryCard title="Avg Liquidity" value={avgVol.toFixed(0)} />
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
  isMobile,
}: {
  cell: HeatmapCell;
  history: HeatmapCell[];
  isCollapsed: boolean;
  setIsCollapsed: (isCollapsed: boolean) => void;
  onChange: () => void;
  isMobile: boolean;
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
  const avgVol = last7.reduce((sum, c) => sum + (c.liquidity ?? 0), 0) / Math.max(last7.length, 1);

  const volBreakdownOpt = useMemo(() => getVolatilityBreakdownOption(volHistory), [volHistory]);

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
        className={cn(
          'flex items-center justify-between px-4 py-3 2xl:px-6 2xl:py-5 border-b border-[#222222]',
          isCollapsed && 'justify-center'
        )}
      >
        {!isCollapsed && (
          <div className="flex items-center space-x-3">
            <h3 className="text-lg font-semibold text-label">Market Analysis</h3>
            <span className={cn(ui.elevated, 'text-xs px-2 py-1', ui.muted, ui.numeric)}>
              {cell.date}
            </span>
          </div>
        )}
        {!isMobile && (
          <div className="flex items-center gap-1.5">
            <Button
              variant="ghost"
              size="md"
              onClick={() => setIsCollapsed(!isCollapsed)}
              title={isCollapsed ? 'Expand' : 'Collapse'}
            >
              <ChevronLeft size={16} />
            </Button>
            <Button variant="ghost" size="md" onClick={onChange} title="Close">
              <X size={16} />
            </Button>
          </div>
        )}
      </div>

      <AnimatePresence mode="wait">
        {!isCollapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 overflow-y-auto"
            style={
              !isMobile
                ? {
                    overflowY: 'scroll',
                    maxHeight: 'calc(100vh - 70px)',
                  }
                : {}
            }
          >
            {/* Main Content */}
            <div className="p-4 2xl:p-6">
              {isSelectedDateToday && (
                <div className="mb-6 space-y-4">
                  <IntradayCandleStickChart symbol={symbol} />
                </div>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <ChartCard title="Volatility Breakdown" option={volBreakdownOpt} />
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

export default function CellDetailedView({ open, onChange, cell, history }: DescriptionModalProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile vs desktop
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Close panel on escape key (desktop only)
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isMobile) {
        onChange();
      }
    };

    if (open && !isMobile) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [open, onChange, isMobile]);

  // Prevent body scroll when panel is open (desktop only)
  useEffect(() => {
    if (open && !isMobile) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [open, isMobile]);

  const slideVariants = {
    hidden: {
      x: '100%',
      opacity: 0,
    },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        type: 'spring' as const,
        damping: 25,
        stiffness: 200,
      },
    },
    exit: {
      x: '100%',
      opacity: 0,
      transition: {
        type: 'spring' as const,
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
        isMobile={true}
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
            className={cn(
              'fixed top-0 right-0 h-full z-50',
              ui.panel,
              'border-l backdrop-blur-2xl shadow-2xl'
            )}
            style={{
              width: isCollapsed ? '60px' : '600px',
              maxWidth: '600px',
            }}
          >
            <DetailedViewContent
              cell={cell}
              history={history}
              isCollapsed={isCollapsed}
              setIsCollapsed={setIsCollapsed}
              isMobile={false}
              onChange={onChange}
            />

            {/* Collapsed State Indicator */}
            {isCollapsed && (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <div className={cn(ui.elevated, 'w-8 h-8 flex items-center justify-center mb-2')}>
                    <span className="text-brand text-lg font-bold">M</span>
                  </div>
                  <div className={cn('text-xs font-medium', ui.muted)}>Analysis</div>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
