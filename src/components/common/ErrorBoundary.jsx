/**
 * ErrorBoundary Component
 * 
 * This component catches JavaScript errors anywhere in its child component tree,
 * logs those errors, and displays a fallback UI instead of the component tree that crashed.
 */

import React, { Component } from 'react'
import ErrorMessage from './ErrorMessage'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    console.error('Error caught by ErrorBoundary:', error, errorInfo)
    this.setState({ errorInfo })
    
    // If onError prop is provided, call it with the error
    if (this.props.onError) {
      this.props.onError(error, errorInfo)
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null })
    
    // If onReset prop is provided, call it
    if (this.props.onReset) {
      this.props.onReset()
    }
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return this.props.fallback ? (
        this.props.fallback(this.state.error, this.handleReset)
      ) : (
        <ErrorMessage
          title={this.props.title || 'Something went wrong'}
          message={this.props.showDetails ? this.state.error?.message : this.props.message || 'An unexpected error occurred'}
          details={this.props.showDetails ? this.state.errorInfo?.componentStack : null}
          onRetry={this.handleReset}
          retryLabel={this.props.retryLabel || 'Try again'}
        />
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary

