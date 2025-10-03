import { pmxApi, railwayApi, pmxSupabaseApi, backendProductionRailwayApi } from '@/lib/api';
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
    const markets: Market[] = this.mapSupabaseData(pmxMarkets, supabaseData);

    await this.fetchCurrentPrices(markets);
    await this.fetchHistoricalPrices(markets);
    await this.fetchMarketFees(markets);

    markets.forEach(market => {
      const today = new Date();

      const endDate = new Date(market.end_date);

      if (!market.resolved) {
        endDate.setUTCHours(23, 59, 59, 999);
        market.end_date = endDate.toISOString();
      }

      const diffTime = endDate.getTime() - today.getTime();
      market.daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (market.daysRemaining <= 0 && !market.resolved) {
        const yesOption = market.options.YES;
        const noOption = market.options.NO;
        if (yesOption.currentPrice && noOption.currentPrice) {
          market.resolved = yesOption.currentPrice > noOption.currentPrice ? yesOption.name || 'Yes' : noOption.name || 'No';
        }
      }
    });

    return markets.sort((a, b) => {
      const dateA = new Date(a.end_date).getTime();
      const dateB = new Date(b.end_date).getTime();
      return dateA - dateB;
    });
  }

  private mapSupabaseData(pmxMarkets: PMXMarket[], supabaseData?: PMXSupabaseMarket[]): Market[] {
    const supabaseMapByName = new Map<string, PMXSupabaseMarket>();
    if (supabaseData) {
      supabaseData.forEach((supabaseMarket) => {
        supabaseMapByName.set(supabaseMarket.name, supabaseMarket);
      });
    }

    return pmxMarkets.map((market) => {
      const matchingSupabaseMarket = supabaseMapByName.get(market.title);

      if (!matchingSupabaseMarket) {
        return {
          ...market,
          slug: ''
        };
      }

      const { image_urls, limit, created_at, collected_fees } = matchingSupabaseMarket;

      const marketImageUrl = typeof image_urls.market === 'string'
        ? image_urls.market
        : image_urls.market?.url;

      const optionImagesUrl = {
        YES: typeof image_urls.YES === 'string' ? image_urls.YES : image_urls.YES?.url,
        NO: typeof image_urls.NO === 'string' ? image_urls.NO : image_urls.NO?.url
      };

      market.options.YES.imageUrl = optionImagesUrl.YES;
      market.options.NO.imageUrl = optionImagesUrl.NO;

      return {
        ...market,
        slug: matchingSupabaseMarket.slug,
        marketImageUrl,
        limit,
        createdAt: created_at,
        totalFees: collected_fees
      };
    });
  }

  private async fetchCurrentPrices(markets: Market[]): Promise<void> {
    const tokenMints = markets.flatMap(market =>
      [market.cas.YES.tokenMint, market.cas.NO.tokenMint]
    );

    const pricePromises = tokenMints.map(address =>
      railwayApi.getPrice(address).catch(() => ({ success: false, data: null }))
    );
    const priceResults = await Promise.all(pricePromises);

    const priceMap = new Map<string, number>();
    tokenMints.forEach((address, index) => {
      const result = priceResults[index];
      if (result.success && result.data) {
        const price = parseFloat(result.data.price);
        priceMap.set(address, price);
      }
    });

    markets.forEach(market => {
      const yesTokenMint = market.cas.YES.tokenMint;
      const noTokenMint = market.cas.NO.tokenMint;

      const yesCurrentPrice = priceMap.get(yesTokenMint);
      const noCurrentPrice = priceMap.get(noTokenMint);

      if (yesCurrentPrice !== undefined) {
        market.options.YES.currentPrice = yesCurrentPrice;
      }
      if (noCurrentPrice !== undefined) {
        market.options.NO.currentPrice = noCurrentPrice;
      }
    });
  }

  private async fetchHistoricalPrices(markets: Market[]): Promise<void> {
    const tokenMints = markets.flatMap(market =>
      [market.cas.YES.tokenMint, market.cas.NO.tokenMint]
    );

    if (tokenMints.length === 0) {
      return;
    }

    const historicalPromises = tokenMints.map(tokenMint =>
      railwayApi.getHistoricalPrice(tokenMint, 500).catch(() => ({ success: false, data: null }))
    );

    const historicalResults = await Promise.all(historicalPromises);

    const tokenToMarketMap = new Map<string, Market['options']['YES']>();
    markets.forEach(market => {
      tokenToMarketMap.set(market.cas.YES.tokenMint, market.options.YES);
      tokenToMarketMap.set(market.cas.NO.tokenMint, market.options.NO);
    });

    tokenMints.forEach((tokenMint, index) => {
      const result = historicalResults[index];
      const option = tokenToMarketMap.get(tokenMint);
      const currentPrice = option?.currentPrice;

      if (result.success && result.data && currentPrice !== undefined && option) {
        const change24h = this.calculate24hChange(result.data, currentPrice);
        option.change24h = change24h;

        if (result.data.historicalData) {
          option.priceHistory = result.data.historicalData.slice(0, -1);
          option.priceHistory.unshift({
            timestamp: new Date().toISOString(),
            price: currentPrice,
            volume: result.data.historicalData[0].volume,
            market_cap: result.data.historicalData[0].market_cap
          });
        }
      }
    });
  }

  private async fetchMarketFees(markets: Market[]): Promise<void> {
    const activeMarkets = markets.filter(market => market.slug && !market.resolved);

    if (activeMarkets.length === 0) {
      return;
    }

    const feesPromises = activeMarkets.map(market =>
      backendProductionRailwayApi.getMarketFees(market.slug).catch(() => ({ success: false, data: null }))
    );

    const feesResults = await Promise.all(feesPromises);

    activeMarkets.forEach((market, index) => {
      const result = feesResults[index];

      if (result.success && result.data) {
        const feesData = result.data;

        market.totalFees = feesData.totalFees.total;

        feesData.positionFees.forEach(positionFee => {
          const option = positionFee.option.toUpperCase();
          if (market.options[option as keyof typeof market.options]) {
            market.options[option as keyof typeof market.options].fees = positionFee.totalFees;
          }
        });
      }
    });
  }

  private calculate24hChange(historicalData: HistoricalPriceResponse, currentPrice: number): number {
    if (!historicalData.historicalData || historicalData.historicalData.length === 0) {
      return 0;
    }

    const now = new Date();
    const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

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

    return ((currentPrice - price24hAgo) / price24hAgo) * 100;
  }
}

export const marketsController = new MarketsController();
