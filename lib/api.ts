import {
  Analytics,
  ApiError,
  CreateUrlRequest,
  CreateUrlResponse,
} from './types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

class ApiClient {
  private async request<T>(
    endpoint: string,
    options?: RequestInit,
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
      });

      if (!response.ok) {
        const error: ApiError = await response.json().catch(() => ({
          error: `HTTP ${response.status}: ${response.statusText}`,
        }));
        throw new Error(error.error);
      }

      return await response.json();
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('An unexpected error occurred');
    }
  }

  async createShortUrl(data: CreateUrlRequest): Promise<CreateUrlResponse> {
    return this.request<CreateUrlResponse>('/api/v1/urls', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getAnalytics(shortCode: string): Promise<Analytics> {
    return this.request<Analytics>(`/api/v1/analytics/${shortCode}`);
  }
}

export const apiClient = new ApiClient();
