'use client';

import { X, RotateCcw, Clock, DollarSign, Eye, TrendingUp } from 'lucide-react';
import { useMarketOptionsStore, TimeFrameFilter, LiquidityFilter, VolumeFilter } from '@/stores';
import { useTranslations } from 'next-intl';
import { Dropdown, DropdownOption } from '@/components/ui/dropdown';

export function MarketAdvancedFilters() {
  const t = useTranslations('markets.advancedFilters');

  const {
    timeFrameFilter,
    setTimeFrameFilter,
    liquidityFilter,
    setLiquidityFilter,
    volumeFilter,
    setVolumeFilter,
    hideIlliquidMarkets,
    setHideIlliquidMarkets,
    showMovers10Percent,
    setShowMovers10Percent,
    setShowAdvancedFilters,
  } = useMarketOptionsStore();

  const timeFrameOptions: DropdownOption[] = [
    { key: 'all', label: t('timeframes.all') },
    { key: '24h', label: t('timeframes.24h') },
    { key: '7d', label: t('timeframes.7d') },
    { key: '30d', label: t('timeframes.30d') },
  ];

  const liquidityOptions: DropdownOption[] = [
    { key: 'any', label: t('liquidity.any') },
    { key: '10k', label: t('liquidity.10k') },
    { key: '50k', label: t('liquidity.50k') },
    { key: '100k', label: t('liquidity.100k') },
  ];

  const volumeOptions: DropdownOption[] = [
    { key: 'any', label: t('volume.any') },
    { key: '2_5k', label: t('volume.2_5k') },
    { key: '5k', label: t('volume.5k') },
    { key: '10k', label: t('volume.10k') },
  ];

  const handleReset = () => {
    setTimeFrameFilter('all');
    setLiquidityFilter('any');
    setVolumeFilter('any');
    setHideIlliquidMarkets(false);
    setShowMovers10Percent(false);
  };

  const handleClose = () => {
    setShowAdvancedFilters(false);
  };

  return (
    <div className="w-full bg-background border border-border rounded-lg p-3">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xs font-mono font-medium text-foreground">{t('title')}</h3>
        <div className="flex items-center gap-2">
          <button
            onClick={handleReset}
            className="flex items-center gap-1 px-2 py-1 text-xs font-mono 
            text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            {t('reset')}
          </button>
          <button
            onClick={handleClose}
            className="p-1 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Filters Row */}
      <div className="flex flex-col md:flex-row gap-4">
        {/* Timeframe Filter */}
        <div className="flex-1">
          <label className="flex items-center gap-1 text-[10px] font-mono text-muted-foreground mb-1">
            <Clock className="w-3 h-3" />
            {t('expiryTimeframe')}
          </label>
          <Dropdown
            options={timeFrameOptions}
            selectedOption={timeFrameFilter}
            onOptionChange={(key) => setTimeFrameFilter(key as TimeFrameFilter)}
            className="w-full"
          />
        </div>

        {/* Liquidity Filter */}
        <div className="flex-1">
          <label className="flex items-center gap-1 text-[10px] font-mono text-muted-foreground mb-1">
            <DollarSign className="w-3 h-3" />
            {t('minLiquidity')}
          </label>
          <Dropdown
            options={liquidityOptions}
            selectedOption={liquidityFilter}
            onOptionChange={(key) => setLiquidityFilter(key as LiquidityFilter)}
            className="w-full"
          />
        </div>

        {/* Volume Filter */}
        <div className="flex-1">
          <label className="flex items-center gap-1 text-[10px] font-mono text-muted-foreground mb-1">
            <TrendingUp className="w-3 h-3" />
            {t('minVolume')}
          </label>
          <Dropdown
            options={volumeOptions}
            selectedOption={volumeFilter}
            onOptionChange={(key) => setVolumeFilter(key as VolumeFilter)}
            className="w-full"
          />
        </div>

        {/* Checkboxes Column */}
        <div className="flex-1 flex flex-col gap-3">
          {/* Hide Illiquid Markets Checkbox */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setHideIlliquidMarkets(!hideIlliquidMarkets)}>
            <input
              type="checkbox"
              id="hideIlliquid"
              checked={hideIlliquidMarkets}
              onChange={(e) => {
                setHideIlliquidMarkets(e.target.checked);
                e.target.blur();
              }}
              className="w-4 h-4 text-orange-500 bg-secondary-background border-border rounded focus:ring-orange-500 focus:ring-2 cursor-pointer"
            />
            <label htmlFor="hideIlliquid" className="flex items-center gap-1 text-[10px] font-mono text-muted-foreground cursor-pointer">
              <Eye className="w-3 h-3" />
              {t('hideIlliquidMarkets')}
            </label>
          </div>

          {/* Movers 10% Checkbox */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setShowMovers10Percent(!showMovers10Percent)}>
            <input
              type="checkbox"
              id="showMovers"
              checked={showMovers10Percent}
              onChange={(e) => {
                setShowMovers10Percent(e.target.checked);
                e.target.blur();
              }}
              className="w-4 h-4 text-orange-500 bg-secondary-background border-border rounded focus:ring-orange-500 focus:ring-2 cursor-pointer"
            />
            <label htmlFor="showMovers" className="flex items-center gap-1 text-[10px] font-mono text-muted-foreground cursor-pointer">
              <TrendingUp className="w-3 h-3" />
              {t('showMovers10Percent')}
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
