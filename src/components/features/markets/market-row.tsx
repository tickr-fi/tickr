import { Market } from '@/lib/types';
import { Star } from 'lucide-react';
import Image from 'next/image';
import { MarketStatusBadge } from '@/components/features/markets/market-status-badge';
import { MarketOptions } from '@/components/features/markets/market-options';
import { MarketEndDate } from '@/components/features/markets/market-end-date';

interface MarketRowProps {
  market: Market;
}

export function MarketRow({ market }: MarketRowProps) {
  const daysRemaining = market.daysRemaining || 0;

  return (
    <div className="px-3 py-3 hover:bg-muted/50 transition-colors grid grid-cols-12 gap-4 items-center text-xs font-mono w-full">
      {/* Market Column */}
      <div className="col-span-5 flex items-start gap-3 pr-8">
        <button className="mt-1 hover:text-primary transition-colors">
          <Star className="w-3 h-3 text-muted-foreground hover:text-primary" />
        </button>
        
        <div className="flex-1 min-w-0 flex gap-3">
          {/* Market image */}
          <div className="w-8 h-8 rounded overflow-hidden flex-shrink-0">
            {(() => {
              const marketImage = market.marketImageUrl;
              const firstOptionImage = market.optionImagesUrl ? Object.values(market.optionImagesUrl)[0] : undefined;
              const imageUrl = marketImage || firstOptionImage;
              
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
            <h3 className="font-medium text-foreground truncate text-xs mb-1">
              {market.title}
            </h3>
            <p className="text-xs text-muted-foreground truncate max-w-[400px]">
              {market.description}
            </p>
          </div>
        </div>
      </div>
      
      {/* Options Column */}
      <div className="col-span-2 flex justify-center">
        <MarketOptions options={market.options} cas={market.cas} />
      </div>
      
      {/* End Date Column */}
      <div className="col-span-2 flex justify-end">
        <MarketEndDate 
          endDate={market.end_date}
          daysRemaining={daysRemaining}
        />
      </div>
      
      {/* Liquidity Column */}
      <div className="col-span-2 flex justify-end">
        <div className="text-right">
          {market.limit && (
            <div className="text-xs text-foreground font-medium">
              ${market.limit.toLocaleString()}
            </div>
          )}
        </div>
      </div>
      
      {/* Status Column */}
      <div className="col-span-1 flex justify-center">
        <MarketStatusBadge resolved={market.resolved} />
      </div>
    </div>
  );
}
