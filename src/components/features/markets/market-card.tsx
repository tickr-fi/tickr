'use client';

import React from 'react';
import { Share2, TrendingUp, TrendingDown, Clock, Zap } from 'lucide-react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Market } from '@/lib/types';
import { useMarketOptionsStore } from '@/stores';
import { Button, useToast } from '@/components/ui';
import { copyToClipboard } from '@/lib/copy-utils';
import { cn } from '@/lib';
import { formatVolume } from '@/lib/utils/market-utils';

import {
    calculateMarketOptionValues,
    getChangeColor,
    formatChangeCompact,
    getFirstOptionChange24h,
    getMarketImageUrl,
    formatTimeRemaining,
    getTimerColorClass,
    getStatusColorClass
} from '@/lib/utils/market-utils';

interface MarketCardProps {
    market: Market;
}

export function MarketCard({ market }: MarketCardProps) {
    const { optionsViewMode } = useMarketOptionsStore();
    const { addToast } = useToast();
    const t = useTranslations('markets');

    const renderLiquidityAndVolume = () => {
        // Liquidity calculation
        const limit = market.limit || 0;
        const maxLiquidity = 100000; // 100K
        const liquidityPercentage = Math.min(100, (limit / maxLiquidity) * 100);

        // Volume calculation
        const totalVolume = market.totalFees ? market.totalFees * 25 : 0;
        const yesVolume = (market.options.YES?.fees || 0) * 25;
        const noVolume = (market.options.NO?.fees || 0) * 25;
        const totalOptionVolume = yesVolume + noVolume;
        const yesPercentage = totalOptionVolume > 0 ? (yesVolume / totalOptionVolume) * 100 : 50;
        const noPercentage = totalOptionVolume > 0 ? (noVolume / totalOptionVolume) * 100 : 50;

        return (
            <div className="flex gap-4 mt-4">
                {/* Liquidity - Left Half */}
                <div className="flex-1">
                    <div className="space-y-1">
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] font-mono text-muted-foreground">{t('card.liquidity')}</span>
                            <span className="text-xs font-mono text-orange-500">${limit.toLocaleString()}</span>
                        </div>
                        <div className="w-full h-1 bg-muted rounded-full overflow-hidden">
                            <div
                                className="h-full bg-orange-500 transition-all duration-300"
                                style={{ width: `${liquidityPercentage}%` }}
                            />
                        </div>
                    </div>
                </div>

                {/* Volume - Right Half */}
                <div className="flex-1">
                    <div className="space-y-1">
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] font-mono text-muted-foreground">{t('headers.volume')}</span>
                            <span className="text-xs font-mono text-blue-500">
                                {formatVolume(totalVolume)}
                            </span>
                        </div>
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
                        <div className="flex justify-between w-full text-[10px] font-mono">
                            <span className="text-green-500">
                                YES: {formatVolume(yesVolume)}
                            </span>
                            <span className="text-red-500">
                                NO: {formatVolume(noVolume)}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const change24h = getFirstOptionChange24h(['YES', 'NO'], market.cas);

    const renderMarketImage = () => {
        const imageUrl = getMarketImageUrl(market);

        return imageUrl ? (
            <Image
                src={imageUrl}
                alt={market.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
        ) : (
            <div className="w-full h-full bg-primary/20 flex items-center justify-center">
                <div className="text-6xl font-bold text-white/20">
                    {market.title.charAt(0).toUpperCase()}
                </div>
            </div>
        );
    };

    const renderStatusBadge = () => (
        <div className="absolute top-3 right-3">
            <div className={`px-2 py-1 rounded text-xs font-mono font-medium ${getStatusColorClass(market.resolved ? 'RESOLVED' : 'ACTIVE')}`}>
                {market.resolved ? t('status.resolved') : t('status.active')}
            </div>
        </div>
    );

    const renderPriceChangeIndicator = () => {
        if (!change24h) { return null; }

        return (
            <div className="absolute bottom-2 right-3">
                <div
                    className={`px-2 py-1 rounded text-xs font-mono font-medium flex items-center gap-1 ${getChangeColor(change24h)}`}
                    style={{ backgroundColor: '#232634cc' }}
                >
                    {change24h > 0 ? (
                        <TrendingUp className="w-3 h-3" />
                    ) : (
                        <TrendingDown className="w-3 h-3" />
                    )}
                    {formatChangeCompact(change24h)}
                </div>
            </div>
        );
    };

    const renderTimer = () => {
        const now = new Date();
        const end = new Date(market.end_date);
        const diffTime = end.getTime() - now.getTime();
        const hoursRemaining = diffTime / (1000 * 60 * 60);
        const isDefaultExpires = diffTime > 0 && hoursRemaining >= 24;

        return (
            <div className="absolute bottom-2 left-3">
                <div
                    className={`px-2 py-1 rounded text-xs font-mono font-medium flex items-center gap-1 ${getTimerColorClass(market.end_date)}`}
                    style={isDefaultExpires ? {
                        backgroundColor: '#232634cc',
                        color: '#9ca3af'
                    } : {}}
                >
                    <Clock className="w-3 h-3" />
                    {formatTimeRemaining(market.end_date, t('card.expired'))}
                </div>
            </div>
        );
    };

    const renderMarketOptions = () => {
        if (!market.cas) { return null; }

        const {
            displayOptions,
            displayNames,
            formattedValues,
            optionColors
        } = calculateMarketOptionValues(market.options, optionsViewMode);

        return (
            <div className="flex justify-between gap-2 mt-4">
                {displayOptions.map((option, index) => {
                    const tokenMint = (market.cas as any)?.[option]?.tokenMint;

                    return (
                        <button
                            key={option}
                            onClick={() => {
                                if (tokenMint) {
                                    window.open(`https://jup.ag/tokens/${tokenMint}`, '_blank');
                                }
                            }}
                            className={cn(
                                'py-1.5 px-3 rounded text-xs font-mono font-medium',
                                'cursor-pointer transition-all duration-200',
                                'hover:scale-105 hover:shadow-md',
                                optionColors[index]
                            )}
                        >
                            {displayNames[index]} {formattedValues[index]}
                        </button>
                    );
                })}
            </div>
        );
    };

    const handleTrade = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        window.open(`https://pmx.trade/markets/${market.slug}`, '_blank');
    };

    const handleShare = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        const url = `${window.location.origin}/markets/${market.slug}`;
        const success = await copyToClipboard(url);

        if (success) {
            addToast({
                title: t('linkCopied'),
                type: 'success',
                duration: 2000
            });
        } else {
            addToast({
                title: t('copyError'),
                type: 'error',
                duration: 3000
            });
        }
    };

    const renderActionButtons = () => (
        <div className="flex gap-2 mt-2">
            <Button
                variant="secondary"
                size="sm"
                className="flex-1"
                icon={<Share2 className="w-3 h-3" />}
                onClick={handleShare}
            >
                {t('card.share')}
            </Button>
            <Button
                variant="secondary"
                size="sm"
                className="flex-1"
                icon={<Zap className="w-3 h-3" />}
                onClick={handleTrade}
            >
                {t('card.trade')}
            </Button>
        </div>
    );

    return (
        <div
            className={cn(
                'bg-secondary-background rounded-lg',
                'overflow-hidden hover:border-primary/50 transition-colors',
                'cursor-pointer h-80 flex flex-col'
            )}
            onClick={handleTrade}
        >
            {/* Header with background image and status indicators */}
            <div className="relative h-32 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0">
                    {renderMarketImage()}
                </div>
                {/* Shadow overlay for readability of text on image */}
                <div className="absolute inset-x-0 bottom-0 h-3/4 bg-gradient-to-t from-black/80 to-transparent" />
                {renderStatusBadge()}
                {renderPriceChangeIndicator()}
                {renderTimer()}
            </div>

            {/* Market details */}
            <div className="p-3 flex flex-col flex-1">
                <h3 className="text-sm font-mono font-medium text-foreground text-left">
                    {market.title}
                </h3>
                <div className="flex flex-col justify-between flex-1">
                    <div>
                        {renderMarketOptions()}
                        {renderLiquidityAndVolume()}
                    </div>
                    <div className="mt-4">
                        {renderActionButtons()}
                    </div>
                </div>
            </div>
        </div>
    );
}
