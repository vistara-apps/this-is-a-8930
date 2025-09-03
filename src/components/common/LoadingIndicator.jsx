/**
 * LoadingIndicator Component
 * 
 * This component displays a loading indicator with an optional message.
 */

import React from 'react'

const LoadingIndicator = ({
  size = 'md',
  message = null,
  fullScreen = false,
  overlay = false,
  className = ''
}) => {
  // Determine spinner size
  const spinnerSizes = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16'
  }
  
  const spinnerSize = spinnerSizes[size] || spinnerSizes.md
  
  // Determine text size
  const textSizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
    xl: 'text-lg'
  }
  
  const textSize = textSizes[size] || textSizes.md
  
  // Create the spinner component
  const spinner = (
    <svg className={`animate-spin ${spinnerSize} text-accent`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
  )
  
  // If fullScreen, display the spinner in the center of the screen
  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center z-50 bg-dark-bg/80">
        <div className="flex flex-col items-center">
          {spinner}
          {message && <p className={`mt-4 text-dark-text font-medium ${textSize}`}>{message}</p>}
        </div>
      </div>
    )
  }
  
  // If overlay, display the spinner as an overlay on the parent element
  if (overlay) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-dark-bg/50 rounded-lg z-10">
        <div className="flex flex-col items-center">
          {spinner}
          {message && <p className={`mt-4 text-dark-text font-medium ${textSize}`}>{message}</p>}
        </div>
      </div>
    )
  }
  
  // Default display
  return (
    <div className={`flex flex-col items-center ${className}`}>
      {spinner}
      {message && <p className={`mt-4 text-dark-text font-medium ${textSize}`}>{message}</p>}
    </div>
  )
}

// Skeleton loading component for content
export const SkeletonLoader = ({ lines = 3, className = '' }) => {
  return (
    <div className={`animate-pulse space-y-4 ${className}`}>
      {Array.from({ length: lines }).map((_, index) => (
        <div
          key={index}
          className={`h-4 bg-dark-border rounded ${index === 0 ? 'w-3/4' : index === lines - 1 ? 'w-1/2' : 'w-full'}`}
        />
      ))}
    </div>
  )
}

// Card skeleton loader
export const CardSkeletonLoader = ({ className = '' }) => {
  return (
    <div className={`animate-pulse bg-dark-surface border border-dark-border rounded-lg p-6 ${className}`}>
      <div className="h-4 bg-dark-border rounded w-1/4 mb-4" />
      <div className="h-8 bg-dark-border rounded w-1/2 mb-6" />
      <div className="space-y-3">
        <div className="h-4 bg-dark-border rounded w-full" />
        <div className="h-4 bg-dark-border rounded w-5/6" />
        <div className="h-4 bg-dark-border rounded w-3/4" />
      </div>
    </div>
  )
}

// Widget skeleton loader
export const WidgetSkeletonLoader = ({ className = '' }) => {
  return (
    <div className={`animate-pulse bg-dark-surface border border-dark-border rounded-lg p-6 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="h-4 bg-dark-border rounded w-1/3" />
        <div className="h-4 w-4 bg-dark-border rounded-full" />
      </div>
      <div className="h-8 bg-dark-border rounded w-1/4 mb-2" />
      <div className="h-4 bg-dark-border rounded w-1/5" />
    </div>
  )
}

export default LoadingIndicator

