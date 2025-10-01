import { Market } from '@/lib/types';
import { normalizePrices } from './market-utils';

export interface GridDataPoint {
    x: number;
    y: number;
    size: number;
    market: Market;
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
 * Calculate market size based on liquidity (max 100,000)
 */
export function calculateMarketSize(market: Market): number {
    // Use the liquidity
    const liquidity = market.limit || 0;

    // Normalize to 20-80px range based on 100,000 max liquidity
    const maxLiquidity = 100000;
    const percentage = Math.min(100, (liquidity / maxLiquidity) * 100);
    const normalizedSize = Math.min(Math.max((percentage / 100) * 60 + 20, 20), 80);

    return normalizedSize;
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
 */
export function transformMarketsToGridData(
    markets: Market[],
    canvasWidth: number,
    canvasHeight: number,
    padding: number,
    maxHours: number,
    minHours: number
): GridDataPoint[] {
    return markets.map(market => {
        const timeRemaining = calculateTimeRemaining(market.end_date);
        const [probability] = normalizePrices([
            market.options.YES.currentPrice as number,
            market.options.NO.currentPrice as number
        ]);
        const size = calculateMarketSize(market);

        const x = timeToCanvasX(timeRemaining, canvasWidth, padding, maxHours, minHours);
        const y = probabilityToCanvasY(probability, canvasHeight, padding);

        return {
            x,
            y,
            size,
            market
        };
    });
}
