'use client';

import React from 'react';
import { Market } from '@/lib/types';
import { getMarketImageUrl, formatTimeRemaining, formatVolume } from '@/lib/utils/market-utils';
import { Clock, X } from 'lucide-react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { MarketGridCardOptions } from './market-grid-card-options';
import { MarketGridCardButtons } from './market-grid-card-buttons';

interface MarketGridCardProps {
    market: Market;
    onClose?: () => void;
}

export function MarketGridCard({ market, onClose }: MarketGridCardProps) {
    const t = useTranslations('markets.gridCard');
    const imageUrl = getMarketImageUrl(market);

    const timeRemaining = formatTimeRemaining(market.end_date);

    const handleClose = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        onClose?.();
    };

    return (
        <div className="w-80 bg-background rounded-lg border border-border overflow-hidden shadow-lg">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border">
                <h3 className="text-foreground font-medium text-sm truncate flex-1">
                    {market.title}
                </h3>
                <div className="flex items-center gap-2 ml-2">
                    <button
                        onClick={handleClose}
                        className="p-1 rounded-full bg-secondary/20 text-muted-foreground
             hover:text-secondary-foreground hover:bg-secondary transition-colors cursor-pointer"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Market Description */}
            <div
                className="p-4 border-b border-border cursor-pointer hover:bg-muted/20 transition-colors"
                onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    window.open(`https://pmx.trade/markets/${market.slug}`, '_blank');
                }}
            >
                <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded flex items-center justify-center flex-shrink-0 overflow-hidden">
                        {imageUrl ? (
                            <Image
                                src={imageUrl}
                                alt={market.title}
                                width={48}
                                height={48}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <span className="text-muted-foreground font-bold text-lg">
                                {market.title.charAt(0).toUpperCase()}
                            </span>
                        )}
                    </div>
                    <p className="text-muted-foreground text-xs leading-relaxed line-clamp-4">
                        {market.description}
                    </p>
                </div>
            </div>

            {/* Time Remaining */}
            <div className="p-4 border-b border-border text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground text-xs font-medium">{t('timeRemaining')}</span>
                </div>
                <div className="text-foreground text-2xl font-bold">
                    {timeRemaining}
                </div>
            </div>

            {/* Market Options */}
            <MarketGridCardOptions market={market} />

            {/* Liquidity */}
            <div className="p-4 border-b border-border">
                <div className="flex items-center gap-2">
                    <span className="text-muted-foreground text-sm">{t('liquidity')}:</span>
                    <span className="text-foreground text-sm font-medium">
                        ${market.limit?.toLocaleString() || '0'}
                    </span>
                </div>
            </div>

            {/* Volume */}
            <div className="p-4 border-b border-border">
                <div className="flex items-center gap-2">
                    <span className="text-muted-foreground text-sm">{t('volume')}:</span>
                    <span className="text-blue-500 text-sm font-medium">
                        {formatVolume(market.totalFees ? market.totalFees * 25 : 0)}
                    </span>
                </div>
            </div>

            {/* Action Buttons */}
            <MarketGridCardButtons market={market} />
        </div>
    );
}
