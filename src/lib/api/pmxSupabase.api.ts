import { BaseApi } from './base.api';
import { ApiResponse, RequestConfig } from '@/lib/types';
import { PMXSupabaseMarket, Premarket } from '@/lib/types/pmx.types';

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
    const path = '/markets?select=name,slug,image_urls,limit,created_at,options,collected_fees&published=eq.true&order=end_date.desc';
    return this.get<PMXSupabaseMarket[]>(path, {
      headers: {
        // eslint-disable-next-line max-len
        'ApiKey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhxZHJic3Bud2dqdnp2Z3p1bGxzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY3OTIyMDQsImV4cCI6MjA3MjM2ODIwNH0.eoM6FmA9ZvUHggRDcbCzydBW1ANtB_-Qw7ngdsrlv-c'
      }
    });
  }

  async getPremarkets(limit: number = 20, offset: number = 0): Promise<ApiResponse<Premarket[]>> {
    const now = new Date().toISOString();
    const path = `/presale-markets?select=*&migrated=eq.false&has_funded=eq.false&end_date=gt.${now}&or=(rejected.is.null,rejected.eq.false)&balance=not.is.null&order=balance.desc,created_at.desc&offset=${offset}&limit=${limit}`;
    return this.get<Premarket[]>(path, {
      headers: {
        // eslint-disable-next-line max-len
        'ApiKey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhxZHJic3Bud2dqdnp2Z3p1bGxzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY3OTIyMDQsImV4cCI6MjA3MjM2ODIwNH0.eoM6FmA9ZvUHggRDcbCzydBW1ANtB_-Qw7ngdsrlv-c'
      }
    });
  }
}

export const pmxSupabaseApi = PMXSupabaseApi.getInstance();
