import { Market } from '@/lib/types';
import { normalizePrices } from './market-utils';

import { type GridOptionsFilter } from '@/stores';

export interface GridDataPoint {
    x: number;
    y: number;
    size: number;
    market: Market;
    optionType: 'YES' | 'NO';
}

export interface GridDimensions {
    width: number;
    height: number;
    padding: number;
}

/**
 * Calculate time remaining in hours
 */
export function calculateTimeRemaining(endDate: string): number {
    const now = Date.now();
    const endDateTime = new Date(endDate);
    const end = endDateTime.getTime();
    const hoursRemaining = Math.max((end - now) / (1000 * 60 * 60), 0.1); // Min 0.1 hours
    return hoursRemaining;
}

/**
 * Calculate market size based on volume with logarithmic scaling
 * Volume can range from 0 to unlimited, so we use log scaling for better distribution
 */
export function calculateMarketSize(market: Market): number {
    const volume = (market.totalFees || 0) * 25;

    const minSize = 30;
    const maxSize = 120;
    const sizePer1K = 2;

    if (volume === 0) {
        return minSize;
    }

    const additionalSize = Math.floor(volume / 1000) * sizePer1K;
    const size = Math.min(minSize + additionalSize, maxSize);

    return Math.round(size);
}

/**
 * Calculate option size based on option-specific volume with logarithmic scaling
 * Uses the individual option's fees for sizing
 */
export function calculateOptionSize(market: Market, optionType: 'YES' | 'NO'): number {
    const optionFees = market.options[optionType]?.fees || 0;
    const volume = optionFees * 25; // Same multiplier as market volume

    const minSize = 20; // Smaller minimum for individual options
    const maxSize = 100; // Smaller maximum for individual options
    const sizePer1K = 2;

    if (volume === 0) {
        return minSize;
    }

    const additionalSize = Math.floor(volume / 1000) * sizePer1K;
    const size = Math.min(minSize + additionalSize, maxSize);

    return Math.round(size);
}

/**
 * Convert time remaining to canvas X position with configurable scaling
 * Uses logarithmic scale with custom min/max ranges
 */
export function timeToCanvasX(
    timeRemaining: number,
    canvasWidth: number,
    padding: number,
    maxHours: number,
    minHours: number
): number {
    const clampedTime = Math.min(timeRemaining, maxHours);

    const logHours = Math.log10(clampedTime);
    const maxLogHours = Math.log10(maxHours);
    const minLogHours = Math.log10(minHours);

    // Reverse calculation so shorter time is on the left
    const normalizedX = (maxLogHours - logHours) / (maxLogHours - minLogHours);

    const canvasWidthInner = canvasWidth - (padding * 2);
    return padding + (normalizedX * canvasWidthInner);
}

/**
 * Convert probability to canvas Y position
 */
export function probabilityToCanvasY(probability: number, canvasHeight: number, padding: number): number {
    const canvasHeightInner = canvasHeight - (padding * 2);

    // Invert Y so 0% is at top, 100% is at bottom
    const normalizedY = (100 - probability) / 100;
    return padding + (normalizedY * canvasHeightInner);
}

/**
 * Transform markets to grid data points with configurable scaling
 * Generates two points per market: one for YES and one for NO option
 */
export function transformMarketsToGridData(
    markets: Market[],
    canvasWidth: number,
    canvasHeight: number,
    padding: number,
    maxHours: number,
    minHours: number,
    optionsFilter: GridOptionsFilter = 'BOTH'
): GridDataPoint[] {
    const dataPoints: GridDataPoint[] = [];
    
    markets.forEach(market => {
        const timeRemaining = calculateTimeRemaining(market.end_date);
        const x = timeToCanvasX(timeRemaining, canvasWidth, padding, maxHours, minHours);
        
        // Create YES point with option-specific size
        const yesPrice = market.options.YES.currentPrice as number;
        const yesProbability = normalizePrices([yesPrice, market.options.NO.currentPrice as number])[0];
        const yesY = probabilityToCanvasY(yesProbability, canvasHeight, padding);
        const yesSize = calculateOptionSize(market, 'YES');
        
        const yesPoint: GridDataPoint = {
            x,
            y: yesY,
            size: yesSize,
            market,
            optionType: 'YES'
        };
        
        // Create NO point with option-specific size
        const noPrice = market.options.NO.currentPrice as number;
        const noProbability = normalizePrices([market.options.YES.currentPrice as number, noPrice])[1];
        const noY = probabilityToCanvasY(noProbability, canvasHeight, padding);
        const noSize = calculateOptionSize(market, 'NO');
        
        const noPoint: GridDataPoint = {
            x,
            y: noY,
            size: noSize,
            market,
            optionType: 'NO'
        };

        // Filter points based on options filter
        if (optionsFilter === 'BOTH') {
            dataPoints.push(yesPoint, noPoint);
        } else if (optionsFilter === 'YES') {
            dataPoints.push(yesPoint);
        } else if (optionsFilter === 'NO') {
            dataPoints.push(noPoint);
        } else if (optionsFilter === 'WINNER') {
            const winner = yesY < noY ? yesPoint : noPoint;
            dataPoints.push(winner);
        }
    });
    
    return dataPoints;
}
