'use client';

import { useEffect } from 'react';
import { Market } from '@/lib/types';
import { MarketRow } from '@/components/features/markets/market-row';
import { MarketTableHeader } from '@/components/features/markets/market-table-header';
import { MarketStatusFilter } from '@/components/features/markets/market-status-filter';
import { MarketSortingDropdown } from '@/components/features/markets/market-sorting-dropdown';
import { OptionsViewMode } from '@/components/features/markets/options-view-mode';
import { MarketViewModeSelector } from '@/components/features/markets/market-view-mode-selector';
import { MarketCardsGrid } from '@/components/features/markets/market-cards-grid';
import { MarketAdvancedFilters } from '@/components/features/markets/market-advanced-filters';
import { MarketFilterButton } from '@/components/features/markets/market-filter-button';
import { useTableOptionsStore } from '@/stores';
import { RefreshCw, } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface MarketTableProps {
  markets: Market[];
  isLoading?: boolean;
  onRefresh?: () => void;
}

export function MarketTable({ markets, isLoading = false, onRefresh }: MarketTableProps) {
  const t = useTranslations('markets');
  const {
    statusFilter,
    selectedSort,
    setSelectedSort,
    searchQuery,
    timeFrameFilter,
    liquidityFilter,
    hideIlliquidMarkets,
    showAdvancedFilters,
    lastUpdate,
    setLastUpdate,
    viewMode
  } = useTableOptionsStore();

  useEffect(() => {
    setLastUpdate(new Date());
  }, [setLastUpdate]);

  const handleRefresh = () => {
    setLastUpdate(new Date());
    onRefresh?.();
  };

  const filteredMarkets = markets.filter(market => {
    // Status filter
    let statusMatch = true;
    if (statusFilter === 'ACTIVE') { statusMatch = !market.resolved; }
    if (statusFilter === 'RESOLVED') { statusMatch = market.resolved; }

    // Search filter
    let searchMatch = true;
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      searchMatch = market.title.toLowerCase().includes(query);
    }

    // Timeframe filter
    let timeFrameMatch = true;
    if (timeFrameFilter !== 'all') {
      const now = new Date();
      const endDate = new Date(market.end_date);
      const hoursUntilEnd = (endDate.getTime() - now.getTime()) / (1000 * 60 * 60);

      switch (timeFrameFilter) {
        case '24h':
          timeFrameMatch = hoursUntilEnd <= 24;
          break;
        case '7d':
          timeFrameMatch = hoursUntilEnd <= 168; // 7 * 24
          break;
        case '30d':
          timeFrameMatch = hoursUntilEnd <= 720; // 30 * 24
          break;
      }
    }

    // Liquidity filter
    let liquidityMatch = true;
    if (liquidityFilter !== 'any' && market.limit) {
      const minLiquidity = {
        '10k': 10000,
        '50k': 50000,
        '100k': 100000,
      }[liquidityFilter] || 0;

      liquidityMatch = market.limit >= minLiquidity;
    }

    // Hide illiquid markets filter
    let illiquidMatch = true;
    if (hideIlliquidMarkets) {
      illiquidMatch = market.limit ? market.limit >= 10000 : false; // Consider <10k as illiquid
    }

    return statusMatch && searchMatch && timeFrameMatch && liquidityMatch && illiquidMatch;
  }).sort((a, b) => {
    // First apply filter-based sorting
    if (statusFilter === 'ALL') {
      if (a.resolved && !b.resolved) { return 1; }
      if (!a.resolved && b.resolved) { return -1; }
    }

    // Then apply user-selected sorting
    switch (selectedSort) {
      case 'expiringSoon':
        return new Date(a.end_date).getTime() - new Date(b.end_date).getTime();
      case 'expiringLater':
        return new Date(b.end_date).getTime() - new Date(a.end_date).getTime();
      case 'alphabetical':
        return a.title.localeCompare(b.title);
      case 'highestLiquidity':
        return (b.limit || 0) - (a.limit || 0);
      default:
        return 0;
    }
  });

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <div className="w-full bg-background">
      {/* Header Section */}
      <div className="flex items-center justify-between mb-4 px-2">
        <div className="flex items-center gap-3">
          <h1 className="text-lg font-mono font-bold text-foreground">
            {t('title')}
          </h1>
          <div className="text-xs font-mono text-muted-foreground">
            {t('lastUpdate')}: {lastUpdate ? formatTime(lastUpdate) : '--:--:--'}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleRefresh}
            className="p-2 hover:bg-muted rounded transition-colors cursor-pointer"
            disabled={isLoading}
          >
            <RefreshCw className={`w-4 h-4 text-foreground ${isLoading ? 'animate-spin' : ''}`} />
          </button>
          <OptionsViewMode />
          <MarketFilterButton />
          <MarketViewModeSelector />
          <MarketStatusFilter />
          <MarketSortingDropdown
            selectedSort={selectedSort}
            onSortChange={setSelectedSort}
          />
        </div>
      </div>

      {/* Advanced Filters Section */}
      {showAdvancedFilters && (
        <div className="mb-4 px-2">
          <MarketAdvancedFilters />
        </div>
      )}

      {/* Content based on view mode */}
      {viewMode === 'table' ? (
        <div className="border border-border rounded-lg overflow-hidden">
          <MarketTableHeader />

          <div className="divide-y divide-border h-[calc(100vh-220px)] overflow-y-auto">
            {isLoading ? (
              <div className="p-8 text-center text-muted-foreground font-mono">
                {t('loading')}
              </div>
            ) : filteredMarkets.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground font-mono">
                {t('noMarkets')}
              </div>
            ) : (
              filteredMarkets.map((market, index) => (
                <MarketRow
                  key={`${market.slug}-${index}`}
                  market={market}
                />
              ))
            )}
          </div>
        </div>
      ) : (
        <div className="h-[calc(100vh-185px)] overflow-y-auto">
          {isLoading ? (
            <div className="p-8 text-center text-muted-foreground font-mono">
              {t('loading')}
            </div>
          ) : filteredMarkets.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground font-mono">
              {t('noMarkets')}
            </div>
          ) : (
            <MarketCardsGrid markets={filteredMarkets} />
          )}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between mt-3 px-2">
        <div className="text-xs font-mono text-muted-foreground">
          {t('showing', { count: filteredMarkets.length })}
        </div>
      </div>
    </div>
  );
}
