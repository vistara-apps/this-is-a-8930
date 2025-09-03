/**
 * NotificationSettings Component
 * 
 * This component provides a form for users to manage their notification settings.
 */

import React, { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import LoadingIndicator from '../common/LoadingIndicator'
import { Save, Check } from 'lucide-react'

const NotificationSettings = () => {
  const { user, updatePreferences, isLoading: authLoading, error: authError, clearError } = useAuth()
  
  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [formError, setFormError] = useState(null)
  
  // Form state
  const [formData, setFormData] = useState({
    email: user?.preferences?.notifications?.email || false,
    inApp: user?.preferences?.notifications?.in_app || false,
    frequency: user?.preferences?.notifications?.frequency || 'daily',
    types: {
      dataSync: user?.preferences?.notifications?.types?.data_sync || false,
      alerts: user?.preferences?.notifications?.types?.alerts || false,
      system: user?.preferences?.notifications?.types?.system || false
    }
  })
  
  // Handle form changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    
    if (type === 'checkbox') {
      if (name.startsWith('types.')) {
        const typeName = name.split('.')[1]
        setFormData(prev => ({
          ...prev,
          types: {
            ...prev.types,
            [typeName]: checked
          }
        }))
      } else {
        setFormData(prev => ({ ...prev, [name]: checked }))
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  }
  
  // Save notification settings
  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSaving(true)
    setSaveSuccess(false)
    setFormError(null)
    clearError()
    
    try {
      await updatePreferences({
        notifications: {
          email: formData.email,
          in_app: formData.inApp,
          frequency: formData.frequency,
          types: {
            data_sync: formData.types.dataSync,
            alerts: formData.types.alerts,
            system: formData.types.system
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
  
  return (
    <div>
      <h2 className="text-xl font-semibold text-dark-text mb-6">Notification Settings</h2>
      
      {/* Error message */}
      {(authError || formError) && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-500 px-4 py-3 rounded-lg mb-6">
          {formError || authError}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-8">
        <div>
          <h3 className="text-lg font-medium text-dark-text mb-4">Notification channels</h3>
          <div className="space-y-4">
            <div className="flex items-center">
              <input
                id="email"
                name="email"
                type="checkbox"
                checked={formData.email}
                onChange={handleChange}
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
                checked={formData.inApp}
                onChange={handleChange}
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
              value={formData.frequency}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-dark-surface border border-dark-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all duration-200 text-dark-text"
            >
              <option value="realtime">Real-time</option>
              <option value="daily">Daily digest</option>
              <option value="weekly">Weekly digest</option>
              <option value="never">Never</option>
            </select>
            <p className="mt-2 text-sm text-dark-muted">
              {formData.frequency === 'realtime'
                ? 'You will receive notifications as events occur.'
                : formData.frequency === 'daily'
                  ? 'You will receive a daily digest of all notifications.'
                  : formData.frequency === 'weekly'
                    ? 'You will receive a weekly digest of all notifications.'
                    : 'You will not receive any notifications.'}
            </p>
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
                checked={formData.types.dataSync}
                onChange={handleChange}
                className="h-4 w-4 text-accent focus:ring-accent border-dark-border rounded"
              />
              <label htmlFor="types.dataSync" className="ml-2 block text-sm text-dark-text">
                Data sync notifications
              </label>
              <p className="ml-6 text-sm text-dark-muted">
                Receive notifications when data sources are synced.
              </p>
            </div>
            
            <div className="flex items-center">
              <input
                id="types.alerts"
                name="types.alerts"
                type="checkbox"
                checked={formData.types.alerts}
                onChange={handleChange}
                className="h-4 w-4 text-accent focus:ring-accent border-dark-border rounded"
              />
              <label htmlFor="types.alerts" className="ml-2 block text-sm text-dark-text">
                Alert notifications
              </label>
              <p className="ml-6 text-sm text-dark-muted">
                Receive notifications for custom alerts you've set up.
              </p>
            </div>
            
            <div className="flex items-center">
              <input
                id="types.system"
                name="types.system"
                type="checkbox"
                checked={formData.types.system}
                onChange={handleChange}
                className="h-4 w-4 text-accent focus:ring-accent border-dark-border rounded"
              />
              <label htmlFor="types.system" className="ml-2 block text-sm text-dark-text">
                System notifications
              </label>
              <p className="ml-6 text-sm text-dark-muted">
                Receive notifications about system updates and maintenance.
              </p>
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
            disabled={isSaving || authLoading}
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
    </div>
  )
}

export default NotificationSettings

