/**
 * ExploreDataView Component
 * 
 * This component allows users to search and explore data from all connected data sources.
 */

import React, { useState, useEffect } from 'react'
import { useApp } from '../context/AppContext'
import useSearch from '../hooks/useSearch'
import LoadingIndicator from './common/LoadingIndicator'
import ErrorMessage from './common/ErrorMessage'
import { Search, Filter, ChevronDown, ChevronLeft, ChevronRight, Download, Plus } from 'lucide-react'

const ExploreDataView = () => {
  const { dataSources, searchQuery, setSearchQuery, selectedFilters, setSelectedFilters } = useApp()
  const { 
    results, 
    totalResults, 
    page, 
    pageSize, 
    totalPages, 
    isLoading, 
    error, 
    search, 
    changePage, 
    changePageSize, 
    clearError 
  } = useSearch()
  
  const [query, setQuery] = useState(searchQuery)
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState(selectedFilters)
  const [selectedResult, setSelectedResult] = useState(null)
  
  // Handle search
  const handleSearch = (e) => {
    e.preventDefault()
    setSearchQuery(query)
    setSelectedFilters(filters)
  }
  
  // Handle filter change
  const handleFilterChange = (name, value) => {
    setFilters(prev => ({ ...prev, [name]: value }))
  }
  
  // Handle result selection
  const handleResultSelect = (result) => {
    setSelectedResult(result === selectedResult ? null : result)
  }
  
  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleString()
  }
  
  // Export results to CSV
  const exportToCsv = () => {
    if (!results.length) return
    
    // Create CSV content
    const headers = Object.keys(results[0].data_payload).join(',')
    const rows = results.map(result => {
      return Object.values(result.data_payload)
        .map(value => {
          // Handle values that need to be quoted
          if (typeof value === 'string' && (value.includes(',') || value.includes('"') || value.includes('\n'))) {
            return `"${value.replace(/"/g, '""')}"`
          }
          return value
        })
        .join(',')
    }).join('\n')
    
    const csvContent = `${headers}\n${rows}`
    
    // Create and download the file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.setAttribute('href', url)
    link.setAttribute('download', `datanest-export-${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
  
  // Create a widget from the selected result
  const createWidget = () => {
    // This would open a modal to create a widget from the selected result
    alert('Create widget functionality would be implemented here')
  }
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-dark-text">Explore Data</h1>
        <p className="text-dark-muted mt-1">Search and explore data from all your connected sources</p>
      </div>
      
      {/* Search form */}
      <div className="bg-dark-surface border border-dark-border rounded-lg p-6">
        <form onSubmit={handleSearch}>
          <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-dark-muted" />
              </div>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search data across all sources..."
                className="block w-full pl-10 pr-4 py-3 bg-dark-bg border border-dark-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all duration-200 text-dark-text"
              />
            </div>
            <div className="flex items-center space-x-4">
              <button
                type="button"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center px-4 py-3 bg-dark-border/50 hover:bg-dark-border text-dark-text rounded-lg transition-colors duration-200"
              >
                <Filter className="w-5 h-5 mr-2" />
                Filters
                <ChevronDown className={`w-5 h-5 ml-2 transition-transform duration-200 ${showFilters ? 'rotate-180' : ''}`} />
              </button>
              <button
                type="submit"
                className="px-4 py-3 bg-accent hover:bg-accent/90 text-white rounded-lg transition-colors duration-200"
              >
                Search
              </button>
            </div>
          </div>
          
          {/* Filters */}
          {showFilters && (
            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="date-range" className="block text-sm font-medium text-dark-text mb-2">
                  Date Range
                </label>
                <select
                  id="date-range"
                  value={filters.dateRange}
                  onChange={(e) => handleFilterChange('dateRange', e.target.value)}
                  className="block w-full px-4 py-2 bg-dark-bg border border-dark-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all duration-200 text-dark-text"
                >
                  <option value="all">All Time</option>
                  <option value="today">Today</option>
                  <option value="yesterday">Yesterday</option>
                  <option value="last-7-days">Last 7 Days</option>
                  <option value="last-30-days">Last 30 Days</option>
                  <option value="last-90-days">Last 90 Days</option>
                  <option value="this-month">This Month</option>
                  <option value="last-month">Last Month</option>
                  <option value="this-year">This Year</option>
                  <option value="custom">Custom Range</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="source" className="block text-sm font-medium text-dark-text mb-2">
                  Data Source
                </label>
                <select
                  id="source"
                  value={filters.source}
                  onChange={(e) => handleFilterChange('source', e.target.value)}
                  className="block w-full px-4 py-2 bg-dark-bg border border-dark-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all duration-200 text-dark-text"
                >
                  <option value="all">All Sources</option>
                  {dataSources.map(source => (
                    <option key={source.id} value={source.id}>
                      {source.type}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-dark-text mb-2">
                  Category
                </label>
                <select
                  id="category"
                  value={filters.category}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                  className="block w-full px-4 py-2 bg-dark-bg border border-dark-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all duration-200 text-dark-text"
                >
                  <option value="all">All Categories</option>
                  <option value="traffic">Traffic</option>
                  <option value="revenue">Revenue</option>
                  <option value="customers">Customers</option>
                  <option value="marketing">Marketing</option>
                  <option value="sales">Sales</option>
                </select>
              </div>
            </div>
          )}
        </form>
      </div>
      
      {/* Error message */}
      {error && (
        <ErrorMessage
          message={error}
          onRetry={clearError}
        />
      )}
      
      {/* Results */}
      <div className="bg-dark-surface border border-dark-border rounded-lg overflow-hidden">
        <div className="p-4 border-b border-dark-border flex items-center justify-between">
          <h2 className="font-medium text-dark-text">
            {isLoading ? 'Searching...' : totalResults > 0 ? `${totalResults} results found` : 'No results found'}
          </h2>
          
          {totalResults > 0 && (
            <div className="flex items-center space-x-2">
              <button
                onClick={exportToCsv}
                className="flex items-center px-3 py-1 bg-dark-border/50 hover:bg-dark-border text-dark-text rounded-lg transition-colors duration-200 text-sm"
              >
                <Download className="w-4 h-4 mr-1" />
                Export
              </button>
            </div>
          )}
        </div>
        
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <LoadingIndicator size="lg" message="Searching..." />
          </div>
        ) : totalResults === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center p-6">
            <Search className="w-12 h-12 text-dark-muted mb-4" />
            <h3 className="text-lg font-medium text-dark-text mb-2">No results found</h3>
            <p className="text-dark-muted max-w-md">
              Try adjusting your search query or filters to find what you're looking for.
            </p>
          </div>
        ) : (
          <div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-dark-border/30">
                    <th className="text-left text-xs font-medium text-dark-muted uppercase tracking-wider px-6 py-3">
                      Source
                    </th>
                    <th className="text-left text-xs font-medium text-dark-muted uppercase tracking-wider px-6 py-3">
                      Timestamp
                    </th>
                    <th className="text-left text-xs font-medium text-dark-muted uppercase tracking-wider px-6 py-3">
                      Type
                    </th>
                    <th className="text-left text-xs font-medium text-dark-muted uppercase tracking-wider px-6 py-3">
                      Preview
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-dark-border">
                  {results.map((result, index) => {
                    const source = dataSources.find(ds => ds.id === result.data_source_id)
                    const isSelected = selectedResult === result
                    
                    return (
                      <React.Fragment key={result.id}>
                        <tr
                          className={`hover:bg-dark-border/10 cursor-pointer ${isSelected ? 'bg-dark-border/10' : ''}`}
                          onClick={() => handleResultSelect(result)}
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <span className="text-xl mr-2">{source?.icon || '📁'}</span>
                              <span className="text-dark-text">{source?.type || 'Unknown'}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-dark-text">
                            {formatDate(result.timestamp)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-dark-text">
                            {result.data_payload.type || result.data_payload.eventType || 'Data Point'}
                          </td>
                          <td className="px-6 py-4 text-dark-muted truncate max-w-xs">
                            {JSON.stringify(result.data_payload).substring(0, 50)}...
                          </td>
                        </tr>
                        
                        {isSelected && (
                          <tr>
                            <td colSpan="4" className="px-6 py-4 bg-dark-border/5">
                              <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                  <h3 className="font-medium text-dark-text">Data Point Details</h3>
                                  <div className="flex items-center space-x-2">
                                    <button
                                      onClick={createWidget}
                                      className="flex items-center px-3 py-1 bg-accent hover:bg-accent/90 text-white rounded-lg transition-colors duration-200 text-sm"
                                    >
                                      <Plus className="w-4 h-4 mr-1" />
                                      Create Widget
                                    </button>
                                  </div>
                                </div>
                                <div className="bg-dark-bg rounded-lg p-4 overflow-x-auto">
                                  <pre className="text-sm text-dark-text">
                                    {JSON.stringify(result.data_payload, null, 2)}
                                  </pre>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    )
                  })}
                </tbody>
              </table>
            </div>
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-6 py-4 border-t border-dark-border">
                <div className="text-sm text-dark-muted">
                  Showing {(page - 1) * pageSize + 1} to {Math.min(page * pageSize, totalResults)} of {totalResults} results
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => changePage(page - 1)}
                    disabled={page === 1}
                    className="p-1 text-dark-muted hover:text-dark-text hover:bg-dark-border/50 rounded transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <span className="text-dark-text">
                    {page} / {totalPages}
                  </span>
                  <button
                    onClick={() => changePage(page + 1)}
                    disabled={page === totalPages}
                    className="p-1 text-dark-muted hover:text-dark-text hover:bg-dark-border/50 rounded transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default ExploreDataView

