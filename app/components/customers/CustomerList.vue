<template>
  <div>
    <!-- Loading -->
    <div v-if="loading" class="space-y-4">
      <div
        v-for="i in 5"
        :key="i"
        class="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
      >
        <div class="flex items-center gap-4">
          <UiSkeleton class="w-12 h-12 rounded-full" />
          <div class="flex-1">
            <UiSkeleton class="h-5 w-32 mb-2" />
            <UiSkeleton class="h-4 w-24" />
          </div>
          <UiSkeleton class="h-6 w-20" />
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div
      v-else-if="customers.length === 0"
      class="text-center py-12"
    >
      <svg class="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
      <h3 class="mt-4 text-lg font-medium text-gray-900 dark:text-white">
        {{ t('common.noData') }}
      </h3>
      <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
        {{ t('customers.noCustomers') }}
      </p>
    </div>

    <!-- Customer List -->
    <div v-else class="overflow-x-auto">
      <table class="w-full">
        <thead>
          <tr class="text-left text-sm text-gray-500 border-b border-gray-200 dark:border-gray-700">
            <th class="pb-3 font-medium">{{ t('customers.name') }}</th>
            <th class="pb-3 font-medium">{{ t('conversations.platform') }}</th>
            <th class="pb-3 font-medium">{{ t('customers.phone') }}</th>
            <th class="pb-3 font-medium text-center">{{ t('customers.orderCount') }}</th>
            <th class="pb-3 font-medium text-end">{{ t('customers.totalSpent') }}</th>
            <th class="pb-3 font-medium">{{ t('customers.lastOrder') }}</th>
            <th class="pb-3 font-medium text-center">{{ t('common.status') }}</th>
            <th class="pb-3 font-medium text-end">{{ t('common.actions') }}</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100 dark:divide-gray-700">
          <tr
            v-for="customer in customers"
            :key="customer.id"
            class="hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer"
            @click="$emit('view', customer)"
          >
            <!-- Name & Avatar -->
            <td class="py-4">
              <div class="flex items-center gap-3">
                <div
                  class="w-10 h-10 rounded-full flex items-center justify-center text-white font-medium"
                  :class="getAvatarColor(customer.platform)"
                >
                  {{ getInitials(customer.name) }}
                </div>
                <div>
                  <div class="font-medium text-gray-900 dark:text-white">
                    {{ customer.name || t('customers.anonymous') }}
                  </div>
                  <div class="text-xs text-gray-400 font-mono">
                    {{ customer.platformId.slice(0, 12) }}...
                  </div>
                </div>
              </div>
            </td>

            <!-- Platform -->
            <td class="py-4">
              <div class="flex items-center gap-2">
                <ConversationsPlatformIcon :platform="customer.platform" size="sm" />
                <span class="text-sm text-gray-600 dark:text-gray-400">
                  {{ t(`platforms.${customer.platform}`) }}
                </span>
              </div>
            </td>

            <!-- Phone -->
            <td class="py-4">
              <span v-if="customer.phone" class="text-gray-600 dark:text-gray-400">
                {{ customer.phone }}
              </span>
              <span v-else class="text-gray-400">-</span>
            </td>

            <!-- Order Count -->
            <td class="py-4 text-center">
              <span class="font-medium text-gray-900 dark:text-white">
                {{ customer.orderCount }}
              </span>
            </td>

            <!-- Total Spent -->
            <td class="py-4 text-end">
              <span class="font-medium text-gray-900 dark:text-white">
                {{ format.currency(customer.totalSpent) }}
              </span>
            </td>

            <!-- Last Order -->
            <td class="py-4">
              <span v-if="customer.lastOrderAt" class="text-sm text-gray-600 dark:text-gray-400">
                {{ format.relativeTime(customer.lastOrderAt) }}
              </span>
              <span v-else class="text-gray-400">-</span>
            </td>

            <!-- Status -->
            <td class="py-4 text-center">
              <UiBadge
                :variant="customer.isBlocked ? 'danger' : 'success'"
                size="sm"
              >
                {{ customer.isBlocked ? t('customers.blocked') : t('common.active') }}
              </UiBadge>
            </td>

            <!-- Actions -->
            <td class="py-4 text-end">
              <div class="flex items-center justify-end gap-1">
                <UiButton
                  variant="ghost"
                  size="sm"
                  @click.stop="$emit('view', customer)"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </UiButton>
                <UiButton
                  variant="ghost"
                  size="sm"
                  :class="customer.isBlocked ? 'text-green-600 hover:text-green-700' : 'text-red-600 hover:text-red-700'"
                  @click.stop="$emit('toggleBlock', customer)"
                >
                  <svg v-if="customer.isBlocked" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
                  </svg>
                  <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                  </svg>
                </UiButton>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Customer, CustomerListItem } from '~/types/customer'
import type { MessagePlatform } from '~/types/conversation'

interface Props {
  customers: (Customer | CustomerListItem)[]
  loading?: boolean
}

withDefaults(defineProps<Props>(), {
  loading: false
})

defineEmits<{
  view: [customer: Customer | CustomerListItem]
  toggleBlock: [customer: Customer | CustomerListItem]
}>()

const { t } = useI18n()
const format = useFormat()

function getInitials(name?: string): string {
  if (!name) return '?'
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

function getAvatarColor(platform: MessagePlatform): string {
  const colors: Record<MessagePlatform, string> = {
    WhatsApp: 'bg-green-500',
    Messenger: 'bg-blue-500',
    Instagram: 'bg-pink-500'
  }
  return colors[platform] || 'bg-gray-500'
}
</script>
