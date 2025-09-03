/**
 * MetricWidget Component
 * 
 * This component displays a metric widget with a value and trend.
 */

import React, { useState } from 'react'
import { MoreHorizontal, Edit, Trash2, RefreshCw, ArrowUp, ArrowDown } from 'lucide-react'
import Tooltip from '../common/Tooltip'

const MetricWidget = ({ widget, onEdit, onDelete }) => {
  const [showMenu, setShowMenu] = useState(false)
  
  const { title, data, visualization_config } = widget
  
  if (!data) {
    return (
      <div className="bg-dark-surface border border-dark-border rounded-lg p-6 h-full">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium text-dark-text">{title}</h3>
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-1 text-dark-muted hover:text-dark-text hover:bg-dark-border/50 rounded transition-colors duration-200"
            >
              <MoreHorizontal className="w-4 h-4" />
            </button>
            
            {showMenu && (
              <div className="absolute right-0 z-10 mt-2 w-48 bg-dark-surface border border-dark-border rounded-lg shadow-dark-modal overflow-hidden">
                <div className="py-1">
                  <button
                    onClick={onEdit}
                    className="w-full text-left px-4 py-2 text-dark-text hover:bg-dark-border/50 transition-colors duration-200"
                  >
                    <Edit className="w-4 h-4 inline-block mr-2" />
                    Edit widget
                  </button>
                  <button
                    onClick={onDelete}
                    className="w-full text-left px-4 py-2 text-red-500 hover:bg-dark-border/50 transition-colors duration-200"
                  >
                    <Trash2 className="w-4 h-4 inline-block mr-2" />
                    Delete widget
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center justify-center h-24">
          <div className="animate-pulse">
            <div className="h-8 w-24 bg-dark-border rounded mb-2"></div>
            <div className="h-4 w-16 bg-dark-border rounded mx-auto"></div>
          </div>
        </div>
      </div>
    )
  }
  
  const { value, previousValue, change, changePercent, trend } = data
  
  // Format the value based on the visualization configuration
  const formatValue = (val) => {
    if (val === null || val === undefined) return 'N/A'
    
    const { format, prefix, suffix, decimals } = visualization_config || {}
    
    let formattedValue = val
    
    switch (format) {
      case 'number':
        formattedValue = Number(val).toLocaleString(undefined, {
          minimumFractionDigits: decimals || 0,
          maximumFractionDigits: decimals || 0
        })
        break
      case 'currency':
        formattedValue = Number(val).toLocaleString(undefined, {
          style: 'currency',
          currency: 'USD',
          minimumFractionDigits: decimals || 0,
          maximumFractionDigits: decimals || 0
        })
        break
      case 'percent':
        formattedValue = `${(Number(val) * 100).toLocaleString(undefined, {
          minimumFractionDigits: decimals || 1,
          maximumFractionDigits: decimals || 1
        })}%`
        break
      default:
        formattedValue = String(val)
    }
    
    return `${prefix || ''}${formattedValue}${suffix || ''}`
  }
  
  // Format the change percent
  const formatChangePercent = () => {
    return `${changePercent >= 0 ? '+' : ''}${changePercent.toFixed(1)}%`
  }
  
  // Get the change color
  const getChangeColor = () => {
    const { colorPositive, colorNegative } = visualization_config || {}
    return trend === 'up' ? colorPositive || 'text-green-500' : colorNegative || 'text-red-500'
  }
  
  return (
    <div className="bg-dark-surface border border-dark-border rounded-lg p-6 h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium text-dark-text">{title}</h3>
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-1 text-dark-muted hover:text-dark-text hover:bg-dark-border/50 rounded transition-colors duration-200"
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>
          
          {showMenu && (
            <div className="absolute right-0 z-10 mt-2 w-48 bg-dark-surface border border-dark-border rounded-lg shadow-dark-modal overflow-hidden">
              <div className="py-1">
                <button
                  onClick={onEdit}
                  className="w-full text-left px-4 py-2 text-dark-text hover:bg-dark-border/50 transition-colors duration-200"
                >
                  <Edit className="w-4 h-4 inline-block mr-2" />
                  Edit widget
                </button>
                <button
                  onClick={onDelete}
                  className="w-full text-left px-4 py-2 text-red-500 hover:bg-dark-border/50 transition-colors duration-200"
                >
                  <Trash2 className="w-4 h-4 inline-block mr-2" />
                  Delete widget
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="text-center">
        <div className="text-3xl font-bold text-dark-text mb-2">
          {formatValue(value)}
        </div>
        
        {visualization_config?.showChange && (
          <div className={`flex items-center justify-center text-sm ${getChangeColor()}`}>
            {trend === 'up' ? (
              <ArrowUp className="w-4 h-4 mr-1" />
            ) : (
              <ArrowDown className="w-4 h-4 mr-1" />
            )}
            <span>{formatChangePercent()}</span>
            <Tooltip
              content={`Previous value: ${formatValue(previousValue)}`}
              position="bottom"
            >
              <span className="ml-1 text-dark-muted">vs. previous</span>
            </Tooltip>
          </div>
        )}
      </div>
    </div>
  )
}

export default MetricWidget

