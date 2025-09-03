/**
 * DataPoint Model
 * 
 * This model represents a data point in the application.
 */

import { v4 as uuidv4 } from 'uuid'

class DataPoint {
  /**
   * Create a new DataPoint instance
   * @param {Object} data - The data point data
   * @returns {DataPoint} A new DataPoint instance
   */
  static create(data) {
    return {
      id: data.id || uuidv4(),
      data_source_id: data.data_source_id,
      timestamp: data.timestamp || new Date().toISOString(),
      data_payload: data.data_payload || {},
      processed_at: data.processed_at || new Date().toISOString()
    }
  }

  /**
   * Generate mock data points for a data source
   * @param {string} dataSourceId - The data source ID
   * @param {string} dataSourceType - The data source type
   * @param {number} count - The number of data points to generate
   * @returns {Array<Object>} The generated data points
   */
  static generateMockDataPoints(dataSourceId, dataSourceType, count = 10) {
    const dataPoints = []
    
    for (let i = 0; i < count; i++) {
      const timestamp = new Date()
      timestamp.setDate(timestamp.getDate() - Math.floor(Math.random() * 30))
      
      dataPoints.push(this.create({
        data_source_id: dataSourceId,
        timestamp: timestamp.toISOString(),
        data_payload: this.generateMockDataPayload(dataSourceType),
        processed_at: new Date().toISOString()
      }))
    }
    
    return dataPoints
  }

  /**
   * Generate a mock data payload for a data source type
   * @param {string} dataSourceType - The data source type
   * @returns {Object} The generated data payload
   */
  static generateMockDataPayload(dataSourceType) {
    switch (dataSourceType) {
      case 'Google Analytics':
        return this.generateMockGoogleAnalyticsPayload()
      case 'Stripe':
        return this.generateMockStripePayload()
      case 'HubSpot':
        return this.generateMockHubSpotPayload()
      default:
        return {}
    }
  }

  /**
   * Generate a mock Google Analytics data payload
   * @returns {Object} The generated data payload
   */
  static generateMockGoogleAnalyticsPayload() {
    const sources = ['google', 'direct', 'facebook', 'twitter', 'linkedin']
    const pages = ['/home', '/about', '/pricing', '/blog', '/contact']
    const devices = ['desktop', 'mobile', 'tablet']
    const browsers = ['Chrome', 'Firefox', 'Safari', 'Edge']
    
    return {
      source: sources[Math.floor(Math.random() * sources.length)],
      medium: Math.random() > 0.5 ? 'organic' : 'referral',
      page: pages[Math.floor(Math.random() * pages.length)],
      pageTitle: `Page Title ${Math.floor(Math.random() * 10) + 1}`,
      device: devices[Math.floor(Math.random() * devices.length)],
      browser: browsers[Math.floor(Math.random() * browsers.length)],
      country: ['US', 'UK', 'CA', 'DE', 'FR'][Math.floor(Math.random() * 5)],
      sessionDuration: Math.floor(Math.random() * 600) + 10,
      bounced: Math.random() > 0.7,
      pageViews: Math.floor(Math.random() * 10) + 1
    }
  }

  /**
   * Generate a mock Stripe data payload
   * @returns {Object} The generated data payload
   */
  static generateMockStripePayload() {
    const eventTypes = ['charge.succeeded', 'customer.created', 'customer.subscription.created', 'invoice.paid']
    const plans = ['basic', 'pro', 'business']
    
    const eventType = eventTypes[Math.floor(Math.random() * eventTypes.length)]
    
    let payload = {
      id: `evt_${Math.random().toString(36).substring(2, 15)}`,
      object: 'event',
      api_version: '2023-10-16',
      created: Math.floor(Date.now() / 1000) - Math.floor(Math.random() * 86400 * 30),
      type: eventType
    }
    
    switch (eventType) {
      case 'charge.succeeded':
        payload.data = {
          object: {
            id: `ch_${Math.random().toString(36).substring(2, 15)}`,
            object: 'charge',
            amount: Math.floor(Math.random() * 10000) + 1000,
            currency: 'usd',
            customer: `cus_${Math.random().toString(36).substring(2, 15)}`,
            description: 'Subscription payment',
            status: 'succeeded'
          }
        }
        break
      case 'customer.created':
        payload.data = {
          object: {
            id: `cus_${Math.random().toString(36).substring(2, 15)}`,
            object: 'customer',
            email: `customer${Math.floor(Math.random() * 1000)}@example.com`,
            name: `Customer ${Math.floor(Math.random() * 1000)}`,
            created: Math.floor(Date.now() / 1000) - Math.floor(Math.random() * 86400 * 30)
          }
        }
        break
      case 'customer.subscription.created':
        payload.data = {
          object: {
            id: `sub_${Math.random().toString(36).substring(2, 15)}`,
            object: 'subscription',
            customer: `cus_${Math.random().toString(36).substring(2, 15)}`,
            plan: {
              id: `plan_${Math.random().toString(36).substring(2, 15)}`,
              nickname: plans[Math.floor(Math.random() * plans.length)],
              amount: Math.floor(Math.random() * 10000) + 1000,
              currency: 'usd',
              interval: 'month'
            },
            status: 'active',
            current_period_start: Math.floor(Date.now() / 1000) - Math.floor(Math.random() * 86400 * 30),
            current_period_end: Math.floor(Date.now() / 1000) + Math.floor(Math.random() * 86400 * 30)
          }
        }
        break
      case 'invoice.paid':
        payload.data = {
          object: {
            id: `in_${Math.random().toString(36).substring(2, 15)}`,
            object: 'invoice',
            customer: `cus_${Math.random().toString(36).substring(2, 15)}`,
            subscription: `sub_${Math.random().toString(36).substring(2, 15)}`,
            amount_due: Math.floor(Math.random() * 10000) + 1000,
            amount_paid: Math.floor(Math.random() * 10000) + 1000,
            currency: 'usd',
            status: 'paid'
          }
        }
        break
    }
    
    return payload
  }

  /**
   * Generate a mock HubSpot data payload
   * @returns {Object} The generated data payload
   */
  static generateMockHubSpotPayload() {
    const eventTypes = ['contact.creation', 'contact.propertyChange', 'deal.creation', 'deal.propertyChange']
    const dealStages = ['appointmentscheduled', 'qualifiedtobuy', 'presentationscheduled', 'decisionmakerboughtin', 'contractsent', 'closedwon', 'closedlost']
    
    const eventType = eventTypes[Math.floor(Math.random() * eventTypes.length)]
    
    let payload = {
      eventId: Math.random().toString(36).substring(2, 15),
      subscriptionId: Math.random().toString(36).substring(2, 15),
      portalId: Math.floor(Math.random() * 1000000) + 1000,
      appId: Math.floor(Math.random() * 1000000) + 1000,
      occurredAt: Math.floor(Date.now() / 1000) - Math.floor(Math.random() * 86400 * 30),
      eventType
    }
    
    switch (eventType) {
      case 'contact.creation':
        payload.objectId = Math.floor(Math.random() * 1000000) + 1000
        payload.properties = {
          email: `contact${Math.floor(Math.random() * 1000)}@example.com`,
          firstname: `First${Math.floor(Math.random() * 1000)}`,
          lastname: `Last${Math.floor(Math.random() * 1000)}`,
          company: `Company ${Math.floor(Math.random() * 100)}`,
          phone: `+1${Math.floor(Math.random() * 1000000000) + 1000000000}`,
          createdate: new Date().toISOString()
        }
        break
      case 'contact.propertyChange':
        payload.objectId = Math.floor(Math.random() * 1000000) + 1000
        payload.propertyName = 'lifecyclestage'
        payload.propertyValue = ['lead', 'marketingqualifiedlead', 'salesqualifiedlead', 'opportunity', 'customer'][Math.floor(Math.random() * 5)]
        break
      case 'deal.creation':
        payload.objectId = Math.floor(Math.random() * 1000000) + 1000
        payload.properties = {
          dealname: `Deal ${Math.floor(Math.random() * 1000)}`,
          amount: Math.floor(Math.random() * 100000) + 10000,
          dealstage: dealStages[Math.floor(Math.random() * dealStages.length)],
          pipeline: 'default',
          closedate: new Date(Date.now() + Math.floor(Math.random() * 86400000 * 90)).toISOString(),
          createdate: new Date().toISOString()
        }
        break
      case 'deal.propertyChange':
        payload.objectId = Math.floor(Math.random() * 1000000) + 1000
        payload.propertyName = 'dealstage'
        payload.propertyValue = dealStages[Math.floor(Math.random() * dealStages.length)]
        break
    }
    
    return payload
  }

  /**
   * Filter data points based on criteria
   * @param {Array<Object>} dataPoints - The data points to filter
   * @param {Object} filters - The filter criteria
   * @returns {Array<Object>} The filtered data points
   */
  static filter(dataPoints, filters = {}) {
    let filteredDataPoints = [...dataPoints]
    
    // Filter by date range
    if (filters.date_range) {
      const { start, end } = filters.date_range
      
      if (start && end) {
        filteredDataPoints = filteredDataPoints.filter(dataPoint => {
          const timestamp = new Date(dataPoint.timestamp)
          return timestamp >= new Date(start) && timestamp <= new Date(end)
        })
      }
    }
    
    // Filter by source
    if (filters.source && filters.source !== 'all') {
      filteredDataPoints = filteredDataPoints.filter(dataPoint => {
        return dataPoint.data_source_id === filters.source
      })
    }
    
    // Filter by category
    if (filters.category && filters.category !== 'all') {
      filteredDataPoints = filteredDataPoints.filter(dataPoint => {
        // This is a simplified example. In a real application, you would have a more complex category filter.
        return dataPoint.data_payload.category === filters.category
      })
    }
    
    // Filter by query
    if (filters.query) {
      const query = filters.query.toLowerCase()
      
      filteredDataPoints = filteredDataPoints.filter(dataPoint => {
        const dataString = JSON.stringify(dataPoint.data_payload).toLowerCase()
        return dataString.includes(query)
      })
    }
    
    return filteredDataPoints
  }
}

export default DataPoint

