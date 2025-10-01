import { BaseApi } from './base.api';
import { ApiResponse, RequestConfig, PriceResponse, HistoricalPriceResponse } from '@/lib/types';

class StreamerRailwayApi extends BaseApi {
  private static readonly BASE_URL = 'https://streamer-production-3d21.up.railway.app/api';
  private static instance: StreamerRailwayApi;

  private constructor(config: RequestConfig = {}) {
    super(StreamerRailwayApi.BASE_URL, config);
  }

  public static getInstance(config: RequestConfig = {}): StreamerRailwayApi {
    if (!StreamerRailwayApi.instance) {
      StreamerRailwayApi.instance = new StreamerRailwayApi(config);
    }
    return StreamerRailwayApi.instance;
  }

  async getPrice(tokenAddress: string): Promise<ApiResponse<PriceResponse>> {
    const path = `/prices/${tokenAddress}`;
    return this.get<PriceResponse>(path);
  }

  async getHistoricalPrice(tokenAddress: string, limit: number = 1000): Promise<ApiResponse<HistoricalPriceResponse>> {
    const path = `/prices/${tokenAddress}/history?limit=${limit}`;
    return this.get<HistoricalPriceResponse>(path);
  }
}

export const streamerRailwayApi = StreamerRailwayApi.getInstance();
