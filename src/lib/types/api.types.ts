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
