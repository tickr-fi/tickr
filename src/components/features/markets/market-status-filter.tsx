import { useTranslations } from 'next-intl';
import { useMarketOptionsStore } from '@/stores';
import { Play, CheckCircle, List } from 'lucide-react';

export function MarketStatusFilter() {
  const { statusFilter, setStatusFilter } = useMarketOptionsStore();
  const t = useTranslations('markets.filters');
  const filters = [
    { key: 'ACTIVE' as const, label: t('active'), icon: Play },
    { key: 'RESOLVED' as const, label: t('resolved'), icon: CheckCircle },
    { key: 'ALL' as const, label: t('all'), icon: List },
  ];

  return (
    <div className="inline-flex bg-secondary rounded-md p-0.5">
      {filters.map((filter) => {
        const Icon = filter.icon;
        return (
          <button
            key={filter.key}
            onClick={() => setStatusFilter(filter.key)}
            className={`inline-flex items-center gap-1 px-2 py-1.5 text-xs font-mono
              font-medium transition-all duration-200 rounded-sm cursor-pointer 
              ${statusFilter === filter.key ? 'bg-primary text-primary-foreground shadow-sm' :
                'text-muted-foreground hover:bg-secondary hover:text-foreground'
              }`}
            title={filter.label}
          >
            <Icon className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{filter.label}</span>
          </button>
        );
      })}
    </div>
  );
}
