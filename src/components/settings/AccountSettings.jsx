/**
 * AccountSettings Component
 * 
 * This component provides a form for users to manage their account settings.
 */

import React, { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import LoadingIndicator from '../common/LoadingIndicator'
import { Save, Check } from 'lucide-react'

const AccountSettings = () => {
  const { user, updateProfile, isLoading: authLoading, error: authError, clearError } = useAuth()
  
  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [formError, setFormError] = useState(null)
  
  // Form state
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    company: user?.company || '',
    jobTitle: user?.job_title || ''
  })
  
  // Handle form changes
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }
  
  // Save account settings
  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSaving(true)
    setSaveSuccess(false)
    setFormError(null)
    clearError()
    
    try {
      await updateProfile({
        name: formData.name,
        company: formData.company,
        job_title: formData.jobTitle
      })
      
      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 3000)
    } catch (error) {
      setFormError(error.message || 'Failed to save account settings')
    } finally {
      setIsSaving(false)
    }
  }
  
  return (
    <div>
      <h2 className="text-xl font-semibold text-dark-text mb-6">Account Settings</h2>
      
      {/* Error message */}
      {(authError || formError) && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-500 px-4 py-3 rounded-lg mb-6">
          {formError || authError}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-dark-text mb-2">
              Full name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
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
              value={formData.email}
              onChange={handleChange}
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
              value={formData.company}
              onChange={handleChange}
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
              value={formData.jobTitle}
              onChange={handleChange}
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

export default AccountSettings

