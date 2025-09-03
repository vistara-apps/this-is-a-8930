/**
 * Authentication Service
 * 
 * This service provides methods for user authentication and authorization.
 */

import api from './api'

/**
 * Sign in a user
 * @param {string} email - The user's email
 * @param {string} password - The user's password
 * @returns {Promise<Object>} The authentication response
 */
export const signIn = async (email, password) => {
  try {
    const response = await api.request(api.endpoints.AUTH.LOGIN, {
      method: 'POST',
      body: { email, password }
    })
    
    // Store the token in local storage
    if (response.data?.token) {
      localStorage.setItem('auth_token', response.data.token)
    }
    
    return response.data
  } catch (error) {
    throw new Error(error.message || 'Sign in failed')
  }
}

/**
 * Sign up a new user
 * @param {string} email - The user's email
 * @param {string} password - The user's password
 * @param {string} name - The user's name
 * @returns {Promise<Object>} The authentication response
 */
export const signUp = async (email, password, name) => {
  try {
    const response = await api.request(api.endpoints.AUTH.SIGNUP, {
      method: 'POST',
      body: { email, password, name }
    })
    
    // Store the token in local storage
    if (response.data?.token) {
      localStorage.setItem('auth_token', response.data.token)
    }
    
    return response.data
  } catch (error) {
    throw new Error(error.message || 'Sign up failed')
  }
}

/**
 * Sign out the current user
 * @returns {Promise<void>}
 */
export const signOut = async () => {
  try {
    // Get the token from local storage
    const token = localStorage.getItem('auth_token')
    
    if (token) {
      // Make a request to the logout endpoint
      await api.request(api.endpoints.AUTH.LOGOUT, {
        method: 'POST',
        headers: api.getAuthHeaders(token)
      })
    }
    
    // Remove the token from local storage
    localStorage.removeItem('auth_token')
  } catch (error) {
    // Even if the request fails, remove the token from local storage
    localStorage.removeItem('auth_token')
    throw new Error(error.message || 'Sign out failed')
  }
}

/**
 * Reset a user's password
 * @param {string} email - The user's email
 * @returns {Promise<Object>} The reset password response
 */
export const resetPassword = async (email) => {
  try {
    const response = await api.request(api.endpoints.AUTH.RESET_PASSWORD, {
      method: 'POST',
      body: { email }
    })
    
    return response.data
  } catch (error) {
    throw new Error(error.message || 'Password reset failed')
  }
}

/**
 * Get the current user's profile
 * @returns {Promise<Object>} The user profile
 */
export const getProfile = async () => {
  try {
    // Get the token from local storage
    const token = localStorage.getItem('auth_token')
    
    if (!token) {
      throw new Error('Not authenticated')
    }
    
    const response = await api.request(api.endpoints.USER.PROFILE, {
      headers: api.getAuthHeaders(token)
    })
    
    return response.data
  } catch (error) {
    throw new Error(error.message || 'Failed to get profile')
  }
}

/**
 * Update the current user's profile
 * @param {Object} updates - The profile updates
 * @returns {Promise<Object>} The updated user profile
 */
export const updateProfile = async (updates) => {
  try {
    // Get the token from local storage
    const token = localStorage.getItem('auth_token')
    
    if (!token) {
      throw new Error('Not authenticated')
    }
    
    const response = await api.request(api.endpoints.USER.PROFILE, {
      method: 'PUT',
      headers: api.getAuthHeaders(token),
      body: updates
    })
    
    return response.data
  } catch (error) {
    throw new Error(error.message || 'Failed to update profile')
  }
}

/**
 * Get the current user's preferences
 * @returns {Promise<Object>} The user preferences
 */
export const getPreferences = async () => {
  try {
    // Get the token from local storage
    const token = localStorage.getItem('auth_token')
    
    if (!token) {
      throw new Error('Not authenticated')
    }
    
    const response = await api.request(api.endpoints.USER.PREFERENCES, {
      headers: api.getAuthHeaders(token)
    })
    
    return response.data
  } catch (error) {
    throw new Error(error.message || 'Failed to get preferences')
  }
}

/**
 * Update the current user's preferences
 * @param {Object} preferences - The preference updates
 * @returns {Promise<Object>} The updated user preferences
 */
export const updatePreferences = async (preferences) => {
  try {
    // Get the token from local storage
    const token = localStorage.getItem('auth_token')
    
    if (!token) {
      throw new Error('Not authenticated')
    }
    
    const response = await api.request(api.endpoints.USER.PREFERENCES, {
      method: 'PUT',
      headers: api.getAuthHeaders(token),
      body: preferences
    })
    
    return response.data
  } catch (error) {
    throw new Error(error.message || 'Failed to update preferences')
  }
}

/**
 * Check if the user is authenticated
 * @returns {boolean} Whether the user is authenticated
 */
export const isAuthenticated = () => {
  return !!localStorage.getItem('auth_token')
}

/**
 * Get the authentication token
 * @returns {string|null} The authentication token
 */
export const getToken = () => {
  return localStorage.getItem('auth_token')
}

// Export a unified auth service
export default {
  signIn,
  signUp,
  signOut,
  resetPassword,
  getProfile,
  updateProfile,
  getPreferences,
  updatePreferences,
  isAuthenticated,
  getToken
}

