import React, { useState } from 'react'
import { useApp } from '../context/AppContext'
import DataSourceConnector from './DataSourceConnector'
import { Plus, CheckCircle, Clock, AlertCircle, RefreshCw } from 'lucide-react'

const DataSourcesView = () => {
  const { dataSources, connectDataSource } = useApp()
  const [showConnector, setShowConnector] = useState(false)

  const availableSources = [
    { name: 'Google Analytics', description: 'Website traffic and user behavior', icon: '📊' },
    { name: 'Stripe', description: 'Payment and subscription data', icon: '💳' },
    { name: 'HubSpot', description: 'CRM and customer data', icon: '🏢' },
    { name: 'Salesforce', description: 'Sales and lead management', icon: '⚡' },
    { name: 'Mailchimp', description: 'Email marketing metrics', icon: '📧' },
    { name: 'Facebook Ads', description: 'Social media advertising data', icon: '📘' }
  ]

  const getStatusIcon = (status) => {
    switch (status) {
      case 'connected':
        return <CheckCircle className="w-5 h-5 text-green-400" />
      case 'setup':
        return <Clock className="w-5 h-5 text-yellow-400" />
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-400" />
      default:
        return <Clock className="w-5 h-5 text-gray-400" />
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case 'connected':
        return 'Connected'
      case 'setup':
        return 'Setup Required'
      case 'error':
        return 'Connection Error'
      default:
        return 'Not Connected'
    }
  }

  const formatLastSync = (timestamp) => {
    if (!timestamp) return 'Never'
    const date = new Date(timestamp)
    const now = new Date()
    const diffMs = now - date
    const diffMins = Math.floor(diffMs / 60000)
    
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`
    return `${Math.floor(diffMins / 1440)}d ago`
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-dark-text">Data Sources</h1>
          <p className="text-dark-muted mt-1">Connect and manage your data integrations</p>
        </div>
        <button
          onClick={() => setShowConnector(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-accent hover:bg-accent/90 text-white rounded-lg transition-colors duration-200 font-medium"
        >
          <Plus className="w-4 h-4" />
          <span>Add Source</span>
        </button>
      </div>

      {/* Connected Sources */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {dataSources.map((source) => (
          <div key={source.id} className="bg-dark-surface border border-dark-border rounded-lg p-6 widget-gradient">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{source.icon}</span>
                <div>
                  <h3 className="text-lg font-semibold text-dark-text">{source.type}</h3>
                  <div className="flex items-center space-x-2 text-sm">
                    {getStatusIcon(source.status)}
                    <span className="text-dark-muted">{getStatusText(source.status)}</span>
                  </div>
                </div>
              </div>
              <button className="p-2 hover:bg-dark-border rounded-lg transition-colors duration-200">
                <RefreshCw className="w-4 h-4 text-dark-muted" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-dark-muted">Last Sync</span>
                <span className="text-dark-text">{formatLastSync(source.lastSync)}</span>
              </div>

              {/* Metrics Preview */}
              {Object.keys(source.metrics).length > 0 && (
                <div className="border-t border-dark-border pt-3">
                  <div className="grid grid-cols-2 gap-4">
                    {Object.entries(source.metrics).slice(0, 4).map(([key, value]) => (
                      <div key={key} className="text-center">
                        <div className="text-lg font-semibold text-dark-text">
                          {typeof value === 'number' ? 
                            (key.includes('Rate') ? `${(value * 100).toFixed(1)}%` : value.toLocaleString()) 
                            : value
                          }
                        </div>
                        <div className="text-xs text-dark-muted capitalize">
                          {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Available Sources */}
      {showConnector && (
        <DataSourceConnector
          availableSources={availableSources.filter(
            source => !dataSources.some(connected => connected.type === source.name)
          )}
          onConnect={connectDataSource}
          onClose={() => setShowConnector(false)}
        />
      )}
    </div>
  )
}

export default DataSourcesView