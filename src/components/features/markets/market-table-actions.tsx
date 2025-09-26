'use client';

import React from 'react';
import { Share2, Zap } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Button, useToast } from '@/components/ui';
import { copyToClipboard } from '@/lib/copy-utils';

interface MarketTableActionsProps {
  marketSlug: string;
}

export function MarketTableActions({ marketSlug }: MarketTableActionsProps) {
  const t = useTranslations('markets.card');
  const tMarket = useTranslations('markets');
  const { addToast } = useToast();

  const handleTrade = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    window.open(`https://pmx.trade/markets/${marketSlug}`, '_blank');
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const url = `${window.location.origin}/markets/${marketSlug}`;
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
    <div className="flex gap-2">
      <Button 
        variant="secondary" 
        size="sm" 
        onClick={handleTrade}
        icon={<Zap className="w-3 h-3" />}
      >
        {t('trade')}
      </Button>
      <Button 
        variant="secondary" 
        size="sm" 
        onClick={handleShare}
        icon={<Share2 className="w-3 h-3" />}
      >
      </Button>
    </div>
  );
}
