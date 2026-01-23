<template>
  <UiModal
    v-model="isOpen"
    :title="title"
    size="sm"
    :close-on-backdrop="false"
  >
    <div class="text-center sm:text-start">
      <!-- Icon -->
      <div :class="['mx-auto sm:mx-0 w-12 h-12 rounded-full flex items-center justify-center mb-4', iconBgClass]">
        <component :is="iconComponent" :class="['w-6 h-6', iconColorClass]" />
      </div>

      <!-- Message -->
      <p class="text-gray-600 dark:text-gray-400">
        {{ message }}
      </p>
    </div>

    <template #footer>
      <div class="flex justify-end gap-3">
        <UiButton variant="secondary" @click="cancel">
          {{ cancelText }}
        </UiButton>
        <UiButton :variant="confirmVariant" :loading="loading" @click="confirm">
          {{ confirmText }}
        </UiButton>
      </div>
    </template>
  </UiModal>
</template>

<script setup lang="ts">
import { h } from 'vue'

interface Props {
  modelValue: boolean
  title?: string
  message: string
  variant?: 'danger' | 'warning' | 'info'
  confirmText?: string
  cancelText?: string
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  title: 'Confirm',
  variant: 'danger',
  confirmText: 'Confirm',
  cancelText: 'Cancel',
  loading: false
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  confirm: []
  cancel: []
}>()

const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const confirmVariant = computed(() => {
  const variants: Record<string, 'danger' | 'warning' | 'primary'> = {
    danger: 'danger',
    warning: 'warning',
    info: 'primary'
  }
  return variants[props.variant]
})

const iconBgClass = computed(() => {
  const classes: Record<string, string> = {
    danger: 'bg-danger-100 dark:bg-danger-900/30',
    warning: 'bg-warning-100 dark:bg-warning-900/30',
    info: 'bg-primary-100 dark:bg-primary-900/30'
  }
  return classes[props.variant]
})

const iconColorClass = computed(() => {
  const classes: Record<string, string> = {
    danger: 'text-danger-600 dark:text-danger-400',
    warning: 'text-warning-600 dark:text-warning-400',
    info: 'text-primary-600 dark:text-primary-400'
  }
  return classes[props.variant]
})

const icons = {
  danger: h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
    h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z' })
  ]),
  warning: h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
    h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' })
  ]),
  info: h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
    h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' })
  ])
}

const iconComponent = computed(() => icons[props.variant])

const confirm = () => {
  emit('confirm')
}

const cancel = () => {
  isOpen.value = false
  emit('cancel')
}
</script>
