/**
 * App Component
 * 
 * This is the main component of the application.
 */

import React, { useState } from 'react'
import { AuthProvider, useAuth } from './context/AuthContext'
import { AppProvider } from './context/AppContext'
import AppShell from './components/AppShell'
import Login from './components/auth/Login'
import Signup from './components/auth/Signup'
import PasswordReset from './components/auth/PasswordReset'
import ErrorBoundary from './components/common/ErrorBoundary'

// Authentication wrapper component
const AuthWrapper = () => {
  const { isAuthenticated, isLoading } = useAuth()
  const [authView, setAuthView] = useState('login')
  
  // Show loading screen while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-dark-bg">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
      </div>
    )
  }
  
  // If authenticated, show the app shell
  if (isAuthenticated) {
    return (
      <ErrorBoundary>
        <AppShell />
      </ErrorBoundary>
    )
  }
  
  // If not authenticated, show the auth views
  return (
    <div className="flex items-center justify-center min-h-screen bg-dark-bg p-6">
      <div className="w-full max-w-md">
        {authView === 'login' && (
          <Login
            onSuccess={() => {}}
            onSignUp={() => setAuthView('signup')}
            onForgotPassword={() => setAuthView('reset')}
          />
        )}
        
        {authView === 'signup' && (
          <Signup
            onSuccess={() => {}}
            onSignIn={() => setAuthView('login')}
          />
        )}
        
        {authView === 'reset' && (
          <PasswordReset
            onSuccess={() => setAuthView('login')}
            onCancel={() => setAuthView('login')}
          />
        )}
      </div>
    </div>
  )
}

// Main App component
const App = () => {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <AppProvider>
          <AuthWrapper />
        </AppProvider>
      </AuthProvider>
    </ErrorBoundary>
  )
}

export default App

