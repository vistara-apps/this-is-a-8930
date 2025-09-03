/**
 * Widget Model
 * 
 * This model represents a widget in a dashboard.
 */

import { v4 as uuidv4 } from 'uuid'

class Widget {
  /**
   * Create a new Widget instance
   * @param {Object} data - The widget data
   * @returns {Widget} A new Widget instance
   */
  static create(data) {
    return {
      id: data.id || uuidv4(),
      dashboard_id: data.dashboard_id,
      type: data.type || 'metric',
      chart_type: data.chart_type,
      title: data.title || 'New Widget',
      description: data.description || '',
      data_source_type: data.data_source_type,
      data_query: data.data_query || {},
      visualization_config: data.visualization_config || this.getDefaultVisualizationConfig(data.type, data.chart_type),
      position: data.position || { x: 0, y: 0, w: 3, h: 2 },
      data: data.data || null,
      created_at: data.created_at || new Date().toISOString(),
      updated_at: data.updated_at || new Date().toISOString()
    }
  }

  /**
   * Update a widget
   * @param {Object} widget - The widget to update
   * @param {Object} updates - The updates to apply
   * @returns {Object} The updated widget
   */
  static update(widget, updates) {
    const updatedWidget = {
      ...widget,
      ...updates,
      updated_at: new Date().toISOString()
    }
    
    // If the type or chart_type changed, update the visualization_config
    if (updates.type || updates.chart_type) {
      updatedWidget.visualization_config = this.getDefaultVisualizationConfig(
        updates.type || widget.type,
        updates.chart_type || widget.chart_type
      )
    }
    
    return updatedWidget
  }

  /**
   * Get the default visualization configuration for a widget type
   * @param {string} type - The widget type
   * @param {string} chartType - The chart type (for chart widgets)
   * @returns {Object} The default visualization configuration
   */
  static getDefaultVisualizationConfig(type, chartType) {
    switch (type) {
      case 'metric':
        return {
          format: 'number',
          prefix: '',
          suffix: '',
          decimals: 0,
          colorPositive: '#10b981',
          colorNegative: '#ef4444',
          showChange: true,
          comparisonPeriod: 'previous'
        }
      case 'chart':
        switch (chartType) {
          case 'line':
            return {
              colors: ['#6366f1', '#8b5cf6', '#ec4899', '#f43f5e'],
              showLegend: true,
              showGrid: true,
              showTooltip: true,
              stacked: false,
              fillOpacity: 0.1,
              aspectRatio: 2
            }
          case 'bar':
            return {
              colors: ['#6366f1', '#8b5cf6', '#ec4899', '#f43f5e'],
              showLegend: true,
              showGrid: true,
              showTooltip: true,
              stacked: false,
              horizontal: false,
              aspectRatio: 2
            }
          case 'pie':
          case 'doughnut':
            return {
              colors: ['#6366f1', '#8b5cf6', '#ec4899', '#f43f5e', '#10b981', '#14b8a6', '#0ea5e9', '#3b82f6'],
              showLegend: true,
              showTooltip: true,
              showLabels: false,
              innerRadius: chartType === 'doughnut' ? 0.6 : 0,
              aspectRatio: 1
            }
          default:
            return {}
        }
      case 'table':
        return {
          showHeader: true,
          striped: true,
          bordered: false,
          compact: false,
          pagination: true,
          pageSize: 10
        }
      default:
        return {}
    }
  }

  /**
   * Generate mock data for a widget
   * @param {Object} widget - The widget to generate data for
   * @param {Array<Object>} dataPoints - Optional data points to use for generating data
   * @returns {Object} The widget with generated data
   */
  static generateMockData(widget, dataPoints = []) {
    let data
    
    switch (widget.type) {
      case 'metric':
        data = this.generateMockMetricData(widget)
        break
      case 'chart':
        data = this.generateMockChartData(widget)
        break
      case 'table':
        data = this.generateMockTableData(widget)
        break
      default:
        data = null
    }
    
    return {
      ...widget,
      data
    }
  }

  /**
   * Generate mock metric data
   * @param {Object} widget - The widget to generate data for
   * @returns {Object} The generated metric data
   */
  static generateMockMetricData(widget) {
    const { data_source_type, data_query } = widget
    let value, previousValue
    
    switch (data_source_type) {
      case 'Google Analytics':
        switch (data_query.metric) {
          case 'activeUsers':
            value = Math.floor(Math.random() * 1000) + 500
            previousValue = Math.floor(Math.random() * 1000) + 500
            break
          case 'pageViews':
            value = Math.floor(Math.random() * 5000) + 1000
            previousValue = Math.floor(Math.random() * 5000) + 1000
            break
          case 'sessions':
            value = Math.floor(Math.random() * 2000) + 800
            previousValue = Math.floor(Math.random() * 2000) + 800
            break
          case 'bounceRate':
            value = Math.random() * 0.6 + 0.2
            previousValue = Math.random() * 0.6 + 0.2
            break
          default:
            value = Math.floor(Math.random() * 1000)
            previousValue = Math.floor(Math.random() * 1000)
        }
        break
      case 'Stripe':
        switch (data_query.metric) {
          case 'customers':
            value = Math.floor(Math.random() * 500) + 200
            previousValue = Math.floor(Math.random() * 500) + 200
            break
          case 'mrr':
            value = Math.floor(Math.random() * 15000) + 5000
            previousValue = Math.floor(Math.random() * 15000) + 5000
            break
          case 'revenue':
            value = Math.floor(Math.random() * 50000) + 10000
            previousValue = Math.floor(Math.random() * 50000) + 10000
            break
          case 'churnRate':
            value = Math.random() * 0.05 + 0.01
            previousValue = Math.random() * 0.05 + 0.01
            break
          default:
            value = Math.floor(Math.random() * 1000)
            previousValue = Math.floor(Math.random() * 1000)
        }
        break
      case 'HubSpot':
        switch (data_query.metric) {
          case 'contacts':
            value = Math.floor(Math.random() * 1000) + 500
            previousValue = Math.floor(Math.random() * 1000) + 500
            break
          case 'companies':
            value = Math.floor(Math.random() * 200) + 100
            previousValue = Math.floor(Math.random() * 200) + 100
            break
          case 'deals':
            value = Math.floor(Math.random() * 100) + 50
            previousValue = Math.floor(Math.random() * 100) + 50
            break
          case 'openDeals':
            value = Math.floor(Math.random() * 50) + 20
            previousValue = Math.floor(Math.random() * 50) + 20
            break
          default:
            value = Math.floor(Math.random() * 1000)
            previousValue = Math.floor(Math.random() * 1000)
        }
        break
      default:
        value = Math.floor(Math.random() * 1000)
        previousValue = Math.floor(Math.random() * 1000)
    }
    
    const change = value - previousValue
    const changePercent = previousValue !== 0 ? (change / previousValue) * 100 : 0
    
    return {
      value,
      previousValue,
      change,
      changePercent,
      trend: change >= 0 ? 'up' : 'down',
      lastUpdated: new Date().toISOString()
    }
  }

  /**
   * Generate mock chart data
   * @param {Object} widget - The widget to generate data for
   * @returns {Object} The generated chart data
   */
  static generateMockChartData(widget) {
    const { data_source_type, data_query, chart_type } = widget
    
    switch (chart_type) {
      case 'line':
      case 'bar':
        return this.generateMockTimeSeriesData(data_source_type, data_query)
      case 'pie':
      case 'doughnut':
        return this.generateMockCategoryData(data_source_type, data_query)
      default:
        return null
    }
  }

  /**
   * Generate mock time series data
   * @param {string} dataSourceType - The data source type
   * @param {Object} dataQuery - The data query
   * @returns {Object} The generated time series data
   */
  static generateMockTimeSeriesData(dataSourceType, dataQuery) {
    const { metrics, dimensions, period, limit } = dataQuery
    const days = period === 'last-7-days' ? 7 : period === 'last-30-days' ? 30 : 14
    
    // Generate dates
    const labels = []
    const now = new Date()
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date()
      date.setDate(now.getDate() - i)
      labels.push(date.toISOString().split('T')[0])
    }
    
    // Generate datasets
    const datasets = (metrics || ['value']).map(metric => {
      const data = labels.map(() => Math.floor(Math.random() * 1000) + 100)
      
      return {
        label: this.formatMetricName(metric),
        data
      }
    })
    
    return {
      labels,
      datasets,
      lastUpdated: new Date().toISOString()
    }
  }

  /**
   * Generate mock category data
   * @param {string} dataSourceType - The data source type
   * @param {Object} dataQuery - The data query
   * @returns {Object} The generated category data
   */
  static generateMockCategoryData(dataSourceType, dataQuery) {
    const { metrics, dimensions, period, limit } = dataQuery
    let labels = []
    let data = []
    
    switch (dataSourceType) {
      case 'Google Analytics':
        if (dimensions && dimensions.includes('source')) {
          labels = ['Google', 'Direct', 'Facebook', 'Twitter', 'LinkedIn']
          data = labels.map(() => Math.floor(Math.random() * 1000) + 100)
        } else if (dimensions && dimensions.includes('device')) {
          labels = ['Desktop', 'Mobile', 'Tablet']
          data = labels.map(() => Math.floor(Math.random() * 1000) + 100)
        } else {
          labels = ['Category 1', 'Category 2', 'Category 3', 'Category 4', 'Category 5']
          data = labels.map(() => Math.floor(Math.random() * 1000) + 100)
        }
        break
      case 'Stripe':
        if (dimensions && dimensions.includes('plan')) {
          labels = ['Basic', 'Pro', 'Business']
          data = labels.map(() => Math.floor(Math.random() * 1000) + 100)
        } else {
          labels = ['Category 1', 'Category 2', 'Category 3', 'Category 4', 'Category 5']
          data = labels.map(() => Math.floor(Math.random() * 1000) + 100)
        }
        break
      case 'HubSpot':
        if (dimensions && dimensions.includes('dealstage')) {
          labels = ['Appointment Scheduled', 'Qualified to Buy', 'Presentation Scheduled', 'Decision Maker Bought-In', 'Contract Sent', 'Closed Won', 'Closed Lost']
          data = labels.map(() => Math.floor(Math.random() * 100) + 10)
        } else {
          labels = ['Category 1', 'Category 2', 'Category 3', 'Category 4', 'Category 5']
          data = labels.map(() => Math.floor(Math.random() * 1000) + 100)
        }
        break
      default:
        labels = ['Category 1', 'Category 2', 'Category 3', 'Category 4', 'Category 5']
        data = labels.map(() => Math.floor(Math.random() * 1000) + 100)
    }
    
    return {
      labels,
      datasets: [{
        data,
        backgroundColor: [
          '#6366f1',
          '#8b5cf6',
          '#ec4899',
          '#f43f5e',
          '#10b981',
          '#14b8a6',
          '#0ea5e9',
          '#3b82f6'
        ].slice(0, labels.length)
      }],
      lastUpdated: new Date().toISOString()
    }
  }

  /**
   * Generate mock table data
   * @param {Object} widget - The widget to generate data for
   * @returns {Object} The generated table data
   */
  static generateMockTableData(widget) {
    const { data_source_type, data_query } = widget
    const { metrics, dimensions, period, limit } = data_query
    const rowCount = limit || 10
    
    let columns = []
    let rows = []
    
    switch (data_source_type) {
      case 'Google Analytics':
        if (dimensions && dimensions.includes('page')) {
          columns = [
            { id: 'page', label: 'Page', type: 'string' },
            { id: 'pageViews', label: 'Page Views', type: 'number' },
            { id: 'uniquePageViews', label: 'Unique Page Views', type: 'number' },
            { id: 'avgTimeOnPage', label: 'Avg. Time on Page', type: 'duration' }
          ]
          
          rows = Array.from({ length: rowCount }).map((_, i) => ({
            page: `/page-${i + 1}`,
            pageViews: Math.floor(Math.random() * 1000) + 100,
            uniquePageViews: Math.floor(Math.random() * 800) + 50,
            avgTimeOnPage: Math.floor(Math.random() * 300) + 10
          }))
        } else {
          columns = [
            { id: 'source', label: 'Source', type: 'string' },
            { id: 'sessions', label: 'Sessions', type: 'number' },
            { id: 'bounceRate', label: 'Bounce Rate', type: 'percent' },
            { id: 'avgSessionDuration', label: 'Avg. Session Duration', type: 'duration' }
          ]
          
          rows = [
            { source: 'Google', sessions: Math.floor(Math.random() * 1000) + 500, bounceRate: Math.random() * 0.6 + 0.2, avgSessionDuration: Math.floor(Math.random() * 300) + 60 },
            { source: 'Direct', sessions: Math.floor(Math.random() * 800) + 300, bounceRate: Math.random() * 0.6 + 0.2, avgSessionDuration: Math.floor(Math.random() * 300) + 60 },
            { source: 'Facebook', sessions: Math.floor(Math.random() * 500) + 200, bounceRate: Math.random() * 0.6 + 0.2, avgSessionDuration: Math.floor(Math.random() * 300) + 60 },
            { source: 'Twitter', sessions: Math.floor(Math.random() * 300) + 100, bounceRate: Math.random() * 0.6 + 0.2, avgSessionDuration: Math.floor(Math.random() * 300) + 60 },
            { source: 'LinkedIn', sessions: Math.floor(Math.random() * 200) + 50, bounceRate: Math.random() * 0.6 + 0.2, avgSessionDuration: Math.floor(Math.random() * 300) + 60 }
          ]
        }
        break
      case 'Stripe':
        columns = [
          { id: 'customer', label: 'Customer', type: 'string' },
          { id: 'plan', label: 'Plan', type: 'string' },
          { id: 'amount', label: 'Amount', type: 'currency' },
          { id: 'status', label: 'Status', type: 'string' },
          { id: 'created', label: 'Created', type: 'date' }
        ]
        
        rows = Array.from({ length: rowCount }).map((_, i) => {
          const plans = ['Basic', 'Pro', 'Business']
          const statuses = ['active', 'past_due', 'canceled']
          const plan = plans[Math.floor(Math.random() * plans.length)]
          const amount = plan === 'Basic' ? 9.99 : plan === 'Pro' ? 29.99 : 99.99
          
          return {
            customer: `Customer ${i + 1}`,
            plan,
            amount,
            status: statuses[Math.floor(Math.random() * statuses.length)],
            created: new Date(Date.now() - Math.floor(Math.random() * 30) * 86400000).toISOString()
          }
        })
        break
      case 'HubSpot':
        columns = [
          { id: 'deal', label: 'Deal', type: 'string' },
          { id: 'amount', label: 'Amount', type: 'currency' },
          { id: 'stage', label: 'Stage', type: 'string' },
          { id: 'owner', label: 'Owner', type: 'string' },
          { id: 'closeDate', label: 'Close Date', type: 'date' }
        ]
        
        rows = Array.from({ length: rowCount }).map((_, i) => {
          const stages = ['Appointment Scheduled', 'Qualified to Buy', 'Presentation Scheduled', 'Decision Maker Bought-In', 'Contract Sent', 'Closed Won', 'Closed Lost']
          const owners = ['John Doe', 'Jane Smith', 'Bob Johnson', 'Alice Williams']
          
          return {
            deal: `Deal ${i + 1}`,
            amount: Math.floor(Math.random() * 50000) + 5000,
            stage: stages[Math.floor(Math.random() * stages.length)],
            owner: owners[Math.floor(Math.random() * owners.length)],
            closeDate: new Date(Date.now() + Math.floor(Math.random() * 90) * 86400000).toISOString()
          }
        })
        break
      default:
        columns = [
          { id: 'id', label: 'ID', type: 'string' },
          { id: 'name', label: 'Name', type: 'string' },
          { id: 'value', label: 'Value', type: 'number' },
          { id: 'date', label: 'Date', type: 'date' }
        ]
        
        rows = Array.from({ length: rowCount }).map((_, i) => ({
          id: `ID-${i + 1}`,
          name: `Item ${i + 1}`,
          value: Math.floor(Math.random() * 1000) + 100,
          date: new Date(Date.now() - Math.floor(Math.random() * 30) * 86400000).toISOString()
        }))
    }
    
    return {
      columns,
      rows,
      lastUpdated: new Date().toISOString()
    }
  }

  /**
   * Format a metric name for display
   * @param {string} metric - The metric name
   * @returns {string} The formatted metric name
   */
  static formatMetricName(metric) {
    // Convert camelCase to Title Case with spaces
    return metric
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .trim()
  }
}

export default Widget

