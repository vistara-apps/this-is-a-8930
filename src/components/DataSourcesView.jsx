/**
 * DataSourcesView Component
 * 
 * This component displays the data sources and allows users to manage them.
 */

import React, { useState } from 'react'
import { useApp } from '../context/AppContext'
import LoadingIndicator from './common/LoadingIndicator'
import ErrorMessage from './common/ErrorMessage'
import { Plus, RefreshCw, Trash2, ExternalLink, Check } from 'lucide-react'

const DataSourcesView = () => {
  const { 
    dataSources, 
    connectDataSource, 
    syncDataSource, 
    disconnectDataSource, 
    isLoading, 
    error, 
    clearError 
  } = useApp()
  
  const [showAddSourceModal, setShowAddSourceModal] = useState(false)
  const [syncingSource, setSyncingSource] = useState(null)
  const [disconnectingSource, setDisconnectingSource] = useState(null)
  const [connectingSource, setConnectingSource] = useState(null)
  
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
  
  // Handle data source sync
  const handleSync = async (sourceId) => {
    setSyncingSource(sourceId)
    
    try {
      await syncDataSource(sourceId)
    } catch (error) {
      console.error('Failed to sync data source:', error)
    } finally {
      setSyncingSource(null)
    }
  }
  
  // Handle data source disconnect
  const handleDisconnect = async (sourceId) => {
    if (!window.confirm('Are you sure you want to disconnect this data source?')) {
      return
    }
    
    setDisconnectingSource(sourceId)
    
    try {
      await disconnectDataSource(sourceId)
    } catch (error) {
      console.error('Failed to disconnect data source:', error)
    } finally {
      setDisconnectingSource(null)
    }
  }
  
  // Handle data source connection
  const handleConnect = async (sourceType) => {
    setConnectingSource(sourceType)
    
    try {
      await connectDataSource(sourceType)
      setShowAddSourceModal(false)
    } catch (error) {
      console.error('Failed to connect data source:', error)
    } finally {
      setConnectingSource(null)
    }
  }
  
  // Available data sources for adding
  const availableSources = [
    { id: 'google-analytics', name: 'Google Analytics', type: 'Google Analytics', icon: '📊', description: 'Connect to Google Analytics to track website traffic and user behavior.' },
    { id: 'stripe', name: 'Stripe', type: 'Stripe', icon: '💳', description: 'Connect to Stripe to track payments, subscriptions, and revenue.' },
    { id: 'hubspot', name: 'HubSpot', type: 'HubSpot', icon: '🏢', description: 'Connect to HubSpot to track contacts, deals, and marketing campaigns.' },
    { id: 'salesforce', name: 'Salesforce', type: 'Salesforce', icon: '⚡', description: 'Connect to Salesforce to track sales, leads, and opportunities.' },
    { id: 'mailchimp', name: 'Mailchimp', type: 'Mailchimp', icon: '📧', description: 'Connect to Mailchimp to track email campaigns and subscribers.' },
    { id: 'facebook-ads', name: 'Facebook Ads', type: 'Facebook Ads', icon: '📘', description: 'Connect to Facebook Ads to track ad performance and conversions.' }
  ]
  
  // Show loading indicator while loading
  if (isLoading && dataSources.length === 0) {
    return (
      <div className="flex items-center justify-center h-96">
        <LoadingIndicator size="lg" message="Loading data sources..." />
      </div>
    )
  }
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-dark-text">Data Sources</h1>
          <p className="text-dark-muted mt-1">Connect and manage your data sources</p>
        </div>
        <button
          onClick={() => setShowAddSourceModal(true)}
          className="flex items-center px-4 py-2 bg-accent hover:bg-accent/90 text-white rounded-lg transition-colors duration-200"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Source
        </button>
      </div>
      
      {/* Error message */}
      {error && (
        <ErrorMessage
          message={error}
          onRetry={clearError}
        />
      )}
      
      {/* Connected data sources */}
      <div className="space-y-4">
        {dataSources.length === 0 ? (
          <div className="bg-dark-surface border border-dark-border rounded-lg p-8 text-center">
            <div className="text-5xl mb-4">📊</div>
            <h2 className="text-xl font-semibold text-dark-text mb-2">No Data Sources Connected</h2>
            <p className="text-dark-muted mb-6 max-w-md mx-auto">
              Connect your first data source to start aggregating and visualizing your data in one place.
            </p>
            <button
              onClick={() => setShowAddSourceModal(true)}
              className="inline-flex items-center px-4 py-2 bg-accent hover:bg-accent/90 text-white rounded-lg transition-colors duration-200"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Your First Data Source
            </button>
          </div>
        ) : (
          dataSources.map(source => (
            <div
              key={source.id}
              className="bg-dark-surface border border-dark-border rounded-lg p-6"
            >
              <div className="flex items-start justify-between">
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
                    className="p-2 text-dark-muted hover:text-dark-text hover:bg-dark-border/50 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {syncingSource === source.id ? (
                      <LoadingIndicator size="sm" />
                    ) : (
                      <RefreshCw className="w-5 h-5" />
                    )}
                  </button>
                  <button
                    onClick={() => handleDisconnect(source.id)}
                    disabled={disconnectingSource === source.id}
                    className="p-2 text-red-500 hover:bg-dark-border/50 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {disconnectingSource === source.id ? (
                      <LoadingIndicator size="sm" />
                    ) : (
                      <Trash2 className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>
              
              {/* Source details */}
              {source.status === 'connected' && (
                <div className="border-t border-dark-border pt-4 mt-4">
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {Object.entries(source.metrics).map(([key, value]) => (
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
              
              {/* Source actions */}
              {source.status === 'setup' && (
                <div className="border-t border-dark-border pt-4 mt-4">
                  <button
                    onClick={() => handleConnect(source.type)}
                    disabled={connectingSource === source.type}
                    className="inline-flex items-center px-4 py-2 bg-accent hover:bg-accent/90 text-white rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {connectingSource === source.type ? (
                      <>
                        <LoadingIndicator size="sm" />
                        <span className="ml-2">Connecting...</span>
                      </>
                    ) : (
                      <>
                        <ExternalLink className="w-4 h-4 mr-2" />
                        <span>Complete Setup</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
      
      {/* Add data source modal */}
      {showAddSourceModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-dark-bg/80 z-50">
          <div className="bg-dark-surface border border-dark-border rounded-lg p-6 w-full max-w-3xl max-h-[80vh] overflow-auto">
            <h2 className="text-xl font-semibold text-dark-text mb-6">Add Data Source</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {availableSources.map(source => {
                const isConnected = dataSources.some(ds => ds.type === source.type && ds.status === 'connected')
                const isSetup = dataSources.some(ds => ds.type === source.type && ds.status === 'setup')
                
                return (
                  <div
                    key={source.id}
                    className={`border ${
                      isConnected ? 'border-green-500/30' : 'border-dark-border hover:border-accent/30'
                    } rounded-lg p-4 transition-colors duration-200 ${
                      isConnected ? 'cursor-default' : 'cursor-pointer'
                    }`}
                  >
                    <div className="flex items-start space-x-3 mb-3">
                      <span className="text-2xl">{source.icon}</span>
                      <div>
                        <h4 className="font-medium text-dark-text">{source.name}</h4>
                        {isConnected && (
                          <span className="inline-flex items-center text-xs text-green-500">
                            <Check className="w-3 h-3 mr-1" />
                            Connected
                          </span>
                        )}
                        {isSetup && (
                          <span className="inline-flex items-center text-xs text-yellow-500">
                            Setup Required
                          </span>
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-dark-muted mb-4">{source.description}</p>
                    {isConnected ? (
                      <button
                        onClick={() => handleSync(dataSources.find(ds => ds.type === source.type).id)}
                        className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-dark-border/50 hover:bg-dark-border text-dark-text rounded-lg transition-colors duration-200"
                      >
                        <RefreshCw className="w-4 h-4" />
                        <span>Sync Now</span>
                      </button>
                    ) : isSetup ? (
                      <button
                        onClick={() => {
                          handleConnect(source.type)
                          setShowAddSourceModal(false)
                        }}
                        disabled={connectingSource === source.type}
                        className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-500 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {connectingSource === source.type ? (
                          <>
                            <LoadingIndicator size="sm" />
                            <span>Connecting...</span>
                          </>
                        ) : (
                          <>
                            <ExternalLink className="w-4 h-4" />
                            <span>Complete Setup</span>
                          </>
                        )}
                      </button>
                    ) : (
                      <button
                        onClick={() => handleConnect(source.type)}
                        disabled={connectingSource === source.type}
                        className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-accent hover:bg-accent/90 text-white rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {connectingSource === source.type ? (
                          <>
                            <LoadingIndicator size="sm" />
                            <span>Connecting...</span>
                          </>
                        ) : (
                          <>
                            <Plus className="w-4 h-4" />
                            <span>Connect</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                )
              })}
            </div>
            <div className="flex justify-end mt-6">
              <button
                onClick={() => setShowAddSourceModal(false)}
                className="px-4 py-2 bg-dark-border/50 hover:bg-dark-border text-dark-text rounded-lg transition-colors duration-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default DataSourcesView

