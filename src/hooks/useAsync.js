/**
 * useAsync Hook
 * 
 * This hook provides a way to handle asynchronous operations with loading and error states.
 */

import { useState, useCallback } from 'react'

const useAsync = (asyncFunction) => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [data, setData] = useState(null)

  /**
   * Execute the async function
   * @param {...any} args - The arguments to pass to the async function
   * @returns {Promise<any>} The result of the async function
   */
  const execute = useCallback(async (...args) => {
    setIsLoading(true)
    setError(null)
    
    try {
      const result = await asyncFunction(...args)
      setData(result)
      setIsLoading(false)
      return result
    } catch (err) {
      setError(err.message || 'An error occurred')
      setIsLoading(false)
      throw err
    }
  }, [asyncFunction])

  /**
   * Reset the state
   */
  const reset = useCallback(() => {
    setIsLoading(false)
    setError(null)
    setData(null)
  }, [])

  /**
   * Clear the error
   */
  const clearError = useCallback(() => {
    setError(null)
  }, [])

  return {
    isLoading,
    error,
    data,
    execute,
    reset,
    clearError
  }
}

export default useAsync

