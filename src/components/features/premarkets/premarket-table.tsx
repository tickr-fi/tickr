'use client';

import { Premarket } from '@/lib/types';
import { PremarketRow } from './premarket-row';
import { PremarketTableHeader } from './premarket-table-header';
import { useTranslations } from 'next-intl';
import { useEffect, useRef } from 'react';

interface PremarketTableProps {
  premarkets: Premarket[];
  isLoading?: boolean;
  isLoadingMore?: boolean;
  hasMore?: boolean;
  onLoadMore?: () => void;
}

export function PremarketTable({
  premarkets,
  isLoading = false,
  isLoadingMore = false,
  hasMore = false,
  onLoadMore
}: PremarketTableProps) {
  const t = useTranslations('premarkets');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scrollElement = scrollRef.current;
    if (!scrollElement || !onLoadMore) { return; }

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = scrollElement;
      const isNearBottom = scrollTop + clientHeight >= scrollHeight - 100; // Load when 100px from bottom

      if (isNearBottom && hasMore && !isLoadingMore) {
        onLoadMore();
      }
    };

    scrollElement.addEventListener('scroll', handleScroll);
    return () => scrollElement.removeEventListener('scroll', handleScroll);
  }, [hasMore, isLoadingMore, onLoadMore]);

  return (
    <div className="w-full bg-background relative">
      <div className="border border-border rounded-lg overflow-hidden">
        <PremarketTableHeader />

        <div 
          ref={scrollRef}
          className="h-[calc(100vh-230px)] overflow-y-auto"
        >
          {isLoading ? (
            <div className="p-8 text-center text-muted-foreground font-mono">
              {t('loading')}
            </div>
          ) : premarkets.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground font-mono">
              {t('noPremarkets')}
            </div>
          ) : (
            <>
              {premarkets.map((premarket, index) => (
                <PremarketRow
                  key={`${premarket.id}-${index}`}
                  premarket={premarket}
                />
              ))}

              {/* Load more indicator */}
              {isLoadingMore && (
                <div className="px-3 py-2 text-center text-muted-foreground font-mono text-xs bg-background border-t border-border">
                  Loading more premarkets...
                </div>
              )}
              
              {/* End of results indicator */}
              {!hasMore && premarkets.length > 0 && (
                <div className="px-3 py-2 text-center text-muted-foreground font-mono text-xs bg-background border-t border-border">
                  No more premarkets to load
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between mt-3 px-2">
        <div className="text-xs font-mono text-muted-foreground">
          {t('showing', { count: premarkets.length })}
        </div>
      </div>
    </div>
  );
}
