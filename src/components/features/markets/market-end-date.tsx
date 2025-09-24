import { useTranslations } from 'next-intl';

interface MarketEndDateProps {
  endDate: string;
  daysRemaining: number;
}

export function MarketEndDate({ endDate, daysRemaining }: MarketEndDateProps) {
  const t = useTranslations('markets.endDate');
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit'
    });
  };

  const getDaysText = (days: number) => {
    if (days < 0) {
      return t('daysAgo', { count: Math.abs(days) });
    } else if (days === 0) {
      return t('today');
    } else {
      return t('days', { count: days });
    }
  };

  const getDaysColor = (days: number) => {
    if (days < 0) {
      return 'text-destructive';
    } else if (days <= 3) {
      return 'text-warning';
    } else {
      return 'text-muted-foreground';
    }
  };

  return (
    <div>
      <div className="text-xs text-foreground font-medium">
        {formatDate(endDate)}
      </div>
      <div className={`text-xs ${getDaysColor(daysRemaining)}`}>
        {getDaysText(daysRemaining)}
      </div>
    </div>
  );
}
