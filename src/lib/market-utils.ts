
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
  optionImagesUrl?: { [key: string]: string };
}): string | undefined {
  const marketImage = market.marketImageUrl;
  const firstOptionImage = market.optionImagesUrl ? Object.values(market.optionImagesUrl)[0] : undefined;
  return marketImage || firstOptionImage;
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
 * Main function to calculate and format market option values
 * This is the single source of truth for market option calculations
 */
export function calculateMarketOptionValues(
  options: string[],
  cas?: {
    [key: string]: {
      tokenMint: string;
      poolAddress: string;
      name?: string;
      currentPrice?: number;
      change24h?: number;
    };
  },
  optionsViewMode: 'odds' | 'prices' = 'odds'
) {
  const sortedOptions = [...options].sort((a, b) => {
    const aUpper = a.toUpperCase();
    const bUpper = b.toUpperCase();
    
    if (aUpper.includes('YES') && !bUpper.includes('YES')) { return -1; }
    if (!aUpper.includes('YES') && bUpper.includes('YES')) { return 1; }
    
    if (aUpper.includes('NO') && !bUpper.includes('NO')) { return -1; }
    if (!aUpper.includes('NO') && bUpper.includes('NO')) { return 1; }
    
    return 0;
  });
  
  const displayOptions = sortedOptions.length >= 2 ? sortedOptions.slice(0, 2) : ['Yes', 'No'];
  
  const displayNames = displayOptions.map(option => {
    const casData = cas?.[option];
    return casData?.name || option;
  });
  
  const prices = displayOptions.map(option => getOptionPrice(option, cas));
  
  const normalizedPrices = normalizePrices(prices);
  
  const formattedValues = normalizedPrices.map((_, index) => 
    formatMarketOptionValue(normalizedPrices, index, optionsViewMode)
  );
  
  const change24h = getOptionChange24h(displayOptions[0], cas);
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
