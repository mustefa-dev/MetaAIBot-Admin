<template>
  <div class="h-full flex flex-col bg-gray-50 dark:bg-gray-900 border-s border-gray-200 dark:border-gray-700">
    <!-- Header -->
    <div class="p-4 border-b border-gray-200 dark:border-gray-700">
      <div class="flex items-center justify-between">
        <h3 class="font-semibold text-gray-900 dark:text-white">
          {{ t('customers.title') }}
        </h3>
        <UiButton variant="ghost" size="sm" @click="$emit('close')">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </UiButton>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex-1 p-4 space-y-4">
      <UiSkeleton class="w-20 h-20 rounded-full mx-auto" />
      <UiSkeleton class="h-6 w-32 mx-auto" />
      <UiSkeleton class="h-4 w-24 mx-auto" />
      <div class="space-y-3 mt-6">
        <UiSkeleton v-for="i in 4" :key="i" class="h-12" />
      </div>
    </div>

    <!-- Customer Info -->
    <div v-else-if="customer" class="flex-1 overflow-y-auto">
      <!-- Profile Section -->
      <div class="p-4 text-center border-b border-gray-200 dark:border-gray-700">
        <div class="w-20 h-20 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center mx-auto mb-3">
          <span class="text-2xl font-bold text-gray-500 dark:text-gray-400">
            {{ initials }}
          </span>
        </div>
        <h4 class="font-semibold text-gray-900 dark:text-white">
          {{ customer.name || t('customers.name') }}
        </h4>
        <p class="text-sm text-gray-500 dark:text-gray-400">
          {{ customer.phone }}
        </p>
        <div class="flex items-center justify-center gap-2 mt-2">
          <UiBadge :variant="platformVariant" size="sm">
            {{ customer.platform }}
          </UiBadge>
          <UiBadge v-if="customer.isBlocked" variant="danger" size="sm">
            {{ t('customers.blocked') }}
          </UiBadge>
        </div>
      </div>

      <!-- Stats -->
      <div class="grid grid-cols-2 gap-4 p-4 border-b border-gray-200 dark:border-gray-700">
        <div class="text-center">
          <div class="text-2xl font-bold text-gray-900 dark:text-white">
            {{ customer.orderCount || 0 }}
          </div>
          <div class="text-xs text-gray-500">{{ t('customers.orderCount') }}</div>
        </div>
        <div class="text-center">
          <div class="text-2xl font-bold text-gray-900 dark:text-white">
            {{ format.currency(customer.totalSpent || 0) }}
          </div>
          <div class="text-xs text-gray-500">{{ t('customers.totalSpent') }}</div>
        </div>
      </div>

      <!-- Details -->
      <div class="p-4 space-y-4">
        <!-- Email -->
        <div v-if="customer.email" class="flex items-start gap-3">
          <svg class="w-5 h-5 text-gray-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          <div>
            <div class="text-xs text-gray-500">{{ t('customers.email') }}</div>
            <div class="text-sm text-gray-900 dark:text-white">{{ customer.email }}</div>
          </div>
        </div>

        <!-- Phone -->
        <div class="flex items-start gap-3">
          <svg class="w-5 h-5 text-gray-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
          <div>
            <div class="text-xs text-gray-500">{{ t('customers.phone') }}</div>
            <div class="text-sm text-gray-900 dark:text-white">{{ customer.phone }}</div>
          </div>
        </div>

        <!-- Last Order -->
        <div v-if="customer.lastOrderDate" class="flex items-start gap-3">
          <svg class="w-5 h-5 text-gray-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          <div>
            <div class="text-xs text-gray-500">{{ t('customers.lastOrder') }}</div>
            <div class="text-sm text-gray-900 dark:text-white">
              {{ format.relativeTime(customer.lastOrderDate) }}
            </div>
          </div>
        </div>

        <!-- Member Since -->
        <div class="flex items-start gap-3">
          <svg class="w-5 h-5 text-gray-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <div>
            <div class="text-xs text-gray-500">{{ t('profile.memberSince') }}</div>
            <div class="text-sm text-gray-900 dark:text-white">
              {{ format.date(customer.createdAt) }}
            </div>
          </div>
        </div>

        <!-- Notes -->
        <div v-if="customer.notes" class="flex items-start gap-3">
          <svg class="w-5 h-5 text-gray-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <div>
            <div class="text-xs text-gray-500">{{ t('orders.notes') }}</div>
            <div class="text-sm text-gray-900 dark:text-white">{{ customer.notes }}</div>
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div class="p-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
        <UiButton
          variant="outline"
          size="sm"
          block
          @click="$emit('view-orders')"
        >
          <svg class="w-4 h-4 me-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          {{ t('customers.viewOrders') }}
        </UiButton>
        <UiButton
          variant="outline"
          size="sm"
          block
          @click="$emit('view-conversations')"
        >
          <svg class="w-4 h-4 me-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          {{ t('customers.viewConversations') }}
        </UiButton>
        <UiButton
          v-if="!customer.isBlocked"
          variant="ghost"
          size="sm"
          block
          class="text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
          @click="$emit('block')"
        >
          <svg class="w-4 h-4 me-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
          </svg>
          {{ t('customers.block') }}
        </UiButton>
        <UiButton
          v-else
          variant="ghost"
          size="sm"
          block
          @click="$emit('unblock')"
        >
          <svg class="w-4 h-4 me-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {{ t('customers.unblock') }}
        </UiButton>
      </div>
    </div>

    <!-- No Customer -->
    <div v-else class="flex-1 flex items-center justify-center p-4 text-gray-500">
      <div class="text-center">
        <svg class="w-12 h-12 mx-auto text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
        <p class="text-sm">{{ t('common.noData') }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Customer } from '~/types/customer'

interface Props {
  customer: Customer | null
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  loading: false
})

defineEmits<{
  close: []
  'view-orders': []
  'view-conversations': []
  block: []
  unblock: []
}>()

const { t } = useI18n()
const format = useFormat()

const initials = computed(() => {
  if (!props.customer?.name) return '?'
  return props.customer.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
})

const platformVariant = computed(() => {
  const variants: Record<string, string> = {
    'WhatsApp': 'success',
    'Messenger': 'info',
    'Instagram': 'primary'
  }
  return variants[props.customer?.platform || ''] || 'secondary'
})
</script>
