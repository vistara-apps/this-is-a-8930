import React, { useState } from 'react'
import { X, ExternalLink, Check } from 'lucide-react'

const DataSourceConnector = ({ availableSources, onConnect, onClose }) => {
  const [connecting, setConnecting] = useState(null)
  const [connected, setConnected] = useState(new Set())

  const handleConnect = async (sourceName) => {
    setConnecting(sourceName)
    
    // Simulate API connection delay
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    onConnect(sourceName)
    setConnected(prev => new Set([...prev, sourceName]))
    setConnecting(null)
    
    // Auto close after successful connection
    setTimeout(() => {
      onClose()
    }, 1000)
  }

  const getButtonState = (sourceName) => {
    if (connecting === sourceName) return 'connecting'
    if (connected.has(sourceName)) return 'connected'
    return 'default'
  }

  const getButtonText = (sourceName) => {
    const state = getButtonState(sourceName)
    switch (state) {
      case 'connecting':
        return 'Connecting...'
      case 'connected':
        return 'Connected'
      default:
        return 'Connect'
    }
  }

  const getButtonStyles = (sourceName) => {
    const state = getButtonState(sourceName)
    switch (state) {
      case 'connecting':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-400/30 cursor-not-allowed'
      case 'connected':
        return 'bg-green-500/20 text-green-400 border-green-400/30'
      default:
        return 'bg-accent hover:bg-accent/90 text-white border-accent'
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-dark-surface border border-dark-border rounded-xl max-w-2xl w-full max-h-[80vh] overflow-auto">
        <div className="flex items-center justify-between p-6 border-b border-dark-border">
          <h2 className="text-xl font-semibold text-dark-text">Connect Data Source</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-dark-border rounded-lg transition-colors duration-200"
          >
            <X className="w-5 h-5 text-dark-muted" />
          </button>
        </div>

        <div className="p-6">
          <p className="text-dark-muted mb-6">
            Choose from our supported integrations to start collecting your data.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {availableSources.map((source) => (
              <div key={source.name} className="border border-dark-border rounded-lg p-4 hover:border-accent/30 transition-colors duration-200">
                <div className="flex items-start space-x-3 mb-4">
                  <span className="text-2xl">{source.icon}</span>
                  <div className="flex-1">
                    <h3 className="font-semibold text-dark-text">{source.name}</h3>
                    <p className="text-sm text-dark-muted mt-1">{source.description}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <button
                    onClick={() => handleConnect(source.name)}
                    disabled={connecting === source.name}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-all duration-200 font-medium ${getButtonStyles(source.name)}`}
                  >
                    {connected.has(source.name) ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <ExternalLink className="w-4 h-4" />
                    )}
                    <span>{getButtonText(source.name)}</span>
                  </button>

                  {connecting === source.name && (
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-accent rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-accent rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-accent rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default DataSourceConnector