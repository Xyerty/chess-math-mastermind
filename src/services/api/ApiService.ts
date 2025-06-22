
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  status: number;
}

export interface ApiService {
  get<T>(endpoint: string, params?: Record<string, any>): Promise<ApiResponse<T>>;
  post<T>(endpoint: string, body?: any): Promise<ApiResponse<T>>;
  put<T>(endpoint: string, body?: any): Promise<ApiResponse<T>>;
  delete<T>(endpoint: string): Promise<ApiResponse<T>>;
}

export abstract class BaseApiService implements ApiService {
  protected baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  abstract get<T>(endpoint: string, params?: Record<string, any>): Promise<ApiResponse<T>>;
  abstract post<T>(endpoint: string, body?: any): Promise<ApiResponse<T>>;
  abstract put<T>(endpoint: string, body?: any): Promise<ApiResponse<T>>;
  abstract delete<T>(endpoint: string): Promise<ApiResponse<T>>;

  protected buildUrl(endpoint: string, params?: Record<string, any>): string {
    const url = new URL(endpoint, this.baseUrl);
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, String(value));
      });
    }
    return url.toString();
  }

  protected handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    return response.json().then(data => ({
      data: response.ok ? data : undefined,
      error: response.ok ? undefined : data.error || response.statusText,
      status: response.status
    }));
  }
}
