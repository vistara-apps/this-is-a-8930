/**
 * MobileNavigation Component
 * 
 * This component provides a mobile-friendly navigation menu.
 */

import React, { useState } from 'react'
import { 
  LayoutDashboard, 
  Database, 
  Search, 
  Settings, 
  Menu, 
  X,
  LogOut,
  User
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import useMediaQuery from '../hooks/useMediaQuery'

const MobileNavigation = ({ currentView, onViewChange }) => {
  const [isOpen, setIsOpen] = useState(false)
  const { user, signOut } = useAuth()
  const isMobile = useMediaQuery('(max-width: 768px)')
  
  // If not on mobile, don't render this component
  if (!isMobile) {
    return null
  }
  
  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'sources', label: 'Data Sources', icon: Database },
    { id: 'explore', label: 'Explore Data', icon: Search },
    { id: 'settings', label: 'Settings', icon: Settings }
  ]
  
  const handleNavigation = (viewId) => {
    onViewChange(viewId)
    setIsOpen(false)
  }
  
  const handleSignOut = async () => {
    try {
      await signOut()
    } catch (error) {
      console.error('Failed to sign out:', error)
    }
  }
  
  return (
    <>
      {/* Mobile Header */}
      <div className="fixed top-0 left-0 right-0 h-16 bg-dark-surface border-b border-dark-border flex items-center justify-between px-4 z-30">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-accent to-primary rounded-lg flex items-center justify-center">
            <Database className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-xl font-bold text-dark-text">DataNest</h1>
        </div>
        
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 text-dark-text hover:bg-dark-border/50 rounded-lg transition-colors duration-200"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>
      
      {/* Mobile Menu */}
      {isOpen && (
        <div className="fixed inset-0 bg-dark-bg/80 z-20 pt-16">
          <div className="bg-dark-surface h-full overflow-auto">
            <div className="p-4 border-b border-dark-border">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-accent/20 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <div className="font-medium text-dark-text">{user?.name || 'User'}</div>
                  <div className="text-sm text-dark-muted">{user?.email || 'user@example.com'}</div>
                </div>
              </div>
            </div>
            
            <nav className="p-4">
              <div className="space-y-2">
                {navigationItems.map((item) => {
                  const Icon = item.icon
                  const isActive = currentView === item.id
                  
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNavigation(item.id)}
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
              
              <div className="mt-8 pt-8 border-t border-dark-border">
                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center space-x-3 px-4 py-3 text-dark-muted hover:text-dark-text hover:bg-dark-border/50 rounded-lg transition-all duration-200"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="font-medium">Sign out</span>
                </button>
              </div>
            </nav>
          </div>
        </div>
      )}
      
      {/* Content Padding for Mobile */}
      <div className="h-16" />
    </>
  )
}

export default MobileNavigation

