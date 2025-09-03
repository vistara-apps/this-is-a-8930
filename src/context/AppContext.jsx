import React, { createContext, useContext, useState, useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid'
import DataSource from '../models/DataSource'
import DataPoint from '../models/DataPoint'
import Dashboard from '../models/Dashboard'
import Widget from '../models/Widget'

const AppContext = createContext()

export const useApp = () => {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp must be used within an AppProvider')
  }
  return context
}

// Generate mock user ID
const mockUserId = uuidv4()

// Generate mock data sources
const generateMockDataSources = () => {
  return [
    DataSource.create({
      id: uuidv4(),
      user_id: mockUserId,
      type: 'Google Analytics',
      status: 'connected',
      last_synced_at: new Date().toISOString(),
      connection_details: {
        oauth_token: 'mock-token',
        account_id: 'GA12345'
      }
    }),
    DataSource.create({
      id: uuidv4(),
      user_id: mockUserId,
      type: 'Stripe',
      status: 'connected',
      last_synced_at: new Date().toISOString(),
      connection_details: {
        api_key: 'sk_test_mock',
        account_id: 'acct_12345'
      }
    }),
    DataSource.create({
      id: uuidv4(),
      user_id: mockUserId,
      type: 'HubSpot',
      status: 'setup',
      last_synced_at: null,
      connection_details: {}
    })
  ]
}

export const AppProvider = ({ children }) => {
  // Initialize state with mock data
  const [dataSources, setDataSources] = useState(() => generateMockDataSources())
  const [dashboards, setDashboards] = useState(() => [Dashboard.generateDefaultDashboard(mockUserId)])
  const [currentDashboard, setCurrentDashboard] = useState(null)
  const [dataPoints, setDataPoints] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedFilters, setSelectedFilters] = useState({
    dateRange: 'last-7-days',
    source: 'all',
    category: 'all'
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  // Set the current dashboard to the first dashboard when the component mounts
  useEffect(() => {
    if (dashboards.length > 0 && !currentDashboard) {
      setCurrentDashboard(dashboards[0])
    }
  }, [dashboards, currentDashboard])

  // Generate mock data points for each data source
  useEffect(() => {
    const generateDataPoints = async () => {
      const allDataPoints = []
      
      for (const source of dataSources) {
        if (source.status === 'connected') {
          const sourceDataPoints = DataPoint.generateMockDataPoints(source.id, source.type, 50)
          allDataPoints.push(...sourceDataPoints)
        }
      }
      
      setDataPoints(allDataPoints)
    }
    
    generateDataPoints()
  }, [dataSources])

  // Connect to a data source
  const connectDataSource = async (sourceType) => {
    setIsLoading(true)
    setError(null)
    
    try {
      // Create a new data source
      const newSource = DataSource.create({
        user_id: mockUserId,
        type: sourceType,
        status: 'setup',
        connection_details: {}
      })
      
      // Simulate API connection delay
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Connect to the data source
      const connectedSource = await DataSource.connect(newSource, {
        oauth_token: 'mock-token',
        account_id: `${sourceType.substring(0, 2).toUpperCase()}${Math.floor(Math.random() * 100000)}`
      })
      
      // Sync data from the data source
      const syncedSource = await DataSource.sync(connectedSource)
      
      // Add the new data source to the state
      setDataSources(prev => [...prev, syncedSource])
      
      // Generate mock data points for the new data source
      const sourceDataPoints = DataPoint.generateMockDataPoints(syncedSource.id, syncedSource.type, 50)
      setDataPoints(prev => [...prev, ...sourceDataPoints])
      
      setIsLoading(false)
      return syncedSource
    } catch (err) {
      setError(err.message || 'Failed to connect to data source')
      setIsLoading(false)
      throw err
    }
  }

  // Create a new dashboard
  const createDashboard = (name, description = '') => {
    setIsLoading(true)
    setError(null)
    
    try {
      const newDashboard = Dashboard.create({
        user_id: mockUserId,
        name,
        description
      })
      
      setDashboards(prev => [...prev, newDashboard])
      setIsLoading(false)
      return newDashboard
    } catch (err) {
      setError(err.message || 'Failed to create dashboard')
      setIsLoading(false)
      throw err
    }
  }

  // Update a dashboard
  const updateDashboard = (dashboardId, updates) => {
    setIsLoading(true)
    setError(null)
    
    try {
      const dashboard = dashboards.find(d => d.id === dashboardId)
      if (!dashboard) {
        throw new Error(`Dashboard with ID ${dashboardId} not found`)
      }
      
      const updatedDashboard = Dashboard.update(dashboard, updates)
      
      setDashboards(prev => prev.map(d => d.id === dashboardId ? updatedDashboard : d))
      
      if (currentDashboard?.id === dashboardId) {
        setCurrentDashboard(updatedDashboard)
      }
      
      setIsLoading(false)
      return updatedDashboard
    } catch (err) {
      setError(err.message || 'Failed to update dashboard')
      setIsLoading(false)
      throw err
    }
  }

  // Delete a dashboard
  const deleteDashboard = (dashboardId) => {
    setIsLoading(true)
    setError(null)
    
    try {
      setDashboards(prev => prev.filter(d => d.id !== dashboardId))
      
      if (currentDashboard?.id === dashboardId) {
        setCurrentDashboard(dashboards.find(d => d.id !== dashboardId) || null)
      }
      
      setIsLoading(false)
      return true
    } catch (err) {
      setError(err.message || 'Failed to delete dashboard')
      setIsLoading(false)
      throw err
    }
  }

  // Add a widget to a dashboard
  const addWidget = (dashboardId, widgetData) => {
    setIsLoading(true)
    setError(null)
    
    try {
      const dashboard = dashboards.find(d => d.id === dashboardId)
      if (!dashboard) {
        throw new Error(`Dashboard with ID ${dashboardId} not found`)
      }
      
      const widget = Widget.create({
        dashboard_id: dashboardId,
        ...widgetData
      })
      
      // Generate mock data for the widget
      const widgetWithData = Widget.generateMockData(widget, dataPoints)
      
      const updatedDashboard = Dashboard.addWidget(dashboard, widgetWithData)
      
      setDashboards(prev => prev.map(d => d.id === dashboardId ? updatedDashboard : d))
      
      if (currentDashboard?.id === dashboardId) {
        setCurrentDashboard(updatedDashboard)
      }
      
      setIsLoading(false)
      return widgetWithData
    } catch (err) {
      setError(err.message || 'Failed to add widget')
      setIsLoading(false)
      throw err
    }
  }

  // Update a widget
  const updateWidget = (dashboardId, widgetId, updates) => {
    setIsLoading(true)
    setError(null)
    
    try {
      const dashboard = dashboards.find(d => d.id === dashboardId)
      if (!dashboard) {
        throw new Error(`Dashboard with ID ${dashboardId} not found`)
      }
      
      const widget = dashboard.widgets.find(w => w.id === widgetId)
      if (!widget) {
        throw new Error(`Widget with ID ${widgetId} not found`)
      }
      
      const updatedWidget = Widget.update(widget, updates)
      
      // Generate mock data for the updated widget
      const widgetWithData = Widget.generateMockData(updatedWidget, dataPoints)
      
      const updatedDashboard = Dashboard.updateWidget(dashboard, widgetId, widgetWithData)
      
      setDashboards(prev => prev.map(d => d.id === dashboardId ? updatedDashboard : d))
      
      if (currentDashboard?.id === dashboardId) {
        setCurrentDashboard(updatedDashboard)
      }
      
      setIsLoading(false)
      return widgetWithData
    } catch (err) {
      setError(err.message || 'Failed to update widget')
      setIsLoading(false)
      throw err
    }
  }

  // Remove a widget from a dashboard
  const removeWidget = (dashboardId, widgetId) => {
    setIsLoading(true)
    setError(null)
    
    try {
      const dashboard = dashboards.find(d => d.id === dashboardId)
      if (!dashboard) {
        throw new Error(`Dashboard with ID ${dashboardId} not found`)
      }
      
      const updatedDashboard = Dashboard.removeWidget(dashboard, widgetId)
      
      setDashboards(prev => prev.map(d => d.id === dashboardId ? updatedDashboard : d))
      
      if (currentDashboard?.id === dashboardId) {
        setCurrentDashboard(updatedDashboard)
      }
      
      setIsLoading(false)
      return true
    } catch (err) {
      setError(err.message || 'Failed to remove widget')
      setIsLoading(false)
      throw err
    }
  }

  // Search data points
  const searchDataPoints = (query, filters = {}) => {
    setIsLoading(true)
    setError(null)
    
    try {
      // Apply search query
      let filteredDataPoints = dataPoints
      
      if (query) {
        filteredDataPoints = filteredDataPoints.filter(dataPoint => {
          const dataString = JSON.stringify(dataPoint.data_payload).toLowerCase()
          return dataString.includes(query.toLowerCase())
        })
      }
      
      // Apply filters
      filteredDataPoints = DataPoint.filter(filteredDataPoints, {
        ...filters,
        query
      })
      
      setIsLoading(false)
      return filteredDataPoints
    } catch (err) {
      setError(err.message || 'Failed to search data points')
      setIsLoading(false)
      return []
    }
  }

  // Sync a data source
  const syncDataSource = async (dataSourceId) => {
    setIsLoading(true)
    setError(null)
    
    try {
      const dataSource = dataSources.find(ds => ds.id === dataSourceId)
      if (!dataSource) {
        throw new Error(`Data source with ID ${dataSourceId} not found`)
      }
      
      // Sync the data source
      const syncedSource = await DataSource.sync(dataSource)
      
      // Update the data source in the state
      setDataSources(prev => prev.map(ds => ds.id === dataSourceId ? syncedSource : ds))
      
      // Generate new data points for the data source
      const newDataPoints = DataPoint.generateMockDataPoints(syncedSource.id, syncedSource.type, 20)
      
      // Add the new data points to the state
      setDataPoints(prev => [
        ...newDataPoints,
        ...prev.filter(dp => dp.data_source_id !== dataSourceId)
      ])
      
      setIsLoading(false)
      return syncedSource
    } catch (err) {
      setError(err.message || 'Failed to sync data source')
      setIsLoading(false)
      throw err
    }
  }

  // Disconnect a data source
  const disconnectDataSource = (dataSourceId) => {
    setIsLoading(true)
    setError(null)
    
    try {
      const dataSource = dataSources.find(ds => ds.id === dataSourceId)
      if (!dataSource) {
        throw new Error(`Data source with ID ${dataSourceId} not found`)
      }
      
      // Disconnect the data source
      const disconnectedSource = DataSource.disconnect(dataSource)
      
      // Update the data source in the state
      setDataSources(prev => prev.map(ds => ds.id === dataSourceId ? disconnectedSource : ds))
      
      setIsLoading(false)
      return disconnectedSource
    } catch (err) {
      setError(err.message || 'Failed to disconnect data source')
      setIsLoading(false)
      throw err
    }
  }

  // Clear error
  const clearError = () => {
    setError(null)
  }

  // Context value
  const value = {
    // State
    dataSources,
    dashboards,
    currentDashboard,
    dataPoints,
    searchQuery,
    selectedFilters,
    isLoading,
    error,
    
    // Data source operations
    connectDataSource,
    syncDataSource,
    disconnectDataSource,
    
    // Dashboard operations
    createDashboard,
    updateDashboard,
    deleteDashboard,
    setCurrentDashboard,
    
    // Widget operations
    addWidget,
    updateWidget,
    removeWidget,
    
    // Search operations
    setSearchQuery,
    setSelectedFilters,
    searchDataPoints,
    
    // Error handling
    clearError
  }

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  )
}

