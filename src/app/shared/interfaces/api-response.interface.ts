export interface IApiResponse<T> {
  data: T;
  success: boolean;
  timestamp: Date;
  source: 'brasilapi';
  endpoint: string;
  responseTime?: number;
}

export interface IApiError {
  code: string;
  message: string;
  details?: Record<string, any>;
  timestamp: Date;
  endpoint: string;
  httpStatus?: number;
  retryable: boolean;
}

export interface ILoadingState {
  isLoading: boolean;
  error: string | null;
  lastUpdated: Date | null;
  retryCount: number;
}