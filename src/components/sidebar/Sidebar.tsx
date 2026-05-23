'use client';
import { cn } from '@/lib/utils';
import { ui } from '@/lib/ui-styles';
import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { DateRangeFilter } from '../dateRangeFilter/DateRangeFilter';
import { useAppStore } from '@/store/useAppStore';
import { fetchSymbols } from '@/lib/binance';
import { Filters } from '@/types/store.types';
import { ThemeToggle } from '../elements/themeToggle/ThemeToggle';
import { SidebarSection } from '../elements/sidebarSection/SidebarSection';
import { Card } from '../elements/card/Card';

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
    <Select
      value={filters.symbol}
      defaultValue={symbols?.[0] || undefined}
      onValueChange={(value) => updateFilter('symbol', value)}
    >
      <SelectTrigger
        className={cn(
          'w-full h-8! 2xl:h-11! text-[10px] rounded-[4px] sm:text-xs md:text-sm xl:text-xs 2xl:text-base',
          filters.symbol ? 'text-label' : ui.muted
        )}
      >
        <SelectValue placeholder="Choose trading pair" />
      </SelectTrigger>

      <SelectContent>
        {isLoading ? (
          <SelectItem disabled value="loading" className={cn(ui.muted, 'cursor-not-allowed')}>
            Loading pairs...
          </SelectItem>
        ) : (
          symbols?.map((symbol) => (
            <SelectItem key={symbol} value={symbol} className="cursor-pointer">
              {symbol}
            </SelectItem>
          ))
        )}
      </SelectContent>
    </Select>
  );
}

function FilterCheckboxes({
  filters,
  updateFilter,
}: {
  filters: Filters;
  updateFilter: <K extends keyof Filters>(key: K, value: Filters[K]) => void;
}) {
  const options = ['volatility', 'liquidity', 'performance'];

  return (
    <div className="space-y-4">
      {options.map((key) => (
        <div key={key} className="flex items-center gap-3">
          <Checkbox
            id={key}
            checked={!!filters[key as keyof typeof filters]}
            onCheckedChange={(checked) => updateFilter(key as keyof typeof filters, checked)}
            className={cn(
              'h-5 w-5 2xl:h-6 2xl:w-6 border-2 border-[#222222]',
              'data-[state=checked]:[&_svg]:text-brand'
            )}
          />
          <label
            htmlFor={key}
            className={cn(
              'text-sm font-medium capitalize leading-none text-[#888888]',
              'peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
            )}
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
    queryKey: ['symbols'],
    queryFn: fetchSymbols,
  });

  const updateFilter = <K extends keyof Filters>(key: K, value: Filters[K]) => {
    const updated = { ...filters, [key]: value };
    setFilters(updated);
  };

  const handleDateChange = (range: { start: Date; end: Date }) => {
    updateFilter('dateRange', {
      startDate: range.start,
      endDate: range.end,
    });
  };

  return (
    <Card
      header={
        <div className="flex items-center gap-1">
          <div className="relative w-5 h-5 2xl:w-6 2xl:h-6 antialiased">
            <Image
              src="/logo.svg"
              alt="Coindra Logo"
              fill
              className="object-contain"
              loading="lazy"
            />
          </div>
          <h2 className="text-brand tracking-tight font-semibold">Coindra</h2>
        </div>
      }
      headerAction={<ThemeToggle />}
      className={cn(
        'max-w-sm w-2xs 2xl:w-sm h-full',
        'border-r backdrop-blur-xl rounded-none!',
        'text-label'
      )}
    >
      <div className="space-y-6">
        <SidebarSection label="Trading Pair">
          <SymbolSelector
            filters={filters}
            symbols={symbols || []}
            isLoading={isLoading}
            updateFilter={updateFilter}
          />
        </SidebarSection>

        <SidebarSection label="Data Filters">
          <FilterCheckboxes filters={filters} updateFilter={updateFilter} />
        </SidebarSection>

        <SidebarSection label="Date Range">
          <DateRangeFilter
            onChange={(range: { start: Date; end: Date }) => handleDateChange(range)}
            initialRange={{
              start: filters.dateRange.startDate,
              end: filters.dateRange.endDate,
            }}
          />
        </SidebarSection>
      </div>
    </Card>
  );
}
