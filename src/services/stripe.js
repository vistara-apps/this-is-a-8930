/**
 * Stripe Service
 * 
 * This service provides methods for interacting with the Stripe API.
 * It handles authentication, data fetching, and data transformation.
 */

import api from './api'

/**
 * Stripe API configuration
 */
const STRIPE_CONFIG = {
  apiUrl: 'https://api.stripe.com/v1',
  publishableKey: process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY,
  apiVersion: '2023-10-16'
}

/**
 * Make a request to the Stripe API
 * @param {string} endpoint - The API endpoint
 * @param {Object} options - The request options
 * @param {string} apiKey - The Stripe API key
 * @returns {Promise<Object>} The API response
 */
export const makeStripeRequest = async (endpoint, options = {}, apiKey) => {
  const { method = 'GET', body, params } = options
  
  let url = `${STRIPE_CONFIG.apiUrl}${endpoint}`
  
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
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/x-www-form-urlencoded',
      'Stripe-Version': STRIPE_CONFIG.apiVersion
    }
  }
  
  // Add request body for non-GET requests
  if (body && method !== 'GET') {
    const formData = new URLSearchParams()
    Object.entries(body).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, value)
      }
    })
    requestOptions.body = formData.toString()
  }
  
  // Make the request
  const response = await fetch(url, requestOptions)
  
  // Handle error responses
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error?.message || 'Failed to make Stripe request')
  }
  
  return response.json()
}

/**
 * Get Stripe account information
 * @param {string} apiKey - The Stripe API key
 * @returns {Promise<Object>} The account information
 */
export const getAccount = async (apiKey) => {
  return makeStripeRequest('/account', {}, apiKey)
}

/**
 * Get Stripe balance
 * @param {string} apiKey - The Stripe API key
 * @returns {Promise<Object>} The balance information
 */
export const getBalance = async (apiKey) => {
  return makeStripeRequest('/balance', {}, apiKey)
}

/**
 * Get Stripe customers
 * @param {string} apiKey - The Stripe API key
 * @param {Object} params - The query parameters
 * @returns {Promise<Object>} The customers
 */
export const getCustomers = async (apiKey, params = {}) => {
  return makeStripeRequest('/customers', { params }, apiKey)
}

/**
 * Get Stripe subscriptions
 * @param {string} apiKey - The Stripe API key
 * @param {Object} params - The query parameters
 * @returns {Promise<Object>} The subscriptions
 */
export const getSubscriptions = async (apiKey, params = {}) => {
  return makeStripeRequest('/subscriptions', { params }, apiKey)
}

/**
 * Get Stripe invoices
 * @param {string} apiKey - The Stripe API key
 * @param {Object} params - The query parameters
 * @returns {Promise<Object>} The invoices
 */
export const getInvoices = async (apiKey, params = {}) => {
  return makeStripeRequest('/invoices', { params }, apiKey)
}

/**
 * Get Stripe payment intents
 * @param {string} apiKey - The Stripe API key
 * @param {Object} params - The query parameters
 * @returns {Promise<Object>} The payment intents
 */
export const getPaymentIntents = async (apiKey, params = {}) => {
  return makeStripeRequest('/payment_intents', { params }, apiKey)
}

/**
 * Get Stripe products
 * @param {string} apiKey - The Stripe API key
 * @param {Object} params - The query parameters
 * @returns {Promise<Object>} The products
 */
export const getProducts = async (apiKey, params = {}) => {
  return makeStripeRequest('/products', { params }, apiKey)
}

/**
 * Get Stripe prices
 * @param {string} apiKey - The Stripe API key
 * @param {Object} params - The query parameters
 * @returns {Promise<Object>} The prices
 */
export const getPrices = async (apiKey, params = {}) => {
  return makeStripeRequest('/prices', { params }, apiKey)
}

/**
 * Calculate Monthly Recurring Revenue (MRR)
 * @param {Array} subscriptions - The subscriptions
 * @returns {number} The MRR
 */
export const calculateMRR = (subscriptions) => {
  return subscriptions.reduce((total, subscription) => {
    if (subscription.status !== 'active') return total
    
    const amount = subscription.plan.amount
    const interval = subscription.plan.interval
    const intervalCount = subscription.plan.interval_count
    
    let monthlyAmount = amount
    
    if (interval === 'year') {
      monthlyAmount = amount / 12
    } else if (interval === 'week') {
      monthlyAmount = amount * 4.33
    } else if (interval === 'day') {
      monthlyAmount = amount * 30.42
    }
    
    monthlyAmount = monthlyAmount * intervalCount
    
    return total + monthlyAmount
  }, 0)
}

/**
 * Calculate customer churn rate
 * @param {Array} subscriptions - The subscriptions
 * @param {number} period - The period in days
 * @returns {number} The churn rate
 */
export const calculateChurnRate = (subscriptions, period = 30) => {
  const now = new Date()
  const periodStart = new Date(now.getTime() - period * 24 * 60 * 60 * 1000)
  
  const activeAtStart = subscriptions.filter(sub => {
    const startDate = new Date(sub.created * 1000)
    return startDate < periodStart && (sub.status === 'active' || (sub.status === 'canceled' && new Date(sub.canceled_at * 1000) >= periodStart))
  }).length
  
  const canceledInPeriod = subscriptions.filter(sub => {
    const cancelDate = sub.canceled_at ? new Date(sub.canceled_at * 1000) : null
    return cancelDate && cancelDate >= periodStart && cancelDate <= now
  }).length
  
  return activeAtStart > 0 ? canceledInPeriod / activeAtStart : 0
}

/**
 * Get revenue data by date
 * @param {Array} invoices - The invoices
 * @param {number} days - The number of days
 * @returns {Array} The revenue data
 */
export const getRevenueByDate = (invoices, days = 30) => {
  const now = new Date()
  const result = []
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000)
    const dateString = date.toISOString().split('T')[0]
    
    const dayInvoices = invoices.filter(invoice => {
      const invoiceDate = new Date(invoice.created * 1000)
      return invoiceDate.toISOString().split('T')[0] === dateString
    })
    
    const revenue = dayInvoices.reduce((total, invoice) => {
      return total + (invoice.amount_paid || 0)
    }, 0)
    
    result.push({
      date: dateString,
      revenue
    })
  }
  
  return result
}

/**
 * Mock Stripe data for development
 * @returns {Object} Mock Stripe data
 */
export const getMockStripeData = () => {
  // Generate dates for the last 30 days
  const dates = []
  const today = new Date()
  for (let i = 29; i >= 0; i--) {
    const date = new Date()
    date.setDate(today.getDate() - i)
    dates.push(date.toISOString().split('T')[0])
  }
  
  // Generate mock revenue data
  const revenueData = dates.map(date => ({
    date,
    revenue: Math.floor(Math.random() * 2000) + 500
  }))
  
  // Generate mock customer data
  const customerCount = Math.floor(Math.random() * 500) + 200
  const newCustomers = Math.floor(Math.random() * 50) + 10
  
  // Generate mock subscription data
  const subscriptionData = {
    active: Math.floor(Math.random() * 400) + 150,
    canceled: Math.floor(Math.random() * 50) + 10,
    pastDue: Math.floor(Math.random() * 20) + 5
  }
  
  // Generate mock MRR data
  const mrrData = dates.map(date => ({
    date,
    mrr: Math.floor(Math.random() * 15000) + 5000
  }))
  
  // Generate mock churn rate
  const churnRate = Math.random() * 0.05 + 0.01
  
  // Generate mock plan distribution
  const planDistribution = [
    { name: 'Basic', count: Math.floor(Math.random() * 200) + 50 },
    { name: 'Pro', count: Math.floor(Math.random() * 150) + 80 },
    { name: 'Business', count: Math.floor(Math.random() * 100) + 20 }
  ]
  
  return {
    revenueData,
    customerData: {
      total: customerCount,
      new: newCustomers
    },
    subscriptionData,
    mrrData,
    churnRate,
    planDistribution
  }
}

// Export a unified Stripe service
export default {
  makeStripeRequest,
  getAccount,
  getBalance,
  getCustomers,
  getSubscriptions,
  getInvoices,
  getPaymentIntents,
  getProducts,
  getPrices,
  calculateMRR,
  calculateChurnRate,
  getRevenueByDate,
  getMockStripeData
}

