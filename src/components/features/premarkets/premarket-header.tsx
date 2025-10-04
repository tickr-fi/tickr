'use client';

import { RefreshCw } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { PremarketSortingDropdown } from './premarket-sorting-dropdown';
import { PremarketAdvancedFilters } from './premarket-advanced-filters';
import { PremarketFilterButton } from './premarket-filter-button';
import { usePremarketOptionsStore } from '@/stores';

interface PremarketHeaderProps {
  lastUpdate?: Date;
  isLoading?: boolean;
  onRefresh?: () => void;
}

export function PremarketHeader({
  lastUpdate,
  isLoading = false,
  onRefresh
}: PremarketHeaderProps) {
  const t = useTranslations('premarkets');
  const { showAdvancedFilters } = usePremarketOptionsStore();

  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <>
      <div className="flex items-center justify-between mb-4 px-1">
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

          <PremarketFilterButton />

          <PremarketSortingDropdown />
        </div>
      </div>

      {/* Advanced Filters Section */}
      {showAdvancedFilters && (
        <div className="mb-4">
          <PremarketAdvancedFilters />
        </div>
      )}
    </>
  );
}
