/**
 * DataSource Model
 * 
 * This model represents a data source in the application.
 */

import { v4 as uuidv4 } from 'uuid'

class DataSource {
  /**
   * Create a new DataSource instance
   * @param {Object} data - The data source data
   * @returns {DataSource} A new DataSource instance
   */
  static create(data) {
    return {
      id: data.id || uuidv4(),
      user_id: data.user_id,
      type: data.type,
      status: data.status || 'setup',
      api_key: data.api_key,
      connection_details: data.connection_details || {},
      last_synced_at: data.last_synced_at || null,
      metrics: data.metrics || this.getDefaultMetrics(data.type),
      icon: this.getIconForType(data.type)
    }
  }

  /**
   * Connect to a data source
   * @param {Object} dataSource - The data source to connect
   * @param {Object} connectionDetails - The connection details
   * @returns {Promise<Object>} The connected data source
   */
  static async connect(dataSource, connectionDetails) {
    // In a real implementation, this would make an API call to connect to the data source
    // For now, we'll simulate a successful connection
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    return {
      ...dataSource,
      status: 'connected',
      connection_details: {
        ...dataSource.connection_details,
        ...connectionDetails
      }
    }
  }

  /**
   * Disconnect from a data source
   * @param {Object} dataSource - The data source to disconnect
   * @returns {Object} The disconnected data source
   */
  static disconnect(dataSource) {
    return {
      ...dataSource,
      status: 'setup',
      connection_details: {},
      last_synced_at: null
    }
  }

  /**
   * Sync a data source
   * @param {Object} dataSource - The data source to sync
   * @returns {Promise<Object>} The synced data source
   */
  static async sync(dataSource) {
    // In a real implementation, this would make an API call to sync the data source
    // For now, we'll simulate a successful sync
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    return {
      ...dataSource,
      last_synced_at: new Date().toISOString(),
      metrics: this.getUpdatedMetrics(dataSource.type)
    }
  }

  /**
   * Get the default metrics for a data source type
   * @param {string} type - The data source type
   * @returns {Object} The default metrics
   */
  static getDefaultMetrics(type) {
    switch (type) {
      case 'Google Analytics':
        return {
          activeUsers: 0,
          pageViews: 0,
          sessions: 0,
          bounceRate: 0
        }
      case 'Stripe':
        return {
          customers: 0,
          mrr: 0,
          revenue: 0,
          churnRate: 0
        }
      case 'HubSpot':
        return {
          contacts: 0,
          companies: 0,
          deals: 0,
          openDeals: 0
        }
      default:
        return {}
    }
  }

  /**
   * Get updated metrics for a data source type
   * @param {string} type - The data source type
   * @returns {Object} The updated metrics
   */
  static getUpdatedMetrics(type) {
    switch (type) {
      case 'Google Analytics':
        return {
          activeUsers: Math.floor(Math.random() * 1000) + 500,
          pageViews: Math.floor(Math.random() * 5000) + 1000,
          sessions: Math.floor(Math.random() * 2000) + 800,
          bounceRate: Math.random() * 0.6 + 0.2
        }
      case 'Stripe':
        return {
          customers: Math.floor(Math.random() * 500) + 200,
          mrr: Math.floor(Math.random() * 15000) + 5000,
          revenue: Math.floor(Math.random() * 50000) + 10000,
          churnRate: Math.random() * 0.05 + 0.01
        }
      case 'HubSpot':
        return {
          contacts: Math.floor(Math.random() * 1000) + 500,
          companies: Math.floor(Math.random() * 200) + 100,
          deals: Math.floor(Math.random() * 100) + 50,
          openDeals: Math.floor(Math.random() * 50) + 20
        }
      default:
        return {}
    }
  }

  /**
   * Get the icon for a data source type
   * @param {string} type - The data source type
   * @returns {string} The icon
   */
  static getIconForType(type) {
    switch (type) {
      case 'Google Analytics':
        return '📊'
      case 'Stripe':
        return '💳'
      case 'HubSpot':
        return '🏢'
      case 'Salesforce':
        return '⚡'
      case 'Mailchimp':
        return '📧'
      case 'Facebook Ads':
        return '📘'
      default:
        return '📁'
    }
  }
}

export default DataSource

