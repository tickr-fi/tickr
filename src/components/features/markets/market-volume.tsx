import { Market } from '@/lib/types';
import { cn, formatVolume } from '@/lib/utils';

interface MarketVolumeProps {
  market: Market;
}

export function MarketVolume({ market }: MarketVolumeProps) {
  const calculateMarketVolume = (market: Market): number => {
    if (!market.totalFees) {
      return 0;
    }
    return market.totalFees * 25;
  };

  const calculateOptionVolume = (market: Market, optionType: 'YES' | 'NO'): number => {
    const optionFees = market.options[optionType]?.fees || 0;
    return optionFees * 25;
  };

  const totalVolume = calculateMarketVolume(market);
  const yesVolume = calculateOptionVolume(market, 'YES');
  const noVolume = calculateOptionVolume(market, 'NO');

  // Calculate proportions for YES/NO bar segments
  const totalOptionVolume = yesVolume + noVolume;
  const yesPercentage = totalOptionVolume > 0 ? (yesVolume / totalOptionVolume) * 100 : 50;
  const noPercentage = totalOptionVolume > 0 ? (noVolume / totalOptionVolume) * 100 : 50;

  return (
    <div className="flex flex-col items-center gap-2 w-40">
      {/* Total Volume at the top */}
      <div className="text-center">
        <div className={cn(
          'text-sm font-mono font-bold',
          totalVolume === 0 ? 'text-muted-foreground' : 'text-blue-500'
        )}>
          {formatVolume(totalVolume)}
        </div>
      </div>
      
      {/* Segmented bar with YES (green) and NO (red) proportions */}
      <div className="w-full h-1 bg-muted rounded-full overflow-hidden">
        <div className="h-full flex">
          <div
            className="h-full bg-green-500 transition-all duration-300"
            style={{ width: `${yesPercentage}%` }}
          />
          <div
            className="h-full bg-red-500 transition-all duration-300"
            style={{ width: `${noPercentage}%` }}
          />
        </div>
      </div>
      
      {/* YES/NO options below the bar */}
      <div className="flex justify-between w-full text-[10px] font-mono">
        <span className={cn(
          'text-green-500',
          yesVolume === 0 && 'text-muted-foreground'
        )}>
          YES: {formatVolume(yesVolume)}
        </span>
        <span className={cn(
          'text-red-500',
          noVolume === 0 && 'text-muted-foreground'
        )}>
          NO: {formatVolume(noVolume)}
        </span>
      </div>
    </div>
  );
}
