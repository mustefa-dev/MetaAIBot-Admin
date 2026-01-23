<template>
  <div class="flex flex-col h-full">
    <!-- Chat Header -->
    <div class="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
      <div class="flex items-center gap-3">
        <!-- Platform Badge -->
        <div
          class="w-10 h-10 rounded-full flex items-center justify-center"
          :class="platformBgClass"
        >
          <component :is="platformIcon" class="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 class="font-semibold text-gray-900 dark:text-white">
            {{ conversation.customerName || t('customers.name') }}
          </h3>
          <div class="flex items-center gap-2 text-sm text-gray-500">
            <span>{{ conversation.platform }}</span>
            <span>&bull;</span>
            <UiBadge :variant="statusVariant" size="sm">
              {{ t(`conversations.statuses.${conversation.status}`) }}
            </UiBadge>
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div class="flex items-center gap-2">
        <UiButton
          v-if="conversation.status === 'Active' || conversation.status === 'PendingHandoff'"
          variant="outline"
          size="sm"
          @click="$emit('resolve')"
        >
          <svg class="w-4 h-4 me-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
          {{ t('conversations.markResolved') }}
        </UiButton>
        <UiButton
          v-if="conversation.customerId"
          variant="ghost"
          size="sm"
          @click="$emit('view-customer')"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </UiButton>
      </div>
    </div>

    <!-- Messages Area -->
    <div
      ref="messagesContainer"
      class="flex-1 overflow-y-auto p-4 space-y-4"
    >
      <!-- Loading -->
      <div v-if="loading" class="flex items-center justify-center h-full">
        <UiSpinner />
      </div>

      <!-- Empty State -->
      <div v-else-if="messages.length === 0" class="flex flex-col items-center justify-center h-full text-gray-500">
        <svg class="w-16 h-16 mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
        <p>{{ t('conversations.noMessages') }}</p>
      </div>

      <!-- Messages -->
      <template v-else>
        <!-- Date Separator -->
        <template v-for="(group, date) in groupedMessages" :key="date">
          <div class="flex items-center justify-center my-4">
            <span class="px-3 py-1 text-xs text-gray-500 bg-gray-100 dark:bg-gray-800 rounded-full">
              {{ formatDate(date) }}
            </span>
          </div>
          <ConversationsMessageBubble
            v-for="message in group"
            :key="message.id"
            :message="message"
            :customer-name="conversation.customerName"
            :show-sender="shouldShowSender(message, group)"
            @view-media="$emit('view-media', $event)"
          />
        </template>
      </template>
    </div>

    <!-- Detected Intent -->
    <div
      v-if="conversation.detectedIntent && conversation.status !== 'Closed'"
      class="px-4 py-2 bg-blue-50 dark:bg-blue-900/20 border-t border-blue-100 dark:border-blue-900"
    >
      <div class="flex items-center gap-2 text-sm">
        <svg class="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
        <span class="text-blue-700 dark:text-blue-300">
          {{ t('conversations.detectedIntent') }}:
        </span>
        <UiBadge variant="info" size="sm">
          {{ t(`intents.${conversation.detectedIntent}`) }}
        </UiBadge>
      </div>
    </div>

    <!-- Input Area -->
    <div
      v-if="conversation.status !== 'Closed' && conversation.status !== 'Resolved'"
      class="p-4 border-t border-gray-200 dark:border-gray-700"
    >
      <form @submit.prevent="sendMessage" class="flex gap-3">
        <FormTextarea
          v-model="newMessage"
          :placeholder="t('conversations.typeMessage')"
          :rows="1"
          class="flex-1"
          @keydown.enter.exact.prevent="sendMessage"
        />
        <UiButton
          type="submit"
          :disabled="!newMessage.trim() || sending"
          :loading="sending"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        </UiButton>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Conversation, Message, ConversationStatus } from '~/types/conversation'

interface Props {
  conversation: Conversation
  messages: Message[]
  loading?: boolean
  sending?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  sending: false
})

const emit = defineEmits<{
  send: [content: string]
  resolve: []
  'view-customer': []
  'view-media': [url: string]
}>()

const { t } = useI18n()

const messagesContainer = ref<HTMLElement | null>(null)
const newMessage = ref('')

const platformBgClass = computed(() => {
  const classes: Record<string, string> = {
    'WhatsApp': 'bg-green-500',
    'Messenger': 'bg-blue-500',
    'Instagram': 'bg-gradient-to-br from-purple-500 to-pink-500'
  }
  return classes[props.conversation.platform] || 'bg-gray-500'
})

const platformIcon = computed(() => {
  return defineComponent({
    render() {
      if (props.conversation.platform === 'WhatsApp') {
        return h('svg', { fill: 'currentColor', viewBox: '0 0 24 24' }, [
          h('path', { d: 'M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z' })
        ])
      } else if (props.conversation.platform === 'Messenger') {
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
})

const statusVariant = computed(() => {
  const variants: Record<ConversationStatus, string> = {
    'Active': 'success',
    'PendingHandoff': 'warning',
    'Resolved': 'info',
    'Closed': 'secondary'
  }
  return variants[props.conversation.status] || 'secondary'
})

const groupedMessages = computed(() => {
  const groups: Record<string, Message[]> = {}

  for (const message of props.messages) {
    const date = new Date(message.sentAt).toDateString()
    if (!groups[date]) {
      groups[date] = []
    }
    groups[date].push(message)
  }

  return groups
})

function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)

  if (date.toDateString() === today.toDateString()) {
    return 'Today'
  }
  if (date.toDateString() === yesterday.toDateString()) {
    return 'Yesterday'
  }
  return date.toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })
}

function shouldShowSender(message: Message, group: Message[]): boolean {
  const index = group.indexOf(message)
  if (index === 0) return true
  return group[index - 1].direction !== message.direction
}

function sendMessage() {
  if (!newMessage.value.trim()) return
  emit('send', newMessage.value.trim())
  newMessage.value = ''
}

// Auto-scroll to bottom when new messages arrive
watch(() => props.messages.length, () => {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
  })
})

// Scroll to bottom on mount
onMounted(() => {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
  })
})
</script>
