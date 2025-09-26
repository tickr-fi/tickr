'use client';

import { Market } from '@/lib/types';
import { MarketRow } from '@/components/features/markets/market-row';
import { MarketTableHeader } from '@/components/features/markets/market-table-header';
import { useTranslations } from 'next-intl';

interface MarketTableProps {
  markets: Market[];
  isLoading?: boolean;
}

export function MarketTable({ markets, isLoading = false }: MarketTableProps) {
  const t = useTranslations('markets');

  return (
    <div className="border border-border rounded-lg overflow-hidden">
      <MarketTableHeader />

      <div className="divide-y divide-border h-[calc(100vh-220px)] overflow-y-auto">
        {isLoading ? (
          <div className="p-8 text-center text-muted-foreground font-mono">
            {t('loading')}
          </div>
        ) : markets.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground font-mono">
            {t('noMarkets')}
          </div>
        ) : (
          markets.map((market, index) => (
            <MarketRow
              key={`${market.slug}-${index}`}
              market={market}
            />
          ))
        )}
      </div>
    </div>
  );
}
