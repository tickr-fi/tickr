'use client';

import { Share2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui';

interface MarketTableActionsProps {
  marketSlug: string;
}

export function MarketTableActions({ }: MarketTableActionsProps) {
  const t = useTranslations('markets.card');

  return (
    <div className="flex gap-2">
      <Button variant="secondary" size="sm">
        {t('trade')}
      </Button>
      <Button variant="secondary" size="sm" icon={<Share2 className="w-3 h-3" />}>
      </Button>
    </div>
  );
}
