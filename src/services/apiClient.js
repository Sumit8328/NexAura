/**
 * Centralized API Client for KARTAVYA.
 * Designed for immediate Python FastAPI integration via Antigravity while providing
 * a robust, reliable offline/prototype fallback layer.
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';
const USE_PROTOTYPE_FALLBACK = import.meta.env.VITE_USE_PROTOTYPE_FALLBACK !== 'false';

class ApiClient {
  constructor(baseUrl = API_BASE_URL) {
    this.baseUrl = baseUrl.replace(/\/+$/, '');
  }

  isBackendConfigured() {
    return Boolean(this.baseUrl && this.baseUrl.length > 0);
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;
    
    // If no backend configured and fallback allowed, return null to trigger mock service
    if (!this.isBackendConfigured()) {
      if (USE_PROTOTYPE_FALLBACK) {
        return { isFallback: true };
      }
      throw new Error(`FastAPI backend not configured and prototype fallback is disabled.`);
    }

    const defaultHeaders = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'X-Client-Agent': 'Kartavya-CommandCentre-v1.0'
    };

    const config = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      if (!response.ok) {
        const errorBody = await response.json().catch(() => ({}));
        const error = new Error(errorBody.detail || errorBody.message || `HTTP ${response.status}: ${response.statusText}`);
        error.status = response.status;
        error.details = errorBody;
        throw error;
      }
      return await response.json();
    } catch (err) {
      if (USE_PROTOTYPE_FALLBACK) {
        console.warn(`[KARTAVYA API] Backend unreachable at ${url}. Falling back to prototype state engine.`, err.message);
        return { isFallback: true };
      }
      throw err;
    }
  }

  get(endpoint, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `${endpoint}?${queryString}` : endpoint;
    return this.request(url, { method: 'GET' });
  }

  post(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  put(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  patch(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  }
}

export const apiClient = new ApiClient();
export default apiClient;
