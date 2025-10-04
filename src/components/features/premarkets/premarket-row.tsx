import { Premarket } from '@/lib/types';
import { Clock } from 'lucide-react';
import Image from 'next/image';
import { PremarketFundingBar } from './premarket-funding-bar';
import { PremarketDeadlineProgress } from './premarket-deadline-progress';
import { cn, formatDurationSinceCreation } from '@/lib/utils';

interface PremarketRowProps {
  premarket: Premarket;
}

export function PremarketRow({ premarket }: PremarketRowProps) {
  const handleView = () => {
    window.open(`https://pmx.trade/markets/presale/${premarket.slug}`, '_blank');
  };

  return (
    <div 
      className={cn(
        'px-3 py-3 hover:bg-secondary-background transition-colors cursor-pointer',
        'grid grid-cols-12 gap-4 items-center text-xs font-mono w-full'
      )}
      onClick={handleView}
    >
      {/* Market Column */}
      <div className="col-span-8 flex items-center gap-3 pr-8">
        <div className="flex-1 min-w-0 flex gap-3">
          {/* Market image */}
          <div className="w-8 h-8 rounded overflow-hidden flex-shrink-0">
            {premarket.image_urls?.market?.url ? (
              <Image
                src={premarket.image_urls.market.url}
                alt={premarket.name}
                width={32}
                height={32}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-primary/20 rounded flex items-center justify-center text-xs font-bold">
                {premarket.name.charAt(0).toUpperCase()}
              </div>
            )}
          </div>

          {/* Title and description */}
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-foreground truncate text-sm mb-1">
              {premarket.name}
            </h3>
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-muted-foreground" />
              <span className="text-xs text-muted-foreground font-mono">
                {formatDurationSinceCreation(premarket.created_at)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Funding Column */}
      <div className="col-span-2 flex justify-center">
        <PremarketFundingBar
          balance={premarket.balance}
          limit={premarket.limit}
          fundingProgress={premarket.fundingProgress || 0}
        />
      </div>

      {/* Deadline Column */}
      <div className="col-span-2 flex justify-center">
        <PremarketDeadlineProgress
          endDate={premarket.end_date}
          daysRemaining={premarket.daysRemaining || 0}
          createdAt={premarket.created_at}
        />
      </div>
    </div>
  );
}
