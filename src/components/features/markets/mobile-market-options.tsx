'use client';

import { useTranslations } from 'next-intl';
import { useMarketOptionsStore } from '@/stores';
import { type SortOption } from './market-sorting-dropdown';
import { Button } from '@/components/ui';
import { Filter } from 'lucide-react';
import { useResponsiveViewMode } from '@/hooks/useResponsiveViewMode';

interface MobileMarketOptionsProps {
  selectedSort: SortOption;
  onSortChange: (sort: SortOption) => void;
  showAdvancedFilters?: boolean;
}

export function MobileMarketOptions({
  selectedSort,
  onSortChange,
}: MobileMarketOptionsProps) {
  const t = useTranslations('markets');
  const { isLargeScreen } = useResponsiveViewMode();
  const {
    statusFilter,
    setStatusFilter,
    optionsViewMode,
    setOptionsViewMode,
    viewMode,
    setViewMode,
    setShowAdvancedFilters,
    setShowMobileMenu
  } = useMarketOptionsStore();

  const displayViewMode = isLargeScreen ? viewMode : (viewMode === 'table' ? 'cards' : viewMode);

  // Handle view mode change and close mobile menu
  const handleViewModeChange = (newViewMode: 'cards' | 'grid') => {
    // On mobile, map 'cards' back to 'table' if that was the original value
    const actualViewMode = !isLargeScreen && viewMode === 'table' && newViewMode === 'cards' 
      ? 'table' 
      : newViewMode;
    setViewMode(actualViewMode);
    setShowMobileMenu(false);
  };

  // Filter options data
  const statusFilters = [
    { key: 'ACTIVE' as const, label: t('filters.active') },
    { key: 'RESOLVED' as const, label: t('filters.resolved') },
    { key: 'ALL' as const, label: t('filters.all') },
  ];

  const optionsViewModes = [
    { key: 'odds' as const, label: t('optionsViewMode.odds') },
    { key: 'prices' as const, label: t('optionsViewMode.prices') },
  ];

  const viewModes = [
    { key: 'cards' as const, label: t('viewMode.cards') },
    { key: 'grid' as const, label: t('viewMode.grid') },
  ];

  const sortOptions = [
    { key: 'expiringSoon' as const, label: t('sorting.expiringSoon') },
    { key: 'expiringLater' as const, label: t('sorting.expiringLater') },
    { key: 'alphabetical' as const, label: t('sorting.alphabetical') },
    { key: 'highestLiquidity' as const, label: t('sorting.highestLiquidity') },
  ];

  // Constants for styling
  const BUTTON_CLASSES = {
    active: 'bg-secondary text-secondary-foreground border border-secondary',
    inactive: 'bg-muted text-muted-foreground hover:bg-secondary hover:text-foreground border border-border',
  };

  // Handle show filters click
  const handleShowFilters = () => {
    setShowAdvancedFilters(true);
    setShowMobileMenu(false);
  };

  // Reusable render method for button groups
  const renderButtonGroup = <T extends string>(
    title: string,
    options: Array<{ key: T; label: string }>,
    selectedValue: T,
    onSelect: (key: T) => void,
    columns: number = 3
  ) => {
    const gridCols = columns === 2 ? 'grid-cols-2' : 'grid-cols-3';

    return (
      <div>
        <h3 className="text-xs font-mono font-medium text-muted-foreground mb-2">
          {title}
        </h3>
        <div className={`grid gap-1 ${gridCols}`}>
          {options.map((option) => (
            <button
              key={option.key}
              onClick={() => onSelect(option.key)}
              className={`px-2 py-1 text-xs font-mono font-medium transition-colors
                rounded cursor-pointer ${selectedValue === option.key ? BUTTON_CLASSES.active : BUTTON_CLASSES.inactive
                }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="lg:hidden bg-muted border border-border rounded-xl shadow-lg p-4 space-y-6 pb-6">
      {/* Title */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-mono font-bold text-foreground">
          {t('advancedFilters.options')}
        </h2>
      </div>

      {/* View Mode */}
      {renderButtonGroup(
        t('viewMode.title') || 'VIEW MODE',
        viewModes,
        displayViewMode as 'cards' | 'grid',
        handleViewModeChange,
        2
      )}

      {/* Options View Mode */}
      {renderButtonGroup(
        t('optionsViewMode.title') || 'OPTIONS VIEW',
        optionsViewModes,
        optionsViewMode,
        setOptionsViewMode,
        2
      )}

      {/* Status Filter */}
      {renderButtonGroup(
        t('filters.title') || 'STATUS FILTER',
        statusFilters,
        statusFilter,
        setStatusFilter,
        3
      )}

      {/* Sorting */}
      <div>
        <h3 className="text-xs font-mono font-medium text-muted-foreground mb-2">
          {t('sorting.title') || 'SORT BY'}
        </h3>
        <div className="bg-muted/30 border border-border rounded-lg p-2 space-y-1">
          {sortOptions.map((option) => (
            <button
              key={option.key}
              onClick={() => onSortChange(option.key)}
              className={`w-full px-3 py-2 text-xs font-mono font-medium transition-all duration-200 rounded-md cursor-pointer text-left ${
                selectedSort === option.key
                  ? 'bg-secondary text-secondary-foreground shadow-sm'
                  : 'bg-transparent text-muted-foreground hover:bg-muted/50 hover:text-foreground'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Show Filters Button */}
      <div>
        <Button
          onClick={handleShowFilters}
          variant="secondary"
          className="w-full"
          disableHoverAnimation={true}
          icon={<Filter className="w-4 h-4" />}
        >
          {t('advancedFilters.showFilters')}
        </Button>
      </div>
    </div>
  );
}
