import { Market } from '@/lib/types';
import { calculateTimeRemaining } from './grid-utils';
import { TimeFilter } from '@/components/features/market-grid';

/**
 * Get maximum hours for each time filter
 */
export function getMaxHoursForFilter(timeFilter: TimeFilter): number {
  switch (timeFilter) {
    case '<1h':
      return 1; // 1 hour
    case '<24h':
      return 24; // 24 hours
    case '<7d':
      return 168; // 7 days = 168 hours
    case '<30d':
      return 720; // 30 days = 720 hours
    case 'All':
      return 2160; // 3 months
    default:
      return 2160; // 3 months default
  }
}

/**
 * Filter markets based on time remaining
 */
export function filterMarketsByTime(markets: Market[], timeFilter: TimeFilter): Market[] {
  if (timeFilter === 'All') {
    return markets;
  }

  const maxHours = getMaxHoursForFilter(timeFilter);
  
  return markets.filter(market => {
    const timeRemaining = calculateTimeRemaining(market.end_date);
    // Only show markets that expire within the selected time range
    return timeRemaining <= maxHours && timeRemaining > 0;
  });
}

/**
 * Get appropriate time labels based on selected filter
 */
export function getTimeLabelsForFilter(timeFilter: TimeFilter) {
  switch (timeFilter) {
    case '<1h':
      return [
        { hours: 0.1, label: '6m' },
        { hours: 0.25, label: '15m' },
        { hours: 0.5, label: '30m' },
        { hours: 1, label: '1h' }
      ];
    case '<24h':
      return [
        { hours: 0.1, label: '6m' },
        { hours: 0.25, label: '15m' },
        { hours: 0.5, label: '30m' },
        { hours: 1, label: '1h' },
        { hours: 3, label: '3h' },
        { hours: 6, label: '6h' },
        { hours: 12, label: '12h' },
        { hours: 24, label: '24h' }
      ];
    case '<7d':
      return [
        { hours: 0.1, label: '6m' },
        { hours: 0.25, label: '15m' },
        { hours: 0.5, label: '30m' },
        { hours: 1, label: '1h' },
        { hours: 3, label: '3h' },
        { hours: 6, label: '6h' },
        { hours: 12, label: '12h' },
        { hours: 24, label: '1d' },
        { hours: 72, label: '3d' },
        { hours: 168, label: '7d' }
      ];
    case '<30d':
      return [
        { hours: 0.1, label: '6m' },
        { hours: 0.25, label: '15m' },
        { hours: 0.5, label: '30m' },
        { hours: 1, label: '1h' },
        { hours: 3, label: '3h' },
        { hours: 6, label: '6h' },
        { hours: 12, label: '12h' },
        { hours: 24, label: '1d' },
        { hours: 72, label: '3d' },
        { hours: 168, label: '1w' },
        { hours: 720, label: '30d' }
      ];
    case 'All':
    default:
      return [
        { hours: 0.1, label: '6m' },
        { hours: 0.25, label: '15m' },
        { hours: 0.5, label: '30m' },
        { hours: 1, label: '1h' },
        { hours: 3, label: '3h' },
        { hours: 6, label: '6h' },
        { hours: 12, label: '12h' },
        { hours: 24, label: '1d' },
        { hours: 72, label: '3d' },
        { hours: 168, label: '1w' },
        { hours: 720, label: '1m' },
        { hours: 2160, label: '3m' }
      ];
  }
}

/**
 * Get appropriate time levels for grid lines based on selected filter
 */
export function getTimeLevelsForFilter(timeFilter: TimeFilter): number[] {
  switch (timeFilter) {
    case '<1h':
      return [0.1, 0.25, 0.5, 1];
    case '<24h':
      return [0.1, 0.25, 0.5, 1, 3, 6, 12, 24];
    case '<7d':
      return [0.1, 0.25, 0.5, 1, 3, 6, 12, 24, 72, 168];
    case '<30d':
      return [0.1, 0.25, 0.5, 1, 3, 6, 12, 24, 72, 168, 720];
    case 'All':
    default:
      return [0.1, 0.25, 0.5, 1, 3, 6, 12, 24, 72, 168, 720, 2160];
  }
}

/**
 * Get the maximum time range for X-axis scaling based on selected filter
 */
export function getMaxTimeRangeForFilter(timeFilter: TimeFilter): number {
  switch (timeFilter) {
    case '<1h':
      return 1; // 1 hour
    case '<24h':
      return 24; // 24 hours
    case '<7d':
      return 168; // 7 days = 168 hours
    case '<30d':
      return 720; // 30 days = 720 hours
    case 'All':
      return 2160; // 3 months
    default:
      return 2160; // 3 months default
  }
}

/**
 * Get the minimum time range for X-axis scaling based on selected filter
 */
export function getMinTimeRangeForFilter(): number {
  return 0.1; // Always 6 minutes minimum
}

/**
 * Get appropriate aggregation time period based on selected filter
 */
export function getAggregationPeriodForFilter(timeFilter: TimeFilter): string {
  switch (timeFilter) {
    case '<1h':
      return '5m'; // 5 minutes for sub-hour analysis
    case '<24h':
      return '30m'; // 30 minutes for daily analysis
    case '<7d':
      return '6h'; // 6 hours for weekly analysis
    case '<30d':
      return '12h'; // 12 hours for monthly analysis
    case 'All':
      return '1d'; // 1 day for 3-month analysis
    default:
      return '1d'; // 1 day default
  }
}
