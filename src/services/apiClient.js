import { API_CONFIG } from '../config/apiConfig';

/**
 * Standard API Client with automatic JSON parsing, authentication headers, and error handling.
 */
class ApiClient {
  constructor(baseUrl = API_CONFIG.BASE_URL, timeout = API_CONFIG.TIMEOUT) {
    this.baseUrl = baseUrl.replace(/\/$/, ''); // strip trailing slash
    this.timeout = timeout;
  }

  /**
   * Helper to retrieve auth token if stored
   */
  getAuthToken() {
    try {
      return localStorage.getItem('craftinator_auth_token');
    } catch {
      return null;
    }
  }

  /**
   * Generic request handler with timeout and error handling
   */
  async request(endpoint, options = {}) {
    const url = endpoint.startsWith('http') ? endpoint : `${this.baseUrl}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;
    const token = this.getAuthToken();

    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      ...(options.headers || {})
    };

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), options.timeout || this.timeout);

    try {
      const response = await fetch(url, {
        ...options,
        headers,
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      // Attempt to parse JSON response
      let data = null;
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        data = await response.text();
      }

      if (!response.ok) {
        const error = new Error((data && data.message) || `HTTP Error ${response.status}: ${response.statusText}`);
        error.status = response.status;
        error.data = data;
        throw error;
      }

      return data;
    } catch (error) {
      clearTimeout(timeoutId);
      if (error.name === 'AbortError') {
        throw new Error(`Request timeout after ${this.timeout}ms for ${url}`);
      }
      throw error;
    }
  }

  get(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'GET' });
  }

  post(endpoint, body, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'POST',
      body: typeof body === 'string' ? body : JSON.stringify(body)
    });
  }

  put(endpoint, body, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'PUT',
      body: typeof body === 'string' ? body : JSON.stringify(body)
    });
  }

  patch(endpoint, body, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'PATCH',
      body: typeof body === 'string' ? body : JSON.stringify(body)
    });
  }

  delete(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'DELETE' });
  }
}

export const apiClient = new ApiClient();
export default apiClient;
