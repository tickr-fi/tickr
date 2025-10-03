'use client';

import React from 'react';
import { Market } from '@/lib/types';
import { Button, useToast } from '@/components/ui';
import { Share2, Zap } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { preventEventPropagation, copyToClipboard } from '@/lib/utils';

interface MarketGridCardButtonsProps {
  market: Market;
}

export function MarketGridCardButtons({ market }: MarketGridCardButtonsProps) {
  const t = useTranslations('markets.gridCard');
  const tMarket = useTranslations('markets');
  const { addToast } = useToast();
  
  const handleTrade = (e: React.MouseEvent | React.TouchEvent) => {
    preventEventPropagation(e);
    window.open(`https://pmx.trade/markets/${market.slug}`, '_blank');
  };
  
  const handleShare = async (e: React.MouseEvent | React.TouchEvent) => {
    preventEventPropagation(e);
    const url = `https://pmx.trade/markets/${market.slug}`;
    const success = await copyToClipboard(url);
    
    if (success) {
      addToast({
        title: tMarket('linkCopied'),
        type: 'success',
        duration: 2000
      });
    } else {
      addToast({
        title: tMarket('copyError'),
        type: 'error',
        duration: 3000
      });
    }
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
