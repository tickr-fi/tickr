'use client';

import React from 'react';
import { Market } from '@/lib/types';
import { Button } from '@/components/ui';
import { Share2, Zap } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface MarketGridCardButtonsProps {
  market: Market;
}

export function MarketGridCardButtons({ market }: MarketGridCardButtonsProps) {
  const t = useTranslations('markets.gridCard');
  
  const handleTrade = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Additional Safari iOS fix
    if (e.nativeEvent) {
      e.nativeEvent.preventDefault();
      e.nativeEvent.stopPropagation();
    }
    window.open(`https://pmx.trade/markets/${market.slug}`, '_blank');
  };
  
  const handleShare = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Additional Safari iOS fix
    if (e.nativeEvent) {
      e.nativeEvent.preventDefault();
      e.nativeEvent.stopPropagation();
    }
    navigator.clipboard.writeText(`${window.location.origin}/markets/${market.slug}`);
  };

  return (
    <div className="p-4">
      <div className="flex gap-2">
        <Button
          variant="secondary"
          size="sm"
          className="flex-1"
          icon={<Share2 className="w-3 h-3" />}
          onClick={handleShare}
        >
          {t('share')}
        </Button>
        <Button
          variant="secondary"
          size="sm"
          className="flex-1"
          icon={<Zap className="w-3 h-3" />}
          onClick={handleTrade}
        >
          {t('trade')}
        </Button>
      </div>
    </div>
  );
}
