import { HistoricalDataPoint, Market } from '@/lib/types';
import { timeToCanvasX, probabilityToCanvasY } from './grid-utils';
import { getPriceDivider, normalizePriceWithDivider } from './market-utils';

/**
 * Time period options for price aggregation
 */
export type TimePeriod = '5m' | '15m' | '30m' | '1h' | '6h' | '12h' | '1d' | '3d' | '7d' | '30d';

/**
 * Convert time period string to hours
 */
export function timePeriodToHours(period: TimePeriod): number {
  const periodMap: Record<TimePeriod, number> = {
    '5m': 5 / 60, // 5 minutes
    '15m': 15 / 60, // 15 minutes
    '30m': 30 / 60, // 30 minutes
    '1h': 1,
    '6h': 6,
    '12h': 12,
    '1d': 24,
    '3d': 72,
    '7d': 168,
    '30d': 720
  };
  return periodMap[period];
}

/**
 * Aggregated price data point
 */
interface AggregatedPricePoint {
  timestamp: string;
  averagePrice: number;
  minPrice: number;
  maxPrice: number;
  volume: number;
  dataPointCount: number;
  timePeriod: TimePeriod;
}

/**
 * Aggregate price history data based on specified time period
 * Groups data points into time buckets and calculates statistics for each bucket
 */
export function aggregatePriceHistory(
  priceHistory: HistoricalDataPoint[],
  timePeriod: TimePeriod = '1d',
  marketEndDate?: string,
  maxTimeRangeHours?: number
): AggregatedPricePoint[] {
  if (priceHistory.length === 0) {
    return [];
  }

  // Sort price history by timestamp (oldest first)
  const sortedHistory = [...priceHistory].sort((a, b) =>
    new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );

  // Filter data based on market end date and max time range
  let filteredHistory = sortedHistory;
  if (marketEndDate) {
    const maxValidHours = maxTimeRangeHours || 2160; // Use provided max or default to 3 months
    filteredHistory = sortedHistory.filter(point => {
      const pointTime = new Date(point.timestamp).getTime();
      const endTime = new Date(marketEndDate).getTime();
      const timeRemaining = (endTime - pointTime) / (1000 * 60 * 60);
      return timeRemaining <= maxValidHours && timeRemaining >= 0;
    });
  }

  if (filteredHistory.length === 0) {
    return [];
  }

  const periodHours = timePeriodToHours(timePeriod);
  const aggregatedPoints: AggregatedPricePoint[] = [];

  // Group data points into time buckets
  const buckets = new Map<number, HistoricalDataPoint[]>();

  filteredHistory.forEach(point => {
    const pointTime = new Date(point.timestamp).getTime();
    // Calculate bucket start time (round down to nearest period boundary)
    const bucketStartTime = Math.floor(pointTime / (periodHours * 60 * 60 * 1000)) * (periodHours * 60 * 60 * 1000);

    if (!buckets.has(bucketStartTime)) {
      buckets.set(bucketStartTime, []);
    }
    buckets.get(bucketStartTime)!.push(point);
  });

  // Process each bucket to create aggregated points
  const sortedBuckets = Array.from(buckets.entries()).sort(([a], [b]) => a - b);
  const lastBucketTime = sortedBuckets[sortedBuckets.length - 1]?.[0];

  sortedBuckets.forEach(([bucketStartTime, points]) => {
    if (points.length === 0) {
      return;
    }

    // Calculate statistics for this bucket
    const prices = points.map(p => p.price);
    const volumes = points.map(p => p.volume);

    // For the last bucket (most recent), use the latest price instead of average
    const isLastBucket = bucketStartTime === lastBucketTime;
    const averagePrice = isLastBucket
      ? prices[prices.length - 1]
      : prices.reduce((sum, price) => sum + price, 0) / prices.length;

    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const totalVolume = volumes.reduce((sum, volume) => sum + volume, 0);

    // Use the middle timestamp of the bucket as the representative timestamp
    const bucketEndTime = bucketStartTime + (periodHours * 60 * 60 * 1000);
    const middleTime = bucketStartTime + (bucketEndTime - bucketStartTime) / 2;
    const representativeTimestamp = new Date(middleTime).toISOString();

    aggregatedPoints.push({
      timestamp: representativeTimestamp,
      averagePrice,
      minPrice,
      maxPrice,
      volume: totalVolume,
      dataPointCount: points.length,
      timePeriod
    });
  });

  return aggregatedPoints;
}

/**
 * Get the default time period for price aggregation
 */
export function getDefaultTimePeriod(): TimePeriod {
  return '1d';
}

/**
 * Get all available time periods
 */
export function getAvailableTimePeriods(): TimePeriod[] {
  return ['1h', '6h', '12h', '1d', '3d', '7d', '30d'];
}

/**
 * Format time period for display
 */
export function formatTimePeriod(period: TimePeriod): string {
  const periodLabels: Record<TimePeriod, string> = {
    '5m': '5 Minutes',
    '15m': '15 Minutes',
    '30m': '30 Minutes',
    '1h': '1 Hour',
    '6h': '6 Hours',
    '12h': '12 Hours',
    '1d': '1 Day',
    '3d': '3 Days',
    '7d': '7 Days',
    '30d': '30 Days'
  };
  return periodLabels[period];
}

/**
 * Get trail color based on 24h change and hover state
 */
export function getTrailColor(change24h: number | undefined, isHovered: boolean): string {
  if (change24h !== undefined && change24h !== null) {
    if (change24h > 0) {
      return isHovered ? '#00ff66' : '#00ff6640'; // Green
    } else if (change24h < 0) {
      return isHovered ? '#ff4500' : '#ff450040'; // Red
    }
  }
  return isHovered ? '#9ca3af' : '#9ca3af40'; // Gray
}

/**
 * Filter and aggregate price history for trail drawing
 * Always returns aggregated data with specified time period
 */
export function preparePriceHistory(
  priceHistory: HistoricalDataPoint[],
  marketEndDate: string,
  timePeriod: TimePeriod = '1d',
  maxTimeRangeHours?: number
): AggregatedPricePoint[] {
  if (priceHistory.length === 0) {
    return [];
  }

  return aggregatePriceHistory(priceHistory, timePeriod, marketEndDate, maxTimeRangeHours);
}

/**
 * Calculate time remaining for a specific point
 */
export function calculateTimeRemainingForPoint(
  pointTimestamp: string,
  marketEndDate: string,
  isLastPoint: boolean
): number {
  const pointTime = new Date(pointTimestamp).getTime();
  const endTime = new Date(marketEndDate).getTime();

  if (isLastPoint) {
    // For the last point (most recent), use current time remaining to match market point positioning
    const now = Date.now();
    return Math.max((endTime - now) / (1000 * 60 * 60), 0.1);
  } else {
    // For historical points, use time remaining from that point to end
    return Math.max((endTime - pointTime) / (1000 * 60 * 60), 0.1);
  }
}

/**
 * Draw a single trail for a market
 */
export function drawMarketTrail(
  ctx: CanvasRenderingContext2D,
  market: Market,
  isHovered: boolean,
  canvasWidth: number,
  canvasHeight: number,
  padding: number,
  timePeriod: TimePeriod,
  maxHours: number,
  minHours: number
): void {
  const priceHistory = market.options.YES?.priceHistory || [];
  const divider = getPriceDivider(
    market.options.YES?.currentPrice as number,
    market.options.NO?.currentPrice as number
  );
  const filteredHistory = preparePriceHistory(priceHistory, market.end_date, timePeriod, maxHours);

  if (filteredHistory.length === 0) {
    return;
  }

  const change24h = market.options.YES?.change24h;
  const trailColor = getTrailColor(change24h, isHovered);

  // Set trail style
  ctx.strokeStyle = trailColor;
  ctx.lineWidth = isHovered ? 3 : 2;
  ctx.setLineDash([]);

  // Draw trail line
  ctx.beginPath();
  let firstPoint = true;

  filteredHistory.forEach((point, pointIndex) => {
    const isLastPoint = pointIndex === filteredHistory.length - 1;
    const timeRemaining = calculateTimeRemainingForPoint(point.timestamp, market.end_date, isLastPoint);

    const probability = normalizePriceWithDivider(point.averagePrice, divider);

    const x = timeToCanvasX(timeRemaining, canvasWidth, padding, maxHours, minHours);
    const y = probabilityToCanvasY(probability, canvasHeight, padding);

    if (firstPoint) {
      ctx.moveTo(x, y);
      firstPoint = false;
    } else {
      ctx.lineTo(x, y);
    }
  });

  ctx.stroke();

  // Draw trail points
  ctx.fillStyle = trailColor;
  filteredHistory.forEach((point, pointIndex) => {
    const isLastPoint = pointIndex === filteredHistory.length - 1;
    const timeRemaining = calculateTimeRemainingForPoint(point.timestamp, market.end_date, isLastPoint);

    const probability = normalizePriceWithDivider(point.averagePrice, divider);

    const x = timeToCanvasX(timeRemaining, canvasWidth, padding, maxHours || 2160, minHours || 0.1);
    const y = probabilityToCanvasY(probability, canvasHeight, padding);

    const pointSize = 2;

    ctx.beginPath();
    ctx.arc(x, y, pointSize, 0, 2 * Math.PI);
    ctx.fill();
  });
}

/**
 * Draw all trails for multiple markets
 */
export function drawAllTrails(
  ctx: CanvasRenderingContext2D,
  markets: Market[],
  hoveredPointIndex: number | null,
  canvasWidth: number,
  canvasHeight: number,
  padding: number,
  timePeriod: TimePeriod,
  maxHours: number,
  minHours: number
): void {
  markets.forEach((market, index) => {
    const isHovered = hoveredPointIndex === index;
    drawMarketTrail(ctx, market, isHovered, canvasWidth, canvasHeight, padding, timePeriod, maxHours, minHours);
  });
}
