/**
 * ErrorMessage Component
 * 
 * This component displays an error message with optional details and a retry button.
 */

import React, { useState } from 'react'

const ErrorMessage = ({
  title = 'Error',
  message = 'An unexpected error occurred',
  details = null,
  onRetry = null,
  retryLabel = 'Try again',
  className = ''
}) => {
  const [showDetails, setShowDetails] = useState(false)

  return (
    <div className={`bg-red-500/10 border border-red-500/30 rounded-lg p-6 ${className}`}>
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <div className="ml-3 flex-1">
          <h3 className="text-lg font-medium text-red-500">{title}</h3>
          <div className="mt-2 text-sm text-dark-text">
            <p>{message}</p>
          </div>
          
          {details && (
            <div className="mt-4">
              <button
                type="button"
                onClick={() => setShowDetails(!showDetails)}
                className="text-sm text-dark-muted hover:text-dark-text transition-colors duration-200 flex items-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-4 w-4 mr-1 transition-transform duration-200 ${showDetails ? 'rotate-90' : ''}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                {showDetails ? 'Hide details' : 'Show details'}
              </button>
              
              {showDetails && (
                <div className="mt-2 p-3 bg-dark-surface border border-dark-border rounded-lg overflow-auto max-h-64">
                  <pre className="text-xs text-dark-muted whitespace-pre-wrap">{details}</pre>
                </div>
              )}
            </div>
          )}
          
          {onRetry && (
            <div className="mt-4">
              <button
                type="button"
                onClick={onRetry}
                className="inline-flex items-center px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-500 rounded-lg transition-colors duration-200 text-sm font-medium"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                {retryLabel}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ErrorMessage

