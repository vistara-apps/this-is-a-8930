/**
 * DashboardView Component
 * 
 * This component displays the dashboard with widgets.
 */

import React, { useState } from 'react'
import { useApp } from '../context/AppContext'
import LoadingIndicator from './common/LoadingIndicator'
import ErrorMessage from './common/ErrorMessage'
import MetricWidget from './widgets/MetricWidget'
import ChartWidget from './widgets/ChartWidget'
import TableWidget from './widgets/TableWidget'
import { Plus, MoreHorizontal, Edit, Trash2 } from 'lucide-react'

const DashboardView = () => {
  const { 
    dashboards, 
    currentDashboard, 
    setCurrentDashboard, 
    createDashboard, 
    updateDashboard, 
    deleteDashboard, 
    removeWidget, 
    isLoading, 
    error, 
    clearError 
  } = useApp()
  
  const [isCreatingDashboard, setIsCreatingDashboard] = useState(false)
  const [newDashboardName, setNewDashboardName] = useState('')
  const [showDashboardMenu, setShowDashboardMenu] = useState(false)
  const [isEditingDashboard, setIsEditingDashboard] = useState(false)
  const [editDashboardName, setEditDashboardName] = useState('')
  const [showAddWidgetModal, setShowAddWidgetModal] = useState(false)
  
  // Handle dashboard selection
  const handleDashboardSelect = (dashboard) => {
    setCurrentDashboard(dashboard)
    setShowDashboardMenu(false)
  }
  
  // Handle dashboard creation
  const handleCreateDashboard = async (e) => {
    e.preventDefault()
    
    if (!newDashboardName.trim()) return
    
    try {
      const dashboard = await createDashboard(newDashboardName)
      setCurrentDashboard(dashboard)
      setNewDashboardName('')
      setIsCreatingDashboard(false)
    } catch (error) {
      console.error('Failed to create dashboard:', error)
    }
  }
  
  // Handle dashboard edit
  const handleEditDashboard = async (e) => {
    e.preventDefault()
    
    if (!editDashboardName.trim() || !currentDashboard) return
    
    try {
      await updateDashboard(currentDashboard.id, { name: editDashboardName })
      setIsEditingDashboard(false)
    } catch (error) {
      console.error('Failed to update dashboard:', error)
    }
  }
  
  // Handle dashboard deletion
  const handleDeleteDashboard = async () => {
    if (!currentDashboard) return
    
    if (dashboards.length <= 1) {
      alert('You cannot delete the last dashboard.')
      return
    }
    
    if (!window.confirm(`Are you sure you want to delete the dashboard "${currentDashboard.name}"?`)) {
      return
    }
    
    try {
      await deleteDashboard(currentDashboard.id)
    } catch (error) {
      console.error('Failed to delete dashboard:', error)
    }
  }
  
  // Render a widget based on its type
  const renderWidget = (widget) => {
    switch (widget.type) {
      case 'metric':
        return <MetricWidget widget={widget} onEdit={() => {}} onDelete={() => handleDeleteWidget(widget.id)} />
      case 'chart':
        return <ChartWidget widget={widget} onEdit={() => {}} onDelete={() => handleDeleteWidget(widget.id)} />
      case 'table':
        return <TableWidget widget={widget} onEdit={() => {}} onDelete={() => handleDeleteWidget(widget.id)} />
      default:
        return <div>Unknown widget type: {widget.type}</div>
    }
  }
  
  // Handle widget deletion
  const handleDeleteWidget = async (widgetId) => {
    if (!currentDashboard) return
    
    if (!window.confirm('Are you sure you want to delete this widget?')) {
      return
    }
    
    try {
      await removeWidget(currentDashboard.id, widgetId)
    } catch (error) {
      console.error('Failed to delete widget:', error)
    }
  }
  
  // Show loading indicator while loading
  if (isLoading && !currentDashboard) {
    return (
      <div className="flex items-center justify-center h-96">
        <LoadingIndicator size="lg" message="Loading dashboard..." />
      </div>
    )
  }
  
  // Show error message if there's an error
  if (error) {
    return (
      <ErrorMessage
        title="Dashboard Error"
        message={error}
        onRetry={clearError}
      />
    )
  }
  
  // If no dashboard is selected, show a message
  if (!currentDashboard) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-dark-text mb-4">No Dashboard Selected</h2>
          <p className="text-dark-muted mb-6">Select a dashboard or create a new one to get started.</p>
          <button
            onClick={() => setIsCreatingDashboard(true)}
            className="inline-flex items-center px-4 py-2 bg-accent hover:bg-accent/90 text-white rounded-lg transition-colors duration-200"
          >
            <Plus className="w-5 h-5 mr-2" />
            Create Dashboard
          </button>
        </div>
      </div>
    )
  }
  
  return (
    <div className="space-y-6">
      {/* Dashboard header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <button
              onClick={() => setShowDashboardMenu(!showDashboardMenu)}
              className="text-xl font-bold text-dark-text hover:text-accent transition-colors duration-200 flex items-center"
            >
              {currentDashboard.name}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`h-5 w-5 ml-2 transition-transform duration-200 ${showDashboardMenu ? 'rotate-180' : ''}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {/* Dashboard dropdown menu */}
            {showDashboardMenu && (
              <div className="absolute z-10 mt-2 w-56 bg-dark-surface border border-dark-border rounded-lg shadow-dark-modal overflow-hidden">
                <div className="py-2">
                  {dashboards.map(dashboard => (
                    <button
                      key={dashboard.id}
                      onClick={() => handleDashboardSelect(dashboard)}
                      className={`w-full text-left px-4 py-2 hover:bg-dark-border/50 transition-colors duration-200 ${
                        dashboard.id === currentDashboard.id ? 'text-accent' : 'text-dark-text'
                      }`}
                    >
                      {dashboard.name}
                    </button>
                  ))}
                </div>
                <div className="border-t border-dark-border py-2">
                  <button
                    onClick={() => {
                      setIsCreatingDashboard(true)
                      setShowDashboardMenu(false)
                    }}
                    className="w-full text-left px-4 py-2 text-dark-text hover:bg-dark-border/50 transition-colors duration-200"
                  >
                    <Plus className="w-4 h-4 inline-block mr-2" />
                    Create new dashboard
                  </button>
                </div>
              </div>
            )}
          </div>
          
          {/* Dashboard actions */}
          <div className="relative">
            <button
              onClick={() => setShowDashboardMenu(false)}
              className="p-2 text-dark-muted hover:text-dark-text hover:bg-dark-border/50 rounded-lg transition-colors duration-200"
            >
              <MoreHorizontal className="w-5 h-5" />
            </button>
            
            <div className="absolute z-10 mt-2 w-48 bg-dark-surface border border-dark-border rounded-lg shadow-dark-modal overflow-hidden">
              <div className="py-2">
                <button
                  onClick={() => {
                    setEditDashboardName(currentDashboard.name)
                    setIsEditingDashboard(true)
                  }}
                  className="w-full text-left px-4 py-2 text-dark-text hover:bg-dark-border/50 transition-colors duration-200"
                >
                  <Edit className="w-4 h-4 inline-block mr-2" />
                  Edit dashboard
                </button>
                <button
                  onClick={handleDeleteDashboard}
                  className="w-full text-left px-4 py-2 text-red-500 hover:bg-dark-border/50 transition-colors duration-200"
                >
                  <Trash2 className="w-4 h-4 inline-block mr-2" />
                  Delete dashboard
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowAddWidgetModal(true)}
            className="flex items-center px-4 py-2 bg-accent hover:bg-accent/90 text-white rounded-lg transition-colors duration-200"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Widget
          </button>
        </div>
      </div>
      
      {/* Dashboard description */}
      {currentDashboard.description && (
        <p className="text-dark-muted">{currentDashboard.description}</p>
      )}
      
      {/* Dashboard widgets */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentDashboard.widgets.map(widget => (
          <div key={widget.id} className="col-span-1">
            {renderWidget(widget)}
          </div>
        ))}
        
        {/* Add widget button */}
        <div
          onClick={() => setShowAddWidgetModal(true)}
          className="col-span-1 border-2 border-dashed border-dark-border rounded-lg p-6 flex flex-col items-center justify-center text-dark-muted hover:text-dark-text hover:border-dark-text transition-colors duration-200 cursor-pointer"
        >
          <Plus className="w-8 h-8 mb-2" />
          <span>Add Widget</span>
        </div>
      </div>
      
      {/* Create dashboard modal */}
      {isCreatingDashboard && (
        <div className="fixed inset-0 flex items-center justify-center bg-dark-bg/80 z-50">
          <div className="bg-dark-surface border border-dark-border rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold text-dark-text mb-4">Create New Dashboard</h2>
            <form onSubmit={handleCreateDashboard}>
              <div className="mb-4">
                <label htmlFor="dashboard-name" className="block text-sm font-medium text-dark-text mb-2">
                  Dashboard Name
                </label>
                <input
                  id="dashboard-name"
                  type="text"
                  value={newDashboardName}
                  onChange={(e) => setNewDashboardName(e.target.value)}
                  className="w-full px-4 py-2 bg-dark-bg border border-dark-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all duration-200 text-dark-text"
                  placeholder="My Dashboard"
                  autoFocus
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsCreatingDashboard(false)}
                  className="px-4 py-2 bg-dark-border/50 hover:bg-dark-border text-dark-text rounded-lg transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!newDashboardName.trim()}
                  className="px-4 py-2 bg-accent hover:bg-accent/90 text-white rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Edit dashboard modal */}
      {isEditingDashboard && (
        <div className="fixed inset-0 flex items-center justify-center bg-dark-bg/80 z-50">
          <div className="bg-dark-surface border border-dark-border rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold text-dark-text mb-4">Edit Dashboard</h2>
            <form onSubmit={handleEditDashboard}>
              <div className="mb-4">
                <label htmlFor="edit-dashboard-name" className="block text-sm font-medium text-dark-text mb-2">
                  Dashboard Name
                </label>
                <input
                  id="edit-dashboard-name"
                  type="text"
                  value={editDashboardName}
                  onChange={(e) => setEditDashboardName(e.target.value)}
                  className="w-full px-4 py-2 bg-dark-bg border border-dark-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all duration-200 text-dark-text"
                  placeholder="My Dashboard"
                  autoFocus
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsEditingDashboard(false)}
                  className="px-4 py-2 bg-dark-border/50 hover:bg-dark-border text-dark-text rounded-lg transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!editDashboardName.trim()}
                  className="px-4 py-2 bg-accent hover:bg-accent/90 text-white rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Add widget modal */}
      {showAddWidgetModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-dark-bg/80 z-50">
          <div className="bg-dark-surface border border-dark-border rounded-lg p-6 w-full max-w-3xl max-h-[80vh] overflow-auto">
            <h2 className="text-xl font-semibold text-dark-text mb-4">Add Widget</h2>
            <div className="mb-6">
              <h3 className="text-lg font-medium text-dark-text mb-3">Widget Type</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="border border-dark-border hover:border-accent rounded-lg p-4 cursor-pointer transition-colors duration-200">
                  <div className="text-center mb-2">
                    <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center mx-auto">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                      </svg>
                    </div>
                  </div>
                  <h4 className="font-medium text-dark-text text-center">Metric</h4>
                  <p className="text-sm text-dark-muted text-center mt-1">Display a single metric with trend</p>
                </div>
                <div className="border border-dark-border hover:border-accent rounded-lg p-4 cursor-pointer transition-colors duration-200">
                  <div className="text-center mb-2">
                    <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center mx-auto">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                  </div>
                  <h4 className="font-medium text-dark-text text-center">Chart</h4>
                  <p className="text-sm text-dark-muted text-center mt-1">Visualize data with various chart types</p>
                </div>
                <div className="border border-dark-border hover:border-accent rounded-lg p-4 cursor-pointer transition-colors duration-200">
                  <div className="text-center mb-2">
                    <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center mx-auto">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </div>
                  </div>
                  <h4 className="font-medium text-dark-text text-center">Table</h4>
                  <p className="text-sm text-dark-muted text-center mt-1">Display data in a tabular format</p>
                </div>
              </div>
            </div>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowAddWidgetModal(false)}
                className="px-4 py-2 bg-dark-border/50 hover:bg-dark-border text-dark-text rounded-lg transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                type="button"
                className="px-4 py-2 bg-accent hover:bg-accent/90 text-white rounded-lg transition-colors duration-200"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default DashboardView
