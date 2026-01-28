export interface CreateUrlRequest {
  long_url: string;
  custom_alias?: string;
  ttl_days?: number;
}

export interface CreateUrlResponse {
  short_url: string;
  expires_at?: string;
}

export interface Analytics {
  short_code: string;
  click_count: number;
  last_accessed?: string;
}

export interface ApiError {
  error: string;
}
