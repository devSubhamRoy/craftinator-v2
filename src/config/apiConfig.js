/**
 * Centralized API configuration loaded from environment variables
 * Designed for seamless backend connectivity in Craftinator-v2.
 */

export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  TIMEOUT: Number(import.meta.env.VITE_API_TIMEOUT) || 15000,
  ENABLE_MOCK: import.meta.env.VITE_ENABLE_MOCK_API === 'true',
  APP_ENV: import.meta.env.VITE_APP_ENV || 'development',
  
  // Standard Backend API Endpoints Registry
  ENDPOINTS: {
    AUTH: {
      LOGIN: '/auth/login',
      REGISTER: '/auth/register',
      ME: '/auth/me',
      REFRESH: '/auth/refresh',
      LOGOUT: '/auth/logout'
    },
    PRODUCTS: {
      LIST: '/products',
      DETAIL: (id) => `/products/${id}`,
      FEATURED: '/products/featured',
      CATEGORIES: '/products/categories',
      SEARCH: '/products/search'
    },
    ARTISANS: {
      LIST: '/artisans',
      DETAIL: (id) => `/artisans/${id}`
    },
    CART: {
      GET: '/cart',
      SYNC: '/cart/sync',
      ADD_ITEM: '/cart/items',
      UPDATE_ITEM: (id) => `/cart/items/${id}`,
      REMOVE_ITEM: (id) => `/cart/items/${id}`
    },
    ORDERS: {
      LIST: '/orders',
      CREATE: '/orders',
      DETAIL: (id) => `/orders/${id}`
    },
    REVIEWS: {
      LIST: (productId) => `/products/${productId}/reviews`,
      CREATE: (productId) => `/products/${productId}/reviews`
    }
  }
};

export default API_CONFIG;
