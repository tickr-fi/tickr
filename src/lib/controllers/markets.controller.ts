import { pmxApi, railwayApi, pmxSupabaseApi } from '@/lib/api';
import { PMXApiResponse, PMXMarket, Market, ApiResponse, PMXSupabaseMarket } from '@/lib/types';

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
    const markets: Market[] = pmxMarkets.map((market) => {
      return {
        ...market,
        slug: this.generateSlug(market.title)
      };
    });

    const supabaseMap = new Map<string, PMXSupabaseMarket>();
    if (supabaseData) {
      supabaseData.forEach((supabaseMarket) => {
        const slug = this.generateSlug(supabaseMarket.name);
        supabaseMap.set(slug, supabaseMarket);
      });
    }

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

    const data = markets.map((market) => {
      
      const enhancedCas: typeof market.cas = {};
      Object.entries(market.cas).forEach(([key, ca]) => {
        const tokenMint = ca.tokenMint;
        const currentPrice = priceMap.get(tokenMint);
        
        enhancedCas[key] = {
          ...ca,
          currentPrice
        };
      });

      const supabaseData = supabaseMap.get(market.slug);
      const mappedData = supabaseData ? this.mapSupabaseData(supabaseData) : {};

      const today = new Date();
      const end = new Date(market.end_date);
      const diffTime = end.getTime() - today.getTime();
      const daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      return {
        ...market,
        cas: enhancedCas,
        ...mappedData,
        daysRemaining
      };
    });

    return data.sort((a, b) => {
      const dateA = new Date(a.end_date).getTime();
      const dateB = new Date(b.end_date).getTime();
      return dateA - dateB;
    });
  }

  private mapSupabaseData(supabaseData: PMXSupabaseMarket) {
    const { image_urls, limit } = supabaseData;
    
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
      limit
    };
  }

  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }
}

export const marketsController = new MarketsController();
