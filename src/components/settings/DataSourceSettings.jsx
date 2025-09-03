/**
 * DataSourceSettings Component
 * 
 * This component provides a form for users to manage their data source settings.
 */

import React, { useState } from 'react'
import { useApp } from '../../context/AppContext'
import LoadingIndicator from '../common/LoadingIndicator'
import { RefreshCw, Trash2, Plus, ExternalLink, Check } from 'lucide-react'

const DataSourceSettings = () => {
  const { dataSources, syncDataSource, disconnectDataSource, isLoading, error, clearError } = useApp()
  
  const [syncingSource, setSyncingSource] = useState(null)
  const [disconnectingSource, setDisconnectingSource] = useState(null)
  const [showAddSource, setShowAddSource] = useState(false)
  const [formError, setFormError] = useState(null)
  
  // Format last sync time
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
  
  // Get status badge class
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'connected':
        return 'bg-green-500/20 text-green-500'
      case 'setup':
        return 'bg-yellow-500/20 text-yellow-500'
      case 'error':
        return 'bg-red-500/20 text-red-500'
      default:
        return 'bg-dark-border/50 text-dark-muted'
    }
  }
  
  // Sync a data source
  const handleSync = async (sourceId) => {
    setSyncingSource(sourceId)
    setFormError(null)
    clearError()
    
    try {
      await syncDataSource(sourceId)
    } catch (error) {
      setFormError(error.message || 'Failed to sync data source')
    } finally {
      setSyncingSource(null)
    }
  }
  
  // Disconnect a data source
  const handleDisconnect = async (sourceId) => {
    setDisconnectingSource(sourceId)
    setFormError(null)
    clearError()
    
    try {
      await disconnectDataSource(sourceId)
    } catch (error) {
      setFormError(error.message || 'Failed to disconnect data source')
    } finally {
      setDisconnectingSource(null)
    }
  }
  
  // Available data sources for adding
  const availableSources = [
    { id: 'google-analytics', name: 'Google Analytics', icon: '📊', description: 'Connect to Google Analytics to track website traffic and user behavior.' },
    { id: 'stripe', name: 'Stripe', icon: '💳', description: 'Connect to Stripe to track payments, subscriptions, and revenue.' },
    { id: 'hubspot', name: 'HubSpot', icon: '🏢', description: 'Connect to HubSpot to track contacts, deals, and marketing campaigns.' },
    { id: 'salesforce', name: 'Salesforce', icon: '⚡', description: 'Connect to Salesforce to track sales, leads, and opportunities.' },
    { id: 'mailchimp', name: 'Mailchimp', icon: '📧', description: 'Connect to Mailchimp to track email campaigns and subscribers.' },
    { id: 'facebook-ads', name: 'Facebook Ads', icon: '📘', description: 'Connect to Facebook Ads to track ad performance and conversions.' }
  ]
  
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-dark-text">Data Source Settings</h2>
        <button
          onClick={() => setShowAddSource(!showAddSource)}
          className="flex items-center space-x-2 px-4 py-2 bg-accent hover:bg-accent/90 text-white rounded-lg transition-colors duration-200"
        >
          <Plus className="w-4 h-4" />
          <span>Add Source</span>
        </button>
      </div>
      
      {/* Error message */}
      {(error || formError) && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-500 px-4 py-3 rounded-lg mb-6">
          {formError || error}
        </div>
      )}
      
      {/* Add data source panel */}
      {showAddSource && (
        <div className="bg-dark-surface border border-dark-border rounded-lg p-6 mb-6">
          <h3 className="text-lg font-medium text-dark-text mb-4">Add Data Source</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {availableSources.map(source => (
              <div
                key={source.id}
                className="border border-dark-border rounded-lg p-4 hover:border-accent/30 transition-colors duration-200"
              >
                <div className="flex items-start space-x-3 mb-3">
                  <span className="text-2xl">{source.icon}</span>
                  <div>
                    <h4 className="font-medium text-dark-text">{source.name}</h4>
                  </div>
                </div>
                <p className="text-sm text-dark-muted mb-4">{source.description}</p>
                <button
                  className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-dark-border/50 hover:bg-dark-border text-dark-text rounded-lg transition-colors duration-200"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Connect</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Connected data sources */}
      <div className="space-y-4">
        {dataSources.length === 0 ? (
          <div className="bg-dark-surface border border-dark-border rounded-lg p-6 text-center">
            <p className="text-dark-muted">No data sources connected yet.</p>
            <button
              onClick={() => setShowAddSource(true)}
              className="mt-4 inline-flex items-center space-x-2 px-4 py-2 bg-accent hover:bg-accent/90 text-white rounded-lg transition-colors duration-200"
            >
              <Plus className="w-4 h-4" />
              <span>Add your first data source</span>
            </button>
          </div>
        ) : (
          dataSources.map(source => (
            <div
              key={source.id}
              className="bg-dark-surface border border-dark-border rounded-lg p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{source.icon}</span>
                  <div>
                    <h3 className="text-lg font-medium text-dark-text">{source.type}</h3>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(source.status)}`}>
                        {source.status === 'connected' ? 'Connected' : source.status === 'setup' ? 'Setup Required' : 'Error'}
                      </span>
                      <span className="text-sm text-dark-muted">
                        Last sync: {formatLastSync(source.last_synced_at)}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleSync(source.id)}
                    disabled={syncingSource === source.id || source.status !== 'connected'}
                    className="p-2 hover:bg-dark-border rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {syncingSource === source.id ? (
                      <LoadingIndicator size="sm" />
                    ) : (
                      <RefreshCw className="w-5 h-5 text-dark-muted" />
                    )}
                  </button>
                  <button
                    onClick={() => handleDisconnect(source.id)}
                    disabled={disconnectingSource === source.id}
                    className="p-2 hover:bg-dark-border rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {disconnectingSource === source.id ? (
                      <LoadingIndicator size="sm" />
                    ) : (
                      <Trash2 className="w-5 h-5 text-red-500" />
                    )}
                  </button>
                </div>
              </div>
              
              {/* Source details */}
              {source.status === 'connected' && Object.keys(source.metrics).length > 0 && (
                <div className="border-t border-dark-border pt-4 mt-4">
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
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
              
              {/* Source settings */}
              <div className="border-t border-dark-border pt-4 mt-4">
                <button
                  className="text-sm text-accent hover:text-accent/80 transition-colors duration-200"
                >
                  Configure settings
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default DataSourceSettings

