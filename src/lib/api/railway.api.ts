import { BaseApi } from './base.api';
import { ApiResponse, RequestConfig, RailwayPriceResponse } from '@/lib/types';

class RailwayApi extends BaseApi {
  private static readonly BASE_URL = 'https://streamer-production-3d21.up.railway.app/api';
  private static instance: RailwayApi;

  private constructor(config: RequestConfig = {}) {
    super(RailwayApi.BASE_URL, config);
  }

  public static getInstance(config: RequestConfig = {}): RailwayApi {
    if (!RailwayApi.instance) {
      RailwayApi.instance = new RailwayApi(config);
    }
    return RailwayApi.instance;
  }

  async getPrice(tokenAddress: string): Promise<ApiResponse<RailwayPriceResponse>> {
    const path = `/prices/${tokenAddress}`;
    return this.get<RailwayPriceResponse>(path);
  }
}

export const railwayApi = RailwayApi.getInstance();
