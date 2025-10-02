'use client';

import { useTranslations } from 'next-intl';
import { useMarketOptionsStore } from '@/stores';
import { Table, Grid3X3, LayoutGrid } from 'lucide-react';

export function MarketViewModeSelector() {
  const t = useTranslations('markets.viewMode');
  const { viewMode, setViewMode } = useMarketOptionsStore();

  const viewModes = [
    { key: 'table' as const, label: t('table'), icon: Table },
    { key: 'cards' as const, label: t('cards'), icon: LayoutGrid },
    { key: 'grid' as const, label: t('grid'), icon: Grid3X3 },
  ];

  return (
    <div className="inline-flex bg-secondary rounded-md p-0.5">
      {viewModes.map((mode) => {
        const Icon = mode.icon;
        return (
          <button
            key={mode.key}
            onClick={() => setViewMode(mode.key)}
            className={`inline-flex items-center gap-1 px-2 py-1.5 text-xs font-mono
                font-medium transition-all duration-200 rounded-sm cursor-pointer 
                ${viewMode === mode.key ? 'bg-primary text-primary-foreground shadow-sm' :
                'text-muted-foreground hover:bg-secondary hover:text-foreground'
              }`}
            title={mode.label}
          >
            <Icon className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{mode.label}</span>
          </button>
        );
      })}
    </div>
  );
}
