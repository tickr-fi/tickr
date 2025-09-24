export interface PMXMarket {
  title: string;
  end_date: string;
  description: string;
  resolved: boolean;
  options: string[];
  cas: {
    [key: string]: {
      tokenMint: string;
      poolAddress: string;
      currentPrice?: number; // Current price for this specific case/option
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

export interface RailwayPriceResponse {
  success: boolean;
  price: string;
  timestamp: string;
  volume: number;
  marketCap: number;
  source: string;
}

export interface PMXSupabaseMarket {
  name: string;
  image_urls: {
    [key: string]: string | { url: string }
  };
  limit: number;
}

// Internal market type
export interface Market extends PMXMarket {
  slug: string; // URL-friendly version of title
  marketImageUrl?: string;
  optionImagesUrl?: {
    [key: string]: string;
  };
  limit?: number;
  daysRemaining?: number;
}
