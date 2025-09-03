/**
 * DataNest Type Definitions
 * 
 * This file contains all the type definitions for the DataNest application.
 * These types are used throughout the application to ensure type safety and
 * to provide better documentation and autocompletion.
 */

/**
 * DataSource Entity
 * Represents a connection to an external data source (e.g., Google Analytics, Stripe)
 */
export interface DataSource {
  id: string;
  user_id: string;
  type: DataSourceType;
  api_key?: string;
  connection_details: ConnectionDetails;
  last_synced_at: string | null;
  status: ConnectionStatus;
  metrics?: Record<string, any>;
  icon?: string;
}

/**
 * DataPoint Entity
 * Represents a single data point collected from a data source
 */
export interface DataPoint {
  id: string;
  data_source_id: string;
  timestamp: string;
  data_payload: Record<string, any>;
  processed_at: string;
  type: string;
  category?: string;
  source?: string;
}

/**
 * Dashboard Entity
 * Represents a user dashboard containing multiple widgets
 */
export interface Dashboard {
  id: string;
  user_id: string;
  name: string;
  layout_config: LayoutConfig;
  widgets: Widget[];
  created_at?: string;
  updated_at?: string;
  description?: string;
}

/**
 * Widget Entity
 * Represents a visualization widget on a dashboard
 */
export interface Widget {
  id: string;
  dashboard_id: string;
  type: WidgetType;
  data_query: DataQuery;
  visualization_config: VisualizationConfig;
  title: string;
  position?: WidgetPosition;
  size?: WidgetSize;
  value?: string;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  chartType?: ChartType;
}

/**
 * User Entity
 * Represents a user of the application
 */
export interface User {
  id: string;
  email: string;
  name?: string;
  created_at: string;
  updated_at: string;
  preferences?: UserPreferences;
  subscription_tier?: SubscriptionTier;
}

/**
 * Supporting Types
 */

export type DataSourceType = 
  | 'Google Analytics' 
  | 'Stripe' 
  | 'HubSpot' 
  | 'Salesforce' 
  | 'Mailchimp' 
  | 'Facebook Ads';

export type ConnectionStatus = 'connected' | 'setup' | 'error' | 'disconnected';

export type WidgetType = 'metric' | 'chart' | 'table' | 'text';

export type ChartType = 'line' | 'bar' | 'pie' | 'doughnut' | 'area' | 'scatter';

export type SubscriptionTier = 'free' | 'pro' | 'business';

export interface ConnectionDetails {
  oauth_token?: string;
  oauth_refresh_token?: string;
  token_expiry?: string;
  account_id?: string;
  properties?: Record<string, any>;
  scopes?: string[];
  integration_id?: string;
}

export interface LayoutConfig {
  columns: number;
  rows?: number;
  gap?: number;
  padding?: number;
  responsive?: boolean;
}

export interface DataQuery {
  source_id: string;
  metrics?: string[];
  dimensions?: string[];
  filters?: QueryFilter[];
  date_range?: DateRange;
  limit?: number;
  sort?: SortConfig[];
  raw_query?: string;
}

export interface QueryFilter {
  field: string;
  operator: FilterOperator;
  value: any;
}

export type FilterOperator = 
  | 'equals' 
  | 'not_equals' 
  | 'contains' 
  | 'not_contains' 
  | 'greater_than' 
  | 'less_than' 
  | 'in' 
  | 'not_in';

export interface DateRange {
  start: string;
  end: string;
  preset?: DateRangePreset;
}

export type DateRangePreset = 
  | 'today' 
  | 'yesterday' 
  | 'last-7-days' 
  | 'last-30-days' 
  | 'last-90-days' 
  | 'this-month' 
  | 'last-month' 
  | 'this-year' 
  | 'custom';

export interface SortConfig {
  field: string;
  direction: 'asc' | 'desc';
}

export interface VisualizationConfig {
  type: ChartType;
  colors?: string[];
  show_legend?: boolean;
  show_axis_labels?: boolean;
  show_data_labels?: boolean;
  stacked?: boolean;
  aspect_ratio?: number;
  custom_options?: Record<string, any>;
}

export interface WidgetPosition {
  x: number;
  y: number;
}

export interface WidgetSize {
  width: number;
  height: number;
  minWidth?: number;
  minHeight?: number;
  maxWidth?: number;
  maxHeight?: number;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  date_format: string;
  number_format: string;
  timezone: string;
  default_dashboard_id?: string;
  notifications: NotificationPreferences;
}

export interface NotificationPreferences {
  email: boolean;
  in_app: boolean;
  frequency: 'realtime' | 'daily' | 'weekly' | 'never';
  types: {
    data_sync: boolean;
    alerts: boolean;
    system: boolean;
  };
}

/**
 * API Response Types
 */

export interface ApiResponse<T> {
  data?: T;
  error?: ApiError;
  meta?: {
    pagination?: PaginationMeta;
    [key: string]: any;
  };
}

export interface ApiError {
  code: string;
  message: string;
  details?: any;
}

export interface PaginationMeta {
  total: number;
  per_page: number;
  current_page: number;
  total_pages: number;
}

