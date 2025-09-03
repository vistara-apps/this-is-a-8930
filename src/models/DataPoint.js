/**
 * DataPoint Model
 * 
 * This model represents a data point from a data source.
 */

class DataPoint {
  /**
   * Create a new DataPoint
   * @param {Object} data - The data point data
   */
  constructor(data) {
    this.id = data.id || `dp_${Math.random().toString(36).substring(2, 15)}`
    this.data_source_id = data.data_source_id
    this.timestamp = data.timestamp || new Date().toISOString()
    this.data_payload = data.data_payload || {}
    this.metadata = data.metadata || {}
  }

  /**
   * Get the data point as a plain object
   * @returns {Object} The data point as a plain object
   */
  toObject() {
    return {
      id: this.id,
      data_source_id: this.data_source_id,
      timestamp: this.timestamp,
      data_payload: this.data_payload,
      metadata: this.metadata
    }
  }

  /**
   * Create a data point from a plain object
   * @param {Object} obj - The plain object
   * @returns {DataPoint} The data point
   */
  static fromObject(obj) {
    return new DataPoint(obj)
  }

  /**
   * Generate a mock data point for a Google Analytics data source
   * @param {string} dataSourceId - The data source ID
   * @returns {DataPoint} The mock data point
   */
  static generateGoogleAnalyticsMock(dataSourceId) {
    const metrics = [
      'pageviews',
      'sessions',
      'users',
      'newUsers',
      'bounceRate',
      'avgSessionDuration',
      'pageviewsPerSession'
    ]
    
    const dimensions = [
      'date',
      'deviceCategory',
      'country',
      'browser',
      'operatingSystem',
      'channelGrouping'
    ]
    
    const metric = metrics[Math.floor(Math.random() * metrics.length)]
    const dimension = dimensions[Math.floor(Math.random() * dimensions.length)]
    
    let value
    switch (metric) {
      case 'pageviews':
      case 'sessions':
      case 'users':
      case 'newUsers':
        value = Math.floor(Math.random() * 1000) + 100
        break
      case 'bounceRate':
        value = Math.random() * 100
        break
      case 'avgSessionDuration':
        value = Math.floor(Math.random() * 300) + 60
        break
      case 'pageviewsPerSession':
        value = Math.random() * 10 + 1
        break
      default:
        value = Math.floor(Math.random() * 1000)
    }
    
    let dimensionValue
    switch (dimension) {
      case 'date':
        const date = new Date()
        date.setDate(date.getDate() - Math.floor(Math.random() * 30))
        dimensionValue = date.toISOString().split('T')[0]
        break
      case 'deviceCategory':
        dimensionValue = ['desktop', 'mobile', 'tablet'][Math.floor(Math.random() * 3)]
        break
      case 'country':
        dimensionValue = ['United States', 'United Kingdom', 'Canada', 'Germany', 'France', 'Australia', 'Japan'][Math.floor(Math.random() * 7)]
        break
      case 'browser':
        dimensionValue = ['Chrome', 'Safari', 'Firefox', 'Edge', 'Opera'][Math.floor(Math.random() * 5)]
        break
      case 'operatingSystem':
        dimensionValue = ['Windows', 'macOS', 'iOS', 'Android', 'Linux'][Math.floor(Math.random() * 5)]
        break
      case 'channelGrouping':
        dimensionValue = ['Organic Search', 'Direct', 'Social', 'Referral', 'Email', 'Paid Search'][Math.floor(Math.random() * 6)]
        break
      default:
        dimensionValue = `Value ${Math.floor(Math.random() * 100)}`
    }
    
    return new DataPoint({
      data_source_id: dataSourceId,
      timestamp: new Date(Date.now() - Math.floor(Math.random() * 86400000 * 30)).toISOString(),
      data_payload: {
        type: 'analytics',
        metric,
        dimension,
        value,
        dimensionValue
      }
    })
  }

  /**
   * Generate a mock data point for a Stripe data source
   * @param {string} dataSourceId - The data source ID
   * @returns {DataPoint} The mock data point
   */
  static generateStripeMock(dataSourceId) {
    const eventTypes = [
      'charge.succeeded',
      'customer.created',
      'customer.subscription.created',
      'invoice.payment_succeeded',
      'payment_intent.succeeded'
    ]
    
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
            current_period_start: Math.floor(Date.now() / 1000) - Math.floor(Math.random() * 86400 * 30),
            current_period_end: Math.floor(Date.now() / 1000) + Math.floor(Math.random() * 86400 * 30),
            status: 'active',
            plan: {
              id: `plan_${Math.random().toString(36).substring(2, 15)}`,
              amount: Math.floor(Math.random() * 10000) + 1000,
              currency: 'usd',
              interval: 'month'
            }
          }
        }
        break
      case 'invoice.payment_succeeded':
        payload.data = {
          object: {
            id: `in_${Math.random().toString(36).substring(2, 15)}`,
            object: 'invoice',
            customer: `cus_${Math.random().toString(36).substring(2, 15)}`,
            subscription: `sub_${Math.random().toString(36).substring(2, 15)}`,
            status: 'paid',
            total: Math.floor(Math.random() * 10000) + 1000,
            currency: 'usd'
          }
        }
        break
      case 'payment_intent.succeeded':
        payload.data = {
          object: {
            id: `pi_${Math.random().toString(36).substring(2, 15)}`,
            object: 'payment_intent',
            amount: Math.floor(Math.random() * 10000) + 1000,
            currency: 'usd',
            customer: `cus_${Math.random().toString(36).substring(2, 15)}`,
            status: 'succeeded'
          }
        }
        break
      default:
        payload.data = {
          object: {
            id: `gen_${Math.random().toString(36).substring(2, 15)}`,
            object: 'generic',
            type: 'unknown'
          }
        }
    }
    
    return new DataPoint({
      data_source_id: dataSourceId,
      timestamp: new Date(payload.created * 1000).toISOString(),
      data_payload: payload
    })
  }

  /**
   * Generate a mock data point for a HubSpot data source
   * @param {string} dataSourceId - The data source ID
   * @returns {DataPoint} The mock data point
   */
  static generateHubSpotMock(dataSourceId) {
    const eventTypes = [
      'contact.creation',
      'contact.propertyChange',
      'deal.creation',
      'deal.propertyChange',
      'company.creation'
    ]
    
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
          address: `${Math.floor(Math.random() * 1000)} Main St`,
          city: `City ${Math.floor(Math.random() * 100)}`,
          state: `State ${Math.floor(Math.random() * 50)}`,
          zip: `${Math.floor(Math.random() * 90000) + 10000}`
        }
        break
      case 'contact.propertyChange':
        payload.objectId = Math.floor(Math.random() * 1000000) + 1000
        payload.propertyName = ['email', 'firstname', 'lastname', 'phone'][Math.floor(Math.random() * 4)]
        payload.propertyValue = `Updated Value ${Math.floor(Math.random() * 100)}`
        break
      case 'deal.creation':
        payload.objectId = Math.floor(Math.random() * 1000000) + 1000
        payload.properties = {
          dealname: `Deal ${Math.floor(Math.random() * 1000)}`,
          amount: Math.floor(Math.random() * 100000) + 1000,
          dealstage: ['appointmentscheduled', 'qualifiedtobuy', 'presentationscheduled', 'decisionmakerboughtin', 'contractsent', 'closedwon', 'closedlost'][Math.floor(Math.random() * 7)],
          pipeline: 'default',
          closedate: new Date(Date.now() + Math.floor(Math.random() * 86400000 * 90)).toISOString().split('T')[0]
        }
        break
      case 'deal.propertyChange':
        payload.objectId = Math.floor(Math.random() * 1000000) + 1000
        payload.propertyName = ['dealname', 'amount', 'dealstage', 'closedate'][Math.floor(Math.random() * 4)]
        payload.propertyValue = `Updated Value ${Math.floor(Math.random() * 100)}`
        break
      case 'company.creation':
        payload.objectId = Math.floor(Math.random() * 1000000) + 1000
        payload.properties = {
          name: `Company ${Math.floor(Math.random() * 1000)}`,
          domain: `company${Math.floor(Math.random() * 1000)}.com`,
          industry: ['Software', 'Healthcare', 'Finance', 'Education', 'Retail', 'Manufacturing'][Math.floor(Math.random() * 6)],
          phone: `+1${Math.floor(Math.random() * 1000000000) + 1000000000}`,
          address: `${Math.floor(Math.random() * 1000)} Main St`,
          city: `City ${Math.floor(Math.random() * 100)}`,
          state: `State ${Math.floor(Math.random() * 50)}`,
          zip: `${Math.floor(Math.random() * 90000) + 10000}`
        }
        break
      default:
        payload.objectId = Math.floor(Math.random() * 1000000) + 1000
        payload.properties = {
          type: 'unknown',
          value: `Generic Value ${Math.floor(Math.random() * 100)}`
        }
    }
    
    return new DataPoint({
      data_source_id: dataSourceId,
      timestamp: new Date(payload.occurredAt * 1000).toISOString(),
      data_payload: payload
    })
  }

  /**
   * Generate a mock data point based on the data source type
   * @param {string} dataSourceId - The data source ID
   * @param {string} dataSourceType - The data source type
   * @returns {DataPoint} The mock data point
   */
  static generateMock(dataSourceId, dataSourceType) {
    switch (dataSourceType) {
      case 'google_analytics':
        return this.generateGoogleAnalyticsMock(dataSourceId)
      case 'stripe':
        return this.generateStripeMock(dataSourceId)
      case 'hubspot':
        return this.generateHubSpotMock(dataSourceId)
      default:
        return new DataPoint({
          data_source_id: dataSourceId,
          timestamp: new Date(Date.now() - Math.floor(Math.random() * 86400000 * 30)).toISOString(),
          data_payload: {
            type: 'generic',
            value: Math.floor(Math.random() * 1000),
            label: `Label ${Math.floor(Math.random() * 100)}`
          }
        })
    }
  }
}

export default DataPoint

