export interface PMXMarket {
  title: string;
  end_date: string;
  description: string;
  resolved: boolean;
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
