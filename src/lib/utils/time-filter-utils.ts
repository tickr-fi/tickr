import { Market } from '@/lib/types';
import { calculateTimeRemaining } from './grid-utils';
import { type GridTimeFilter } from '@/stores';

/**
 * Get maximum hours for each time filter
 */
export function getMaxHoursForFilter(timeFilter: GridTimeFilter): number {
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
export function filterMarketsByTime(markets: Market[], timeFilter: GridTimeFilter): Market[] {
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
export function getTimeLabelsForFilter(timeFilter: GridTimeFilter) {
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
 * Get filtered time labels based on dynamic minimum time
 */
export function getFilteredTimeLabels(timeFilter: GridTimeFilter, minHours: number, maxHours: number) {
  const allLabels = getTimeLabelsForFilter(timeFilter);
  return allLabels.filter(({ hours }) => hours >= minHours && hours <= maxHours);
}

/**
 * Get appropriate time levels for grid lines based on selected filter
 */
export function getTimeLevelsForFilter(timeFilter: GridTimeFilter): number[] {
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
export function getMaxTimeRangeForFilter(timeFilter: GridTimeFilter): number {
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
 * Calculate dynamic minimum time based on actual market data
 * Returns the closest predefined log level that includes all markets
 */
export function calculateDynamicMinTime(markets: Market[], timeFilter: GridTimeFilter): number {
  if (markets.length === 0) {
    return 0.1; // Default fallback
  }

  const maxHours = getMaxHoursForFilter(timeFilter);
  const timeLevels = getTimeLevelsForFilter(timeFilter);

  // Get all time remaining values from markets within the filter range
  const timeRemainingValues = markets
    .map(market => calculateTimeRemaining(market.end_date))
    .filter(time => time <= maxHours && time > 0)
    .sort((a, b) => a - b);

  if (timeRemainingValues.length === 0) {
    return 0.1; // Default fallback if no valid markets
  }

  const minTime = timeRemainingValues[0];

  // Find the closest time level that is <= the minimum market time
  // This ensures all markets are included in the visible range
  let selectedMinTime = 0.1; // Default minimum

  for (let i = timeLevels.length - 1; i >= 0; i--) {
    if (timeLevels[i] <= minTime) {
      selectedMinTime = timeLevels[i];
      break;
    }
  }

  return selectedMinTime;
}

/**
 * Get appropriate aggregation time period based on selected filter
 */
export function getAggregationPeriodForFilter(timeFilter: GridTimeFilter): string {
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
