/**
 * AppShell Component
 * 
 * This component provides the main layout for the application.
 */

import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import Sidebar from './Sidebar'
import MobileNavigation from './MobileNavigation'
import DashboardView from './DashboardView'
import DataSourcesView from './DataSourcesView'
import ExploreDataView from './ExploreDataView'
import SettingsView from './SettingsView'
import LoadingIndicator from './common/LoadingIndicator'
import ErrorBoundary from './common/ErrorBoundary'

const AppShell = () => {
  const { isLoading, error } = useAuth()
  const [currentView, setCurrentView] = useState('dashboard')
  
  // Show loading indicator while loading
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-dark-bg">
        <LoadingIndicator size="lg" message="Loading application..." />
      </div>
    )
  }
  
  // Show error message if there's an error
  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-dark-bg p-6">
        <div className="bg-red-500/10 border border-red-500/30 text-red-500 px-6 py-4 rounded-lg max-w-md">
          <h2 className="text-lg font-semibold mb-2">Error</h2>
          <p>{error}</p>
        </div>
      </div>
    )
  }
  
  // Render the current view
  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return (
          <ErrorBoundary>
            <DashboardView />
          </ErrorBoundary>
        )
      case 'sources':
        return (
          <ErrorBoundary>
            <DataSourcesView />
          </ErrorBoundary>
        )
      case 'explore':
        return (
          <ErrorBoundary>
            <ExploreDataView />
          </ErrorBoundary>
        )
      case 'settings':
        return (
          <ErrorBoundary>
            <SettingsView />
          </ErrorBoundary>
        )
      default:
        return (
          <ErrorBoundary>
            <DashboardView />
          </ErrorBoundary>
        )
    }
  }
  
  return (
    <div className="flex h-screen bg-dark-bg text-dark-text">
      {/* Sidebar (desktop) */}
      <Sidebar currentView={currentView} onViewChange={setCurrentView} />
      
      {/* Mobile navigation */}
      <MobileNavigation currentView={currentView} onViewChange={setCurrentView} />
      
      {/* Main content */}
      <main className="flex-1 overflow-auto p-6 md:p-8 pt-6 md:pt-8">
        <div className="max-w-6xl mx-auto">
          {renderView()}
        </div>
      </main>
    </div>
  )
}

export default AppShell
