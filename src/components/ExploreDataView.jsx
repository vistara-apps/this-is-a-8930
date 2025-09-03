import React, { useState } from 'react'
import { useApp } from '../context/AppContext'
import SearchInput from './SearchInput'
import DataFilter from './DataFilter'
import { Search, Filter, Download, Eye } from 'lucide-react'

const ExploreDataView = () => {
  const { searchQuery, setSearchQuery, selectedFilters, setSelectedFilters } = useApp()
  const [showFilters, setShowFilters] = useState(false)

  // Mock search results
  const mockResults = [
    {
      id: 1,
      source: 'Google Analytics',
      type: 'pageview',
      timestamp: '2024-01-15T14:30:00Z',
      data: { page: '/dashboard', sessions: 142, duration: '2m 34s' },
      icon: '📊'
    },
    {
      id: 2,
      source: 'Stripe',
      type: 'payment',
      timestamp: '2024-01-15T14:25:00Z',
      data: { amount: '$299.00', customer: 'john@example.com', status: 'succeeded' },
      icon: '💳'
    },
    {
      id: 3,
      source: 'Google Analytics',
      type: 'event',
      timestamp: '2024-01-15T14:20:00Z',
      data: { event: 'button_click', element: 'signup_button', value: 1 },
      icon: '📊'
    },
    {
      id: 4,
      source: 'Stripe',
      type: 'subscription',
      timestamp: '2024-01-15T14:15:00Z',
      data: { plan: 'Pro Plan', customer: 'jane@example.com', status: 'active' },
      icon: '💳'
    }
  ]

  const filteredResults = mockResults.filter(result => {
    // Simple search filter
    if (searchQuery && !Object.values(result.data).some(value => 
      String(value).toLowerCase().includes(searchQuery.toLowerCase())
    )) {
      return false
    }

    // Source filter
    if (selectedFilters.source !== 'all' && result.source !== selectedFilters.source) {
      return false
    }

    return true
  })

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp)
    return date.toLocaleString()
  }

  const formatData = (data) => {
    return Object.entries(data).map(([key, value]) => (
      <span key={key} className="inline-block bg-dark-border/30 px-2 py-1 rounded text-xs mr-2 mb-1">
        <span className="text-dark-muted">{key}:</span>
        <span className="text-dark-text ml-1">{value}</span>
      </span>
    ))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-dark-text">Explore Data</h1>
          <p className="text-dark-muted mt-1">Search and analyze your aggregated data</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors duration-200 ${
              showFilters 
                ? 'bg-accent text-white' 
                : 'bg-dark-border/50 text-dark-text hover:bg-dark-border'
            }`}
          >
            <Filter className="w-4 h-4" />
            <span>Filters</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-2 bg-dark-border/50 text-dark-text hover:bg-dark-border rounded-lg transition-colors duration-200">
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="space-y-4">
        <SearchInput
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search across all your data..."
        />
        
        {showFilters && (
          <div className="bg-dark-surface border border-dark-border rounded-lg p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <DataFilter
                label="Data Source"
                value={selectedFilters.source}
                onChange={(value) => setSelectedFilters(prev => ({ ...prev, source: value }))}
                options={[
                  { value: 'all', label: 'All Sources' },
                  { value: 'Google Analytics', label: 'Google Analytics' },
                  { value: 'Stripe', label: 'Stripe' },
                  { value: 'HubSpot', label: 'HubSpot' }
                ]}
              />
              <DataFilter
                label="Date Range"
                value={selectedFilters.dateRange}
                onChange={(value) => setSelectedFilters(prev => ({ ...prev, dateRange: value }))}
                options={[
                  { value: 'last-7-days', label: 'Last 7 days' },
                  { value: 'last-30-days', label: 'Last 30 days' },
                  { value: 'last-90-days', label: 'Last 90 days' },
                  { value: 'custom', label: 'Custom range' }
                ]}
              />
              <DataFilter
                label="Category"
                value={selectedFilters.category}
                onChange={(value) => setSelectedFilters(prev => ({ ...prev, category: value }))}
                options={[
                  { value: 'all', label: 'All Categories' },
                  { value: 'pageview', label: 'Page Views' },
                  { value: 'payment', label: 'Payments' },
                  { value: 'event', label: 'Events' },
                  { value: 'subscription', label: 'Subscriptions' }
                ]}
              />
            </div>
          </div>
        )}
      </div>

      {/* Results */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-dark-text">
            Results ({filteredResults.length})
          </h2>
          <div className="text-sm text-dark-muted">
            Showing {filteredResults.length} of {mockResults.length} records
          </div>
        </div>

        <div className="space-y-3">
          {filteredResults.map((result) => (
            <div key={result.id} className="bg-dark-surface border border-dark-border rounded-lg p-4 hover:border-accent/30 transition-colors duration-200">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <span className="text-xl">{result.icon}</span>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-dark-text">{result.source}</span>
                      <span className="text-sm bg-accent/20 text-accent px-2 py-1 rounded">
                        {result.type}
                      </span>
                    </div>
                    <div className="text-sm text-dark-muted mt-1">
                      {formatTimestamp(result.timestamp)}
                    </div>
                  </div>
                </div>
                <button className="p-2 hover:bg-dark-border rounded-lg transition-colors duration-200">
                  <Eye className="w-4 h-4 text-dark-muted" />
                </button>
              </div>
              
              <div className="flex flex-wrap">
                {formatData(result.data)}
              </div>
            </div>
          ))}
        </div>

        {filteredResults.length === 0 && (
          <div className="text-center py-12">
            <Search className="w-12 h-12 text-dark-muted mx-auto mb-4" />
            <h3 className="text-lg font-medium text-dark-text mb-2">No results found</h3>
            <p className="text-dark-muted">Try adjusting your search query or filters</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default ExploreDataView