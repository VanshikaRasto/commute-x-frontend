// src/services/api.js - API service for frontend
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// API client with error handling
class ApiClient {
  constructor(baseURL = API_BASE_URL) {
    this.baseURL = baseURL;
    this.token = localStorage.getItem('authToken');
  }

  // Set auth token
  setToken(token) {
    this.token = token;
    if (token) {
      localStorage.setItem('authToken', token);
    } else {
      localStorage.removeItem('authToken');
    }
  }

  // Get auth headers
  getHeaders(customHeaders = {}) {
    const headers = {
      'Content-Type': 'application/json',
      ...customHeaders
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    return headers;
  }

  // Generic request method
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: this.getHeaders(options.headers),
      ...options
    };

    try {
      console.log(`API Request: ${config.method || 'GET'} ${url}`);
      
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error(`API Error: ${config.method || 'GET'} ${url}`, error);
      throw error;
    }
  }

  // HTTP methods
  async get(endpoint, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `${endpoint}?${queryString}` : endpoint;
    return this.request(url, { method: 'GET' });
  }

  async post(endpoint, data) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  async put(endpoint, data) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  async delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  }
}

// Create API client instance
const apiClient = new ApiClient();

// Authentication API
export const authAPI = {
  login: async (credentials) => {
    const response = await apiClient.post('/auth/login', credentials);
    if (response.success && response.token) {
      apiClient.setToken(response.token);
    }
    return response;
  },

  logout: async () => {
    try {
      await apiClient.post('/auth/logout', {});
    } finally {
      apiClient.setToken(null);
      localStorage.clear();
    }
  },

  getCurrentUser: () => {
    const userInfo = localStorage.getItem('userInfo');
    return userInfo ? JSON.parse(userInfo) : null;
  }
};

// Users API
export const usersAPI = {
  create: (userData) => apiClient.post('/users', userData),
  getAll: () => apiClient.get('/users'),
  getById: (id) => apiClient.get(`/users/${id}`),
  update: (id, userData) => apiClient.put(`/users/${id}`, userData),
  delete: (id) => apiClient.delete(`/users/${id}`)
};

// Vendors API
export const vendorsAPI = {
  create: (vendorData) => apiClient.post('/vendors', vendorData),
  getAll: () => apiClient.get('/vendors'),
  getById: (id) => apiClient.get(`/vendors/${id}`),
  update: (id, vendorData) => apiClient.put(`/vendors/${id}`, vendorData),
  delete: (id) => apiClient.delete(`/vendors/${id}`)
};

// Vehicles API
export const vehiclesAPI = {
  create: (vehicleData) => apiClient.post('/vehicles', vehicleData),
  getAll: () => apiClient.get('/vehicles'),
  getById: (id) => apiClient.get(`/vehicles/${id}`),
  update: (id, vehicleData) => apiClient.put(`/vehicles/${id}`, vehicleData),
  delete: (id) => apiClient.delete(`/vehicles/${id}`)
};

// Drivers API
export const driversAPI = {
  create: (driverData) => apiClient.post('/drivers', driverData),
  getAll: () => apiClient.get('/drivers'),
  getById: (id) => apiClient.get(`/drivers/${id}`),
  update: (id, driverData) => apiClient.put(`/drivers/${id}`, driverData),
  delete: (id) => apiClient.delete(`/drivers/${id}`)
};

// Routes API
export const routesAPI = {
  create: (routeData) => apiClient.post('/routes', routeData),
  getAll: () => apiClient.get('/routes'),
  getById: (id) => apiClient.get(`/routes/${id}`),
  update: (id, routeData) => apiClient.put(`/routes/${id}`, routeData),
  delete: (id) => apiClient.delete(`/routes/${id}`)
};

// Cab Requests API
export const cabRequestsAPI = {
  create: (requestData) => apiClient.post('/cab-requests', requestData),
  getAll: () => apiClient.get('/cab-requests'),
  getById: (id) => apiClient.get(`/cab-requests/${id}`),
  update: (id, requestData) => apiClient.put(`/cab-requests/${id}`, requestData),
  cancel: (id) => apiClient.delete(`/cab-requests/${id}`)
};

// Dashboard API
export const dashboardAPI = {
  getStats: () => apiClient.get('/dashboard/stats'),
  getActivities: () => apiClient.get('/dashboard/activities'),
  getTrips: () => apiClient.get('/dashboard/trips')
};

// Health check API
export const healthAPI = {
  check: () => apiClient.get('/health')
};

// Utility functions
export const apiUtils = {
  // Format error messages for user display
  formatError: (error) => {
    if (typeof error === 'string') return error;
    if (error.message) return error.message;
    if (error.error) return error.error;
    return 'An unexpected error occurred';
  },

  // Check if API is available
  checkConnection: async () => {
    try {
      await healthAPI.check();
      return true;
    } catch (error) {
      console.error('API connection failed:', error);
      return false;
    }
  },

  // Retry mechanism for failed requests
  retry: async (apiCall, maxRetries = 3, delay = 1000) => {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await apiCall();
      } catch (error) {
        if (attempt === maxRetries) throw error;
        
        console.warn(`API call failed (attempt ${attempt}/${maxRetries}), retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        delay *= 2; // Exponential backoff
      }
    }
  }
};

// Export the main API client
export default apiClient;