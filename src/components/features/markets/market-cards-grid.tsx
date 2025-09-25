'use client';

import { Market } from '@/lib/types';
import { MarketCard } from './market-card';

interface MarketCardsGridProps {
  markets: Market[];
}

export function MarketCardsGrid({ markets }: MarketCardsGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {markets.map((market) => (
        <MarketCard key={market.slug} market={market} />
      ))}
    </div>
  );
}
