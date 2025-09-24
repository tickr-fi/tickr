import { Star } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface ColumnConfig {
  key: string;
  label: string;
  span: number;
  justify: 'start' | 'center' | 'end';
  icon?: React.ComponentType<{ className?: string }>;
  showSort?: boolean;
  padding?: string;
}

const getColumns = (t: any): ColumnConfig[] => [
  {
    key: 'market',
    label: t('market'),
    span: 5,
    justify: 'start',
    icon: Star,
    padding: 'pr-8'
  },
  {
    key: 'options',
    label: t('options'),
    span: 2,
    justify: 'center'
  },
  {
    key: 'endDate',
    label: t('endDate'),
    span: 2,
    justify: 'end'
  },
  {
    key: 'liquidity',
    label: t('liquidity'),
    span: 2,
    justify: 'end'
  },
  {
    key: 'status',
    label: t('status'),
    span: 1,
    justify: 'center'
  }
];

export function MarketTableHeader() {
  const t = useTranslations('markets.headers');
  const columns = getColumns(t);

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
