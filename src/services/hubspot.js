/**
 * HubSpot Service
 * 
 * This service provides methods for interacting with the HubSpot API.
 * It handles authentication, data fetching, and data transformation.
 */

import api from './api'

/**
 * HubSpot API configuration
 */
const HUBSPOT_CONFIG = {
  apiUrl: 'https://api.hubapi.com',
  authUrl: 'https://app.hubspot.com/oauth/authorize',
  tokenUrl: 'https://api.hubapi.com/oauth/v1/token',
  clientId: process.env.REACT_APP_HUBSPOT_CLIENT_ID,
  clientSecret: process.env.REACT_APP_HUBSPOT_CLIENT_SECRET,
  redirectUri: process.env.REACT_APP_HUBSPOT_REDIRECT_URI,
  scope: 'contacts content crm.objects.contacts.read crm.objects.companies.read crm.objects.deals.read'
}

/**
 * Get the HubSpot OAuth URL
 * @param {string} state - A state parameter to include in the OAuth flow
 * @returns {string} The OAuth URL
 */
export const getOAuthUrl = (state) => {
  const params = new URLSearchParams({
    client_id: HUBSPOT_CONFIG.clientId,
    redirect_uri: HUBSPOT_CONFIG.redirectUri,
    scope: HUBSPOT_CONFIG.scope,
    state
  })
  
  return `${HUBSPOT_CONFIG.authUrl}?${params.toString()}`
}

/**
 * Exchange an authorization code for an access token
 * @param {string} code - The authorization code
 * @returns {Promise<Object>} The token response
 */
export const exchangeCodeForToken = async (code) => {
  const params = new URLSearchParams({
    grant_type: 'authorization_code',
    client_id: HUBSPOT_CONFIG.clientId,
    client_secret: HUBSPOT_CONFIG.clientSecret,
    redirect_uri: HUBSPOT_CONFIG.redirectUri,
    code
  })
  
  const response = await fetch(HUBSPOT_CONFIG.tokenUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: params.toString()
  })
  
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Failed to exchange code for token')
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
    grant_type: 'refresh_token',
    client_id: HUBSPOT_CONFIG.clientId,
    client_secret: HUBSPOT_CONFIG.clientSecret,
    refresh_token: refreshToken
  })
  
  const response = await fetch(HUBSPOT_CONFIG.tokenUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: params.toString()
  })
  
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Failed to refresh access token')
  }
  
  return response.json()
}

/**
 * Make a request to the HubSpot API
 * @param {string} endpoint - The API endpoint
 * @param {Object} options - The request options
 * @param {string} accessToken - The access token
 * @returns {Promise<Object>} The API response
 */
export const makeHubspotRequest = async (endpoint, options = {}, accessToken) => {
  const { method = 'GET', body, params } = options
  
  let url = `${HUBSPOT_CONFIG.apiUrl}${endpoint}`
  
  // Add query parameters
  if (params) {
    const queryParams = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, value)
      }
    })
    url = `${url}?${queryParams.toString()}`
  }
  
  // Build request options
  const requestOptions = {
    method,
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    }
  }
  
  // Add request body for non-GET requests
  if (body && method !== 'GET') {
    requestOptions.body = JSON.stringify(body)
  }
  
  // Make the request
  const response = await fetch(url, requestOptions)
  
  // Handle error responses
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Failed to make HubSpot request')
  }
  
  return response.json()
}

/**
 * Get HubSpot contacts
 * @param {string} accessToken - The access token
 * @param {Object} params - The query parameters
 * @returns {Promise<Object>} The contacts
 */
export const getContacts = async (accessToken, params = {}) => {
  return makeHubspotRequest('/crm/v3/objects/contacts', { params }, accessToken)
}

/**
 * Get HubSpot companies
 * @param {string} accessToken - The access token
 * @param {Object} params - The query parameters
 * @returns {Promise<Object>} The companies
 */
export const getCompanies = async (accessToken, params = {}) => {
  return makeHubspotRequest('/crm/v3/objects/companies', { params }, accessToken)
}

/**
 * Get HubSpot deals
 * @param {string} accessToken - The access token
 * @param {Object} params - The query parameters
 * @returns {Promise<Object>} The deals
 */
export const getDeals = async (accessToken, params = {}) => {
  return makeHubspotRequest('/crm/v3/objects/deals', { params }, accessToken)
}

/**
 * Get HubSpot deal pipelines
 * @param {string} accessToken - The access token
 * @returns {Promise<Object>} The deal pipelines
 */
export const getDealPipelines = async (accessToken) => {
  return makeHubspotRequest('/crm/v3/pipelines/deals', {}, accessToken)
}

/**
 * Get HubSpot deal stages
 * @param {string} accessToken - The access token
 * @param {string} pipelineId - The pipeline ID
 * @returns {Promise<Object>} The deal stages
 */
export const getDealStages = async (accessToken, pipelineId) => {
  return makeHubspotRequest(`/crm/v3/pipelines/deals/${pipelineId}/stages`, {}, accessToken)
}

/**
 * Get HubSpot owner information
 * @param {string} accessToken - The access token
 * @param {string} ownerId - The owner ID
 * @returns {Promise<Object>} The owner information
 */
export const getOwner = async (accessToken, ownerId) => {
  return makeHubspotRequest(`/crm/v3/owners/${ownerId}`, {}, accessToken)
}

/**
 * Get HubSpot contact properties
 * @param {string} accessToken - The access token
 * @returns {Promise<Object>} The contact properties
 */
export const getContactProperties = async (accessToken) => {
  return makeHubspotRequest('/crm/v3/properties/contacts', {}, accessToken)
}

/**
 * Get HubSpot company properties
 * @param {string} accessToken - The access token
 * @returns {Promise<Object>} The company properties
 */
export const getCompanyProperties = async (accessToken) => {
  return makeHubspotRequest('/crm/v3/properties/companies', {}, accessToken)
}

/**
 * Get HubSpot deal properties
 * @param {string} accessToken - The access token
 * @returns {Promise<Object>} The deal properties
 */
export const getDealProperties = async (accessToken) => {
  return makeHubspotRequest('/crm/v3/properties/deals', {}, accessToken)
}

/**
 * Calculate deal metrics
 * @param {Array} deals - The deals
 * @returns {Object} The deal metrics
 */
export const calculateDealMetrics = (deals) => {
  const totalDeals = deals.length
  const openDeals = deals.filter(deal => !deal.properties.closedate).length
  const closedDeals = totalDeals - openDeals
  const wonDeals = deals.filter(deal => deal.properties.dealstage === 'closedwon').length
  const lostDeals = deals.filter(deal => deal.properties.dealstage === 'closedlost').length
  
  const totalValue = deals.reduce((total, deal) => {
    return total + (parseFloat(deal.properties.amount) || 0)
  }, 0)
  
  const openValue = deals.filter(deal => !deal.properties.closedate).reduce((total, deal) => {
    return total + (parseFloat(deal.properties.amount) || 0)
  }, 0)
  
  const wonValue = deals.filter(deal => deal.properties.dealstage === 'closedwon').reduce((total, deal) => {
    return total + (parseFloat(deal.properties.amount) || 0)
  }, 0)
  
  const winRate = closedDeals > 0 ? wonDeals / closedDeals : 0
  
  return {
    totalDeals,
    openDeals,
    closedDeals,
    wonDeals,
    lostDeals,
    totalValue,
    openValue,
    wonValue,
    winRate
  }
}

/**
 * Group deals by stage
 * @param {Array} deals - The deals
 * @param {Array} stages - The deal stages
 * @returns {Object} The deals grouped by stage
 */
export const groupDealsByStage = (deals, stages) => {
  const result = {}
  
  stages.forEach(stage => {
    result[stage.id] = {
      name: stage.label,
      count: 0,
      value: 0,
      deals: []
    }
  })
  
  deals.forEach(deal => {
    const stageId = deal.properties.dealstage
    if (result[stageId]) {
      result[stageId].count++
      result[stageId].value += parseFloat(deal.properties.amount) || 0
      result[stageId].deals.push(deal)
    }
  })
  
  return result
}

/**
 * Get deals by date
 * @param {Array} deals - The deals
 * @param {number} days - The number of days
 * @returns {Array} The deals by date
 */
export const getDealsByDate = (deals, days = 30) => {
  const now = new Date()
  const result = []
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000)
    const dateString = date.toISOString().split('T')[0]
    
    const dayDeals = deals.filter(deal => {
      const createDate = new Date(deal.properties.createdate)
      return createDate.toISOString().split('T')[0] === dateString
    })
    
    const value = dayDeals.reduce((total, deal) => {
      return total + (parseFloat(deal.properties.amount) || 0)
    }, 0)
    
    result.push({
      date: dateString,
      count: dayDeals.length,
      value
    })
  }
  
  return result
}

/**
 * Mock HubSpot data for development
 * @returns {Object} Mock HubSpot data
 */
export const getMockHubspotData = () => {
  // Generate dates for the last 30 days
  const dates = []
  const today = new Date()
  for (let i = 29; i >= 0; i--) {
    const date = new Date()
    date.setDate(today.getDate() - i)
    dates.push(date.toISOString().split('T')[0])
  }
  
  // Generate mock contact data
  const contactCount = Math.floor(Math.random() * 1000) + 500
  const newContacts = Math.floor(Math.random() * 100) + 20
  
  // Generate mock company data
  const companyCount = Math.floor(Math.random() * 200) + 100
  
  // Generate mock deal data
  const dealCount = Math.floor(Math.random() * 100) + 50
  const openDeals = Math.floor(Math.random() * 50) + 20
  const closedWonDeals = Math.floor(Math.random() * 30) + 10
  const closedLostDeals = Math.floor(Math.random() * 20) + 5
  
  // Generate mock deal value
  const totalDealValue = Math.floor(Math.random() * 1000000) + 500000
  const openDealValue = Math.floor(Math.random() * 500000) + 200000
  const wonDealValue = Math.floor(Math.random() * 500000) + 200000
  
  // Generate mock deal stages
  const dealStages = [
    { id: 'appointmentscheduled', name: 'Appointment Scheduled', count: Math.floor(Math.random() * 20) + 5, value: Math.floor(Math.random() * 100000) + 50000 },
    { id: 'qualifiedtobuy', name: 'Qualified to Buy', count: Math.floor(Math.random() * 15) + 5, value: Math.floor(Math.random() * 100000) + 50000 },
    { id: 'presentationscheduled', name: 'Presentation Scheduled', count: Math.floor(Math.random() * 10) + 5, value: Math.floor(Math.random() * 100000) + 50000 },
    { id: 'decisionmakerboughtin', name: 'Decision Maker Bought-In', count: Math.floor(Math.random() * 10) + 3, value: Math.floor(Math.random() * 100000) + 50000 },
    { id: 'contractsent', name: 'Contract Sent', count: Math.floor(Math.random() * 8) + 2, value: Math.floor(Math.random() * 100000) + 50000 },
    { id: 'closedwon', name: 'Closed Won', count: closedWonDeals, value: wonDealValue },
    { id: 'closedlost', name: 'Closed Lost', count: closedLostDeals, value: 0 }
  ]
  
  // Generate mock deals by date
  const dealsByDate = dates.map(date => ({
    date,
    count: Math.floor(Math.random() * 5) + 1,
    value: Math.floor(Math.random() * 50000) + 10000
  }))
  
  return {
    contactData: {
      total: contactCount,
      new: newContacts
    },
    companyData: {
      total: companyCount
    },
    dealData: {
      total: dealCount,
      open: openDeals,
      closedWon: closedWonDeals,
      closedLost: closedLostDeals,
      totalValue: totalDealValue,
      openValue: openDealValue,
      wonValue: wonDealValue,
      winRate: closedWonDeals / (closedWonDeals + closedLostDeals)
    },
    dealStages,
    dealsByDate
  }
}

// Export a unified HubSpot service
export default {
  getOAuthUrl,
  exchangeCodeForToken,
  refreshAccessToken,
  getContacts,
  getCompanies,
  getDeals,
  getDealPipelines,
  getDealStages,
  getOwner,
  getContactProperties,
  getCompanyProperties,
  getDealProperties,
  calculateDealMetrics,
  groupDealsByStage,
  getDealsByDate,
  getMockHubspotData
}

