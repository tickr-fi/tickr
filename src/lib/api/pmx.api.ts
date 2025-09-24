import { BaseApi } from './base.api';
import { PMXMarket, PMXApiResponse, ApiResponse, RequestConfig } from '@/lib/types';

class PMXApi extends BaseApi {
  private static readonly BASE_URL = 'https://pmx.trade/api';
  private static instance: PMXApi;

  private constructor(config: RequestConfig = {}) {
    super(PMXApi.BASE_URL, config);
  }

  public static getInstance(config: RequestConfig = {}): PMXApi {
    if (!PMXApi.instance) {
      PMXApi.instance = new PMXApi(config);
    }
    return PMXApi.instance;
  }

  async getAllMarkets(limit: number = 50): Promise<ApiResponse<PMXApiResponse>> {
    const params = new URLSearchParams({
      limit: Math.min(limit, 100).toString(),
      published: 'true',
    });

    const path = `/markets?${params.toString()}`;
    return this.get<PMXApiResponse>(path);
  }

  async getActiveMarkets(limit: number = 50): Promise<ApiResponse<PMXApiResponse>> {
    const params = new URLSearchParams({
      limit: Math.min(limit, 100).toString(),
    });

    const path = `/markets/active?${params.toString()}`;
    return this.get<PMXApiResponse>(path);
  }

  async getResolvedMarkets(limit: number = 50): Promise<ApiResponse<PMXApiResponse>> {
    const params = new URLSearchParams({
      limit: Math.min(limit, 100).toString(),
    });

    const path = `/markets/resolved?${params.toString()}`;
    return this.get<PMXApiResponse>(path);
  }

  async getMarketsByStatus(status: string, limit: number = 50): Promise<ApiResponse<PMXApiResponse>> {
    const params = new URLSearchParams({
      limit: Math.min(limit, 100).toString(),
    });

    const path = `/markets/status/${status}?${params.toString()}`;
    return this.get<PMXApiResponse>(path);
  }

  async getMarketBySlug(slug: string): Promise<ApiResponse<PMXMarket>> {
    const path = `/market/${slug}`;
    return this.get<PMXMarket>(path);
  }

  async getMarketByCA(ca: string): Promise<ApiResponse<PMXMarket>> {
    const path = `/market-by-ca/${ca}`;
    return this.get<PMXMarket>(path);
  }
}

// Export singleton instance
export const pmxApi = PMXApi.getInstance();
