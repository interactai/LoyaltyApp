
/**
 * centralized API Client
 * This file handles the low-level HTTP requests, Auth headers, and error handling.
 */

// CONFIGURATION
// In a real app, use process.env.REACT_APP_API_URL
export const API_BASE_URL = "https://api.your-backend.com/v1"; 

export interface ApiResponse<T> {
  data: T;
  error?: string;
  status: number;
}

/**
 * A generic fetch wrapper that handles headers and auth
 */
async function request<T>(
  endpoint: string, 
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET', 
  body?: any
): Promise<T> {
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    // Add Auth Token if available
    // 'Authorization': `Bearer ${localStorage.getItem('token')}` 
  };

  const config: RequestInit = {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

    // Handle 401 Unauthorized (Logout user)
    if (response.status === 401) {
      // window.location.href = '/login';
      throw new Error('Unauthorized');
    }

    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({}));
      throw new Error(errorBody.message || `HTTP Error ${response.status}`);
    }

    // If the response is empty (e.g. 204 No Content)
    if (response.status === 204) {
      return {} as T;
    }

    return await response.json();
  } catch (error) {
    console.error(`API Request Failed: ${endpoint}`, error);
    throw error;
  }
}

// Typed API methods
export const apiClient = {
  get: <T>(url: string) => request<T>(url, 'GET'),
  post: <T>(url: string, body: any) => request<T>(url, 'POST', body),
  put: <T>(url: string, body: any) => request<T>(url, 'PUT', body),
  delete: <T>(url: string) => request<T>(url, 'DELETE'),
};
