<template>
  <div
    class="flex gap-3"
    :class="isOutgoing ? 'flex-row-reverse' : 'flex-row'"
  >
    <!-- Avatar -->
    <div
      class="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
      :class="avatarClass"
    >
      <svg v-if="isOutgoing" class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
      <span v-else class="text-sm font-medium text-white">
        {{ initials }}
      </span>
    </div>

    <!-- Message Content -->
    <div
      class="max-w-[70%] rounded-2xl px-4 py-2"
      :class="bubbleClass"
    >
      <!-- Sender Name -->
      <div v-if="showSender" class="text-xs font-medium mb-1" :class="senderClass">
        {{ isOutgoing ? (message.isAIResponse ? 'AI Bot' : 'Agent') : customerName }}
      </div>

      <!-- Message Text -->
      <p class="text-sm whitespace-pre-wrap break-words" :class="textClass">
        {{ message.content }}
      </p>

      <!-- Media Attachments -->
      <div v-if="message.mediaUrl" class="mt-2">
        <img
          v-if="isImage(message.mediaType)"
          :src="message.mediaUrl"
          :alt="message.mediaType"
          class="max-w-full rounded-lg cursor-pointer hover:opacity-90"
          @click="$emit('view-media', message.mediaUrl)"
        />
        <a
          v-else
          :href="message.mediaUrl"
          target="_blank"
          class="flex items-center gap-2 p-2 bg-white/10 rounded-lg hover:bg-white/20"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
          </svg>
          <span class="text-sm">{{ message.mediaType || 'Attachment' }}</span>
        </a>
      </div>

      <!-- Footer -->
      <div class="flex items-center justify-end gap-2 mt-1">
        <span class="text-xs opacity-70" :class="textClass">
          {{ formatTime(message.sentAt) }}
        </span>
        <template v-if="isOutgoing && message.status">
          <svg
            v-if="message.status === 'Sent'"
            class="w-3.5 h-3.5 opacity-70"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
          <svg
            v-else-if="message.status === 'Delivered'"
            class="w-3.5 h-3.5 opacity-70"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <svg
            v-else-if="message.status === 'Read'"
            class="w-3.5 h-3.5 text-blue-400"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
          </svg>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Message } from '~/types/conversation'

interface Props {
  message: Message
  customerName?: string
  showSender?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  customerName: 'Customer',
  showSender: false
})

defineEmits<{
  'view-media': [url: string]
}>()

const isOutgoing = computed(() => props.message.direction === 'Outgoing')

const initials = computed(() => {
  return props.customerName
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
})

const avatarClass = computed(() => {
  if (isOutgoing.value) {
    return props.message.isAIResponse
      ? 'bg-purple-500'
      : 'bg-primary-500'
  }
  return 'bg-gray-500'
})

const bubbleClass = computed(() => {
  if (isOutgoing.value) {
    return props.message.isAIResponse
      ? 'bg-purple-500 text-white rounded-tr-sm'
      : 'bg-primary-500 text-white rounded-tr-sm'
  }
  return 'bg-gray-100 dark:bg-gray-800 rounded-tl-sm'
})

const textClass = computed(() => {
  return isOutgoing.value ? 'text-white' : 'text-gray-900 dark:text-white'
})

const senderClass = computed(() => {
  return isOutgoing.value ? 'text-white/80' : 'text-gray-500 dark:text-gray-400'
})

function formatTime(date: string): string {
  return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

function isImage(mediaType?: string): boolean {
  if (!mediaType) return false
  return ['image', 'photo', 'jpg', 'jpeg', 'png', 'gif', 'webp'].some(
    type => mediaType.toLowerCase().includes(type)
  )
}
</script>
