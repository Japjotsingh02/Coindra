"use client";

import { Card, CardContent } from "@/components/ui/card";
import {
  TrendingUp,
  BarChart3,
  ArrowUpDown,
  CheckCircle2,
  Circle,
  Sparkles,
} from "lucide-react";
import { useState, useEffect, useMemo, Fragment } from "react";
import { useAppStore } from "@/store/useAppStore";
import { motion, AnimatePresence } from "framer-motion";
import { Filters } from "@/types/store.types";
import { analysisConfig, SectionArray } from "@/lib/analysisConfig";

export type FilterKey = "volatility" | "liquidity" | "performance";

const LegendGrid = (items: SectionArray[0]["items"]) =>
  items.map((item, index) => {
    if (item.variant === "sparkline") {
      return (
        <motion.div
          key={item.label}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.3 }}
          className="p-3 bg-gradient-to-br from-surface to-surface-border rounded-xl border border-surface-ring"
        >
          <div className="space-y-3">
            <div className="text-center">
              <div className="text-sm font-semibold text-label mb-2">
                {item.label}
              </div>
              <div className="text-xs text-muted-secondary mb-3">
                {item.description}
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-center space-x-6">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-xs text-green-400">Positive</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-600 rounded-full"></div>
                  <span className="text-xs text-red-400">Negative</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                  <span className="text-xs text-gray-400">Neutral</span>
                </div>
              </div>
              
              <div className="w-full h-8 bg-surface-border rounded-lg border border-surface-ring flex items-center justify-center relative overflow-hidden">
                <motion.div
                  className="w-20 h-1 bg-gradient-to-r from-green-500 via-red-600 to-gray-400 rounded-full"
                  animate={{ 
                    scaleX: [1, 1.1, 1], 
                    opacity: [0.7, 1, 0.7] 
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              </div>
            </div>
          </div>
        </motion.div>
      );
    }

    if (item.variant === "dot") {
      return (
        <motion.div
          key={item.label}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 + index * 0.1, duration: 0.3 }}
          className="flex items-center space-x-2 p-2 rounded-lg hover:bg-surface-ring/50 transition-colors"
        >
          <div
            className={`w-4 h-4 rounded ${item.color} ${item.text}`}
          ></div>
          <span className="text-xs text-muted-secondary">
            {item.label}
          </span>
        </motion.div>
      );
    }

    return (
      <motion.div
        key={item.label}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: index * 0.1, duration: 0.3 }}
        className="group relative overflow-hidden rounded-xl border border-surface-ring bg-gradient-to-br from-surface to-surface-border p-3 hover:border-brand/30 transition-all duration-300"
      >
        <div className="flex items-center space-x-3">
          {item.icon ? (
            <div
              className={`w-8 h-8 rounded-lg bg-gradient-to-br ${item.color} flex items-center justify-center text-lg`}
            >
              {item.icon}
            </div>
          ) : item.bg ? (
            <div
              className={`w-8 h-8 rounded-lg bg-gradient-to-t ${item.color} flex items-center justify-center`}
            >
              <div className={`w-4 h-4 rounded ${item.bg}`}></div>
            </div>
          ) : (
            <div
              className={`w-4 h-4 rounded ${item.color || "bg-gray-400"}`}
            ></div>
          )}
          <div className="flex-1">
            <div
              className={`text-xs 2xl:text-sm font-semibold ${item.text || "text-label"}`}
            >
              {item.label}
            </div>
            {item.description && (
              <div className="text-[10px] 2xl:text-xs text-muted-secondary">
                {item.description}
              </div>
            )}
          </div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
      </motion.div>
    );
  });

const AnalysisSection = ({
  id,
  filters,
  handleFilterToggle,
}: {
  id: FilterKey;
  filters: Filters;
  handleFilterToggle: (key: FilterKey) => void;
}) => {
  const {
    icon: Icon,
    title,
    subtitle,
    description,
    sections,
  } = analysisConfig[id];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-4"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-brand/10 rounded-lg">
            <Icon className="h-5 w-5 text-brand" />
          </div>
          <div>
            <h5 className="font-semibold text-label">{title}</h5>
            <p className="text-xs text-muted-secondary">{subtitle}</p>
          </div>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleFilterToggle(id)}
          className={`flex items-center gap-1 2xl:gap-2 px-2.5 py-1.5 2xl:px-3 2xl:py-2 rounded-md 2xl:rounded-lg transition-all duration-200 ${
            filters[id]
              ? "bg-brand text-white"
              : "bg-surface-border text-muted-secondary hover:bg-surface-ring"
          }`}
        >
          {filters[id] ? (
            <CheckCircle2 className="h-3 w-3 2xl:h-4 2xl:w-4" />
          ) : (
            <Circle className="h-3 w-3 2xl:h-4 2xl:w-4" />
          )}
          <span className="text-[10px] 2xl:text-xs font-medium">Enabled</span>
        </motion.button>
      </div>

      {sections.map((section) => (
        <Fragment key={section.title}>
          {section.icon ? (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1, duration: 0.3 }}
              className="p-4 bg-gradient-to-br from-surface to-surface-border rounded-xl border border-surface-ring"
            >
              <div className="flex items-center gap-2 mb-3">
                <section.icon className="h-4 w-4 text-brand" />
                <span className="text-sm font-semibold text-label">
                  {section.title}
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {LegendGrid(section.items)}
              </div>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {LegendGrid(section.items)}
            </div>
          )}
        </Fragment>
      ))}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.3 }}
        className="p-4 bg-gradient-to-r from-brand/5 to-transparent rounded-lg border border-brand/20"
      >
        <p className="text-xs 2xl:text-sm text-muted-secondary leading-relaxed">
          <Sparkles className="inline h-4 w-4 mr-2 text-brand" />
          {description}
        </p>
      </motion.div>
    </motion.div>
  );
};

export function VisualizationLegend() {
  const { viewMode, filters, setFilters } = useAppStore();
  const [activeTab, setActiveTab] = useState<FilterKey>("volatility");

  const availableTabs = useMemo(
    () =>
      viewMode === "monthly"
        ? (["volatility", "performance"] as const)
        : (["volatility", "liquidity", "performance"] as const),
    [viewMode]
  );

  useEffect(() => {
    if (!(availableTabs as readonly string[]).includes(activeTab)) {
      setActiveTab(availableTabs[0]);
    }
  }, [viewMode, activeTab, availableTabs]);

  const handleFilterToggle = (filterType: keyof typeof filters) => {
    if (filterType === "symbol" || filterType === "dateRange") return;

    setFilters({
      [filterType]: !filters[filterType],
    });
  };

  const tabs: Array<{
    id: "volatility" | "liquidity" | "performance";
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    color: string;
    description: string;
    enabled: boolean;
  }> = [
    {
      id: "volatility",
      label: "Volatility",
      icon: TrendingUp,
      color: "text-brand",
      description: "Price fluctuation intensity",
      enabled: filters.volatility,
    },
    {
      id: "liquidity",
      label: "Liquidity",
      icon: BarChart3,
      color: "text-muted-secondary",
      description: "Trading volume patterns",
      enabled: filters.liquidity,
    },
    {
      id: "performance",
      label: "Performance",
      icon: ArrowUpDown,
      color: "text-muted-secondary",
      description: "Price change direction",
      enabled: filters.performance,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="bg-gradient-to-br from-surface to-surface-border border-surface-ring shadow-xl">
        <CardContent className="px-4 sm:px-6 xl:px-5 2xl:px-6 pt-1 pb-10">
          <div className="flex items-center justify-between mb-7">
            <div>
              <h4 className="font-semibold text-label">Data Visualization Guide</h4>
              <p className="text-xs 2xl:text-sm text-muted-secondary">
                Understanding the {viewMode} view indicators
              </p>
            </div>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="p-2 bg-brand/10 rounded-lg"
            >
              <Sparkles className="h-4 w-4 2xl:h-5 2xl:w-5 text-brand" />
            </motion.div>
          </div>

          <div className="flex flex-wrap gap-2 mb-6 p-1 bg-surface-ring rounded-xl border border-surface-ring">
            {tabs
              .filter((tab) =>
                (availableTabs as readonly string[]).includes(tab.id)
              )
              .map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <motion.button
                    key={tab.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setActiveTab(tab.id)}
                    className={`relative flex items-center justify-center gap-2 px-4 py-1.5 2xl:py-2 rounded-lg transition-all duration-300 basis-[calc(50%-4px)] sm:basis-auto flex-1 ${
                      isActive
                        ? "bg-brand text-white shadow-lg shadow-brand/25"
                        : "text-muted-secondary hover:text-label hover:bg-surface-ring/50"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="text-xs 2xl:text-sm font-medium">{tab.label}</span>
                    {isActive && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute inset-0 bg-brand rounded-lg -z-10"
                        transition={{
                          type: "spring",
                          stiffness: 300,
                          damping: 30,
                        }}
                      />
                    )}
                  </motion.button>
                );
              })}
          </div>

          {/* Tab Content */}
          <div>
            <AnimatePresence mode="wait">
              <AnalysisSection
                id={activeTab}
                filters={filters}
                handleFilterToggle={handleFilterToggle}
              />
            </AnimatePresence>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
