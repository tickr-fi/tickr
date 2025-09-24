import { Check } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface MarketStatusBadgeProps {
  resolved: boolean;
}

export function MarketStatusBadge({ resolved }: MarketStatusBadgeProps) {
  const t = useTranslations('markets.status');
  
  if (resolved) {
    return (
      <div className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-500/20 text-blue-400 text-xs font-mono font-medium rounded">
        {t('resolved')}
      </div>
    );
  }

  return (
    <div className="inline-flex items-center gap-1 px-2 py-0.5 bg-success/20 text-success text-xs font-mono font-medium rounded">
      <Check className="w-3 h-3" />
      {t('active')}
    </div>
  );
}
