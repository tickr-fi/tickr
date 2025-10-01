import { useTranslations } from 'next-intl';
import { useTableOptionsStore } from '@/stores';

interface ColumnConfig {
  key: string;
  label: string;
  span: number;
  justify: 'start' | 'center' | 'end';
  icon?: React.ComponentType<{ className?: string }>;
  showSort?: boolean;
  padding?: string;
}

const getColumns = (t: any, optionsViewMode: string): ColumnConfig[] => [
  {
    key: 'market',
    label: t('market'),
    span: 5,
    justify: 'start',
    padding: 'pr-8'
  },
  {
    key: 'odds',
    label: optionsViewMode === 'prices' ? t('prices') : t('odds'),
    span: 2,
    justify: 'center'
  },
  {
    key: 'expires',
    label: t('expires'),
    span: 1,
    justify: 'center'
  },
  {
    key: 'liquidity',
    label: t('liquidity'),
    span: 1,
    justify: 'center'
  },
  {
    key: 'volume',
    label: t('volume'),
    span: 1,
    justify: 'center'
  },
  {
    key: 'status',
    label: t('status'),
    span: 1,
    justify: 'center'
  },
  {
    key: 'actions',
    label: t('actions'),
    span: 1,
    justify: 'center'
  }
];

export function MarketTableHeader() {
  const t = useTranslations('markets.headers');
  const { optionsViewMode } = useTableOptionsStore();
  const columns = getColumns(t, optionsViewMode);

  return (
    <div className="bg-muted px-3 py-2 border-b border-border">
      <div className="grid grid-cols-12 gap-4 items-center text-xs font-mono font-medium text-muted-foreground">
        {columns.map((column) => {
          const Icon = column.icon;
          const justifyClass = {
            start: 'justify-start',
            center: 'justify-center',
            end: 'justify-end'
          }[column.justify];

          return (
            <div
              key={column.key}
              className={`col-span-${column.span} flex items-center gap-2 ${justifyClass} ${column.padding || ''}`}
            >
              {Icon && <Icon className="w-3 h-3" />}
              <span>{column.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
