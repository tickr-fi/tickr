'use client';

import React, { useState } from 'react';
import { Market } from '@/lib/types';
import Image from 'next/image';
import { MarketGridHoverTooltip } from './market-grid-hover-tooltip';
import { getMarketImageUrl } from '@/lib/utils/market-utils';

interface MarketGridPointProps {
    market: Market;
    x: number;
    y: number;
    size: number;
    onHoverChange?: (isHovered: boolean) => void;
}

export function MarketGridPoint({ market, x, y, size, onHoverChange }: MarketGridPointProps) {
    const [isHovered, setIsHovered] = useState(false);
    const [isPinned, setIsPinned] = useState(false);
    const imageUrl = getMarketImageUrl(market);

    const change24h = market.options.YES?.change24h;

    const getBorderColor = () => {
        if (change24h !== undefined && change24h !== null) {
            if (change24h > 0) {
                return 'border-green-500';
            }
            if (change24h < 0) {
                return 'border-red-500';
            }
            return 'border-muted-foreground/50';
        }

        return 'border-muted-foreground/30';
    };

    const handleClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsPinned(!isPinned);
    };

    return (
        <>
            <div
                className="absolute cursor-pointer transition-all duration-200 hover:scale-110"
                style={{
                    left: `${x - size / 2}px`,
                    top: `${y - size / 2}px`,
                    width: `${size}px`,
                    height: `${size}px`,
                }}
                onMouseEnter={() => {
                    setIsHovered(true);
                    onHoverChange?.(true);
                }}
                onMouseLeave={() => {
                    setIsHovered(false);
                    onHoverChange?.(false);
                }}
                onClick={handleClick}
            >
                {/* Main circle container */}
                <div className={`relative w-full h-full rounded-full overflow-hidden border-4 ${getBorderColor()} bg-muted/10`}>
                    {/* Market image or fallback */}
                    {imageUrl ? (
                        <Image
                            src={imageUrl}
                            alt={market.title}
                            fill
                            className="object-cover rounded-full"
                            sizes={`${size}px`}
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-muted/20 rounded-full">
                            <span className="text-xs font-bold text-foreground">
                                {market.title.charAt(0).toUpperCase()}
                            </span>
                        </div>
                    )}
                </div>
            </div>

            {/* Hover tooltip */}
            <MarketGridHoverTooltip
                market={market}
                x={x}
                y={y}
                size={size}
                visible={isHovered || isPinned}
                isPinned={isPinned}
                onClose={() => setIsPinned(false)}
            />
        </>
    );
}
