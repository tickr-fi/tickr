'use client';

import { X, RotateCcw, Clock, DollarSign, Eye, TrendingUp } from 'lucide-react';
import { usePremarketOptionsStore, PremarketTimeFrameFilter, PremarketFundingFilter, PremarketProgressFilter } from '@/stores';
import { useTranslations } from 'next-intl';
import { Dropdown, DropdownOption } from '@/components/ui/dropdown';

export function PremarketAdvancedFilters() {
  const t = useTranslations('premarkets.advancedFilters');

  const {
    timeFrameFilter,
    setTimeFrameFilter,
    fundingFilter,
    setFundingFilter,
    progressFilter,
    setProgressFilter,
    hideIlliquidMarkets,
    setHideIlliquidMarkets,
    setShowAdvancedFilters,
  } = usePremarketOptionsStore();

  const timeFrameOptions: DropdownOption[] = [
    { key: 'all', label: t('timeframes.all') },
    { key: '24h', label: t('timeframes.24h') },
    { key: '7d', label: t('timeframes.7d') },
    { key: '30d', label: t('timeframes.30d') },
  ];

  const fundingOptions: DropdownOption[] = [
    { key: 'any', label: t('funding.any') },
    { key: '1k', label: t('funding.1k') },
    { key: '5k', label: t('funding.5k') },
    { key: '10k', label: t('funding.10k') },
  ];

  const progressOptions: DropdownOption[] = [
    { key: 'any', label: t('progress.any') },
    { key: '25', label: t('progress.25') },
    { key: '50', label: t('progress.50') },
    { key: '75', label: t('progress.75') },
  ];

  const handleReset = () => {
    setTimeFrameFilter('all');
    setFundingFilter('any');
    setProgressFilter('any');
    setHideIlliquidMarkets(false);
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
        {/* Deadline Timeframe Filter */}
        <div className="flex-1">
          <label className="flex items-center gap-1 text-[10px] font-mono text-muted-foreground mb-1">
            <Clock className="w-3 h-3" />
            {t('deadlineTimeframe')}
          </label>
          <Dropdown
            options={timeFrameOptions}
            selectedOption={timeFrameFilter}
            onOptionChange={(key) => setTimeFrameFilter(key as PremarketTimeFrameFilter)}
            className="w-full"
          />
        </div>

        {/* Min Funding Filter */}
        <div className="flex-1">
          <label className="flex items-center gap-1 text-[10px] font-mono text-muted-foreground mb-1">
            <DollarSign className="w-3 h-3" />
            {t('minFunding')}
          </label>
          <Dropdown
            options={fundingOptions}
            selectedOption={fundingFilter}
            onOptionChange={(key) => setFundingFilter(key as PremarketFundingFilter)}
            className="w-full"
          />
        </div>

        {/* Min Progress Filter */}
        <div className="flex-1">
          <label className="flex items-center gap-1 text-[10px] font-mono text-muted-foreground mb-1">
            <TrendingUp className="w-3 h-3" />
            {t('minProgress')}
          </label>
          <Dropdown
            options={progressOptions}
            selectedOption={progressFilter}
            onOptionChange={(key) => setProgressFilter(key as PremarketProgressFilter)}
            className="w-full"
          />
        </div>

        {/* Checkboxes Column */}
        <div className="flex-1 flex flex-col">          
          {/* Spacer to push checkbox to bottom */}
          <div className="flex-1"></div>
          
          {/* Hide Illiquid Markets Checkbox */}
          <div className="flex items-center gap-2 mb-2">
            <input
              type="checkbox"
              id="hideIlliquidPremarkets"
              checked={hideIlliquidMarkets}
              onChange={(e) => {
                setHideIlliquidMarkets(e.target.checked);
                e.target.blur();
              }}
              className="w-4 h-4 text-orange-500 bg-secondary-background border-border rounded focus:ring-orange-500 focus:ring-2 cursor-pointer"
            />
            <label 
              htmlFor="hideIlliquidPremarkets" 
              className="flex items-center gap-1 text-[10px] font-mono text-muted-foreground cursor-pointer"
            >
              <Eye className="w-3 h-3" />
              {t('hideIlliquidMarkets')}
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
