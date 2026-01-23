<template>
  <UiCard>
    <template #header>
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <h3 class="font-semibold text-gray-900 dark:text-white">
            {{ t('dashboard.systemHealth') }}
          </h3>
          <div
            v-if="health"
            class="w-2.5 h-2.5 rounded-full"
            :class="getStatusColor(health.status)"
          />
        </div>
        <UiButton variant="ghost" size="sm" @click="$emit('refresh')">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </UiButton>
      </div>
    </template>

    <div v-if="loading" class="space-y-4">
      <UiSkeleton v-for="i in 4" :key="i" class="h-12" />
    </div>

    <div v-else-if="!health" class="text-center py-8">
      <svg class="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
        {{ t('dashboard.healthUnavailable') }}
      </p>
    </div>

    <div v-else class="space-y-4">
      <!-- Overall Status -->
      <div class="p-3 rounded-lg" :class="getStatusBgClass(health.status)">
        <div class="flex items-center gap-2">
          <svg
            v-if="health.status === 'healthy'"
            class="w-5 h-5 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
          <svg
            v-else-if="health.status === 'degraded'"
            class="w-5 h-5 text-yellow-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <svg
            v-else
            class="w-5 h-5 text-red-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
          <span class="font-medium" :class="getStatusTextClass(health.status)">
            {{ t(`dashboard.status.${health.status}`) }}
          </span>
        </div>
      </div>

      <!-- Services -->
      <div class="space-y-3">
        <!-- Database -->
        <div class="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div class="flex items-center gap-2">
            <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
            </svg>
            <span class="text-sm font-medium text-gray-900 dark:text-white">
              Database
            </span>
          </div>
          <div class="flex items-center gap-2">
            <span v-if="health.checks.database.responseTimeMs" class="text-xs text-gray-500">
              {{ health.checks.database.responseTimeMs }}ms
            </span>
            <div
              class="w-2 h-2 rounded-full"
              :class="health.checks.database.status === 'healthy' ? 'bg-green-500' : 'bg-red-500'"
            />
          </div>
        </div>

        <!-- Redis -->
        <div class="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div class="flex items-center gap-2">
            <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
            </svg>
            <span class="text-sm font-medium text-gray-900 dark:text-white">
              Redis
            </span>
          </div>
          <div class="flex items-center gap-2">
            <span v-if="health.checks.redis.responseTimeMs" class="text-xs text-gray-500">
              {{ health.checks.redis.responseTimeMs }}ms
            </span>
            <div
              class="w-2 h-2 rounded-full"
              :class="health.checks.redis.status === 'healthy' ? 'bg-green-500' : 'bg-red-500'"
            />
          </div>
        </div>

        <!-- AI Providers -->
        <div class="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div class="flex items-center gap-2">
            <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <span class="text-sm font-medium text-gray-900 dark:text-white">
              AI Providers
            </span>
          </div>
          <div class="flex items-center gap-2">
            <span class="text-xs text-gray-500">
              {{ health.checks.aiProviders.availableProviders }}/{{ health.checks.aiProviders.totalProviders }}
            </span>
            <div
              class="w-2 h-2 rounded-full"
              :class="health.checks.aiProviders.availableProviders > 0 ? 'bg-green-500' : 'bg-red-500'"
            />
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="pt-3 border-t border-gray-200 dark:border-gray-700 text-xs text-gray-500">
        <div class="flex items-center justify-between">
          <span>{{ t('dashboard.uptime') }}: {{ formatUptime(health.system.uptimeSeconds) }}</span>
          <span>v{{ health.version }}</span>
        </div>
        <div class="mt-1">
          {{ t('dashboard.lastChecked') }}: {{ format.relativeTime(health.timestamp) }}
        </div>
      </div>
    </div>
  </UiCard>
</template>

<script setup lang="ts">
import type { SystemHealth } from '~/types/stats'

interface Props {
  health: SystemHealth | null
  loading?: boolean
}

defineProps<Props>()

defineEmits<{
  refresh: []
}>()

const { t } = useI18n()
const format = useFormat()

function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    'healthy': 'bg-green-500',
    'degraded': 'bg-yellow-500',
    'unhealthy': 'bg-red-500'
  }
  return colors[status] || 'bg-gray-500'
}

function getStatusBgClass(status: string): string {
  const classes: Record<string, string> = {
    'healthy': 'bg-green-50 dark:bg-green-900/20',
    'degraded': 'bg-yellow-50 dark:bg-yellow-900/20',
    'unhealthy': 'bg-red-50 dark:bg-red-900/20'
  }
  return classes[status] || 'bg-gray-50 dark:bg-gray-800'
}

function getStatusTextClass(status: string): string {
  const classes: Record<string, string> = {
    'healthy': 'text-green-700 dark:text-green-400',
    'degraded': 'text-yellow-700 dark:text-yellow-400',
    'unhealthy': 'text-red-700 dark:text-red-400'
  }
  return classes[status] || 'text-gray-700 dark:text-gray-400'
}

function formatUptime(seconds: number): string {
  const days = Math.floor(seconds / 86400)
  const hours = Math.floor((seconds % 86400) / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)

  if (days > 0) {
    return `${days}d ${hours}h`
  }
  if (hours > 0) {
    return `${hours}h ${minutes}m`
  }
  return `${minutes}m`
}
</script>
