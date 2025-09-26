'use client';

import { Market } from '@/lib/types';
import { MarketCard } from './market-card';
import { useTranslations } from 'next-intl';

interface MarketCardsGridProps {
  markets: Market[];
  isLoading?: boolean;
}

export function MarketCardsGrid({ markets, isLoading = false }: MarketCardsGridProps) {
  const t = useTranslations('markets');

  return (
    <div className="h-[calc(100vh-185px)] overflow-y-auto">
      {isLoading ? (
        <div className="p-8 text-center text-muted-foreground font-mono">
          {t('loading')}
        </div>
      ) : markets.length === 0 ? (
        <div className="p-8 text-center text-muted-foreground font-mono">
          {t('noMarkets')}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {markets.map((market) => (
            <MarketCard key={market.slug} market={market} />
          ))}
        </div>
      )}
    </div>
  );
}
