'use client';

import { Filter } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useMarketOptionsStore } from '@/stores';

export function MarketFilterButton() {
  const t = useTranslations('markets.advancedFilters');
  const {
    timeFrameFilter,
    liquidityFilter,
    volumeFilter,
    hideIlliquidMarkets,
    showMovers10Percent,
    showAdvancedFilters,
    setShowAdvancedFilters,
  } = useMarketOptionsStore();

  const hasActiveFilters = timeFrameFilter !== 'all' || liquidityFilter !== 'any' ||
    volumeFilter !== 'any' || hideIlliquidMarkets || showMovers10Percent;

  return (
    <div className="inline-flex bg-secondary rounded-md p-0.5">
      <button
        onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
        className={`flex items-center gap-1.5 px-2 py-1.5 text-xs font-mono
          font-medium transition-all duration-200 rounded-sm cursor-pointer ${hasActiveFilters
            ? 'bg-primary text-primary-foreground shadow-sm'
            : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
          }`}
        title={t('button')}
      >
        <Filter className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">{t('button')}</span>
      </button>
    </div>
  );
}
