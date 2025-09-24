import { BaseApi } from './base.api';
import { ApiResponse, RequestConfig } from '@/lib/types';
import { PMXSupabaseMarket } from '@/lib/types/pmx.types';

class PMXSupabaseApi extends BaseApi {
  private static readonly BASE_URL = 'https://xqdrbspnwgjvzvgzulls.supabase.co/rest/v1';
  private static instance: PMXSupabaseApi;

  private constructor(config: RequestConfig = {}) {
    super(PMXSupabaseApi.BASE_URL, config);
  }

  public static getInstance(config: RequestConfig = {}): PMXSupabaseApi {
    if (!PMXSupabaseApi.instance) {
      PMXSupabaseApi.instance = new PMXSupabaseApi(config);
    }
    return PMXSupabaseApi.instance;
  }

  async getMarkets(): Promise<ApiResponse<PMXSupabaseMarket[]>> {
    const path = '/markets?select=*&published=eq.true&order=created_at.desc';
    return this.get<PMXSupabaseMarket[]>(path, {
      headers: {
        // eslint-disable-next-line max-len
        'ApiKey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhxZHJic3Bud2dqdnp2Z3p1bGxzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY3OTIyMDQsImV4cCI6MjA3MjM2ODIwNH0.eoM6FmA9ZvUHggRDcbCzydBW1ANtB_-Qw7ngdsrlv-c'
      }
    });
  }
}

export const pmxSupabaseApi = PMXSupabaseApi.getInstance();
