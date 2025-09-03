import React, { useState } from 'react'
import { useApp } from '../context/AppContext'
import WidgetCard from './WidgetCard'
import { Plus, Edit3, MoreVertical } from 'lucide-react'

const DashboardGrid = () => {
  const { currentDashboard, addWidget } = useApp()
  const [isEditing, setIsEditing] = useState(false)
  const [showAddWidget, setShowAddWidget] = useState(false)

  const handleAddWidget = (widgetType) => {
    const newWidget = {
      type: widgetType,
      title: `New ${widgetType === 'metric' ? 'Metric' : 'Chart'}`,
      ...(widgetType === 'metric' ? 
        { value: '$0', change: '0%', changeType: 'neutral' } :
        { chartType: 'line' }
      )
    }
    addWidget(currentDashboard.id, newWidget)
    setShowAddWidget(false)
  }

  if (!currentDashboard) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-dark-text mb-2">No Dashboard Selected</h2>
          <p className="text-dark-muted">Create your first dashboard to get started</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-dark-text">{currentDashboard.name}</h1>
          <p className="text-dark-muted mt-1">Monitor your key metrics and performance</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors duration-200 ${
              isEditing 
                ? 'bg-accent text-white' 
                : 'bg-dark-border/50 text-dark-text hover:bg-dark-border'
            }`}
          >
            <Edit3 className="w-4 h-4" />
            <span>{isEditing ? 'Done' : 'Edit'}</span>
          </button>
          <button className="p-2 bg-dark-border/50 text-dark-text hover:bg-dark-border rounded-lg transition-colors duration-200">
            <MoreVertical className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Dashboard Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentDashboard.widgets?.map((widget) => (
          <WidgetCard 
            key={widget.id} 
            widget={widget} 
            isEditing={isEditing}
          />
        ))}
        
        {/* Add Widget Card */}
        {isEditing && (
          <div className="relative">
            <button
              onClick={() => setShowAddWidget(!showAddWidget)}
              className="w-full h-48 border-2 border-dashed border-dark-border hover:border-accent/50 rounded-lg flex items-center justify-center transition-colors duration-200 group"
            >
              <div className="text-center">
                <Plus className="w-8 h-8 text-dark-muted group-hover:text-accent mx-auto mb-2" />
                <span className="text-dark-muted group-hover:text-accent font-medium">Add Widget</span>
              </div>
            </button>
            
            {showAddWidget && (
              <div className="absolute top-full left-0 mt-2 w-48 bg-dark-surface border border-dark-border rounded-lg shadow-dark-modal z-10">
                <div className="p-2">
                  <button
                    onClick={() => handleAddWidget('metric')}
                    className="w-full text-left px-3 py-2 text-dark-text hover:bg-dark-border/50 rounded-md transition-colors duration-200"
                  >
                    Metric Card
                  </button>
                  <button
                    onClick={() => handleAddWidget('chart')}
                    className="w-full text-left px-3 py-2 text-dark-text hover:bg-dark-border/50 rounded-md transition-colors duration-200"
                  >
                    Chart Widget
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default DashboardGrid