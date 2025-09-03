/**
 * Google Analytics Service
 * 
 * This service provides methods for interacting with the Google Analytics API.
 * It handles authentication, data fetching, and data transformation.
 */

import api from './api'

/**
 * Google Analytics API configuration
 */
const GA_CONFIG = {
  authUrl: 'https://accounts.google.com/o/oauth2/auth',
  tokenUrl: 'https://oauth2.googleapis.com/token',
  apiUrl: 'https://analyticsdata.googleapis.com/v1beta',
  scope: 'https://www.googleapis.com/auth/analytics.readonly',
  clientId: process.env.REACT_APP_GA_CLIENT_ID,
  clientSecret: process.env.REACT_APP_GA_CLIENT_SECRET,
  redirectUri: process.env.REACT_APP_GA_REDIRECT_URI
}

/**
 * Get the Google Analytics OAuth URL
 * @param {string} state - A state parameter to include in the OAuth flow
 * @returns {string} The OAuth URL
 */
export const getOAuthUrl = (state) => {
  const params = new URLSearchParams({
    client_id: GA_CONFIG.clientId,
    redirect_uri: GA_CONFIG.redirectUri,
    response_type: 'code',
    scope: GA_CONFIG.scope,
    access_type: 'offline',
    prompt: 'consent',
    state
  })
  
  return `${GA_CONFIG.authUrl}?${params.toString()}`
}

/**
 * Exchange an authorization code for an access token
 * @param {string} code - The authorization code
 * @returns {Promise<Object>} The token response
 */
export const exchangeCodeForToken = async (code) => {
  const params = new URLSearchParams({
    client_id: GA_CONFIG.clientId,
    client_secret: GA_CONFIG.clientSecret,
    redirect_uri: GA_CONFIG.redirectUri,
    grant_type: 'authorization_code',
    code
  })
  
  const response = await fetch(GA_CONFIG.tokenUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: params.toString()
  })
  
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error_description || 'Failed to exchange code for token')
  }
  
  return response.json()
}

/**
 * Refresh an access token
 * @param {string} refreshToken - The refresh token
 * @returns {Promise<Object>} The token response
 */
export const refreshAccessToken = async (refreshToken) => {
  const params = new URLSearchParams({
    client_id: GA_CONFIG.clientId,
    client_secret: GA_CONFIG.clientSecret,
    grant_type: 'refresh_token',
    refresh_token: refreshToken
  })
  
  const response = await fetch(GA_CONFIG.tokenUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: params.toString()
  })
  
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error_description || 'Failed to refresh access token')
  }
  
  return response.json()
}

/**
 * Make a request to the Google Analytics API
 * @param {string} endpoint - The API endpoint
 * @param {Object} options - The request options
 * @param {string} accessToken - The access token
 * @returns {Promise<Object>} The API response
 */
export const makeGaRequest = async (endpoint, options = {}, accessToken) => {
  const { method = 'GET', body } = options
  
  const url = `${GA_CONFIG.apiUrl}${endpoint}`
  
  const requestOptions = {
    method,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`
    }
  }
  
  if (body && method !== 'GET') {
    requestOptions.body = JSON.stringify(body)
  }
  
  const response = await fetch(url, requestOptions)
  
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Failed to make Google Analytics request')
  }
  
  return response.json()
}

/**
 * Get a list of Google Analytics properties
 * @param {string} accessToken - The access token
 * @returns {Promise<Array>} The list of properties
 */
export const getProperties = async (accessToken) => {
  return makeGaRequest('/properties', {}, accessToken)
}

/**
 * Run a report in Google Analytics
 * @param {string} propertyId - The property ID
 * @param {Object} reportRequest - The report request
 * @param {string} accessToken - The access token
 * @returns {Promise<Object>} The report response
 */
export const runReport = async (propertyId, reportRequest, accessToken) => {
  return makeGaRequest(`/properties/${propertyId}:runReport`, {
    method: 'POST',
    body: reportRequest
  }, accessToken)
}

/**
 * Transform Google Analytics data into a standardized format
 * @param {Object} reportResponse - The report response from Google Analytics
 * @returns {Array} The transformed data
 */
export const transformGaData = (reportResponse) => {
  if (!reportResponse || !reportResponse.rows) {
    return []
  }
  
  const { dimensionHeaders, metricHeaders, rows } = reportResponse
  
  return rows.map(row => {
    const dataPoint = {}
    
    // Add dimensions
    row.dimensionValues.forEach((value, index) => {
      const key = dimensionHeaders[index].name
      dataPoint[key] = value.value
    })
    
    // Add metrics
    row.metricValues.forEach((value, index) => {
      const key = metricHeaders[index].name
      dataPoint[key] = parseFloat(value.value) || value.value
    })
    
    return dataPoint
  })
}

/**
 * Build a Google Analytics report request
 * @param {Array} metrics - The metrics to include
 * @param {Array} dimensions - The dimensions to include
 * @param {Object} dateRange - The date range
 * @param {Array} filters - The filters to apply
 * @returns {Object} The report request
 */
export const buildReportRequest = (metrics, dimensions, dateRange, filters = []) => {
  return {
    dateRanges: [
      {
        startDate: dateRange.start,
        endDate: dateRange.end
      }
    ],
    metrics: metrics.map(metric => ({ name: metric })),
    dimensions: dimensions.map(dimension => ({ name: dimension })),
    dimensionFilter: filters.length > 0 ? {
      andGroup: {
        expressions: filters
      }
    } : undefined
  }
}

/**
 * Get common Google Analytics metrics
 * @param {string} propertyId - The property ID
 * @param {string} accessToken - The access token
 * @returns {Promise<Object>} The metrics data
 */
export const getCommonMetrics = async (propertyId, accessToken) => {
  const today = new Date()
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(today.getDate() - 30)
  
  const reportRequest = buildReportRequest(
    ['activeUsers', 'screenPageViews', 'sessions', 'bounceRate', 'averageSessionDuration'],
    ['date'],
    {
      start: thirtyDaysAgo.toISOString().split('T')[0],
      end: today.toISOString().split('T')[0]
    }
  )
  
  const response = await runReport(propertyId, reportRequest, accessToken)
  return transformGaData(response)
}

/**
 * Get traffic source data from Google Analytics
 * @param {string} propertyId - The property ID
 * @param {string} accessToken - The access token
 * @returns {Promise<Object>} The traffic source data
 */
export const getTrafficSources = async (propertyId, accessToken) => {
  const today = new Date()
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(today.getDate() - 30)
  
  const reportRequest = buildReportRequest(
    ['sessions', 'activeUsers'],
    ['sessionSource'],
    {
      start: thirtyDaysAgo.toISOString().split('T')[0],
      end: today.toISOString().split('T')[0]
    }
  )
  
  const response = await runReport(propertyId, reportRequest, accessToken)
  return transformGaData(response)
}

/**
 * Get device data from Google Analytics
 * @param {string} propertyId - The property ID
 * @param {string} accessToken - The access token
 * @returns {Promise<Object>} The device data
 */
export const getDeviceData = async (propertyId, accessToken) => {
  const today = new Date()
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(today.getDate() - 30)
  
  const reportRequest = buildReportRequest(
    ['activeUsers'],
    ['deviceCategory'],
    {
      start: thirtyDaysAgo.toISOString().split('T')[0],
      end: today.toISOString().split('T')[0]
    }
  )
  
  const response = await runReport(propertyId, reportRequest, accessToken)
  return transformGaData(response)
}

/**
 * Mock Google Analytics data for development
 * @returns {Object} Mock Google Analytics data
 */
export const getMockGaData = () => {
  // Generate dates for the last 30 days
  const dates = []
  const today = new Date()
  for (let i = 29; i >= 0; i--) {
    const date = new Date()
    date.setDate(today.getDate() - i)
    dates.push(date.toISOString().split('T')[0])
  }
  
  // Generate mock metrics
  const metrics = {
    activeUsers: dates.map(date => ({
      date,
      activeUsers: Math.floor(Math.random() * 1000) + 500
    })),
    pageViews: dates.map(date => ({
      date,
      screenPageViews: Math.floor(Math.random() * 5000) + 1000
    })),
    sessions: dates.map(date => ({
      date,
      sessions: Math.floor(Math.random() * 2000) + 800
    })),
    bounceRate: dates.map(date => ({
      date,
      bounceRate: Math.random() * 0.6 + 0.2
    })),
    sessionDuration: dates.map(date => ({
      date,
      averageSessionDuration: Math.floor(Math.random() * 300) + 60
    }))
  }
  
  // Generate mock traffic sources
  const trafficSources = [
    { sessionSource: 'google', sessions: Math.floor(Math.random() * 5000) + 2000, activeUsers: Math.floor(Math.random() * 4000) + 1500 },
    { sessionSource: 'direct', sessions: Math.floor(Math.random() * 3000) + 1000, activeUsers: Math.floor(Math.random() * 2500) + 800 },
    { sessionSource: 'facebook', sessions: Math.floor(Math.random() * 2000) + 500, activeUsers: Math.floor(Math.random() * 1500) + 400 },
    { sessionSource: 'twitter', sessions: Math.floor(Math.random() * 1000) + 200, activeUsers: Math.floor(Math.random() * 800) + 150 },
    { sessionSource: 'linkedin', sessions: Math.floor(Math.random() * 800) + 100, activeUsers: Math.floor(Math.random() * 600) + 80 }
  ]
  
  // Generate mock device data
  const deviceData = [
    { deviceCategory: 'desktop', activeUsers: Math.floor(Math.random() * 6000) + 3000 },
    { deviceCategory: 'mobile', activeUsers: Math.floor(Math.random() * 4000) + 2000 },
    { deviceCategory: 'tablet', activeUsers: Math.floor(Math.random() * 1000) + 500 }
  ]
  
  return {
    metrics,
    trafficSources,
    deviceData
  }
}

// Export a unified Google Analytics service
export default {
  getOAuthUrl,
  exchangeCodeForToken,
  refreshAccessToken,
  getProperties,
  runReport,
  getCommonMetrics,
  getTrafficSources,
  getDeviceData,
  getMockGaData
}

