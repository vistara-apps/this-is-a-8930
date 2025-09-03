import React, { useState } from 'react'
import { ChevronDown } from 'lucide-react'

const DataFilter = ({ label, value, onChange, options, variant = "dropdown" }) => {
  const [isOpen, setIsOpen] = useState(false)

  const selectedOption = options.find(opt => opt.value === value)

  const handleSelect = (optionValue) => {
    onChange(optionValue)
    setIsOpen(false)
  }

  if (variant === "dropdown") {
    return (
      <div className="relative">
        <label className="block text-sm font-medium text-dark-text mb-2">
          {label}
        </label>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between px-3 py-2 border border-dark-border bg-dark-surface text-dark-text rounded-lg hover:border-accent/50 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all duration-200"
        >
          <span>{selectedOption?.label || 'Select...'}</span>
          <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-dark-surface border border-dark-border rounded-lg shadow-dark-modal z-10 max-h-48 overflow-auto">
            {options.map((option) => (
              <button
                key={option.value}
                onClick={() => handleSelect(option.value)}
                className={`w-full text-left px-3 py-2 hover:bg-dark-border/50 transition-colors duration-200 first:rounded-t-lg last:rounded-b-lg ${
                  value === option.value ? 'bg-accent/20 text-accent' : 'text-dark-text'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div>
      <label className="block text-sm font-medium text-dark-text mb-2">
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 border border-dark-border bg-dark-surface text-dark-text rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all duration-200"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  )
}

export default DataFilter