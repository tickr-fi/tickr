import { Market } from '@/lib/types';
import { cn } from '@/lib';
import { formatVolume } from '@/lib/utils/market-utils';

interface MarketVolumeProps {
  market: Market;
}

export function MarketVolume({ market }: MarketVolumeProps) {
  const calculateVolume = (market: Market): number => {
    if (!market.totalFees) {
      return 0;
    }
    return market.totalFees * 25;
  };

  const volume = calculateVolume(market);

  return (
    <div className="flex flex-col items-center">
      <span 
        className={cn(
          'text-xs font-mono font-medium',
          volume === 0 ? 'text-muted-foreground' : 'text-blue-500'
        )}
      >
        {formatVolume(volume)}
      </span>
    </div>
  );
}
