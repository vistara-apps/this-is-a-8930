/**
 * Dashboard Model
 * 
 * This model represents a dashboard in the application.
 */

import { v4 as uuidv4 } from 'uuid'
import Widget from './Widget'

class Dashboard {
  /**
   * Create a new Dashboard instance
   * @param {Object} data - The dashboard data
   * @returns {Dashboard} A new Dashboard instance
   */
  static create(data) {
    return {
      id: data.id || uuidv4(),
      user_id: data.user_id,
      name: data.name || 'New Dashboard',
      description: data.description || '',
      layout_config: data.layout_config || {
        columns: 12,
        rowHeight: 50,
        margin: [16, 16]
      },
      widgets: data.widgets || [],
      created_at: data.created_at || new Date().toISOString(),
      updated_at: data.updated_at || new Date().toISOString()
    }
  }

  /**
   * Generate a default dashboard
   * @param {string} userId - The user ID
   * @returns {Dashboard} A default dashboard
   */
  static generateDefaultDashboard(userId) {
    const dashboard = this.create({
      user_id: userId,
      name: 'Main Dashboard',
      description: 'Your main dashboard with key metrics'
    })
    
    // Add default widgets
    const widgets = [
      Widget.create({
        dashboard_id: dashboard.id,
        type: 'metric',
        title: 'Active Users',
        data_source_type: 'Google Analytics',
        data_query: {
          metric: 'activeUsers',
          period: 'last-30-days'
        },
        position: { x: 0, y: 0, w: 3, h: 2 }
      }),
      Widget.create({
        dashboard_id: dashboard.id,
        type: 'metric',
        title: 'Page Views',
        data_source_type: 'Google Analytics',
        data_query: {
          metric: 'pageViews',
          period: 'last-30-days'
        },
        position: { x: 3, y: 0, w: 3, h: 2 }
      }),
      Widget.create({
        dashboard_id: dashboard.id,
        type: 'metric',
        title: 'Monthly Revenue',
        data_source_type: 'Stripe',
        data_query: {
          metric: 'mrr',
          period: 'last-30-days'
        },
        position: { x: 6, y: 0, w: 3, h: 2 }
      }),
      Widget.create({
        dashboard_id: dashboard.id,
        type: 'metric',
        title: 'Open Deals',
        data_source_type: 'HubSpot',
        data_query: {
          metric: 'openDeals',
          period: 'current'
        },
        position: { x: 9, y: 0, w: 3, h: 2 }
      }),
      Widget.create({
        dashboard_id: dashboard.id,
        type: 'chart',
        chart_type: 'line',
        title: 'Traffic Over Time',
        data_source_type: 'Google Analytics',
        data_query: {
          metrics: ['sessions'],
          dimensions: ['date'],
          period: 'last-30-days'
        },
        position: { x: 0, y: 2, w: 6, h: 4 }
      }),
      Widget.create({
        dashboard_id: dashboard.id,
        type: 'chart',
        chart_type: 'bar',
        title: 'Revenue by Day',
        data_source_type: 'Stripe',
        data_query: {
          metrics: ['revenue'],
          dimensions: ['date'],
          period: 'last-30-days'
        },
        position: { x: 6, y: 2, w: 6, h: 4 }
      }),
      Widget.create({
        dashboard_id: dashboard.id,
        type: 'chart',
        chart_type: 'pie',
        title: 'Traffic Sources',
        data_source_type: 'Google Analytics',
        data_query: {
          metrics: ['sessions'],
          dimensions: ['source'],
          period: 'last-30-days'
        },
        position: { x: 0, y: 6, w: 4, h: 4 }
      }),
      Widget.create({
        dashboard_id: dashboard.id,
        type: 'chart',
        chart_type: 'doughnut',
        title: 'Deal Stages',
        data_source_type: 'HubSpot',
        data_query: {
          metrics: ['deals'],
          dimensions: ['dealstage'],
          period: 'current'
        },
        position: { x: 4, y: 6, w: 4, h: 4 }
      }),
      Widget.create({
        dashboard_id: dashboard.id,
        type: 'chart',
        chart_type: 'bar',
        title: 'Top Pages',
        data_source_type: 'Google Analytics',
        data_query: {
          metrics: ['pageViews'],
          dimensions: ['page'],
          period: 'last-30-days',
          limit: 5
        },
        position: { x: 8, y: 6, w: 4, h: 4 }
      })
    ]
    
    // Generate mock data for each widget
    const widgetsWithData = widgets.map(widget => Widget.generateMockData(widget))
    
    return {
      ...dashboard,
      widgets: widgetsWithData
    }
  }

  /**
   * Update a dashboard
   * @param {Object} dashboard - The dashboard to update
   * @param {Object} updates - The updates to apply
   * @returns {Object} The updated dashboard
   */
  static update(dashboard, updates) {
    return {
      ...dashboard,
      ...updates,
      updated_at: new Date().toISOString()
    }
  }

  /**
   * Add a widget to a dashboard
   * @param {Object} dashboard - The dashboard to add the widget to
   * @param {Object} widget - The widget to add
   * @returns {Object} The updated dashboard
   */
  static addWidget(dashboard, widget) {
    return {
      ...dashboard,
      widgets: [...dashboard.widgets, widget],
      updated_at: new Date().toISOString()
    }
  }

  /**
   * Update a widget in a dashboard
   * @param {Object} dashboard - The dashboard containing the widget
   * @param {string} widgetId - The ID of the widget to update
   * @param {Object} updatedWidget - The updated widget
   * @returns {Object} The updated dashboard
   */
  static updateWidget(dashboard, widgetId, updatedWidget) {
    return {
      ...dashboard,
      widgets: dashboard.widgets.map(widget => 
        widget.id === widgetId ? updatedWidget : widget
      ),
      updated_at: new Date().toISOString()
    }
  }

  /**
   * Remove a widget from a dashboard
   * @param {Object} dashboard - The dashboard containing the widget
   * @param {string} widgetId - The ID of the widget to remove
   * @returns {Object} The updated dashboard
   */
  static removeWidget(dashboard, widgetId) {
    return {
      ...dashboard,
      widgets: dashboard.widgets.filter(widget => widget.id !== widgetId),
      updated_at: new Date().toISOString()
    }
  }

  /**
   * Update the layout of a dashboard
   * @param {Object} dashboard - The dashboard to update
   * @param {Object} layoutConfig - The new layout configuration
   * @returns {Object} The updated dashboard
   */
  static updateLayout(dashboard, layoutConfig) {
    return {
      ...dashboard,
      layout_config: {
        ...dashboard.layout_config,
        ...layoutConfig
      },
      updated_at: new Date().toISOString()
    }
  }

  /**
   * Update widget positions in a dashboard
   * @param {Object} dashboard - The dashboard to update
   * @param {Array<Object>} positions - The new widget positions
   * @returns {Object} The updated dashboard
   */
  static updateWidgetPositions(dashboard, positions) {
    const updatedWidgets = dashboard.widgets.map(widget => {
      const position = positions.find(pos => pos.id === widget.id)
      if (position) {
        return {
          ...widget,
          position: {
            x: position.x,
            y: position.y,
            w: position.w,
            h: position.h
          }
        }
      }
      return widget
    })
    
    return {
      ...dashboard,
      widgets: updatedWidgets,
      updated_at: new Date().toISOString()
    }
  }
}

export default Dashboard

