// Statistics & Dashboard Types

import type { AIProvider, MessagePlatform, CustomerIntent } from './conversation'
import type { OrderStatus } from './order'

// AI Provider Status
export interface AIProviderStatus {
  provider: AIProvider
  isAvailable: boolean
  dailyLimit: number
  usedToday: number
  remainingToday: number
  priority: number
  usagePercent: number
  usagePercentage: number // Alias for usagePercent for component compatibility
  averageLatencyMs?: number
  successRate?: number
  lastError?: string
}

// System Health
export interface SystemHealth {
  status: 'healthy' | 'degraded' | 'unhealthy'
  timestamp: string
  version: string
  system: SystemInfo
  checks: HealthChecks
}

export interface SystemInfo {
  uptime: string
  uptimeSeconds: number
  memoryMB: number
  threadCount: number
  environment: string
}

export interface HealthChecks {
  database: HealthCheckResult
  redis: HealthCheckResult
  aiProviders: AIProvidersHealth
}

export interface HealthCheckResult {
  status: 'healthy' | 'unhealthy'
  responseTimeMs?: number
  error?: string
  stats?: Record<string, number>
}

export interface AIProvidersHealth {
  status: 'healthy' | 'degraded' | 'unhealthy'
  availableProviders: number
  totalProviders: number
  providers: AIProviderStatus[]
}

// Dashboard Stats
export interface DashboardStats {
  conversations: ConversationStats
  orders: OrderDashboardStats
  customers: CustomerDashboardStats
  products: ProductDashboardStats
  revenue: RevenueStats
  aiProviders: AIProviderStatus[]
}

export interface ConversationStats {
  today: number
  thisWeek: number
  thisMonth: number
  active: number
  pendingHandoff: number
  resolved: number
  byPlatform: PlatformBreakdown
  byIntent: IntentBreakdown[]
}

export interface PlatformBreakdown {
  whatsApp: number
  messenger: number
  instagram: number
}

export interface IntentBreakdown {
  intent: CustomerIntent
  count: number
  percentage: number
}

export interface OrderDashboardStats {
  today: number
  thisWeek: number
  thisMonth: number
  pending: number
  processing: number
  shipped: number
  delivered: number
  cancelled: number
  byStatus: OrderStatusBreakdown[]
}

export interface OrderStatusBreakdown {
  status: OrderStatus
  count: number
  percentage: number
}

export interface CustomerDashboardStats {
  total: number
  newToday: number
  newThisWeek: number
  newThisMonth: number
  active: number
  byPlatform: PlatformBreakdown
}

export interface ProductDashboardStats {
  total: number
  active: number
  outOfStock: number
  lowStock: number
  topSelling: TopSellingProduct[]
}

export interface TopSellingProduct {
  id: string
  code: string
  name: string
  nameArabic: string
  soldCount: number
  revenue: number
  imageUrl?: string
}

export interface RevenueStats {
  today: number
  yesterday: number
  thisWeek: number
  lastWeek: number
  thisMonth: number
  lastMonth: number
  growth: {
    daily: number
    weekly: number
    monthly: number
  }
}

// Chart Data
export interface ChartDataPoint {
  label: string
  value: number
}

export interface TimeSeriesData {
  labels: string[]
  datasets: TimeSeriesDataset[]
}

export interface TimeSeriesDataset {
  name: string
  data: number[]
  color?: string
}

export interface DailyStats {
  date: string
  conversations: number
  orders: number
  revenue: number
  newCustomers: number
}

// Activity Feed
export interface ActivityItem {
  id: string
  type: ActivityType
  title: string
  description: string
  timestamp: string
  metadata?: Record<string, unknown>
}

export type ActivityType =
  | 'new_order'
  | 'order_status_changed'
  | 'new_conversation'
  | 'handoff_requested'
  | 'low_stock_alert'
  | 'new_customer'
  | 'ai_provider_down'

// Alerts
export interface Alert {
  id: string
  type: AlertType
  severity: AlertSeverity
  title: string
  message: string
  timestamp: string
  isRead: boolean
  actionUrl?: string
}

export type AlertType = 'low_stock' | 'handoff' | 'ai_down' | 'system' | 'order'
export type AlertSeverity = 'info' | 'warning' | 'error' | 'success'
