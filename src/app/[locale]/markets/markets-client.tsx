'use client';

import { useState, useEffect } from 'react';
import { MarketView } from '@/components/features';
import { Market } from '@/lib/types';
import { apiRequest } from '@/lib/api/client';
import { useGlobalLoadingStore } from '@/stores';

interface MarketsPageClientProps {
  initialMarkets: Market[];
}

export function MarketsPageClient({ initialMarkets }: MarketsPageClientProps) {
  const [markets, setMarkets] = useState<Market[]>(initialMarkets);
  const [isLoading, setIsLoading] = useState(false);
  const { setIsLoading: setGlobalLoading } = useGlobalLoadingStore();

  useEffect(() => {
    setGlobalLoading(false);
  }, [setGlobalLoading]);

  const handleRefresh = async () => {
    setIsLoading(true);
    try {
      const { data } = await apiRequest('/api/markets/all?limit=50');
      setMarkets(data || []);
    } catch (error) {
      console.error('Failed to refresh markets:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <MarketView 
      markets={markets} 
      isLoading={isLoading}
      onRefresh={handleRefresh}
    />
  );
}
