import React from 'react'
import { 
  LayoutDashboard, 
  Database, 
  Search, 
  Settings, 
  Plus,
  TrendingUp,
  Users,
  CreditCard
} from 'lucide-react'

const Sidebar = ({ currentView, onViewChange }) => {
  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'sources', label: 'Data Sources', icon: Database },
    { id: 'explore', label: 'Explore Data', icon: Search },
    { id: 'settings', label: 'Settings', icon: Settings }
  ]

  const quickStats = [
    { label: 'Revenue', value: '$24.3k', icon: TrendingUp, color: 'text-green-400' },
    { label: 'Users', value: '5.1k', icon: Users, color: 'text-blue-400' },
    { label: 'Orders', value: '342', icon: CreditCard, color: 'text-purple-400' }
  ]

  return (
    <div className="w-64 bg-dark-surface border-r border-dark-border flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-dark-border">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-accent to-primary rounded-lg flex items-center justify-center">
            <Database className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-xl font-bold text-dark-text">DataNest</h1>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <div className="space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon
            const isActive = currentView === item.id
            
            return (
              <button
                key={item.id}
                onClick={() => onViewChange(item.id)}
                className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                  isActive 
                    ? 'bg-accent/20 text-accent border border-accent/30' 
                    : 'text-dark-muted hover:text-dark-text hover:bg-dark-border/50'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            )
          })}
        </div>

        {/* Quick Stats */}
        <div className="mt-8">
          <h3 className="text-sm font-semibold text-dark-muted mb-4 px-3">Quick Stats</h3>
          <div className="space-y-3">
            {quickStats.map((stat, index) => {
              const Icon = stat.icon
              return (
                <div key={index} className="px-3 py-2 rounded-lg bg-dark-border/30">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Icon className={`w-4 h-4 ${stat.color}`} />
                      <span className="text-sm text-dark-muted">{stat.label}</span>
                    </div>
                    <span className="text-sm font-semibold text-dark-text">{stat.value}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Add Data Source Button */}
        <div className="mt-8">
          <button
            onClick={() => onViewChange('sources')}
            className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-accent hover:bg-accent/90 text-white rounded-lg transition-colors duration-200 font-medium"
          >
            <Plus className="w-4 h-4" />
            <span>Add Data Source</span>
          </button>
        </div>
      </nav>
    </div>
  )
}

export default Sidebar