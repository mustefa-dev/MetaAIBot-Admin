<template>
  <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
    <!-- Total Customers -->
    <UiCard class="text-center">
      <div class="text-2xl font-bold text-gray-900 dark:text-white">
        {{ stats?.totalCustomers || 0 }}
      </div>
      <div class="text-sm text-gray-500">{{ t('customers.totalCustomers') }}</div>
    </UiCard>

    <!-- New Today -->
    <UiCard class="text-center">
      <div class="text-2xl font-bold text-green-600">
        {{ stats?.newCustomersToday || 0 }}
      </div>
      <div class="text-sm text-gray-500">{{ t('customers.newToday') }}</div>
    </UiCard>

    <!-- New This Week -->
    <UiCard class="text-center">
      <div class="text-2xl font-bold text-blue-600">
        {{ stats?.newCustomersThisWeek || 0 }}
      </div>
      <div class="text-sm text-gray-500">{{ t('customers.newThisWeek') }}</div>
    </UiCard>

    <!-- Active -->
    <UiCard class="text-center">
      <div class="text-2xl font-bold text-emerald-600">
        {{ stats?.activeCustomers || 0 }}
      </div>
      <div class="text-sm text-gray-500">{{ t('common.active') }}</div>
    </UiCard>

    <!-- Blocked -->
    <UiCard class="text-center">
      <div class="text-2xl font-bold text-red-600">
        {{ stats?.blockedCustomers || 0 }}
      </div>
      <div class="text-sm text-gray-500">{{ t('customers.blocked') }}</div>
    </UiCard>

    <!-- Avg Order Value -->
    <UiCard class="text-center">
      <div class="text-2xl font-bold text-amber-600">
        {{ format.currency(stats?.averageOrderValue || 0) }}
      </div>
      <div class="text-sm text-gray-500">{{ t('customers.avgOrderValue') }}</div>
    </UiCard>
  </div>

  <!-- Platform Distribution -->
  <div v-if="stats?.customersByPlatform" class="mt-4 grid grid-cols-3 gap-4">
    <UiCard class="flex items-center gap-3">
      <div class="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
        <ConversationsPlatformIcon platform="WhatsApp" size="md" />
      </div>
      <div>
        <div class="text-xl font-bold text-gray-900 dark:text-white">
          {{ stats.customersByPlatform.whatsApp }}
        </div>
        <div class="text-sm text-gray-500">{{ t('platforms.WhatsApp') }}</div>
      </div>
    </UiCard>

    <UiCard class="flex items-center gap-3">
      <div class="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
        <ConversationsPlatformIcon platform="Messenger" size="md" />
      </div>
      <div>
        <div class="text-xl font-bold text-gray-900 dark:text-white">
          {{ stats.customersByPlatform.messenger }}
        </div>
        <div class="text-sm text-gray-500">{{ t('platforms.Messenger') }}</div>
      </div>
    </UiCard>

    <UiCard class="flex items-center gap-3">
      <div class="w-10 h-10 rounded-full bg-pink-100 dark:bg-pink-900/30 flex items-center justify-center">
        <ConversationsPlatformIcon platform="Instagram" size="md" />
      </div>
      <div>
        <div class="text-xl font-bold text-gray-900 dark:text-white">
          {{ stats.customersByPlatform.instagram }}
        </div>
        <div class="text-sm text-gray-500">{{ t('platforms.Instagram') }}</div>
      </div>
    </UiCard>
  </div>
</template>

<script setup lang="ts">
import type { CustomerStats } from '~/types/customer'

interface Props {
  stats: CustomerStats | null
}

defineProps<Props>()

const { t } = useI18n()
const format = useFormat()
</script>
