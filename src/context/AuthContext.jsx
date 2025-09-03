/**
 * Authentication Context
 * 
 * This context provides authentication state and methods for the application.
 */

import React, { createContext, useContext, useState, useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid'

// Create the context
const AuthContext = createContext()

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

// Mock user data for development
const mockUser = {
  id: uuidv4(),
  email: 'demo@datanest.app',
  name: 'Demo User',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  subscription_tier: 'pro',
  preferences: {
    theme: 'dark',
    date_format: 'MM/DD/YYYY',
    number_format: 'en-US',
    timezone: 'America/New_York',
    notifications: {
      email: true,
      in_app: true,
      frequency: 'daily',
      types: {
        data_sync: true,
        alerts: true,
        system: true
      }
    }
  }
}

// Auth provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  
  // Check if the user is authenticated on mount
  useEffect(() => {
    const checkAuth = async () => {
      setIsLoading(true)
      setError(null)
      
      try {
        // In a real implementation, this would check for a valid session
        // For now, we'll simulate a successful authentication
        const token = localStorage.getItem('auth_token')
        
        if (token) {
          // Simulate API call to get user data
          await new Promise(resolve => setTimeout(resolve, 500))
          setUser(mockUser)
        }
        
        setIsLoading(false)
      } catch (err) {
        setError(err.message || 'Authentication failed')
        setIsLoading(false)
      }
    }
    
    checkAuth()
  }, [])
  
  /**
   * Sign in a user
   * @param {string} email - The user's email
   * @param {string} password - The user's password
   * @returns {Promise<Object>} The authenticated user
   */
  const signIn = async (email, password) => {
    setIsLoading(true)
    setError(null)
    
    try {
      // In a real implementation, this would make an API call to authenticate
      // For now, we'll simulate a successful authentication
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Check if the email and password are valid
      if (email !== 'demo@datanest.app' || password !== 'password') {
        throw new Error('Invalid email or password')
      }
      
      // Store the token in local storage
      localStorage.setItem('auth_token', 'mock_token')
      
      // Set the user
      setUser(mockUser)
      
      setIsLoading(false)
      return mockUser
    } catch (err) {
      setError(err.message || 'Sign in failed')
      setIsLoading(false)
      throw err
    }
  }
  
  /**
   * Sign up a new user
   * @param {string} email - The user's email
   * @param {string} password - The user's password
   * @param {string} name - The user's name
   * @returns {Promise<Object>} The authenticated user
   */
  const signUp = async (email, password, name) => {
    setIsLoading(true)
    setError(null)
    
    try {
      // In a real implementation, this would make an API call to create a new user
      // For now, we'll simulate a successful sign up
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Create a new user
      const newUser = {
        ...mockUser,
        id: uuidv4(),
        email,
        name,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
      
      // Store the token in local storage
      localStorage.setItem('auth_token', 'mock_token')
      
      // Set the user
      setUser(newUser)
      
      setIsLoading(false)
      return newUser
    } catch (err) {
      setError(err.message || 'Sign up failed')
      setIsLoading(false)
      throw err
    }
  }
  
  /**
   * Sign out the current user
   * @returns {Promise<void>}
   */
  const signOut = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      // In a real implementation, this would make an API call to sign out
      // For now, we'll simulate a successful sign out
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Remove the token from local storage
      localStorage.removeItem('auth_token')
      
      // Clear the user
      setUser(null)
      
      setIsLoading(false)
    } catch (err) {
      setError(err.message || 'Sign out failed')
      setIsLoading(false)
      throw err
    }
  }
  
  /**
   * Reset a user's password
   * @param {string} email - The user's email
   * @returns {Promise<void>}
   */
  const resetPassword = async (email) => {
    setIsLoading(true)
    setError(null)
    
    try {
      // In a real implementation, this would make an API call to reset the password
      // For now, we'll simulate a successful password reset
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setIsLoading(false)
    } catch (err) {
      setError(err.message || 'Password reset failed')
      setIsLoading(false)
      throw err
    }
  }
  
  /**
   * Update the current user's profile
   * @param {Object} updates - The profile updates
   * @returns {Promise<Object>} The updated user
   */
  const updateProfile = async (updates) => {
    setIsLoading(true)
    setError(null)
    
    try {
      // In a real implementation, this would make an API call to update the profile
      // For now, we'll simulate a successful profile update
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Update the user
      const updatedUser = {
        ...user,
        ...updates,
        updated_at: new Date().toISOString()
      }
      
      setUser(updatedUser)
      
      setIsLoading(false)
      return updatedUser
    } catch (err) {
      setError(err.message || 'Profile update failed')
      setIsLoading(false)
      throw err
    }
  }
  
  /**
   * Update the current user's preferences
   * @param {Object} preferences - The preference updates
   * @returns {Promise<Object>} The updated user
   */
  const updatePreferences = async (preferences) => {
    setIsLoading(true)
    setError(null)
    
    try {
      // In a real implementation, this would make an API call to update the preferences
      // For now, we'll simulate a successful preference update
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Update the user
      const updatedUser = {
        ...user,
        preferences: {
          ...user.preferences,
          ...preferences
        },
        updated_at: new Date().toISOString()
      }
      
      setUser(updatedUser)
      
      setIsLoading(false)
      return updatedUser
    } catch (err) {
      setError(err.message || 'Preference update failed')
      setIsLoading(false)
      throw err
    }
  }
  
  /**
   * Clear the error
   */
  const clearError = () => {
    setError(null)
  }
  
  // Context value
  const value = {
    user,
    isLoading,
    error,
    isAuthenticated: !!user,
    signIn,
    signUp,
    signOut,
    resetPassword,
    updateProfile,
    updatePreferences,
    clearError
  }
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext

