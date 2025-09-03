/**
 * PasswordReset Component
 * 
 * This component provides a form for users to reset their password.
 */

import React, { useState } from 'react'
import { useAuth } from '../../context/AuthContext'

const PasswordReset = ({ onSuccess, onCancel }) => {
  const { resetPassword, isLoading, error, clearError } = useAuth()
  const [email, setEmail] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    clearError()
    
    try {
      await resetPassword(email)
      setIsSubmitted(true)
      
      if (onSuccess) {
        onSuccess(email)
      }
    } catch (err) {
      // Error is handled by the auth context
    }
  }

  if (isSubmitted) {
    return (
      <div className="w-full max-w-md mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
          <h1 className="text-2xl font-bold text-dark-text">Check your email</h1>
          <p className="text-dark-muted mt-2">
            We've sent a password reset link to <span className="text-dark-text font-medium">{email}</span>
          </p>
        </div>
        
        <div className="text-center">
          <p className="text-dark-muted mb-6">
            Didn't receive the email? Check your spam folder or try again.
          </p>
          
          <div className="flex flex-col space-y-4">
            <button
              type="button"
              onClick={() => setIsSubmitted(false)}
              className="w-full px-4 py-3 bg-dark-border/50 hover:bg-dark-border text-dark-text rounded-lg transition-colors duration-200 font-medium"
            >
              Try again
            </button>
            
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="text-dark-muted hover:text-dark-text transition-colors duration-200"
              >
                Back to sign in
              </button>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-accent to-primary rounded-xl flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
            </svg>
          </div>
        </div>
        <h1 className="text-2xl font-bold text-dark-text">Reset your password</h1>
        <p className="text-dark-muted mt-2">
          Enter your email address and we'll send you a link to reset your password
        </p>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-500 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
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
              Sending reset link...
            </>
          ) : (
            'Send reset link'
          )}
        </button>

        {onCancel && (
          <div className="text-center mt-6">
            <button
              type="button"
              onClick={onCancel}
              className="text-dark-muted hover:text-dark-text transition-colors duration-200"
            >
              Back to sign in
            </button>
          </div>
        )}
      </form>
    </div>
  )
}

export default PasswordReset

