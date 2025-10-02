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
    <button
      onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
      className={`flex items-center gap-2 px-3 py-1.5 text-xs font-mono font-medium transition-colors rounded cursor-pointer ${hasActiveFilters
        ? 'bg-orange-500 text-white hover:bg-orange-600'
        : 'bg-secondary-background text-muted-foreground hover:bg-muted hover:text-foreground'
        }`}
    >
      <Filter className="w-3 h-3" />
      {t('button')}
    </button>
  );
}
