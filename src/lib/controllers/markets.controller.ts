import { pmxApi, railwayApi, pmxSupabaseApi } from '@/lib/api';
import { PMXApiResponse, PMXMarket, Market, ApiResponse, PMXSupabaseMarket, HistoricalPriceResponse } from '@/lib/types';

export class MarketsController {

  async getAllMarkets(limit: number = 50): Promise<ApiResponse<Market[]>> {
    try {
      const [pmxResponse, supabaseResponse] = await Promise.all([
        pmxApi.getAllMarkets(limit),
        pmxSupabaseApi.getMarkets().catch(() => ({ success: false, data: [] }))
      ]);
      
      if (!pmxResponse.success) {
        return { 
          success: false, 
          error: pmxResponse.error || 'Failed to fetch active markets' 
        };
      }

      const pmxData = pmxResponse.data as PMXApiResponse;
      if (!pmxData.success) {
        return { 
          success: false, 
          error: 'PMX API returned unsuccessful response' 
        };
      }

      const supabaseData = supabaseResponse.success ? supabaseResponse.data : undefined;
      const markets: Market[] = await this.processData(pmxData.data, supabaseData);
      return { success: true, data: markets };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error fetching markets' 
      };
    }
  }

  private async processData(pmxMarkets: PMXMarket[], supabaseData?: PMXSupabaseMarket[]): Promise<Market[]> {
    const supabaseMapByName = new Map<string, PMXSupabaseMarket>();
    if (supabaseData) {
      supabaseData.forEach((supabaseMarket) => {
        supabaseMapByName.set(supabaseMarket.name, supabaseMarket);
      });
    }

    const markets: Market[] = pmxMarkets.map((market) => {
      const matchingSupabaseMarket = supabaseMapByName.get(market.title);
      const mappedData = matchingSupabaseMarket ? this.mapSupabaseData(matchingSupabaseMarket) : {};

      return {
        ...market,
        slug: matchingSupabaseMarket?.slug || '',
        ...mappedData
      };
    });

    const tokenMint = markets.flatMap(market => 
      Object.values(market.cas).map(ca => ca.tokenMint)
    );

    const pricePromises = tokenMint.map(address => 
      railwayApi.getPrice(address).catch(() => ({ success: false, data: null }))
    );
    const priceResults = await Promise.all(pricePromises);

    const priceMap = new Map<string, number>();
    tokenMint.forEach((address, index) => {
      const result = priceResults[index];
      if (result.success && result.data) {
        const price = parseFloat(result.data.price);
        priceMap.set(address, price);
      }
    });

    // Fetch historical prices for YES options only
    const yesTokenMints = this.getYesOptionTokenMints(markets);
    const change24hMap = await this.fetchHistoricalPrices(yesTokenMints, priceMap);

    const enhancedMarkets = markets.map((market) => {
      const enhancedCas: typeof market.cas = {};
      Object.entries(market.cas).forEach(([key, ca]) => {
        const tokenMint = ca.tokenMint;
        const currentPrice = priceMap.get(tokenMint);
        const change24h = change24hMap.get(tokenMint);
        
        enhancedCas[key] = {
          ...ca,
          currentPrice,
          change24h
        };
      });

      const matchingSupabaseMarket = supabaseMapByName.get(market.title);
      if (matchingSupabaseMarket?.options) {
        Object.entries(matchingSupabaseMarket.options).forEach(([optionKey, optionData]) => {
          if (enhancedCas[optionKey]) {
            enhancedCas[optionKey] = {
              ...enhancedCas[optionKey],
              name: optionData.name
            };
          }
        });
      }

      const today = new Date();
      const end = new Date(market.end_date);
      const diffTime = end.getTime() - today.getTime();
      const daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      return {
        ...market,
        cas: enhancedCas,
        daysRemaining
      };
    });

    return enhancedMarkets.sort((a, b) => {
      const dateA = new Date(a.end_date).getTime();
      const dateB = new Date(b.end_date).getTime();
      return dateA - dateB;
    });
  }

  private mapSupabaseData(supabaseData: PMXSupabaseMarket) {
    const { image_urls, limit, created_at } = supabaseData;
    
    const marketImageUrl = typeof image_urls.market === 'string' 
      ? image_urls.market 
      : image_urls.market?.url;

    const optionImagesUrl = Object.fromEntries(
      Object.entries(image_urls)
        .filter(([key]) => key !== 'market')
        .map(([key, value]) => [
          key, 
          typeof value === 'string' ? value : value.url
        ])
    );

    return {
      marketImageUrl,
      optionImagesUrl,
      limit,
      createdAt: created_at
    };
  }

  private getYesOptionTokenMints(markets: Market[]): string[] {
    return markets
      .flatMap(market => Object.entries(market.cas))
      .filter(([key]) => key === 'YES')
      .map(([, ca]) => ca.tokenMint);
  }

  private async fetchHistoricalPrices(tokenMints: string[], priceMap: Map<string, number>): Promise<Map<string, number>> {
    const change24hMap = new Map<string, number>();
    
    if (tokenMints.length === 0) {
      return change24hMap;
    }

    const historicalPromises = tokenMints.map(tokenMint =>
      railwayApi.getHistoricalPrice(tokenMint, 25).catch(() => ({ success: false, data: null }))
    );

    const historicalResults = await Promise.all(historicalPromises);

    tokenMints.forEach((tokenMint, index) => {
      const result = historicalResults[index];
      const currentPrice = priceMap.get(tokenMint);
      
      if (result.success && result.data && currentPrice !== undefined) {
        const change24h = this.calculate24hChange(result.data, currentPrice);
        change24hMap.set(tokenMint, change24h);
      }
    });

    return change24hMap;
  }

  private calculate24hChange(historicalData: HistoricalPriceResponse, currentPrice: number): number {
    if (!historicalData.historicalData || historicalData.historicalData.length === 0) {
      return 0;
    }

    const now = new Date();
    const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    
    // Find the closest data point to 24 hours ago
    let closestPoint = historicalData.historicalData[0];
    let minTimeDiff = Math.abs(new Date(closestPoint.timestamp).getTime() - twentyFourHoursAgo.getTime());

    for (const point of historicalData.historicalData) {
      const timeDiff = Math.abs(new Date(point.timestamp).getTime() - twentyFourHoursAgo.getTime());
      if (timeDiff < minTimeDiff) {
        minTimeDiff = timeDiff;
        closestPoint = point;
      }
    }

    const price24hAgo = closestPoint.price;

    if (price24hAgo === 0) {
      return 0;
    }

    // Calculate percentage change using the current price we already loaded
    return ((currentPrice - price24hAgo) / price24hAgo) * 100;
  }
}

export const marketsController = new MarketsController();
