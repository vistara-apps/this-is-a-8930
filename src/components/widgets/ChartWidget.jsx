/**
 * ChartWidget Component
 * 
 * This component displays a chart widget with various chart types.
 */

import React, { useState } from 'react'
import { MoreHorizontal, Edit, Trash2, RefreshCw, BarChart2, LineChart, PieChart } from 'lucide-react'

const ChartWidget = ({ widget, onEdit, onDelete }) => {
  const [showMenu, setShowMenu] = useState(false)
  
  const { title, chart_type, data, visualization_config } = widget
  
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
        <div className="flex items-center justify-center h-48">
          <div className="animate-pulse">
            <div className="h-32 w-full bg-dark-border rounded"></div>
          </div>
        </div>
      </div>
    )
  }
  
  // Render the chart based on the chart type
  const renderChart = () => {
    switch (chart_type) {
      case 'line':
        return renderLineChart()
      case 'bar':
        return renderBarChart()
      case 'pie':
      case 'doughnut':
        return renderPieChart()
      default:
        return <div>Unsupported chart type: {chart_type}</div>
    }
  }
  
  // Render a line chart
  const renderLineChart = () => {
    const { labels, datasets } = data
    const { colors, showGrid, fillOpacity } = visualization_config || {}
    
    // Calculate the maximum value for scaling
    const maxValue = Math.max(...datasets.flatMap(dataset => dataset.data))
    const scale = maxValue > 0 ? 100 / maxValue : 1
    
    return (
      <div className="h-48 relative">
        {/* Grid lines */}
        {showGrid && (
          <div className="absolute inset-0 flex flex-col justify-between">
            {[0, 1, 2, 3].map(i => (
              <div key={i} className="border-t border-dark-border/30 h-0"></div>
            ))}
          </div>
        )}
        
        {/* Chart */}
        <div className="absolute inset-0 flex items-end">
          {datasets.map((dataset, datasetIndex) => (
            <div key={datasetIndex} className="flex-1 h-full relative">
              <svg className="w-full h-full" viewBox={`0 0 ${labels.length - 1} 100`} preserveAspectRatio="none">
                {/* Line */}
                <polyline
                  points={dataset.data.map((value, i) => `${i}, ${100 - value * scale}`).join(' ')}
                  fill="none"
                  stroke={colors?.[datasetIndex % colors.length] || '#6366f1'}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                
                {/* Fill */}
                <polygon
                  points={`0,100 ${dataset.data.map((value, i) => `${i},${100 - value * scale}`).join(' ')} ${labels.length - 1},100`}
                  fill={colors?.[datasetIndex % colors.length] || '#6366f1'}
                  fillOpacity={fillOpacity || 0.1}
                />
              </svg>
            </div>
          ))}
        </div>
        
        {/* X-axis labels */}
        <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-dark-muted">
          {labels.filter((_, i) => i % Math.ceil(labels.length / 5) === 0).map((label, i) => (
            <div key={i} className="text-center">
              {typeof label === 'string' && label.includes('-') ? label.split('-').pop() : label}
            </div>
          ))}
        </div>
      </div>
    )
  }
  
  // Render a bar chart
  const renderBarChart = () => {
    const { labels, datasets } = data
    const { colors, showGrid, stacked, horizontal } = visualization_config || {}
    
    // Calculate the maximum value for scaling
    const maxValue = Math.max(...datasets.flatMap(dataset => dataset.data))
    const scale = maxValue > 0 ? 100 / maxValue : 1
    
    return (
      <div className="h-48 relative">
        {/* Grid lines */}
        {showGrid && (
          <div className="absolute inset-0 flex flex-col justify-between">
            {[0, 1, 2, 3].map(i => (
              <div key={i} className="border-t border-dark-border/30 h-0"></div>
            ))}
          </div>
        )}
        
        {/* Chart */}
        <div className="absolute inset-0 flex items-end pt-4 pb-6">
          {labels.map((label, labelIndex) => (
            <div key={labelIndex} className="flex-1 h-full flex flex-col justify-end items-center">
              {datasets.map((dataset, datasetIndex) => {
                const value = dataset.data[labelIndex] || 0
                const height = `${value * scale}%`
                
                return (
                  <div
                    key={datasetIndex}
                    className="w-2/3 mx-auto"
                    style={{
                      height,
                      backgroundColor: colors?.[datasetIndex % colors.length] || '#6366f1',
                      marginBottom: stacked && datasetIndex > 0 ? 0 : undefined
                    }}
                  ></div>
                )
              })}
            </div>
          ))}
        </div>
        
        {/* X-axis labels */}
        <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-dark-muted">
          {labels.filter((_, i) => i % Math.ceil(labels.length / 5) === 0).map((label, i) => (
            <div key={i} className="text-center">
              {typeof label === 'string' && label.includes('-') ? label.split('-').pop() : label}
            </div>
          ))}
        </div>
      </div>
    )
  }
  
  // Render a pie chart
  const renderPieChart = () => {
    const { labels, datasets } = data
    const { colors, innerRadius, showLabels } = visualization_config || {}
    
    // Calculate the total value
    const total = datasets[0]?.data.reduce((sum, value) => sum + value, 0) || 0
    
    // Calculate the segments
    const segments = []
    let currentAngle = 0
    
    datasets[0]?.data.forEach((value, i) => {
      const angle = (value / total) * 360
      segments.push({
        value,
        startAngle: currentAngle,
        endAngle: currentAngle + angle,
        color: colors?.[i % colors.length] || '#6366f1',
        label: labels[i]
      })
      currentAngle += angle
    })
    
    return (
      <div className="h-48 flex items-center justify-center">
        <div className="relative" style={{ width: '120px', height: '120px' }}>
          <svg viewBox="0 0 100 100">
            {segments.map((segment, i) => {
              const startX = 50 + 50 * Math.cos((segment.startAngle - 90) * Math.PI / 180)
              const startY = 50 + 50 * Math.sin((segment.startAngle - 90) * Math.PI / 180)
              const endX = 50 + 50 * Math.cos((segment.endAngle - 90) * Math.PI / 180)
              const endY = 50 + 50 * Math.sin((segment.endAngle - 90) * Math.PI / 180)
              
              const largeArcFlag = segment.endAngle - segment.startAngle <= 180 ? '0' : '1'
              
              // For doughnut chart
              const innerStartX = 50 + (innerRadius || 0) * 50 * Math.cos((segment.startAngle - 90) * Math.PI / 180)
              const innerStartY = 50 + (innerRadius || 0) * 50 * Math.sin((segment.startAngle - 90) * Math.PI / 180)
              const innerEndX = 50 + (innerRadius || 0) * 50 * Math.cos((segment.endAngle - 90) * Math.PI / 180)
              const innerEndY = 50 + (innerRadius || 0) * 50 * Math.sin((segment.endAngle - 90) * Math.PI / 180)
              
              let path
              
              if (chart_type === 'doughnut' && innerRadius) {
                path = `
                  M ${startX} ${startY}
                  A 50 50 0 ${largeArcFlag} 1 ${endX} ${endY}
                  L ${innerEndX} ${innerEndY}
                  A ${innerRadius * 50} ${innerRadius * 50} 0 ${largeArcFlag} 0 ${innerStartX} ${innerStartY}
                  Z
                `
              } else {
                path = `
                  M 50 50
                  L ${startX} ${startY}
                  A 50 50 0 ${largeArcFlag} 1 ${endX} ${endY}
                  Z
                `
              }
              
              return (
                <path
                  key={i}
                  d={path}
                  fill={segment.color}
                />
              )
            })}
          </svg>
        </div>
        
        {/* Legend */}
        {visualization_config?.showLegend && (
          <div className="ml-4 text-xs">
            {segments.map((segment, i) => (
              <div key={i} className="flex items-center mb-1">
                <div
                  className="w-3 h-3 mr-2"
                  style={{ backgroundColor: segment.color }}
                ></div>
                <div className="text-dark-text">{segment.label}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    )
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
      
      {renderChart()}
      
      {/* Legend for line and bar charts */}
      {(chart_type === 'line' || chart_type === 'bar') && visualization_config?.showLegend && data.datasets.length > 1 && (
        <div className="mt-4 flex flex-wrap justify-center">
          {data.datasets.map((dataset, i) => (
            <div key={i} className="flex items-center mr-4 mb-2">
              <div
                className="w-3 h-3 mr-2"
                style={{ backgroundColor: visualization_config?.colors?.[i % visualization_config.colors.length] || '#6366f1' }}
              ></div>
              <div className="text-xs text-dark-text">{dataset.label}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default ChartWidget

