import { AxiosRequestConfig } from 'axios';

export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    error?: string;
    status?: number;
}

export interface RequestConfig extends AxiosRequestConfig {
    timeout?: number;
}

export interface MarketFeesTotal {
    usdc: number;
    token: number;
    total: number;
}

export interface MarketFeesPosition {
    option: string;
    hasPosition: boolean;
    usdcFees: number;
    tokenFees: number;
    totalFees: number;
    positionAddress: string;
    poolAddress: string;
}

export interface MarketFeesResponse {
    success: boolean;
    marketSlug: string;
    totalFees: MarketFeesTotal;
    positionFees: MarketFeesPosition[];
}
