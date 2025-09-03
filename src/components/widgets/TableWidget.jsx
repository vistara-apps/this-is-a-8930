/**
 * TableWidget Component
 * 
 * This component displays a table widget with data in a tabular format.
 */

import React, { useState } from 'react'
import { MoreHorizontal, Edit, Trash2, RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react'

const TableWidget = ({ widget, onEdit, onDelete }) => {
  const [showMenu, setShowMenu] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  
  const { title, data, visualization_config } = widget
  
  // Render a placeholder if no data is available
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
        <div className="animate-pulse">
          <div className="h-8 bg-dark-border rounded mb-2"></div>
          <div className="space-y-2">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-6 bg-dark-border rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }
  
  const { columns, rows } = data
  const { showHeader, striped, bordered, compact, pagination, pageSize = 5 } = visualization_config || {}
  
  // Calculate pagination
  const totalPages = pagination ? Math.ceil(rows.length / pageSize) : 1
  const paginatedRows = pagination
    ? rows.slice((currentPage - 1) * pageSize, currentPage * pageSize)
    : rows
  
  // Format a cell value based on its type
  const formatCellValue = (value, type) => {
    if (value === null || value === undefined) return 'N/A'
    
    switch (type) {
      case 'number':
        return Number(value).toLocaleString()
      case 'currency':
        return Number(value).toLocaleString(undefined, {
          style: 'currency',
          currency: 'USD',
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        })
      case 'percent':
        return `${(Number(value) * 100).toFixed(1)}%`
      case 'date':
        return new Date(value).toLocaleDateString()
      case 'datetime':
        return new Date(value).toLocaleString()
      case 'duration':
        const minutes = Math.floor(Number(value) / 60)
        const seconds = Math.floor(Number(value) % 60)
        return `${minutes}:${seconds.toString().padStart(2, '0')}`
      default:
        return String(value)
    }
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
      
      <div className="overflow-x-auto">
        <table className={`w-full ${bordered ? 'border border-dark-border' : ''}`}>
          {showHeader !== false && (
            <thead>
              <tr className="bg-dark-border/30">
                {columns.map((column, i) => (
                  <th
                    key={i}
                    className={`text-left text-xs font-medium text-dark-muted uppercase tracking-wider ${
                      bordered ? 'border border-dark-border' : ''
                    } ${compact ? 'px-2 py-1' : 'px-4 py-2'}`}
                  >
                    {column.label}
                  </th>
                ))}
              </tr>
            </thead>
          )}
          <tbody>
            {paginatedRows.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className={`${
                  striped && rowIndex % 2 === 1 ? 'bg-dark-border/10' : ''
                } ${bordered ? 'border border-dark-border' : ''}`}
              >
                {columns.map((column, colIndex) => (
                  <td
                    key={colIndex}
                    className={`text-sm text-dark-text ${
                      bordered ? 'border border-dark-border' : ''
                    } ${compact ? 'px-2 py-1' : 'px-4 py-2'}`}
                  >
                    {formatCellValue(row[column.id], column.type)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Pagination */}
      {pagination && totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <div className="text-xs text-dark-muted">
            Showing {(currentPage - 1) * pageSize + 1} to {Math.min(currentPage * pageSize, rows.length)} of {rows.length} entries
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="p-1 text-dark-muted hover:text-dark-text hover:bg-dark-border/50 rounded transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs text-dark-text">
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-1 text-dark-muted hover:text-dark-text hover:bg-dark-border/50 rounded transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default TableWidget

