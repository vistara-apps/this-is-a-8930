/**
 * Signup Component
 * 
 * This component provides a signup form for users to create a new account.
 */

import React, { useState } from 'react'
import { useAuth } from '../../context/AuthContext'

const Signup = ({ onSuccess, onSignIn }) => {
  const { signUp, isLoading, error, clearError } = useAuth()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [agreeToTerms, setAgreeToTerms] = useState(false)
  const [termsError, setTermsError] = useState('')

  const validatePassword = () => {
    if (password !== confirmPassword) {
      setPasswordError('Passwords do not match')
      return false
    }
    
    if (password.length < 8) {
      setPasswordError('Password must be at least 8 characters long')
      return false
    }
    
    setPasswordError('')
    return true
  }

  const validateTerms = () => {
    if (!agreeToTerms) {
      setTermsError('You must agree to the terms and conditions')
      return false
    }
    
    setTermsError('')
    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    clearError()
    setPasswordError('')
    setTermsError('')
    
    // Validate form
    const isPasswordValid = validatePassword()
    const isTermsValid = validateTerms()
    
    if (!isPasswordValid || !isTermsValid) {
      return
    }
    
    try {
      const user = await signUp(email, password, name)
      if (onSuccess) {
        onSuccess(user)
      }
    } catch (err) {
      // Error is handled by the auth context
    }
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-accent to-primary rounded-xl flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2 1 3 3 3h10c2 0 3-1 3-3V7c0-2-1-3-3-3H7c-2 0-3 1-3 3z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 11l3 3 3-3m-3-3v6" />
            </svg>
          </div>
        </div>
        <h1 className="text-2xl font-bold text-dark-text">Create your account</h1>
        <p className="text-dark-muted mt-2">Start your journey with DataNest</p>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-500 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-dark-text mb-2">
            Full name
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full px-4 py-3 bg-dark-surface border border-dark-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all duration-200 text-dark-text"
            placeholder="John Doe"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-dark-text mb-2">
            Email address
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-3 bg-dark-surface border border-dark-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all duration-200 text-dark-text"
            placeholder="you@example.com"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-dark-text mb-2">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-3 bg-dark-surface border border-dark-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all duration-200 text-dark-text"
            placeholder="••••••••"
          />
        </div>

        <div>
          <label htmlFor="confirm-password" className="block text-sm font-medium text-dark-text mb-2">
            Confirm password
          </label>
          <input
            id="confirm-password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="w-full px-4 py-3 bg-dark-surface border border-dark-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all duration-200 text-dark-text"
            placeholder="••••••••"
          />
          {passwordError && (
            <p className="mt-2 text-sm text-red-500">{passwordError}</p>
          )}
        </div>

        <div>
          <div className="flex items-center">
            <input
              id="agree-terms"
              type="checkbox"
              checked={agreeToTerms}
              onChange={(e) => setAgreeToTerms(e.target.checked)}
              className="h-4 w-4 text-accent focus:ring-accent border-dark-border rounded"
            />
            <label htmlFor="agree-terms" className="ml-2 block text-sm text-dark-text">
              I agree to the{' '}
              <a href="#" className="text-accent hover:text-accent/80 transition-colors duration-200">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="#" className="text-accent hover:text-accent/80 transition-colors duration-200">
                Privacy Policy
              </a>
            </label>
          </div>
          {termsError && (
            <p className="mt-2 text-sm text-red-500">{termsError}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex items-center justify-center px-4 py-3 bg-accent hover:bg-accent/90 text-white rounded-lg transition-colors duration-200 font-medium disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Creating account...
            </>
          ) : (
            'Create account'
          )}
        </button>

        {onSignIn && (
          <div className="text-center mt-6">
            <p className="text-dark-muted">
              Already have an account?{' '}
              <button
                type="button"
                onClick={onSignIn}
                className="text-accent hover:text-accent/80 transition-colors duration-200"
              >
                Sign in
              </button>
            </p>
          </div>
        )}
      </form>
    </div>
  )
}

export default Signup

