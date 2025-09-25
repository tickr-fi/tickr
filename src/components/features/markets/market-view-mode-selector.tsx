'use client';

import { useTranslations } from 'next-intl';
import { useTableOptionsStore } from '@/stores';

export function MarketViewModeSelector() {
  const t = useTranslations('markets.viewMode');
  const { viewMode, setViewMode } = useTableOptionsStore();

  const viewModes = [
    { key: 'table' as const, label: t('table') },
    { key: 'cards' as const, label: t('cards') },
  ];

  return (
    <div className="flex gap-1">
      {viewModes.map((mode) => (
        <button
          key={mode.key}
          onClick={() => setViewMode(mode.key)}
          className={`px-2 py-1 text-xs font-mono font-medium transition-colors rounded cursor-pointer ${viewMode === mode.key
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted text-muted-foreground hover:bg-secondary hover:text-foreground'
            }`}
        >
          {mode.label}
        </button>
      ))}
    </div>
  );
}
