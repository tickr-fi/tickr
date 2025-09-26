'use client';

import { RefreshCw } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { MarketStatusFilter } from './market-status-filter';
import { MarketSortingDropdown, type SortOption } from './market-sorting-dropdown';
import { OptionsViewMode } from './options-view-mode';
import { MarketViewModeSelector } from './market-view-mode-selector';
import { MarketAdvancedFilters } from './market-advanced-filters';
import { MarketFilterButton } from './market-filter-button';
import { MobileMenuButton } from './mobile-menu-button';

interface MarketHeaderProps {
  lastUpdate?: Date;
  isLoading?: boolean;
  onRefresh?: () => void;
  selectedSort: SortOption;
  onSortChange: (sort: SortOption) => void;
  showAdvancedFilters?: boolean;
}

export function MarketHeader({
  lastUpdate,
  isLoading = false,
  onRefresh,
  selectedSort,
  onSortChange,
  showAdvancedFilters = false
}: MarketHeaderProps) {
  const t = useTranslations('markets');

  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <>
      {/* Header Section */}
      <div className="flex items-center justify-between mb-4 px-2">
        <div className="flex items-center gap-3">
          <h1 className="text-lg font-mono font-bold text-foreground">
            {t('title')}
          </h1>
          <div className="hidden lg:block text-xs font-mono text-muted-foreground">
            {t('lastUpdate')}: {lastUpdate ? formatTime(lastUpdate) : '--:--:--'}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onRefresh}
            className="p-2 hover:bg-muted rounded transition-colors cursor-pointer"
            disabled={isLoading}
          >
            <RefreshCw className={`w-4 h-4 text-foreground ${isLoading ? 'animate-spin' : ''}`} />
          </button>
          
          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center gap-2">
            <OptionsViewMode />
            <MarketFilterButton />
            <MarketViewModeSelector />
            <MarketStatusFilter />
            <MarketSortingDropdown
              selectedSort={selectedSort}
              onSortChange={onSortChange}
            />
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <MobileMenuButton />
          </div>
        </div>
      </div>

      {/* Advanced Filters Section */}
      {showAdvancedFilters && (
        <div className="mb-4 px-2">
          <MarketAdvancedFilters />
        </div>
      )}
    </>
  );
}
