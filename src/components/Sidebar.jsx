/**
 * Sidebar Component
 * 
 * This component provides the main navigation sidebar for the application.
 */

import React from 'react'
import { useAuth } from '../context/AuthContext'
import useMediaQuery from '../hooks/useMediaQuery'
import { 
  LayoutDashboard, 
  Database, 
  Search, 
  Settings, 
  LogOut,
  User
} from 'lucide-react'

const Sidebar = ({ currentView, onViewChange }) => {
  const { user, signOut } = useAuth()
  const isMobile = useMediaQuery('(max-width: 768px)')
  
  // If on mobile, don't render the sidebar
  if (isMobile) {
    return null
  }
  
  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'sources', label: 'Data Sources', icon: Database },
    { id: 'explore', label: 'Explore Data', icon: Search },
    { id: 'settings', label: 'Settings', icon: Settings }
  ]
  
  const handleSignOut = async () => {
    try {
      await signOut()
    } catch (error) {
      console.error('Failed to sign out:', error)
    }
  }
  
  return (
    <aside className="hidden md:flex flex-col w-64 bg-dark-surface border-r border-dark-border">
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
      <nav className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon
            const isActive = currentView === item.id
            
            return (
              <button
                key={item.id}
                onClick={() => onViewChange(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
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
      </nav>
      
      {/* User profile */}
      <div className="p-4 border-t border-dark-border">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-accent/20 rounded-full flex items-center justify-center">
            <User className="w-5 h-5 text-accent" />
          </div>
          <div>
            <div className="font-medium text-dark-text">{user?.name || 'User'}</div>
            <div className="text-sm text-dark-muted">{user?.email || 'user@example.com'}</div>
          </div>
        </div>
        
        <button
          onClick={handleSignOut}
          className="w-full flex items-center space-x-3 px-4 py-3 text-dark-muted hover:text-dark-text hover:bg-dark-border/50 rounded-lg transition-all duration-200"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Sign out</span>
        </button>
      </div>
    </aside>
  )
}

export default Sidebar

