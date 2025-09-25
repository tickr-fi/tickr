import { useTranslations } from 'next-intl';

interface MarketEndDateProps {
  endDate: string;
  daysRemaining: number;
  createdAt?: string;
}

export function MarketEndDate({ endDate, createdAt }: MarketEndDateProps) {
  const t = useTranslations('markets.card');

  if (!createdAt) {
    return <div className="text-xs text-muted-foreground">--</div>;
  }

  const now = new Date();
  const created = new Date(createdAt);
  const end = new Date(endDate);

  const totalDuration = end.getTime() - created.getTime();
  const elapsed = now.getTime() - created.getTime();
  const remaining = end.getTime() - now.getTime();

  const isExpired = remaining <= 0;

  // Calculate progress percentage (0-100)
  const progress = isExpired ? 100 : Math.max(0, Math.min(100, (elapsed / totalDuration) * 100));

  // Determine color based on remaining time
  const hoursRemaining = remaining / (1000 * 60 * 60);
  let barColor = 'bg-blue-500'; // Default blue
  let pulseClass = '';

  if (isExpired) {
    barColor = 'bg-blue-500'; // Full blue when expired
  } else if (hoursRemaining < 1) {
    barColor = 'bg-red-500'; // Red when <1h
    pulseClass = 'animate-pulse';
  } else if (hoursRemaining < 24) {
    barColor = 'bg-amber-500'; // Amber when <24h
  }

  const formatTimeRemaining = (hours: number) => {
    if (isExpired) {
      return t('expired');
    }
    if (hours >= 24) {
      const days = Math.floor(hours / 24);
      const remainingHours = Math.floor(hours % 24);
      return `${days}d ${remainingHours}h`;
    } else {
      return `${Math.floor(hours)}h`;
    }
  };

  return (
    <div className="flex flex-col items-center gap-1 w-30">
      <div className="text-xs text-muted-foreground font-mono">
        {formatTimeRemaining(hoursRemaining)}
      </div>
      <div className="w-full h-1 bg-muted rounded-full overflow-hidden">
        <div
          className={`h-full ${barColor} ${pulseClass} transition-all duration-300`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
