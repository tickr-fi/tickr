import { pmxSupabaseApi } from '@/lib/api';
import { Premarket, ApiResponse } from '@/lib/types';

export class PremarketsController {

    async getAllPremarkets(limit: number = 20, offset: number = 0): Promise<ApiResponse<Premarket[]>> {
        try {
            const supabaseResponse = await pmxSupabaseApi.getPremarkets(limit, offset);

            if (!supabaseResponse.success) {
                return {
                    success: false,
                    error: supabaseResponse.error || 'Failed to fetch premarkets'
                };
            }

            const premarkets: Premarket[] = this.processData(supabaseResponse.data || []);
            return { success: true, data: premarkets };
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error fetching premarkets'
            };
        }
    }

    private processData(supabaseData: Premarket[]): Premarket[] {
        const premarkets: Premarket[] = supabaseData.map((premarket) => {
            const today = new Date();
            const endDate = new Date(premarket.end_date);
            endDate.setUTCHours(23, 59, 59, 999);
            // Calculate days remaining
            const diffTime = endDate.getTime() - today.getTime();
            const daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            // Calculate funding progress percentage
            const fundingProgress = premarket.limit > 0 ? (premarket.balance / premarket.limit) * 100 : 0;

            return {
                ...premarket,
                daysRemaining: Math.max(0, daysRemaining),
                fundingProgress: Math.min(100, Math.max(0, fundingProgress))
            };
        });

        return premarkets;
    }
}

export const premarketsController = new PremarketsController();
