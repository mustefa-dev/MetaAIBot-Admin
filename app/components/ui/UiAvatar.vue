<template>
  <div :class="avatarClasses">
    <img
      v-if="src && !imageError"
      :src="src"
      :alt="alt"
      class="w-full h-full object-cover"
      @error="imageError = true"
    />
    <span v-else class="font-medium">
      {{ initials }}
    </span>

    <!-- Status indicator -->
    <span
      v-if="status"
      :class="statusClasses"
    />
  </div>
</template>

<script setup lang="ts">
interface Props {
  src?: string
  alt?: string
  name?: string
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  status?: 'online' | 'offline' | 'away' | 'busy'
  rounded?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  rounded: true
})

const imageError = ref(false)

const sizeClasses: Record<string, string> = {
  xs: 'w-6 h-6 text-xs',
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base',
  xl: 'w-16 h-16 text-lg'
}

const statusSizeClasses: Record<string, string> = {
  xs: 'w-1.5 h-1.5',
  sm: 'w-2 h-2',
  md: 'w-2.5 h-2.5',
  lg: 'w-3 h-3',
  xl: 'w-3.5 h-3.5'
}

const statusColorClasses: Record<string, string> = {
  online: 'bg-success-500',
  offline: 'bg-gray-400',
  away: 'bg-warning-500',
  busy: 'bg-danger-500'
}

const avatarClasses = computed(() => [
  'relative inline-flex items-center justify-center',
  'bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-300',
  'overflow-hidden',
  sizeClasses[props.size],
  props.rounded ? 'rounded-full' : 'rounded-lg'
])

const statusClasses = computed(() => [
  'absolute bottom-0 end-0 block rounded-full ring-2 ring-white dark:ring-gray-800',
  statusSizeClasses[props.size],
  props.status ? statusColorClasses[props.status] : ''
])

const initials = computed(() => {
  if (!props.name) return '?'
  return props.name
    .split(' ')
    .map(part => part.charAt(0).toUpperCase())
    .slice(0, 2)
    .join('')
})

// Reset error state when src changes
watch(() => props.src, () => {
  imageError.value = false
})
</script>
