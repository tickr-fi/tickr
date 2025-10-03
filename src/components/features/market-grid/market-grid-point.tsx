'use client';

import React, { useState } from 'react';
import { Market } from '@/lib/types';
import Image from 'next/image';
import { MarketGridHoverTooltip } from './market-grid-hover-tooltip';
import { preventEventPropagation, getOptionImageUrl } from '@/lib/utils';
import { useMarketOptionsStore } from '@/stores';

interface MarketGridPointProps {
    market: Market;
    x: number;
    y: number;
    size: number;
    optionType: 'YES' | 'NO';
    isPairedHovered?: boolean;
    onHoverChange?: (isHovered: boolean) => void;
}

export function MarketGridPoint({ 
    market, 
    x, 
    y, 
    size, 
    optionType, 
    isPairedHovered = false, 
    onHoverChange 
}: MarketGridPointProps) {
    const [isHovered, setIsHovered] = useState(false);
    const [isPinned, setIsPinned] = useState(false);
    const imageUrl = getOptionImageUrl(market, optionType);
    
    const { gridOptionsFilter: optionsFilter } = useMarketOptionsStore();

    const change24h = market.options[optionType]?.change24h;

    const getBorderColor = () => {
        // If filter is BOTH, use option-based colors
        if (optionsFilter === 'BOTH') {
            if (optionType === 'YES') {
                return 'border-green-500';
            } else {
                return 'border-red-500';
            }
        }
        
        // If filter is not BOTH, use 24h change-based colors
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
        preventEventPropagation(e);
        setIsPinned(!isPinned);
    };

    return (
        <>
            <div
                className={`absolute cursor-pointer transition-all duration-200 ${(isHovered || isPairedHovered) ? 'scale-120' : 'hover:scale-120'}`}
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
                <div className={`relative w-full h-full rounded-full overflow-hidden border-2 lg:border-4 ${getBorderColor()} bg-muted/10`}>
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
                highlightedOptionType={optionType}
            />
        </>
    );
}
