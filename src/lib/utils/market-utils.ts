
/**
 * Normalizes prices to ensure consistent display formatting
 * This function handles small decimal values by scaling them appropriately
 */
export function normalizePrices(prices: number[]): [number, number] {
  const a = prices[0];
  const b = prices[1];
  if (a === 0 && b === 0) { return [0, 0]; }

  function leadingZeros(n: number): number {
    const str = n.toString();
    const match = str.match(/^0\.(0*)[1-9]/);
    return match ? match[1].length : 0;
  }

  const zeros = Math.min(leadingZeros(a), leadingZeros(b));
  const scale = Math.pow(10, zeros + 2);
  const fa = parseFloat((a * scale).toFixed(2));
  const fb = parseFloat((b * scale).toFixed(2));

  return [fa, fb];
}

/**
 * Normalizes prices to ensure consistent display formatting
 * This function handles small decimal values by scaling them appropriately
 */
export function getPriceDivider(yesPrice: number, noPrice: number): number {

  function leadingZeros(n: number): number {
    const str = n.toString();
    const match = str.match(/^0\.(0*)[1-9]/);
    return match ? match[1].length : 0;
  }

  const zeros = Math.min(leadingZeros(yesPrice), leadingZeros(noPrice));
  return zeros;
}

export function normalizePriceWithDivider(price: number, divider: number): number {
  const scale = Math.pow(10, divider + 2);
  return parseFloat((price * scale).toFixed(2));
}

/**
 * Gets the price for a specific option from the market data
 */
export function getOptionPrice(option: string, cas?: {
  [key: string]: {
    tokenMint: string;
    poolAddress: string;
    name?: string;
    currentPrice?: number;
    change24h?: number;
  };
}): number {
  if (!cas) { return 0; }
  const caseData = cas[option];
  return caseData?.currentPrice || 0;
}

/**
 * Gets the 24h change for a specific option from the market data
 */
export function getOptionChange24h(option: string, cas?: {
  [key: string]: {
    tokenMint: string;
    poolAddress: string;
    name?: string;
    currentPrice?: number;
    change24h?: number;
  };
}): number | undefined {
  if (!cas) { return undefined; }
  const caseData = cas[option];
  return caseData?.change24h;
}

/**
 * Formats the display value for market options based on the current view mode
 * This ensures consistent formatting between table and card views
 */
export function formatMarketOptionValue(
  normalizedPrices: [number, number],
  index: number,
  optionsViewMode: 'odds' | 'prices'
): string {
  if (optionsViewMode === 'prices') {
    // Convert percentage to dollar amount (assuming 100% = $1.00)
    const dollarAmount = (normalizedPrices[index] / 100);
    return `$${dollarAmount.toFixed(2)}`;
  } else {
    // 'odds' mode shows percentages
    return `${normalizedPrices[index]}%`;
  }
}

/**
 * Formats the 24h change display
 */
export function formatChange24h(change: number | undefined): string | null {
  if (change === undefined || change === null) {
    return null;
  }

  // If absolute value is less than 0.1, don't show a sign
  if (Math.abs(change) < 0.1) {
    return `${change.toFixed(1)}% (24h)`;
  }

  const sign = change >= 0 ? '+' : '';
  return `${sign}${change.toFixed(1)}% (24h)`;
}

/**
 * Gets the color class for change indicators
 */
export function getChangeColor(change: number | undefined): string {
  if (change === undefined || change === null) {
    return 'text-muted-foreground';
  }

  // If absolute value is under 0.1, return muted foreground
  if (Math.abs(change) < 0.1) {
    return 'text-muted-foreground';
  }

  if (change > 0) {
    return 'text-success';
  }
  if (change < 0) {
    return 'text-destructive';
  }
  return 'text-muted-foreground';
}

/**
 * Gets the color class for option buttons based on index
 */
export function getOptionColor(index: number): string {
  return index === 0
    ? 'bg-success/20 text-success hover:bg-success/30'
    : 'bg-destructive/20 text-destructive hover:bg-destructive/30';
}

/**
 * Gets the 24h change for the first option (usually Yes) from market data
 * This is used for displaying price change indicators
 */
export function getFirstOptionChange24h(
  options: string[],
  cas?: {
    [key: string]: {
      tokenMint: string;
      poolAddress: string;
      name?: string;
      currentPrice?: number;
      change24h?: number;
    };
  }
): number | null {
  if (!cas) { return null; }

  const sortedOptions = Object.entries(cas).sort(([keyA], [keyB]) => {
    if (keyA.toUpperCase().includes('YES') && !keyB.toUpperCase().includes('YES')) { return -1; }
    if (!keyA.toUpperCase().includes('YES') && keyB.toUpperCase().includes('YES')) { return 1; }
    return 0;
  });

  if (sortedOptions.length > 0) {
    return sortedOptions[0][1].change24h || null;
  }

  return null;
}

/**
 * Formats change for display without the "(24h)" suffix
 * Used in card view for compact display
 */
export function formatChangeCompact(change: number): string {
  const sign = change > 0 ? '+' : '';
  return `${sign}${change.toFixed(1)}%`;
}

/**
 * Gets the best available image URL for a market
 * Prioritizes market image, then first option image
 */
export function getMarketImageUrl(market: {
  marketImageUrl?: string;
  options?: {
    YES?: { imageUrl?: string };
    NO?: { imageUrl?: string };
  };
}): string | undefined {
  const marketImage = market.marketImageUrl;
  const firstOptionImage = market.options?.YES?.imageUrl || market.options?.NO?.imageUrl;
  return marketImage || firstOptionImage;
}

/**
 * Gets the image URL for a specific option (YES or NO)
 * Falls back to market image if option image is not available
 */
export function getOptionImageUrl(market: {
  marketImageUrl?: string;
  options?: {
    YES?: { imageUrl?: string };
    NO?: { imageUrl?: string };
  };
}, optionType: 'YES' | 'NO'): string | undefined {
  const optionImage = market.options?.[optionType]?.imageUrl;
  const marketImage = market.marketImageUrl;
  return optionImage || marketImage;
}

/**
 * Formats duration since creation (e.g., "2d 5h", "3h")
 */
export function formatDurationSinceCreation(createdAt?: string): string {
  if (!createdAt) {
    return '--';
  }

  const now = new Date();
  const created = new Date(createdAt);
  const diffTime = now.getTime() - created.getTime();

  const days = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

  if (days > 0) {
    return `${days}d ${hours}h`;
  } else {
    return `${hours}h`;
  }
}

/**
 * Formats time remaining until end date
 */
export function formatTimeRemaining(endDate: string, expiredText: string = 'Expired'): string {
  const now = new Date();
  const end = new Date(endDate);
  const diffTime = end.getTime() - now.getTime();

  if (diffTime <= 0) { return expiredText; }

  const hoursRemaining = diffTime / (1000 * 60 * 60);

  if (hoursRemaining >= 24) {
    const days = Math.floor(hoursRemaining / 24);
    const remainingHours = Math.floor(hoursRemaining % 24);
    return `${days}d ${remainingHours}h`;
  } else {
    return `${Math.floor(hoursRemaining)}h`;
  }
}

/**
 * Gets timer color class based on time remaining
 */
export function getTimerColorClass(endDate: string): string {
  const now = new Date();
  const end = new Date(endDate);
  const diffTime = end.getTime() - now.getTime();

  if (diffTime <= 0) { return 'bg-muted/20 text-muted-foreground'; }

  const hoursRemaining = diffTime / (1000 * 60 * 60);

  if (hoursRemaining < 1) {
    return 'bg-destructive/20 text-destructive animate-pulse';
  } else if (hoursRemaining < 24) {
    return 'bg-amber-500/20 text-amber-500';
  } else {
    return '';
  }
}

/**
 * Gets status color class based on market status
 */
export function getStatusColorClass(status: string): string {
  switch (status) {
    case 'ACTIVE':
      return 'bg-success/20 text-success';
    case 'RESOLVED':
      return 'bg-blue-500/20 text-blue-500';
    default:
      return 'bg-muted/20 text-muted-foreground';
  }
}

/**
 * Formats volume for display with appropriate suffixes (K, M)
*/
export function formatVolume(volume: number): string {
  if (volume === 0) {
    return 'N/A';
  }

  if (volume >= 1000000) {
    return `$${(volume / 1000000).toFixed(1)}M`;
  } else if (volume >= 1000) {
    return `$${(volume / 1000).toFixed(1)}K`;
  } else {
    return `$${volume.toFixed(0)}`;
  }
}

/**
 * Main function to calculate and format market option values
 * This is the single source of truth for market option calculations
 */
export function calculateMarketOptionValues(
  options: {
    YES: {
      tokenMint: string;
      poolAddress: string;
      name?: string;
      currentPrice?: number;
      change24h?: number;
      priceHistory?: any[];
    };
    NO: {
      tokenMint: string;
      poolAddress: string;
      name?: string;
      currentPrice?: number;
    };
  },
  optionsViewMode: 'odds' | 'prices' = 'odds'
) {

  const displayOptions = ['YES', 'NO'];

  const displayNames = [
    options.YES.name || 'Yes',
    options.NO.name || 'No'
  ];

  const prices = [
    options.YES.currentPrice || 0,
    options.NO.currentPrice || 0
  ];

  const normalizedPrices = normalizePrices(prices);

  const formattedValues = normalizedPrices.map((_, index) =>
    formatMarketOptionValue(normalizedPrices, index, optionsViewMode)
  );

  const change24h = options.YES.change24h;
  const formattedChange = formatChange24h(change24h);
  const changeColor = getChangeColor(change24h);

  const optionColors = displayOptions.map((_, index) => getOptionColor(index));

  return {
    displayOptions,
    displayNames,
    normalizedPrices,
    formattedValues,
    optionColors,
    change24h,
    formattedChange,
    changeColor
  };
}
