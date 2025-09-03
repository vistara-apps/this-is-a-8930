/**
 * useDataSource Hook
 * 
 * This hook provides methods for working with data sources, including
 * connecting, disconnecting, syncing, and fetching data.
 */

import { useState, useCallback } from 'react'
import { useApp } from '../context/AppContext'
import googleAnalytics from '../services/googleAnalytics'
import stripe from '../services/stripe'
import hubspot from '../services/hubspot'

const useDataSource = () => {
  const { 
    dataSources, 
    connectDataSource, 
    syncDataSource, 
    disconnectDataSource 
  } = useApp()
  
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [data, setData] = useState(null)

  /**
   * Connect to a data source
   * @param {string} sourceType - The data source type
   * @returns {Promise<Object>} The connected data source
   */
  const connect = useCallback(async (sourceType) => {
    setIsLoading(true)
    setError(null)
    
    try {
      const dataSource = await connectDataSource(sourceType)
      setIsLoading(false)
      return dataSource
    } catch (err) {
      setError(err.message || 'Failed to connect to data source')
      setIsLoading(false)
      throw err
    }
  }, [connectDataSource])

  /**
   * Sync a data source
   * @param {string} dataSourceId - The data source ID
   * @returns {Promise<Object>} The synced data source
   */
  const sync = useCallback(async (dataSourceId) => {
    setIsLoading(true)
    setError(null)
    
    try {
      const dataSource = await syncDataSource(dataSourceId)
      setIsLoading(false)
      return dataSource
    } catch (err) {
      setError(err.message || 'Failed to sync data source')
      setIsLoading(false)
      throw err
    }
  }, [syncDataSource])

  /**
   * Disconnect from a data source
   * @param {string} dataSourceId - The data source ID
   * @returns {Promise<Object>} The disconnected data source
   */
  const disconnect = useCallback(async (dataSourceId) => {
    setIsLoading(true)
    setError(null)
    
    try {
      const dataSource = await disconnectDataSource(dataSourceId)
      setIsLoading(false)
      return dataSource
    } catch (err) {
      setError(err.message || 'Failed to disconnect data source')
      setIsLoading(false)
      throw err
    }
  }, [disconnectDataSource])

  /**
   * Fetch data from a data source
   * @param {string} dataSourceId - The data source ID
   * @param {Object} options - The fetch options
   * @returns {Promise<Object>} The fetched data
   */
  const fetchData = useCallback(async (dataSourceId, options = {}) => {
    setIsLoading(true)
    setError(null)
    
    try {
      const dataSource = dataSources.find(ds => ds.id === dataSourceId)
      if (!dataSource) {
        throw new Error(`Data source with ID ${dataSourceId} not found`)
      }
      
      let fetchedData
      
      // Fetch data based on the data source type
      switch (dataSource.type) {
        case 'Google Analytics':
          fetchedData = await fetchGoogleAnalyticsData(dataSource, options)
          break
        case 'Stripe':
          fetchedData = await fetchStripeData(dataSource, options)
          break
        case 'HubSpot':
          fetchedData = await fetchHubSpotData(dataSource, options)
          break
        default:
          throw new Error(`Unsupported data source type: ${dataSource.type}`)
      }
      
      setData(fetchedData)
      setIsLoading(false)
      return fetchedData
    } catch (err) {
      setError(err.message || 'Failed to fetch data')
      setIsLoading(false)
      throw err
    }
  }, [dataSources])

  /**
   * Fetch data from Google Analytics
   * @param {Object} dataSource - The data source
   * @param {Object} options - The fetch options
   * @returns {Promise<Object>} The fetched data
   */
  const fetchGoogleAnalyticsData = async (dataSource, options) => {
    // In a real implementation, this would use the Google Analytics API
    // For now, we'll return mock data
    return googleAnalytics.getMockGaData()
  }

  /**
   * Fetch data from Stripe
   * @param {Object} dataSource - The data source
   * @param {Object} options - The fetch options
   * @returns {Promise<Object>} The fetched data
   */
  const fetchStripeData = async (dataSource, options) => {
    // In a real implementation, this would use the Stripe API
    // For now, we'll return mock data
    return stripe.getMockStripeData()
  }

  /**
   * Fetch data from HubSpot
   * @param {Object} dataSource - The data source
   * @param {Object} options - The fetch options
   * @returns {Promise<Object>} The fetched data
   */
  const fetchHubSpotData = async (dataSource, options) => {
    // In a real implementation, this would use the HubSpot API
    // For now, we'll return mock data
    return hubspot.getMockHubspotData()
  }

  /**
   * Get the OAuth URL for a data source
   * @param {string} sourceType - The data source type
   * @param {string} state - A state parameter to include in the OAuth flow
   * @returns {string} The OAuth URL
   */
  const getOAuthUrl = useCallback((sourceType, state) => {
    switch (sourceType) {
      case 'Google Analytics':
        return googleAnalytics.getOAuthUrl(state)
      case 'HubSpot':
        return hubspot.getOAuthUrl(state)
      default:
        throw new Error(`OAuth not supported for data source type: ${sourceType}`)
    }
  }, [])

  /**
   * Exchange an authorization code for an access token
   * @param {string} sourceType - The data source type
   * @param {string} code - The authorization code
   * @returns {Promise<Object>} The token response
   */
  const exchangeCodeForToken = useCallback(async (sourceType, code) => {
    setIsLoading(true)
    setError(null)
    
    try {
      let tokenResponse
      
      switch (sourceType) {
        case 'Google Analytics':
          tokenResponse = await googleAnalytics.exchangeCodeForToken(code)
          break
        case 'HubSpot':
          tokenResponse = await hubspot.exchangeCodeForToken(code)
          break
        default:
          throw new Error(`OAuth not supported for data source type: ${sourceType}`)
      }
      
      setIsLoading(false)
      return tokenResponse
    } catch (err) {
      setError(err.message || 'Failed to exchange code for token')
      setIsLoading(false)
      throw err
    }
  }, [])

  /**
   * Clear the error
   */
  const clearError = useCallback(() => {
    setError(null)
  }, [])

  return {
    isLoading,
    error,
    data,
    connect,
    sync,
    disconnect,
    fetchData,
    getOAuthUrl,
    exchangeCodeForToken,
    clearError
  }
}

export default useDataSource

