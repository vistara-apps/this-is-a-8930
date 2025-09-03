/**
 * API Service
 * 
 * This service provides a unified interface for making API requests to various endpoints.
 * It handles authentication, error handling, and response parsing.
 */

// Base API configuration
const API_CONFIG = {
  baseUrl: process.env.REACT_APP_API_URL || 'https://api.datanest.app',
  timeout: 30000, // 30 seconds
  retries: 3
}

/**
 * Make an API request
 * @param {string} endpoint - The API endpoint
 * @param {Object} options - The request options
 * @returns {Promise<Object>} The API response
 */
export const apiRequest = async (endpoint, options = {}) => {
  const {
    method = 'GET',
    headers = {},
    body,
    params,
    timeout = API_CONFIG.timeout,
    retries = API_CONFIG.retries
  } = options

  // Build the URL with query parameters
  let url = `${API_CONFIG.baseUrl}${endpoint}`
  if (params) {
    const queryParams = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, value)
      }
    })
    url = `${url}?${queryParams.toString()}`
  }

  // Build the request options
  const requestOptions = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers
    }
  }

  // Add the request body for non-GET requests
  if (body && method !== 'GET') {
    requestOptions.body = JSON.stringify(body)
  }

  // Make the request with retries
  let attempt = 0
  let error

  while (attempt < retries) {
    try {
      // Set up a timeout for the request
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), timeout)
      requestOptions.signal = controller.signal

      // Make the request
      const response = await fetch(url, requestOptions)
      clearTimeout(timeoutId)

      // Parse the response
      const data = await response.json()

      // Handle error responses
      if (!response.ok) {
        throw {
          status: response.status,
          message: data.message || response.statusText,
          details: data.details || data
        }
      }

      return data
    } catch (err) {
      error = err
      attempt++

      // Don't retry if the request was aborted or if it's a client error (4xx)
      if (err.name === 'AbortError' || (err.status && err.status < 500)) {
        break
      }

      // Wait before retrying (exponential backoff)
      if (attempt < retries) {
        await new Promise(resolve => setTimeout(resolve, 2 ** attempt * 1000))
      }
    }
  }

  // If all retries failed, throw the error
  throw error
}

/**
 * Get the authentication headers for a request
 * @param {string} token - The authentication token
 * @returns {Object} The authentication headers
 */
export const getAuthHeaders = (token) => {
  return {
    'Authorization': `Bearer ${token}`
  }
}

/**
 * API endpoints
 */
export const API_ENDPOINTS = {
  // Auth endpoints
  AUTH: {
    LOGIN: '/auth/login',
    SIGNUP: '/auth/signup',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    RESET_PASSWORD: '/auth/reset-password'
  },
  
  // User endpoints
  USER: {
    PROFILE: '/user/profile',
    PREFERENCES: '/user/preferences'
  },
  
  // Data source endpoints
  DATA_SOURCES: {
    LIST: '/data-sources',
    GET: (id) => `/data-sources/${id}`,
    CREATE: '/data-sources',
    UPDATE: (id) => `/data-sources/${id}`,
    DELETE: (id) => `/data-sources/${id}`,
    CONNECT: (id) => `/data-sources/${id}/connect`,
    DISCONNECT: (id) => `/data-sources/${id}/disconnect`,
    SYNC: (id) => `/data-sources/${id}/sync`
  },
  
  // Data point endpoints
  DATA_POINTS: {
    LIST: '/data-points',
    GET: (id) => `/data-points/${id}`,
    SEARCH: '/data-points/search'
  },
  
  // Dashboard endpoints
  DASHBOARDS: {
    LIST: '/dashboards',
    GET: (id) => `/dashboards/${id}`,
    CREATE: '/dashboards',
    UPDATE: (id) => `/dashboards/${id}`,
    DELETE: (id) => `/dashboards/${id}`
  },
  
  // Widget endpoints
  WIDGETS: {
    LIST: (dashboardId) => `/dashboards/${dashboardId}/widgets`,
    GET: (dashboardId, id) => `/dashboards/${dashboardId}/widgets/${id}`,
    CREATE: (dashboardId) => `/dashboards/${dashboardId}/widgets`,
    UPDATE: (dashboardId, id) => `/dashboards/${dashboardId}/widgets/${id}`,
    DELETE: (dashboardId, id) => `/dashboards/${dashboardId}/widgets/${id}`
  }
}

/**
 * Mock API implementation
 * 
 * This is a mock implementation of the API for development purposes.
 * In a real application, this would be replaced with actual API calls.
 */
export const mockApiRequest = async (endpoint, options = {}) => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000))
  
  // Simulate random errors (10% chance)
  if (Math.random() < 0.1) {
    throw {
      status: 500,
      message: 'Simulated server error',
      details: { endpoint, options }
    }
  }
  
  // Return mock data based on the endpoint
  if (endpoint.startsWith('/data-sources')) {
    return mockDataSourceResponse(endpoint, options)
  } else if (endpoint.startsWith('/data-points')) {
    return mockDataPointResponse(endpoint, options)
  } else if (endpoint.startsWith('/dashboards')) {
    return mockDashboardResponse(endpoint, options)
  } else if (endpoint.startsWith('/user')) {
    return mockUserResponse(endpoint, options)
  } else if (endpoint.startsWith('/auth')) {
    return mockAuthResponse(endpoint, options)
  }
  
  // Default response
  return {
    success: true,
    data: {},
    message: 'Mock API response'
  }
}

// Mock response generators
const mockDataSourceResponse = (endpoint, options) => {
  // Implementation would go here
  return { success: true, data: {} }
}

const mockDataPointResponse = (endpoint, options) => {
  // Implementation would go here
  return { success: true, data: {} }
}

const mockDashboardResponse = (endpoint, options) => {
  // Implementation would go here
  return { success: true, data: {} }
}

const mockUserResponse = (endpoint, options) => {
  // Implementation would go here
  return { success: true, data: {} }
}

const mockAuthResponse = (endpoint, options) => {
  // Implementation would go here
  return { success: true, data: {} }
}

// Export a unified API object
export default {
  request: process.env.NODE_ENV === 'development' ? mockApiRequest : apiRequest,
  endpoints: API_ENDPOINTS,
  getAuthHeaders
}

