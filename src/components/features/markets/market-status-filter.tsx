import { useTranslations } from 'next-intl';
import { useTableOptionsStore } from '@/stores';

export function MarketStatusFilter() {
  const { statusFilter, setStatusFilter } = useTableOptionsStore();
  const t = useTranslations('markets.filters');
  const filters = [
    { key: 'ACTIVE' as const, label: t('active') },
    { key: 'RESOLVED' as const, label: t('resolved') },
    { key: 'ALL' as const, label: t('all') },
  ];

  return (
    <div className="flex gap-1">
      {filters.map((filter) => (
        <button
          key={filter.key}
          onClick={() => setStatusFilter(filter.key)}
          className={`px-2 py-1 text-xs font-mono font-medium transition-colors rounded cursor-pointer ${statusFilter === filter.key
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted text-muted-foreground hover:bg-secondary hover:text-foreground'
            }`}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
}
