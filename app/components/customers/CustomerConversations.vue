<template>
  <div>
    <!-- Loading -->
    <div v-if="loading" class="space-y-3">
      <div v-for="i in 3" :key="i" class="flex items-center gap-4 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
        <UiSkeleton class="w-8 h-8 rounded-full" />
        <UiSkeleton class="flex-1 h-5" />
        <UiSkeleton class="w-16 h-5" />
      </div>
    </div>

    <!-- Empty State -->
    <div v-else-if="conversations.length === 0" class="text-center py-8 text-gray-500">
      {{ t('customers.noConversationsYet') }}
    </div>

    <!-- Conversations List -->
    <div v-else class="space-y-3">
      <NuxtLink
        v-for="conversation in conversations"
        :key="conversation.id"
        :to="`/conversations/${conversation.id}`"
        class="flex items-center gap-4 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      >
        <!-- Platform Icon -->
        <ConversationsPlatformIcon :platform="conversation.platform" size="md" />

        <!-- Info -->
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-2">
            <span class="font-medium text-gray-900 dark:text-white truncate">
              {{ t(`platforms.${conversation.platform}`) }}
            </span>
            <UiBadge
              :variant="getStatusVariant(conversation.status)"
              size="sm"
            >
              {{ t(`conversations.statuses.${conversation.status}`) }}
            </UiBadge>
          </div>
          <div v-if="conversation.lastMessage" class="text-sm text-gray-500 truncate">
            {{ conversation.lastMessage }}
          </div>
        </div>

        <!-- Date -->
        <div class="text-sm text-gray-500">
          {{ format.relativeTime(conversation.lastMessageAt || conversation.updatedAt) }}
        </div>

        <!-- Arrow -->
        <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
      </NuxtLink>

      <!-- View All Link -->
      <div v-if="showViewAll && conversations.length > 0" class="text-center pt-2">
        <NuxtLink
          :to="`/conversations?customerId=${customerId}`"
          class="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400"
        >
          {{ t('customers.viewAllConversations') }} &rarr;
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Conversation, ConversationStatus } from '~/types/conversation'

interface Props {
  conversations: Conversation[]
  customerId?: string
  loading?: boolean
  showViewAll?: boolean
}

withDefaults(defineProps<Props>(), {
  loading: false,
  showViewAll: true
})

const { t } = useI18n()
const format = useFormat()

function getStatusVariant(status: ConversationStatus): 'success' | 'warning' | 'gray' {
  switch (status) {
    case 'Active':
      return 'success'
    case 'PendingHandoff':
      return 'warning'
    default:
      return 'gray'
  }
}
</script>
