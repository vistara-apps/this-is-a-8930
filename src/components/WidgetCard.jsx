import React, { useState } from 'react'
import { MoreVertical, TrendingUp, TrendingDown, BarChart3, LineChart, PieChart } from 'lucide-react'
import { LineChart as RechartsLineChart, Line, BarChart as RechartsBarChart, Bar, PieChart as RechartsPieChart, Cell, XAxis, YAxis, ResponsiveContainer } from 'recharts'

const WidgetCard = ({ widget, isEditing }) => {
  const [isLoading, setIsLoading] = useState(false)

  // Mock data for charts
  const lineData = [
    { name: 'Jan', value: 4000 },
    { name: 'Feb', value: 3000 },
    { name: 'Mar', value: 5000 },
    { name: 'Apr', value: 4500 },
    { name: 'May', value: 6000 },
    { name: 'Jun', value: 5500 }
  ]

  const barData = [
    { name: 'Organic', value: 4000 },
    { name: 'Direct', value: 3000 },
    { name: 'Social', value: 2000 },
    { name: 'Email', value: 2780 },
    { name: 'Ads', value: 1890 }
  ]

  const pieData = [
    { name: 'Desktop', value: 60, color: '#8b5cf6' },
    { name: 'Mobile', value: 30, color: '#06b6d4' },
    { name: 'Tablet', value: 10, color: '#10b981' }
  ]

  const renderChart = () => {
    switch (widget.chartType) {
      case 'line':
        return (
          <ResponsiveContainer width="100%" height={120}>
            <RechartsLineChart data={lineData}>
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="#8b5cf6" 
                strokeWidth={2}
                dot={false}
              />
              <XAxis hide />
              <YAxis hide />
            </RechartsLineChart>
          </ResponsiveContainer>
        )
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={120}>
            <RechartsBarChart data={barData}>
              <Bar dataKey="value" fill="#8b5cf6" radius={[2, 2, 0, 0]} />
              <XAxis hide />
              <YAxis hide />
            </RechartsBarChart>
          </ResponsiveContainer>
        )
      case 'doughnut':
        return (
          <ResponsiveContainer width="100%" height={120}>
            <RechartsPieChart>
              <RechartsPieChart
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={30}
                outerRadius={50}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </RechartsPieChart>
            </RechartsPieChart>
          </ResponsiveContainer>
        )
      default:
        return (
          <div className="flex items-center justify-center h-32 text-dark-muted">
            <BarChart3 className="w-8 h-8" />
          </div>
        )
    }
  }

  const getChangeIcon = () => {
    if (widget.changeType === 'positive') {
      return <TrendingUp className="w-4 h-4 text-green-400" />
    } else if (widget.changeType === 'negative') {
      return <TrendingDown className="w-4 h-4 text-red-400" />
    }
    return null
  }

  const getChangeColor = () => {
    if (widget.changeType === 'positive') return 'text-green-400'
    if (widget.changeType === 'negative') return 'text-red-400'
    return 'text-dark-muted'
  }

  if (isLoading) {
    return (
      <div className="bg-dark-surface border border-dark-border rounded-lg p-6 animate-pulse">
        <div className="flex items-center justify-between mb-4">
          <div className="h-4 bg-dark-border rounded w-1/2"></div>
          <div className="h-4 w-4 bg-dark-border rounded"></div>
        </div>
        <div className="h-8 bg-dark-border rounded w-1/3 mb-2"></div>
        <div className="h-4 bg-dark-border rounded w-1/4"></div>
      </div>
    )
  }

  return (
    <div className="bg-dark-surface border border-dark-border rounded-lg p-6 hover:border-accent/30 transition-all duration-200 widget-gradient group">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-dark-muted">{widget.title}</h3>
        {isEditing && (
          <button className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-1 hover:bg-dark-border rounded">
            <MoreVertical className="w-4 h-4 text-dark-muted" />
          </button>
        )}
      </div>

      {widget.type === 'metric' ? (
        <div>
          <div className="text-2xl font-bold text-dark-text mb-1">{widget.value}</div>
          {widget.change && (
            <div className={`flex items-center space-x-1 text-sm ${getChangeColor()}`}>
              {getChangeIcon()}
              <span>{widget.change}</span>
            </div>
          )}
        </div>
      ) : (
        <div>
          {renderChart()}
        </div>
      )}
    </div>
  )
}

export default WidgetCard