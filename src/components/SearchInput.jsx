import React from 'react'
import { Search, X } from 'lucide-react'

const SearchInput = ({ value, onChange, placeholder = "Search..." }) => {
  const handleClear = () => {
    onChange('')
  }

  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search className="h-5 w-5 text-dark-muted" />
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="block w-full pl-10 pr-10 py-3 border border-dark-border bg-dark-surface text-dark-text placeholder-dark-muted rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all duration-200"
      />
      {value && (
        <button
          onClick={handleClear}
          className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-dark-text transition-colors duration-200"
        >
          <X className="h-5 w-5 text-dark-muted" />
        </button>
      )}
    </div>
  )
}

export default SearchInput