<template>
  <div v-if="!dismissed" :class="alertClasses" role="alert">
    <!-- Icon -->
    <div v-if="!hideIcon" class="shrink-0">
      <component :is="iconComponent" class="w-5 h-5" />
    </div>

    <!-- Content -->
    <div class="flex-1">
      <h4 v-if="title" class="font-medium mb-1">
        {{ title }}
      </h4>
      <div :class="{ 'text-sm': title }">
        <slot />
      </div>
    </div>

    <!-- Dismiss Button -->
    <button
      v-if="dismissible"
      type="button"
      class="shrink-0 p-1 rounded-lg opacity-70 hover:opacity-100 transition-opacity"
      @click="dismiss"
    >
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>
  </div>
</template>

<script setup lang="ts">
import { h } from 'vue'

interface Props {
  variant?: 'info' | 'success' | 'warning' | 'danger'
  title?: string
  dismissible?: boolean
  hideIcon?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'info',
  dismissible: false,
  hideIcon: false
})

const emit = defineEmits<{
  dismiss: []
}>()

const dismissed = ref(false)

const variantClasses: Record<string, string> = {
  info: 'alert-info',
  success: 'alert-success',
  warning: 'alert-warning',
  danger: 'alert-danger'
}

const alertClasses = computed(() => [
  'alert',
  variantClasses[props.variant]
])

// Icon components based on variant
const icons = {
  info: h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
    h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' })
  ]),
  success: h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
    h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' })
  ]),
  warning: h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
    h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z' })
  ]),
  danger: h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
    h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z' })
  ])
}

const iconComponent = computed(() => icons[props.variant])

const dismiss = () => {
  dismissed.value = true
  emit('dismiss')
}
</script>
