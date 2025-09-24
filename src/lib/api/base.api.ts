import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { ApiResponse, RequestConfig } from '../types';

export abstract class BaseApi {
  protected axiosInstance: AxiosInstance;
  protected baseURL: string;

  constructor(baseURL: string, config: RequestConfig = {}) {
    this.baseURL = baseURL;
    
    this.axiosInstance = axios.create({
      baseURL,
      timeout: config.timeout || 15000,
      headers: {
        'Content-Type': 'application/json',
        ...config.headers,
      },
      ...config,
    });
  }

  protected async get<T = any>(
    url: string, 
    config?: RequestConfig
  ): Promise<ApiResponse<T>> {
    try {
      const response: AxiosResponse<T> = await this.axiosInstance.get(url, config);
      return {
        success: true,
        data: response.data,
        status: response.status,
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  protected async post<T = any>(
    url: string, 
    data?: any, 
    config?: RequestConfig
  ): Promise<ApiResponse<T>> {
    try {
      const response: AxiosResponse<T> = await this.axiosInstance.post(url, data, config);
      return {
        success: true,
        data: response.data,
        status: response.status,
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  protected async put<T = any>(
    url: string, 
    data?: any, 
    config?: RequestConfig
  ): Promise<ApiResponse<T>> {
    try {
      const response: AxiosResponse<T> = await this.axiosInstance.put(url, data, config);
      return {
        success: true,
        data: response.data,
        status: response.status,
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  protected async delete<T = any>(
    url: string, 
    config?: RequestConfig
  ): Promise<ApiResponse<T>> {
    try {
      const response: AxiosResponse<T> = await this.axiosInstance.delete(url, config);
      return {
        success: true,
        data: response.data,
        status: response.status,
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  protected async patch<T = any>(
    url: string, 
    data?: any, 
    config?: RequestConfig
  ): Promise<ApiResponse<T>> {
    try {
      const response: AxiosResponse<T> = await this.axiosInstance.patch(url, data, config);
      return {
        success: true,
        data: response.data,
        status: response.status,
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  private handleError(error: any): ApiResponse {
    if (error.response) {
      return {
        success: false,
        error: error.response.data?.error || error.response.data?.message || `HTTP ${error.response.status}`,
        status: error.response.status,
      };
    } else if (error.request) {
      return {
        success: false,
        error: 'Network error - no response received',
        status: 0,
      };
    } else {
      return {
        success: false,
        error: error.message || 'Unknown error occurred',
        status: 0,
      };
    }
  }
}
