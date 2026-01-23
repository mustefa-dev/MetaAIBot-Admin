<template>
  <UiCard>
    <template #header>
      <div class="flex items-center justify-between">
        <h3 class="font-semibold text-gray-900 dark:text-white">
          {{ t('dashboard.aiStatus') }}
        </h3>
        <NuxtLink
          to="/settings/ai-providers"
          class="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400"
        >
          {{ t('settings.title') }}
        </NuxtLink>
      </div>
    </template>

    <div v-if="loading" class="space-y-4">
      <UiSkeleton v-for="i in 5" :key="i" class="h-14" />
    </div>

    <div v-else-if="providers.length === 0" class="text-center py-8">
      <svg class="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
      <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
        {{ t('common.noData') }}
      </p>
    </div>

    <div v-else class="space-y-4">
      <div
        v-for="provider in providers"
        :key="provider.provider"
        class="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
      >
        <div class="flex items-center justify-between mb-2">
          <div class="flex items-center gap-3">
            <!-- Status Indicator -->
            <div
              class="w-2.5 h-2.5 rounded-full"
              :class="provider.isAvailable ? 'bg-green-500 animate-pulse' : 'bg-red-500'"
            />
            <!-- Provider Name -->
            <span class="font-medium text-gray-900 dark:text-white">
              {{ provider.provider }}
            </span>
            <!-- Priority Badge -->
            <UiBadge variant="secondary" size="sm">
              #{{ getProviderPriority(provider.provider) }}
            </UiBadge>
          </div>
          <!-- Usage Count -->
          <span class="text-sm text-gray-600 dark:text-gray-400">
            {{ provider.usedToday.toLocaleString() }} / {{ provider.dailyLimit.toLocaleString() }}
          </span>
        </div>

        <!-- Progress Bar -->
        <UiProgress
          :value="provider.usagePercentage"
          size="sm"
          :variant="getProgressVariant(provider.usagePercentage)"
        />

        <!-- Stats Row -->
        <div class="flex items-center justify-between mt-2 text-xs text-gray-500">
          <span>
            {{ t('aiProviders.remaining') }}: {{ provider.remainingToday.toLocaleString() }}
          </span>
          <span v-if="provider.averageLatencyMs">
            {{ provider.averageLatencyMs }}ms avg
          </span>
          <span v-if="provider.successRate !== undefined">
            {{ provider.successRate }}% {{ t('common.success') }}
          </span>
        </div>

        <!-- Error Message -->
        <div
          v-if="provider.lastError && !provider.isAvailable"
          class="mt-2 p-2 bg-red-50 dark:bg-red-900/20 rounded text-xs text-red-600 dark:text-red-400"
        >
          {{ provider.lastError }}
        </div>
      </div>
    </div>

    <!-- Summary -->
    <div v-if="providers.length > 0" class="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
      <div class="flex items-center justify-between text-sm">
        <span class="text-gray-600 dark:text-gray-400">
          {{ t('aiProviders.available') }}:
          <span class="font-medium text-gray-900 dark:text-white">
            {{ availableCount }} / {{ providers.length }}
          </span>
        </span>
        <span class="text-gray-600 dark:text-gray-400">
          {{ t('aiProviders.usedToday') }}:
          <span class="font-medium text-gray-900 dark:text-white">
            {{ totalUsed.toLocaleString() }}
          </span>
        </span>
      </div>
    </div>
  </UiCard>
</template>

<script setup lang="ts">
import type { AIProviderStatus } from '~/types/stats'

interface Props {
  providers: AIProviderStatus[]
  loading?: boolean
}

const props = defineProps<Props>()

const { t } = useI18n()

const providerPriorities: Record<string, number> = {
  'Groq': 1,
  'Mistral': 2,
  'Cloudflare': 3,
  'GeminiFree': 4,
  'GitHubModels': 5,
  'GeminiPaid': 6
}

function getProviderPriority(provider: string): number {
  return providerPriorities[provider] || 99
}

function getProgressVariant(percentage: number): string {
  if (percentage >= 90) return 'danger'
  if (percentage >= 70) return 'warning'
  return 'success'
}

const availableCount = computed(() =>
  props.providers.filter(p => p.isAvailable).length
)

const totalUsed = computed(() =>
  props.providers.reduce((sum, p) => sum + p.usedToday, 0)
)
</script>
