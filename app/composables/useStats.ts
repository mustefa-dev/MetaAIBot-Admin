import type { AIProviderStatus, DashboardStats, SystemHealth } from '~/types/stats'
import { API_ENDPOINTS } from '~/utils/constants'

export function useStats() {
  const api = useApi()
  const toast = useAppToast()

  // Dashboard stats
  const dashboardStats = ref<DashboardStats | null>(null)
  const isLoadingDashboard = ref(false)

  // AI Provider stats
  const providerStats = ref<AIProviderStatus[]>([])
  const isLoadingProviders = ref(false)

  // System health
  const systemHealth = ref<SystemHealth | null>(null)
  const isLoadingHealth = ref(false)

  // Fetch dashboard stats
  async function fetchDashboardStats() {
    isLoadingDashboard.value = true

    const { data, error } = await api.get<DashboardStats>(API_ENDPOINTS.STATS.DASHBOARD)

    if (error) {
      toast.error(error.message)
      isLoadingDashboard.value = false
      return null
    }

    dashboardStats.value = data
    isLoadingDashboard.value = false
    return data
  }

  // Fetch AI provider stats
  async function fetchProviderStats() {
    isLoadingProviders.value = true

    const { data, error } = await api.get<AIProviderStatus[]>(API_ENDPOINTS.STATS.PROVIDERS)

    if (error) {
      toast.error(error.message)
      isLoadingProviders.value = false
      return []
    }

    providerStats.value = data || []
    isLoadingProviders.value = false
    return providerStats.value
  }

  // Fetch system health
  async function fetchSystemHealth() {
    isLoadingHealth.value = true

    const { data, error } = await api.get<SystemHealth>(API_ENDPOINTS.STATS.HEALTH)

    if (error) {
      // Don't show toast for health check failures
      isLoadingHealth.value = false
      return null
    }

    systemHealth.value = data
    isLoadingHealth.value = false
    return data
  }

  // Fetch conversation analytics
  async function fetchConversationAnalytics(period: 'day' | 'week' | 'month' = 'week') {
    const { data, error } = await api.get<{
      labels: string[]
      data: number[]
      byPlatform: Record<string, number>
      byIntent: Record<string, number>
    }>(API_ENDPOINTS.STATS.CONVERSATIONS, { period })

    if (error) {
      return null
    }

    return data
  }

  // Fetch order analytics
  async function fetchOrderAnalytics(period: 'day' | 'week' | 'month' = 'week') {
    const { data, error } = await api.get<{
      labels: string[]
      orders: number[]
      revenue: number[]
      byStatus: Record<string, number>
    }>(API_ENDPOINTS.STATS.ORDERS, { period })

    if (error) {
      return null
    }

    return data
  }

  // Fetch AI usage analytics
  async function fetchAIUsageAnalytics(period: 'day' | 'week' | 'month' = 'week') {
    const { data, error } = await api.get<{
      labels: string[]
      byProvider: Record<string, number[]>
      totalRequests: number
      successRate: number
      averageLatency: number
    }>(API_ENDPOINTS.STATS.AI_USAGE, { period })

    if (error) {
      return null
    }

    return data
  }

  // Get provider color for charts
  function getProviderColor(provider: string): string {
    const colors: Record<string, string> = {
      'Groq': '#F97316',
      'Mistral': '#8B5CF6',
      'Cloudflare': '#F59E0B',
      'Gemini': '#3B82F6',
      'GitHub': '#22C55E'
    }
    return colors[provider] || '#6B7280'
  }

  // Get health status color
  function getHealthColor(status: 'healthy' | 'degraded' | 'unhealthy'): string {
    const colors: Record<string, string> = {
      'healthy': 'success',
      'degraded': 'warning',
      'unhealthy': 'danger'
    }
    return colors[status] || 'secondary'
  }

  return {
    // State
    dashboardStats,
    isLoadingDashboard,
    providerStats,
    isLoadingProviders,
    systemHealth,
    isLoadingHealth,

    // Actions
    fetchDashboardStats,
    fetchProviderStats,
    fetchSystemHealth,
    fetchConversationAnalytics,
    fetchOrderAnalytics,
    fetchAIUsageAnalytics,

    // Helpers
    getProviderColor,
    getHealthColor
  }
}
