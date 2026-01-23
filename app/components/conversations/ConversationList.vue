<template>
  <div class="space-y-2">
    <!-- Loading -->
    <template v-if="loading">
      <div
        v-for="i in 5"
        :key="i"
        class="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
      >
        <div class="flex items-start gap-3">
          <UiSkeleton class="w-12 h-12 rounded-full" />
          <div class="flex-1">
            <UiSkeleton class="h-5 w-32 mb-2" />
            <UiSkeleton class="h-4 w-48" />
          </div>
          <UiSkeleton class="h-6 w-20" />
        </div>
      </div>
    </template>

    <!-- Empty State -->
    <div
      v-else-if="conversations.length === 0"
      class="text-center py-12"
    >
      <svg class="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
      <h3 class="mt-4 text-lg font-medium text-gray-900 dark:text-white">
        {{ t('common.noData') }}
      </h3>
      <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
        {{ t('conversations.noMessages') }}
      </p>
    </div>

    <!-- Conversation Items -->
    <template v-else>
      <NuxtLink
        v-for="conversation in conversations"
        :key="conversation.id"
        :to="`/conversations/${conversation.id}`"
        class="block p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-600 hover:shadow-sm transition-all"
        :class="{ 'ring-2 ring-primary-500': selected === conversation.id }"
      >
        <div class="flex items-start gap-3">
          <!-- Platform Avatar -->
          <div
            class="w-12 h-12 rounded-full flex items-center justify-center shrink-0"
            :class="getPlatformBgClass(conversation.platform)"
          >
            <component :is="getPlatformIcon(conversation.platform)" class="w-6 h-6 text-white" />
          </div>

          <!-- Content -->
          <div class="flex-1 min-w-0">
            <div class="flex items-center justify-between gap-2 mb-1">
              <h4 class="font-medium text-gray-900 dark:text-white truncate">
                {{ conversation.customerName || t('customers.name') }}
              </h4>
              <span class="text-xs text-gray-500 shrink-0">
                {{ format.relativeTime(conversation.lastMessageAt) }}
              </span>
            </div>

            <p class="text-sm text-gray-600 dark:text-gray-400 truncate mb-2">
              {{ conversation.lastMessage || t('conversations.noMessages') }}
            </p>

            <div class="flex items-center gap-2">
              <UiBadge :variant="getStatusVariant(conversation.status)" size="sm">
                {{ t(`conversations.statuses.${conversation.status}`) }}
              </UiBadge>
              <UiBadge v-if="conversation.detectedIntent" variant="secondary" size="sm">
                {{ t(`intents.${conversation.detectedIntent}`) }}
              </UiBadge>
              <span
                v-if="conversation.unreadCount"
                class="inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full"
              >
                {{ conversation.unreadCount > 9 ? '9+' : conversation.unreadCount }}
              </span>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex items-center gap-1 shrink-0">
            <UiButton
              v-if="conversation.status === 'Active' || conversation.status === 'PendingHandoff'"
              variant="ghost"
              size="sm"
              @click.prevent="$emit('resolve', conversation)"
            >
              <svg class="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
            </UiButton>
            <UiButton
              v-if="conversation.status === 'Active'"
              variant="ghost"
              size="sm"
              @click.prevent="$emit('handoff', conversation)"
            >
              <svg class="w-4 h-4 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </UiButton>
          </div>
        </div>
      </NuxtLink>
    </template>
  </div>
</template>

<script setup lang="ts">
import type { Conversation, ConversationStatus, MessagePlatform } from '~/types/conversation'

interface Props {
  conversations: Conversation[]
  loading?: boolean
  selected?: string
}

withDefaults(defineProps<Props>(), {
  loading: false,
  selected: ''
})

defineEmits<{
  resolve: [conversation: Conversation]
  handoff: [conversation: Conversation]
}>()

const { t } = useI18n()
const format = useFormat()

function getPlatformBgClass(platform: MessagePlatform): string {
  const classes: Record<MessagePlatform, string> = {
    'WhatsApp': 'bg-green-500',
    'Messenger': 'bg-blue-500',
    'Instagram': 'bg-gradient-to-br from-purple-500 to-pink-500'
  }
  return classes[platform] || 'bg-gray-500'
}

function getPlatformIcon(platform: MessagePlatform) {
  return defineComponent({
    render() {
      if (platform === 'WhatsApp') {
        return h('svg', { fill: 'currentColor', viewBox: '0 0 24 24' }, [
          h('path', { d: 'M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z' })
        ])
      } else if (platform === 'Messenger') {
        return h('svg', { fill: 'currentColor', viewBox: '0 0 24 24' }, [
          h('path', { d: 'M12 0C5.373 0 0 4.974 0 11.111c0 3.498 1.744 6.614 4.469 8.654V24l4.088-2.242c1.092.301 2.246.464 3.443.464 6.627 0 12-4.975 12-11.111S18.627 0 12 0zm1.191 14.963l-3.055-3.26-5.963 3.26L10.732 8l3.131 3.259L19.752 8l-6.561 6.963z' })
        ])
      } else {
        return h('svg', { fill: 'currentColor', viewBox: '0 0 24 24' }, [
          h('path', { d: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z' })
        ])
      }
    }
  })
}

function getStatusVariant(status: ConversationStatus): string {
  const variants: Record<ConversationStatus, string> = {
    'Active': 'success',
    'PendingHandoff': 'warning',
    'Resolved': 'info',
    'Closed': 'secondary'
  }
  return variants[status] || 'secondary'
}
</script>
