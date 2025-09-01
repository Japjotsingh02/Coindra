"use client";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { DateRangeFilter } from "../dateRangeFilter/DateRangeFilter";
import { useAppStore } from "@/store/useAppStore";
import { fetchSymbols } from "@/lib/binance";
import { Filters } from "@/types/store.types";
import { ThemeToggle } from "@/components/uielements/themeToggle/theme-toggle";

function SymbolSelector({
  filters,
  symbols,
  isLoading,
  updateFilter,
}: {
  filters: Filters;
  symbols: string[];
  isLoading: boolean;
  updateFilter: <K extends keyof Filters>(key: K, value: Filters[K]) => void;
}) {
  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-muted-secondary tracking-wide uppercase block">
        Trading Pair
      </label>
      <Select
        value={filters.symbol}
        defaultValue={symbols?.[0] || undefined}
        onValueChange={(value) => updateFilter("symbol", value)}
      >
        <SelectTrigger
          className={`w-full rounded border border-surface-border bg-background-input px-3 py-2.5 ${
            filters.symbol ? "text-brand" : "text-ash"
          } text-base font-medium transition-all duration-200 hover:border-brand/30 focus:border-brand focus:ring-1 focus:ring-brand/20 h-11!`}
        >
          <SelectValue placeholder="Choose trading pair" />
        </SelectTrigger>

        <SelectContent className="bg-background-input border border-surface-border rounded-lg shadow-xl">
          {isLoading ? (
            <SelectItem
              disabled
              value="loading"
              className="text-ash text-sm bg-background-input hover:bg-surface-light cursor-not-allowed"
            >
              Loading pairs...
            </SelectItem>
          ) : (
            symbols?.map((symbol) => (
              <SelectItem
                key={symbol}
                value={symbol}
                className="text-ash text-sm bg-background-input hover:bg-surface-light hover:text-brand transition-colors cursor-pointer"
              >
                {symbol}
              </SelectItem>
            ))
          )}
        </SelectContent>
      </Select>
    </div>
  );
}

function FilterCheckboxes({
  filters,
  updateFilter,
}: {
  filters: Filters;
  updateFilter: <K extends keyof Filters>(key: K, value: Filters[K]) => void;
}) {
  const options = ["volatility", "liquidity", "performance"];

  return (
    <div>
      {options.map((key) => (
        <div key={key} className="flex items-center gap-3 py-3">
          <Checkbox
            id={key}
            checked={!!filters[key as keyof typeof filters]}
            onCheckedChange={(checked) =>
              updateFilter(key as keyof typeof filters, checked)
            }
            className="h-6 w-6 [&_svg]:h-4 [&_svg]:w-4 [&_svg]:stroke-brand [&_svg]:!fill-transparent border-2 border-surface-border data-[state=checked]:bg-transparent data-[state=checked]:border-surface-border"
          />
          <label
            htmlFor={key}
            className="text-xl font-medium capitalize leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-label"
          >
            {key}
          </label>
        </div>
      ))}
    </div>
  );
}

export default function Sidebar() {
  const { filters, setFilters } = useAppStore();

  const { data: symbols, isLoading } = useQuery<string[]>({
    queryKey: ["symbols"],
    queryFn: fetchSymbols,
  });
  
  // useEffect(() => {
  //   if (symbols) setFilters({ "symbol": symbols[0] });
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [symbols]);

  const updateFilter = <K extends keyof Filters>(key: K, value: Filters[K]) => {
    const updated = { ...filters, [key]: value };
    setFilters(updated);
  };

  const handleDateChange = (range: { start: Date; end: Date }) => {
    updateFilter("dateRange", {
      startDate: range.start,
      endDate: range.end,
    });
  };

  return (
    <aside className="w-sm bg-background-sidebar text-label p-6 flex flex-col gap-8 rounded-xl shadow-2xl border border-surface-border backdrop-blur-sm">
      <div className="flex items-center justify-between pb-4">
        <div className="flex items-center gap-1">
          <div className="w-8 h-8 md:w-6 md:h-6 antialiased">
            <Image 
              src="/logo.svg" 
              alt="Coindra Logo"
              height={20}
              width={20}
              loading="lazy"
            />
          </div>
          <h2 className="text-brand tracking-wide font-sans">Coindra</h2>
        </div>
        <ThemeToggle />
      </div>

      <div className="space-y-6">
        <SymbolSelector
          filters={filters}
          symbols={symbols || []}
          isLoading={isLoading}
          updateFilter={updateFilter}
        />

        <div className="space-y-3">
          <label className="text-sm font-medium text-muted-secondary tracking-wide uppercase block">
            Data Filters
          </label>
          <FilterCheckboxes filters={filters} updateFilter={updateFilter} />
        </div>

        <div className="space-y-3">
          <label className="text-sm font-medium text-muted-secondary tracking-wide uppercase block">
            Date Range
          </label>
          <DateRangeFilter
            onChange={(range: { start: Date; end: Date }) => handleDateChange(range)}
            initialRange={{
              start: filters.dateRange.startDate,
              end: filters.dateRange.endDate,
            }}
          />
        </div>
      </div>
    </aside>
  );
}
