'use client';

import { useState, useEffect } from 'react';
import { Market } from '@/lib/types';
import { MarketRow } from '@/components/features/markets/market-row';
import { MarketTableHeader } from '@/components/features/markets/market-table-header';
import { MarketTableFilters } from '@/components/features/markets/market-table-filters';
import { RefreshCw, } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface MarketTableProps {
  markets: Market[];
  isLoading?: boolean;
  onRefresh?: () => void;
}

export function MarketTable({ markets, isLoading = false, onRefresh }: MarketTableProps) {
  const t = useTranslations('markets');
  const [selectedFilter, setSelectedFilter] = useState<'ACTIVE' | 'RESOLVED' | 'ALL'>('ACTIVE');
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  useEffect(() => {
    setLastUpdate(new Date());
  }, []);

  const handleRefresh = () => {
    setLastUpdate(new Date());
    onRefresh?.();
  };

  const filteredMarkets = markets.filter(market => {
    if (selectedFilter === 'ALL') { return true; }
    if (selectedFilter === 'ACTIVE') { return !market.resolved; }
    if (selectedFilter === 'RESOLVED') { return market.resolved; }
    return true;
  }).sort((a, b) => {
    if (selectedFilter === 'ALL') {
      if (a.resolved && !b.resolved) { return 1; }
      if (!a.resolved && b.resolved) { return -1; }
    }
    return 0;
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
          <MarketTableFilters
            selectedFilter={selectedFilter}
            onFilterChange={setSelectedFilter}
          />
        </div>
      </div>

      {/* Table */}
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

      {/* Footer */}
      <div className="flex items-center justify-between mt-3 px-2">
        <div className="text-xs font-mono text-muted-foreground">
          {t('showing', { count: filteredMarkets.length })}
        </div>
      </div>
    </div>
  );
}
