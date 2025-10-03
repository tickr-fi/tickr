import { Market } from '@/lib/types';
import { Clock } from 'lucide-react';
import Image from 'next/image';
import { MarketStatusBadge } from '@/components/features/markets/market-status-badge';
import { MarketOptions } from '@/components/features/markets/market-options';
import { MarketEndDate } from '@/components/features/markets/market-end-date';
import { MarketLiquidity } from '@/components/features/markets/market-liquidity';
import { MarketVolume } from '@/components/features/markets/market-volume';
import { MarketTableActions } from '@/components/features/markets/market-table-actions';
import { cn, getMarketImageUrl, formatDurationSinceCreation } from '@/lib/utils';

interface MarketRowProps {
  market: Market;
  maxLiquidity?: number;
}

export function MarketRow({ market, maxLiquidity }: MarketRowProps) {
  const daysRemaining = market.daysRemaining || 0;

  const handleTrade = () => {
    window.open(`https://pmx.trade/markets/${market.slug}`, '_blank');
  };

  return (
    <div 
      className={cn(
        'px-3 py-3 hover:bg-secondary-background transition-colors cursor-pointer',
        'grid grid-cols-14 gap-4 items-center text-xs font-mono w-full'
      )}
      onClick={handleTrade}
    >
      {/* Market Column */}
      <div className="col-span-6 flex items-center gap-3 pr-8">
        <div className="flex-1 min-w-0 flex gap-3">
          {/* Market image */}
          <div className="w-8 h-8 rounded overflow-hidden flex-shrink-0">
            {(() => {
              const imageUrl = getMarketImageUrl(market);

              return imageUrl ? (
                <Image
                  src={imageUrl}
                  alt={market.title}
                  width={32}
                  height={32}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-primary/20 rounded flex items-center justify-center text-xs font-bold">
                  {market.title.charAt(0).toUpperCase()}
                </div>
              );
            })()}
          </div>

          {/* Title and description */}
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-foreground truncate text-sm mb-1">
              {market.title}
            </h3>
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-muted-foreground" />
              <span className="text-xs text-muted-foreground font-mono">
                {formatDurationSinceCreation(market.createdAt)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Options Column */}
      <div className="col-span-2 flex justify-center">
        <MarketOptions options={market.options} />
      </div>

      {/* End Date Column */}
      <div className="col-span-1 flex justify-center">
        <MarketEndDate
          endDate={market.end_date}
          daysRemaining={daysRemaining}
          createdAt={market.createdAt}
        />
      </div>

      {/* Liquidity Column */}
      <div className="col-span-1 flex justify-center">
        <MarketLiquidity limit={market.limit} maxLiquidity={maxLiquidity} />
      </div>

      {/* Volume Column */}
      <div className="col-span-2 flex justify-center">
        <MarketVolume market={market} />
      </div>

      {/* Status Column */}
      <div className="col-span-1 flex justify-center">
        <MarketStatusBadge resolved={market.resolved} />
      </div>

      {/* Actions Column */}
      <div className="col-span-1 flex justify-center">
        <MarketTableActions marketSlug={market.slug} />
      </div>
    </div>
  );
}
