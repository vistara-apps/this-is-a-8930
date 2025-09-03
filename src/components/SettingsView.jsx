/**
 * SettingsView Component
 * 
 * This component provides a settings page for users to manage their account,
 * configure data sources, set up notifications, and customize the application.
 */

import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useApp } from '../context/AppContext'
import LoadingIndicator from './common/LoadingIndicator'
import ErrorMessage from './common/ErrorMessage'
import { 
  User, 
  Bell, 
  Globe, 
  Palette, 
  Shield, 
  CreditCard,
  Save,
  Check
} from 'lucide-react'

const SettingsView = () => {
  const { user, updateProfile, updatePreferences, isLoading: authLoading, error: authError, clearError: clearAuthError } = useAuth()
  const { dataSources, isLoading: appLoading, error: appError, clearError: clearAppError } = useApp()
  
  const [activeTab, setActiveTab] = useState('account')
  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [formError, setFormError] = useState(null)
  
  // Form state
  const [accountForm, setAccountForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    company: user?.company || '',
    jobTitle: user?.job_title || ''
  })
  
  const [preferencesForm, setPreferencesForm] = useState({
    theme: user?.preferences?.theme || 'dark',
    dateFormat: user?.preferences?.date_format || 'MM/DD/YYYY',
    numberFormat: user?.preferences?.number_format || 'en-US',
    timezone: user?.preferences?.timezone || 'America/New_York'
  })
  
  const [notificationsForm, setNotificationsForm] = useState({
    email: user?.preferences?.notifications?.email || false,
    inApp: user?.preferences?.notifications?.in_app || false,
    frequency: user?.preferences?.notifications?.frequency || 'daily',
    types: {
      dataSync: user?.preferences?.notifications?.types?.data_sync || false,
      alerts: user?.preferences?.notifications?.types?.alerts || false,
      system: user?.preferences?.notifications?.types?.system || false
    }
  })
  
  // Handle account form changes
  const handleAccountChange = (e) => {
    const { name, value } = e.target
    setAccountForm(prev => ({ ...prev, [name]: value }))
  }
  
  // Handle preferences form changes
  const handlePreferencesChange = (e) => {
    const { name, value } = e.target
    setPreferencesForm(prev => ({ ...prev, [name]: value }))
  }
  
  // Handle notifications form changes
  const handleNotificationsChange = (e) => {
    const { name, value, type, checked } = e.target
    
    if (type === 'checkbox') {
      if (name.startsWith('types.')) {
        const typeName = name.split('.')[1]
        setNotificationsForm(prev => ({
          ...prev,
          types: {
            ...prev.types,
            [typeName]: checked
          }
        }))
      } else {
        setNotificationsForm(prev => ({ ...prev, [name]: checked }))
      }
    } else {
      setNotificationsForm(prev => ({ ...prev, [name]: value }))
    }
  }
  
  // Save account settings
  const saveAccountSettings = async (e) => {
    e.preventDefault()
    setIsSaving(true)
    setSaveSuccess(false)
    setFormError(null)
    clearAuthError()
    
    try {
      await updateProfile({
        name: accountForm.name,
        company: accountForm.company,
        job_title: accountForm.jobTitle
      })
      
      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 3000)
    } catch (error) {
      setFormError(error.message || 'Failed to save account settings')
    } finally {
      setIsSaving(false)
    }
  }
  
  // Save preferences settings
  const savePreferencesSettings = async (e) => {
    e.preventDefault()
    setIsSaving(true)
    setSaveSuccess(false)
    setFormError(null)
    clearAuthError()
    
    try {
      await updatePreferences({
        theme: preferencesForm.theme,
        date_format: preferencesForm.dateFormat,
        number_format: preferencesForm.numberFormat,
        timezone: preferencesForm.timezone
      })
      
      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 3000)
    } catch (error) {
      setFormError(error.message || 'Failed to save preferences')
    } finally {
      setIsSaving(false)
    }
  }
  
  // Save notifications settings
  const saveNotificationsSettings = async (e) => {
    e.preventDefault()
    setIsSaving(true)
    setSaveSuccess(false)
    setFormError(null)
    clearAuthError()
    
    try {
      await updatePreferences({
        notifications: {
          email: notificationsForm.email,
          in_app: notificationsForm.inApp,
          frequency: notificationsForm.frequency,
          types: {
            data_sync: notificationsForm.types.dataSync,
            alerts: notificationsForm.types.alerts,
            system: notificationsForm.types.system
          }
        }
      })
      
      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 3000)
    } catch (error) {
      setFormError(error.message || 'Failed to save notification settings')
    } finally {
      setIsSaving(false)
    }
  }
  
  // Render the settings tabs
  const renderTabs = () => {
    const tabs = [
      { id: 'account', label: 'Account', icon: User },
      { id: 'preferences', label: 'Preferences', icon: Palette },
      { id: 'notifications', label: 'Notifications', icon: Bell },
      { id: 'security', label: 'Security', icon: Shield },
      { id: 'billing', label: 'Billing', icon: CreditCard }
    ]
    
    return (
      <div className="flex flex-wrap border-b border-dark-border mb-6">
        {tabs.map(tab => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-3 border-b-2 transition-colors duration-200 ${
                isActive 
                  ? 'border-accent text-accent' 
                  : 'border-transparent text-dark-muted hover:text-dark-text'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          )
        })}
      </div>
    )
  }
  
  // Render the account settings form
  const renderAccountSettings = () => {
    return (
      <form onSubmit={saveAccountSettings} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-dark-text mb-2">
              Full name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={accountForm.name}
              onChange={handleAccountChange}
              className="w-full px-4 py-3 bg-dark-surface border border-dark-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all duration-200 text-dark-text"
            />
          </div>
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-dark-text mb-2">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={accountForm.email}
              onChange={handleAccountChange}
              disabled
              className="w-full px-4 py-3 bg-dark-surface border border-dark-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all duration-200 text-dark-text opacity-70 cursor-not-allowed"
            />
            <p className="mt-2 text-xs text-dark-muted">
              Contact support to change your email address
            </p>
          </div>
          
          <div>
            <label htmlFor="company" className="block text-sm font-medium text-dark-text mb-2">
              Company
            </label>
            <input
              id="company"
              name="company"
              type="text"
              value={accountForm.company}
              onChange={handleAccountChange}
              className="w-full px-4 py-3 bg-dark-surface border border-dark-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all duration-200 text-dark-text"
            />
          </div>
          
          <div>
            <label htmlFor="jobTitle" className="block text-sm font-medium text-dark-text mb-2">
              Job title
            </label>
            <input
              id="jobTitle"
              name="jobTitle"
              type="text"
              value={accountForm.jobTitle}
              onChange={handleAccountChange}
              className="w-full px-4 py-3 bg-dark-surface border border-dark-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all duration-200 text-dark-text"
            />
          </div>
        </div>
        
        <div className="flex items-center justify-end space-x-4">
          {saveSuccess && (
            <div className="flex items-center text-green-500">
              <Check className="w-4 h-4 mr-2" />
              <span>Settings saved</span>
            </div>
          )}
          
          <button
            type="submit"
            disabled={isSaving}
            className="flex items-center space-x-2 px-4 py-2 bg-accent hover:bg-accent/90 text-white rounded-lg transition-colors duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSaving ? (
              <>
                <LoadingIndicator size="sm" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save changes</span>
              </>
            )}
          </button>
        </div>
      </form>
    )
  }
  
  // Render the preferences settings form
  const renderPreferencesSettings = () => {
    return (
      <form onSubmit={savePreferencesSettings} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="theme" className="block text-sm font-medium text-dark-text mb-2">
              Theme
            </label>
            <select
              id="theme"
              name="theme"
              value={preferencesForm.theme}
              onChange={handlePreferencesChange}
              className="w-full px-4 py-3 bg-dark-surface border border-dark-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all duration-200 text-dark-text"
            >
              <option value="dark">Dark</option>
              <option value="light">Light</option>
              <option value="system">System</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="dateFormat" className="block text-sm font-medium text-dark-text mb-2">
              Date format
            </label>
            <select
              id="dateFormat"
              name="dateFormat"
              value={preferencesForm.dateFormat}
              onChange={handlePreferencesChange}
              className="w-full px-4 py-3 bg-dark-surface border border-dark-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all duration-200 text-dark-text"
            >
              <option value="MM/DD/YYYY">MM/DD/YYYY</option>
              <option value="DD/MM/YYYY">DD/MM/YYYY</option>
              <option value="YYYY-MM-DD">YYYY-MM-DD</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="numberFormat" className="block text-sm font-medium text-dark-text mb-2">
              Number format
            </label>
            <select
              id="numberFormat"
              name="numberFormat"
              value={preferencesForm.numberFormat}
              onChange={handlePreferencesChange}
              className="w-full px-4 py-3 bg-dark-surface border border-dark-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all duration-200 text-dark-text"
            >
              <option value="en-US">1,234.56 (US)</option>
              <option value="en-GB">1,234.56 (UK)</option>
              <option value="de-DE">1.234,56 (DE)</option>
              <option value="fr-FR">1 234,56 (FR)</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="timezone" className="block text-sm font-medium text-dark-text mb-2">
              Timezone
            </label>
            <select
              id="timezone"
              name="timezone"
              value={preferencesForm.timezone}
              onChange={handlePreferencesChange}
              className="w-full px-4 py-3 bg-dark-surface border border-dark-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all duration-200 text-dark-text"
            >
              <option value="America/New_York">Eastern Time (ET)</option>
              <option value="America/Chicago">Central Time (CT)</option>
              <option value="America/Denver">Mountain Time (MT)</option>
              <option value="America/Los_Angeles">Pacific Time (PT)</option>
              <option value="Europe/London">London (GMT)</option>
              <option value="Europe/Paris">Paris (CET)</option>
              <option value="Asia/Tokyo">Tokyo (JST)</option>
              <option value="Australia/Sydney">Sydney (AEST)</option>
            </select>
          </div>
        </div>
        
        <div className="flex items-center justify-end space-x-4">
          {saveSuccess && (
            <div className="flex items-center text-green-500">
              <Check className="w-4 h-4 mr-2" />
              <span>Settings saved</span>
            </div>
          )}
          
          <button
            type="submit"
            disabled={isSaving}
            className="flex items-center space-x-2 px-4 py-2 bg-accent hover:bg-accent/90 text-white rounded-lg transition-colors duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSaving ? (
              <>
                <LoadingIndicator size="sm" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save changes</span>
              </>
            )}
          </button>
        </div>
      </form>
    )
  }
  
  // Render the notifications settings form
  const renderNotificationsSettings = () => {
    return (
      <form onSubmit={saveNotificationsSettings} className="space-y-6">
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium text-dark-text mb-4">Notification channels</h3>
            <div className="space-y-4">
              <div className="flex items-center">
                <input
                  id="email"
                  name="email"
                  type="checkbox"
                  checked={notificationsForm.email}
                  onChange={handleNotificationsChange}
                  className="h-4 w-4 text-accent focus:ring-accent border-dark-border rounded"
                />
                <label htmlFor="email" className="ml-2 block text-sm text-dark-text">
                  Email notifications
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  id="inApp"
                  name="inApp"
                  type="checkbox"
                  checked={notificationsForm.inApp}
                  onChange={handleNotificationsChange}
                  className="h-4 w-4 text-accent focus:ring-accent border-dark-border rounded"
                />
                <label htmlFor="inApp" className="ml-2 block text-sm text-dark-text">
                  In-app notifications
                </label>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-medium text-dark-text mb-4">Notification frequency</h3>
            <div className="max-w-md">
              <select
                id="frequency"
                name="frequency"
                value={notificationsForm.frequency}
                onChange={handleNotificationsChange}
                className="w-full px-4 py-3 bg-dark-surface border border-dark-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all duration-200 text-dark-text"
              >
                <option value="realtime">Real-time</option>
                <option value="daily">Daily digest</option>
                <option value="weekly">Weekly digest</option>
                <option value="never">Never</option>
              </select>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-medium text-dark-text mb-4">Notification types</h3>
            <div className="space-y-4">
              <div className="flex items-center">
                <input
                  id="types.dataSync"
                  name="types.dataSync"
                  type="checkbox"
                  checked={notificationsForm.types.dataSync}
                  onChange={handleNotificationsChange}
                  className="h-4 w-4 text-accent focus:ring-accent border-dark-border rounded"
                />
                <label htmlFor="types.dataSync" className="ml-2 block text-sm text-dark-text">
                  Data sync notifications
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  id="types.alerts"
                  name="types.alerts"
                  type="checkbox"
                  checked={notificationsForm.types.alerts}
                  onChange={handleNotificationsChange}
                  className="h-4 w-4 text-accent focus:ring-accent border-dark-border rounded"
                />
                <label htmlFor="types.alerts" className="ml-2 block text-sm text-dark-text">
                  Alert notifications
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  id="types.system"
                  name="types.system"
                  type="checkbox"
                  checked={notificationsForm.types.system}
                  onChange={handleNotificationsChange}
                  className="h-4 w-4 text-accent focus:ring-accent border-dark-border rounded"
                />
                <label htmlFor="types.system" className="ml-2 block text-sm text-dark-text">
                  System notifications
                </label>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-end space-x-4">
          {saveSuccess && (
            <div className="flex items-center text-green-500">
              <Check className="w-4 h-4 mr-2" />
              <span>Settings saved</span>
            </div>
          )}
          
          <button
            type="submit"
            disabled={isSaving}
            className="flex items-center space-x-2 px-4 py-2 bg-accent hover:bg-accent/90 text-white rounded-lg transition-colors duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSaving ? (
              <>
                <LoadingIndicator size="sm" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save changes</span>
              </>
            )}
          </button>
        </div>
      </form>
    )
  }
  
  // Render the security settings form (placeholder)
  const renderSecuritySettings = () => {
    return (
      <div className="space-y-6">
        <div className="bg-dark-surface border border-dark-border rounded-lg p-6">
          <h3 className="text-lg font-medium text-dark-text mb-4">Password</h3>
          <p className="text-dark-muted mb-4">
            Change your password to keep your account secure.
          </p>
          <button
            type="button"
            className="px-4 py-2 bg-dark-border/50 hover:bg-dark-border text-dark-text rounded-lg transition-colors duration-200"
          >
            Change password
          </button>
        </div>
        
        <div className="bg-dark-surface border border-dark-border rounded-lg p-6">
          <h3 className="text-lg font-medium text-dark-text mb-4">Two-factor authentication</h3>
          <p className="text-dark-muted mb-4">
            Add an extra layer of security to your account by enabling two-factor authentication.
          </p>
          <button
            type="button"
            className="px-4 py-2 bg-dark-border/50 hover:bg-dark-border text-dark-text rounded-lg transition-colors duration-200"
          >
            Enable 2FA
          </button>
        </div>
        
        <div className="bg-dark-surface border border-dark-border rounded-lg p-6">
          <h3 className="text-lg font-medium text-dark-text mb-4">API keys</h3>
          <p className="text-dark-muted mb-4">
            Manage API keys for programmatic access to your data.
          </p>
          <button
            type="button"
            className="px-4 py-2 bg-dark-border/50 hover:bg-dark-border text-dark-text rounded-lg transition-colors duration-200"
          >
            Manage API keys
          </button>
        </div>
      </div>
    )
  }
  
  // Render the billing settings form (placeholder)
  const renderBillingSettings = () => {
    return (
      <div className="space-y-6">
        <div className="bg-dark-surface border border-dark-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-dark-text">Current plan</h3>
            <span className="px-3 py-1 bg-accent/20 text-accent rounded-full text-sm font-medium">
              {user?.subscription_tier === 'pro' ? 'Pro' : user?.subscription_tier === 'business' ? 'Business' : 'Free'}
            </span>
          </div>
          <p className="text-dark-muted mb-4">
            {user?.subscription_tier === 'pro' 
              ? 'You are currently on the Pro plan. You have access to all Pro features.'
              : user?.subscription_tier === 'business'
                ? 'You are currently on the Business plan. You have access to all Business features.'
                : 'You are currently on the Free plan. Upgrade to get access to more features.'}
          </p>
          {user?.subscription_tier !== 'business' && (
            <button
              type="button"
              className="px-4 py-2 bg-accent hover:bg-accent/90 text-white rounded-lg transition-colors duration-200"
            >
              Upgrade plan
            </button>
          )}
        </div>
        
        <div className="bg-dark-surface border border-dark-border rounded-lg p-6">
          <h3 className="text-lg font-medium text-dark-text mb-4">Payment method</h3>
          <p className="text-dark-muted mb-4">
            {user?.subscription_tier === 'free'
              ? 'Add a payment method to upgrade your plan.'
              : 'Manage your payment method and billing information.'}
          </p>
          <button
            type="button"
            className="px-4 py-2 bg-dark-border/50 hover:bg-dark-border text-dark-text rounded-lg transition-colors duration-200"
          >
            {user?.subscription_tier === 'free' ? 'Add payment method' : 'Manage payment method'}
          </button>
        </div>
        
        <div className="bg-dark-surface border border-dark-border rounded-lg p-6">
          <h3 className="text-lg font-medium text-dark-text mb-4">Billing history</h3>
          <p className="text-dark-muted mb-4">
            View your billing history and download invoices.
          </p>
          <button
            type="button"
            className="px-4 py-2 bg-dark-border/50 hover:bg-dark-border text-dark-text rounded-lg transition-colors duration-200"
          >
            View billing history
          </button>
        </div>
      </div>
    )
  }
  
  // Render the active tab content
  const renderTabContent = () => {
    switch (activeTab) {
      case 'account':
        return renderAccountSettings()
      case 'preferences':
        return renderPreferencesSettings()
      case 'notifications':
        return renderNotificationsSettings()
      case 'security':
        return renderSecuritySettings()
      case 'billing':
        return renderBillingSettings()
      default:
        return renderAccountSettings()
    }
  }
  
  // Show loading indicator while loading
  if (authLoading || appLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <LoadingIndicator size="lg" message="Loading settings..." />
      </div>
    )
  }
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-dark-text">Settings</h1>
        <p className="text-dark-muted mt-1">Manage your account and application preferences</p>
      </div>
      
      {/* Error messages */}
      {(authError || appError || formError) && (
        <ErrorMessage
          message={formError || authError || appError}
          onRetry={() => {
            setFormError(null)
            clearAuthError()
            clearAppError()
          }}
        />
      )}
      
      {/* Settings content */}
      <div className="bg-dark-surface border border-dark-border rounded-lg overflow-hidden">
        {renderTabs()}
        <div className="p-6">
          {renderTabContent()}
        </div>
      </div>
    </div>
  )
}

export default SettingsView

