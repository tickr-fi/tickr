import { BaseApi } from './base.api';
import { ApiResponse, RequestConfig, MarketFeesResponse } from '@/lib/types';

class BackendProductionRailwayApi extends BaseApi {
  private static readonly BASE_URL = 'https://backend-production-2715.up.railway.app/api';
  private static instance: BackendProductionRailwayApi;

  private constructor(config: RequestConfig = {}) {
    super(BackendProductionRailwayApi.BASE_URL, config);
  }

  public static getInstance(config: RequestConfig = {}): BackendProductionRailwayApi {
    if (!BackendProductionRailwayApi.instance) {
      BackendProductionRailwayApi.instance = new BackendProductionRailwayApi(config);
    }
    return BackendProductionRailwayApi.instance;
  }

  async getMarketFees(marketSlug: string): Promise<ApiResponse<MarketFeesResponse>> {
    const path = `/markets/${marketSlug}/fees`;
    return this.get<MarketFeesResponse>(path);
  }
}

export const backendProductionRailwayApi = BackendProductionRailwayApi.getInstance();
