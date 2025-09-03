import React from 'react'
import Sidebar from './Sidebar'

const AppShell = ({ children, currentView, onViewChange }) => {
  return (
    <div className="flex min-h-screen">
      <Sidebar currentView={currentView} onViewChange={onViewChange} />
      <main className="flex-1 overflow-auto">
        <div className="max-w-6xl mx-auto px-6 py-8">
          {children}
        </div>
      </main>
    </div>
  )
}

export default AppShell