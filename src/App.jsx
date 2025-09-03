import React, { useState } from 'react'
import AppShell from './components/AppShell'
import DashboardGrid from './components/DashboardGrid'
import DataSourcesView from './components/DataSourcesView'
import ExploreDataView from './components/ExploreDataView'
import { AppProvider } from './context/AppContext'

function App() {
  const [currentView, setCurrentView] = useState('dashboard')

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <DashboardGrid />
      case 'sources':
        return <DataSourcesView />
      case 'explore':
        return <ExploreDataView />
      default:
        return <DashboardGrid />
    }
  }

  return (
    <AppProvider>
      <div className="min-h-screen gradient-bg">
        <AppShell currentView={currentView} onViewChange={setCurrentView}>
          {renderView()}
        </AppShell>
      </div>
    </AppProvider>
  )
}

export default App