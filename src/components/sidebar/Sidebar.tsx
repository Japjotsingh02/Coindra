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
      <label className="text-sm font-medium text-[#7c8796] tracking-wide uppercase block">
        Trading Pair
      </label>
      <Select
        value={filters.symbol}
        defaultValue={symbols?.[0] || undefined}
        onValueChange={(value) => updateFilter("symbol", value)}
      >
        <SelectTrigger
          className={`w-full rounded border border-[#1e2126] bg-[#16171E] px-3 py-2.5 ${
            filters.symbol ? "text-[#bb9c2d]" : "text-[#aaabac]"
          } text-base font-medium transition-all duration-200 hover:border-[#bb9c2d]/30 focus:border-[#bb9c2d] focus:ring-1 focus:ring-[#bb9c2d]/20 h-11!`}
        >
          <SelectValue placeholder="Choose trading pair" />
        </SelectTrigger>

        <SelectContent className="bg-[#16171E] border border-[#1e2126] rounded-lg shadow-xl">
          {isLoading ? (
            <SelectItem
              disabled
              value="loading"
              className="text-[#aaabac] text-sm bg-[#16171E] hover:bg-[#1e1f26] cursor-not-allowed"
            >
              Loading pairs...
            </SelectItem>
          ) : (
            symbols?.map((symbol) => (
              <SelectItem
                key={symbol}
                value={symbol}
                className="text-[#aaabac] text-sm bg-[#16171E] hover:bg-[#1e1f26] hover:text-[#bb9c2d] transition-colors cursor-pointer"
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
            className="h-6 w-6 [&_svg]:h-4 [&_svg]:w-4 [&_svg]:stroke-[#bb9c2d] [&_svg]:!fill-transparent border-2 border-[#1e2126] data-[state=checked]:bg-transparent data-[state=checked]:border-[#1e2126]"
          />
          <label
            htmlFor={key}
            className="text-xl font-medium capitalize leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            {key}
          </label>
        </div>
      ))}
    </div>
  );
}

export default function Sidebar({
  onChange,
}: {
  onChange: (filters: Filters) => void;
}) {
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
    onChange(updated);
  };

  const handleDateChange = (range: { start: Date; end: Date }) => {
    updateFilter("dateRange", {
      startDate: range.start,
      endDate: range.end,
    })
  };

  return (
    <aside className="w-sm bg-[#0a0a0a] text-white p-6 flex flex-col gap-8 rounded-xl shadow-2xl border border-[#1e2126] backdrop-blur-sm">
      <div className="flex items-center pb-4 border-b border-[#1e2126]/30">
        <Image 
          src="/logo.svg" 
          alt="Coindra Logo" 
          width={40} 
          height={40} 
          className="w-10 h-10"
          priority
        />
        <h2 className="text-2xl font-bold text-[#bb9c2d] tracking-wide">Coindra</h2>
      </div>

      <div className="space-y-6">
        <SymbolSelector
          filters={filters}
          symbols={symbols || []}
          isLoading={isLoading}
          updateFilter={updateFilter}
        />

        <div className="space-y-3">
          <label className="text-sm font-medium text-[#7c8796] tracking-wide uppercase block">
            Data Filters
          </label>
          <FilterCheckboxes filters={filters} updateFilter={updateFilter} />
        </div>

        <div className="space-y-3">
          <label className="text-sm font-medium text-[#7c8796] tracking-wide uppercase block">
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
