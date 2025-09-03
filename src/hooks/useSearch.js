/**
 * useSearch Hook
 * 
 * This hook provides methods for searching and filtering data points.
 */

import { useState, useCallback, useEffect } from 'react'
import { useApp } from '../context/AppContext'

const useSearch = () => {
  const { searchQuery, selectedFilters, searchDataPoints } = useApp()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [results, setResults] = useState([])
  const [totalResults, setTotalResults] = useState(0)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  /**
   * Search for data points
   * @param {string} query - The search query
   * @param {Object} filters - The filters to apply
   * @param {number} page - The page number
   * @param {number} pageSize - The page size
   * @returns {Promise<Object>} The search results
   */
  const search = useCallback(async (query, filters = {}, page = 1, pageSize = 10) => {
    setIsLoading(true)
    setError(null)
    
    try {
      // Convert date range filter to actual dates
      let dateRange = {}
      
      if (filters.dateRange) {
        const now = new Date()
        let startDate = new Date()
        
        switch (filters.dateRange) {
          case 'today':
            startDate = new Date(now.setHours(0, 0, 0, 0))
            break
          case 'yesterday':
            startDate = new Date(now.setDate(now.getDate() - 1))
            startDate.setHours(0, 0, 0, 0)
            break
          case 'last-7-days':
            startDate = new Date(now.setDate(now.getDate() - 7))
            break
          case 'last-30-days':
            startDate = new Date(now.setDate(now.getDate() - 30))
            break
          case 'last-90-days':
            startDate = new Date(now.setDate(now.getDate() - 90))
            break
          case 'this-month':
            startDate = new Date(now.getFullYear(), now.getMonth(), 1)
            break
          case 'last-month':
            startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1)
            break
          case 'this-year':
            startDate = new Date(now.getFullYear(), 0, 1)
            break
          case 'custom':
            // Custom date range should be provided in filters.customDateRange
            if (filters.customDateRange) {
              dateRange = filters.customDateRange
            }
            break
          default:
            startDate = new Date(now.setDate(now.getDate() - 30))
        }
        
        if (!filters.customDateRange) {
          dateRange = {
            start: startDate.toISOString(),
            end: now.toISOString()
          }
        }
      }
      
      // Search data points
      const searchResults = await searchDataPoints(query, {
        ...filters,
        date_range: dateRange
      })
      
      // Calculate pagination
      const total = searchResults.length
      const paginatedResults = searchResults.slice((page - 1) * pageSize, page * pageSize)
      
      setResults(paginatedResults)
      setTotalResults(total)
      setPage(page)
      setPageSize(pageSize)
      setIsLoading(false)
      
      return {
        results: paginatedResults,
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize)
      }
    } catch (err) {
      setError(err.message || 'Failed to search data points')
      setIsLoading(false)
      throw err
    }
  }, [searchDataPoints])

  /**
   * Change the page
   * @param {number} newPage - The new page number
   */
  const changePage = useCallback((newPage) => {
    setPage(newPage)
  }, [])

  /**
   * Change the page size
   * @param {number} newPageSize - The new page size
   */
  const changePageSize = useCallback((newPageSize) => {
    setPageSize(newPageSize)
    setPage(1) // Reset to first page when changing page size
  }, [])

  /**
   * Clear the search results
   */
  const clearResults = useCallback(() => {
    setResults([])
    setTotalResults(0)
    setPage(1)
  }, [])

  /**
   * Clear the error
   */
  const clearError = useCallback(() => {
    setError(null)
  }, [])

  // Perform search when query or filters change
  useEffect(() => {
    if (searchQuery || Object.values(selectedFilters).some(value => value !== 'all')) {
      search(searchQuery, selectedFilters, page, pageSize)
    } else {
      clearResults()
    }
  }, [searchQuery, selectedFilters, page, pageSize, search, clearResults])

  return {
    isLoading,
    error,
    results,
    totalResults,
    page,
    pageSize,
    totalPages: Math.ceil(totalResults / pageSize),
    search,
    changePage,
    changePageSize,
    clearResults,
    clearError
  }
}

export default useSearch
