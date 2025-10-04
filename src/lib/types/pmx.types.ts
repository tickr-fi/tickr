export interface PMXMarket {
  title: string;
  end_date: string;
  description: string;
  resolved: boolean | string;
  options: {
    YES: {
      tokenMint: string;
      poolAddress: string;
      name?: string;
      currentPrice?: number;
      change24h?: number;
      priceHistory?: HistoricalDataPoint[];
      imageUrl?: string;
      fees?: number;
    };
    NO: {
      tokenMint: string;
      poolAddress: string;
      name?: string;
      currentPrice?: number;
      change24h?: number;
      priceHistory?: HistoricalDataPoint[];
      imageUrl?: string;
      fees?: number;
    };
  };
  cas: {
    YES: {
      tokenMint: string;
      poolAddress: string;
    };
    NO: {
      tokenMint: string;
      poolAddress: string;
    };
  };
}

export interface PMXApiResponse {
  success: boolean;
  data: PMXMarket[];
  count: number;
  limit: number;
}

export interface PMXApiError {
  success: false;
  error: string;
}

export interface PMXSingleMarketResponse {
  success: boolean;
  data: PMXMarket;
}

export interface PriceResponse {
  success: boolean;
  price: string;
  timestamp: string;
  volume: number;
  marketCap: number;
  source: string;
}

export interface HistoricalDataPoint {
  timestamp: string;
  price: number;
  volume: number;
  market_cap: number;
}

export interface HistoricalPriceResponse {
  success: boolean;
  historicalData: HistoricalDataPoint[];
  count: number;
  tokenMint: string;
  hasCurrentPrice: boolean;
}

export interface PMXSupabaseMarket {
  name: string;
  slug: string;
  image_urls: {
    [key: string]: string | { url: string }
  };
  limit: number;
  created_at: string;
  end_date: string;
  options: {
    [key: string]: {
      name: string;
      ticker: string;
      metadata_url: string;
    };
  };
  collected_fees: number;
}

// Internal market type
export interface Market extends PMXMarket {
  slug: string; // URL-friendly version of title
  marketImageUrl?: string;
  limit?: number;
  createdAt?: string;
  daysRemaining?: number;
  totalFees?: number;
}

// Premarket types
export interface PMXSupabasePremarket {
  id: string;
  creator_address: string;
  name: string;
  options: string[];
  end_date: string;
  rules: string;
  created_at: string;
  description: string;
  image_urls: {
    market: {
      url: string;
      size: number;
      filename: string;
      mimetype: string;
    };
    option1: {
      url: string;
      size: number;
      filename: string;
      mimetype: string;
    };
    option2: {
      url: string;
      size: number;
      filename: string;
      mimetype: string;
    };
  };
  slug: string;
  funding_wallet: string;
  limit: number;
  has_funded: boolean;
  migrated: boolean;
  balance: number;
  rejected: boolean | null;
  expired: boolean;
  daysRemaining?: number;
  fundingProgress?: number;
}

// Internal premarket type for processed data
export interface Premarket extends PMXSupabasePremarket {
  daysRemaining?: number;
  fundingProgress?: number;
}

