import React, { createContext, useContext, useState, useEffect } from 'react'

const AppContext = createContext()

export const useApp = () => {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp must be used within an AppProvider')
  }
  return context
}

// Mock data for demonstration
const mockDataSources = [
  {
    id: 1,
    type: 'Google Analytics',
    status: 'connected',
    lastSync: '2024-01-15T10:30:00Z',
    icon: '📊',
    metrics: { sessions: 15420, pageviews: 32150, bounceRate: 0.42 }
  },
  {
    id: 2,
    type: 'Stripe',
    status: 'connected',
    lastSync: '2024-01-15T09:45:00Z',
    icon: '💳',
    metrics: { revenue: 24350, customers: 1250, transactions: 3420 }
  },
  {
    id: 3,
    type: 'HubSpot',
    status: 'setup',
    lastSync: null,
    icon: '🏢',
    metrics: {}
  }
]

const mockDashboards = [
  {
    id: 1,
    name: 'Business Overview',
    widgets: [
      { id: 1, type: 'metric', title: 'Total Revenue', value: '$24,350', change: '+12.5%', changeType: 'positive' },
      { id: 2, type: 'metric', title: 'Active Users', value: '5,137', change: '+8.2%', changeType: 'positive' },
      { id: 3, type: 'metric', title: 'Conversion Rate', value: '3.2%', change: '-0.8%', changeType: 'negative' },
      { id: 4, type: 'chart', title: 'Revenue Trend', chartType: 'line' },
      { id: 5, type: 'chart', title: 'Traffic Sources', chartType: 'bar' },
      { id: 6, type: 'chart', title: 'User Distribution', chartType: 'doughnut' }
    ]
  }
]

export const AppProvider = ({ children }) => {
  const [dataSources, setDataSources] = useState(mockDataSources)
  const [dashboards, setDashboards] = useState(mockDashboards)
  const [currentDashboard, setCurrentDashboard] = useState(mockDashboards[0])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedFilters, setSelectedFilters] = useState({
    dateRange: 'last-7-days',
    source: 'all',
    category: 'all'
  })

  const connectDataSource = (sourceType) => {
    const newSource = {
      id: Date.now(),
      type: sourceType,
      status: 'connected',
      lastSync: new Date().toISOString(),
      icon: getSourceIcon(sourceType),
      metrics: generateMockMetrics(sourceType)
    }
    setDataSources(prev => [...prev, newSource])
  }

  const getSourceIcon = (type) => {
    const icons = {
      'Google Analytics': '📊',
      'Stripe': '💳',
      'HubSpot': '🏢',
      'Salesforce': '⚡',
      'Mailchimp': '📧',
      'Facebook Ads': '📘'
    }
    return icons[type] || '📁'
  }

  const generateMockMetrics = (type) => {
    switch (type) {
      case 'Google Analytics':
        return { sessions: Math.floor(Math.random() * 20000), pageviews: Math.floor(Math.random() * 50000), bounceRate: Math.random() }
      case 'Stripe':
        return { revenue: Math.floor(Math.random() * 50000), customers: Math.floor(Math.random() * 2000), transactions: Math.floor(Math.random() * 5000) }
      default:
        return {}
    }
  }

  const createDashboard = (name, widgets = []) => {
    const newDashboard = {
      id: Date.now(),
      name,
      widgets
    }
    setDashboards(prev => [...prev, newDashboard])
    return newDashboard
  }

  const updateDashboard = (dashboardId, updates) => {
    setDashboards(prev => prev.map(dashboard => 
      dashboard.id === dashboardId ? { ...dashboard, ...updates } : dashboard
    ))
    if (currentDashboard?.id === dashboardId) {
      setCurrentDashboard(prev => ({ ...prev, ...updates }))
    }
  }

  const addWidget = (dashboardId, widget) => {
    const newWidget = {
      ...widget,
      id: Date.now()
    }
    updateDashboard(dashboardId, {
      widgets: [...(dashboards.find(d => d.id === dashboardId)?.widgets || []), newWidget]
    })
  }

  const value = {
    dataSources,
    dashboards,
    currentDashboard,
    searchQuery,
    selectedFilters,
    connectDataSource,
    createDashboard,
    updateDashboard,
    addWidget,
    setCurrentDashboard,
    setSearchQuery,
    setSelectedFilters
  }

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  )
}