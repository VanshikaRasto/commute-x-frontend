// API configuration and utility functions
const API_BASE_URL = 'http://localhost:5000/api';

// Helper function to handle API requests
const fetchData = async (endpoint, options = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Something went wrong');
    }

    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// Dashboard specific API calls
export const dashboardAPI = {
  getStats: () => fetchData('/dashboard/stats'),
  getRecentRequests: () => fetchData('/dashboard/recent-requests'),
  // Add more dashboard related API calls here
};

export default {
  dashboard: dashboardAPI,
  // Add other API modules here
};
