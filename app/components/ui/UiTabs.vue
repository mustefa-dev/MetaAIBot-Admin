<template>
  <div>
    <!-- Tab List -->
    <div :class="tabListClasses">
      <button
        v-for="tab in tabs"
        :key="tab.key"
        type="button"
        :class="[tabClasses, { [activeTabClasses]: modelValue === tab.key }]"
        :disabled="tab.disabled"
        @click="selectTab(tab.key)"
      >
        <component v-if="tab.icon" :is="tab.icon" class="w-5 h-5" />
        {{ tab.label }}
        <UiBadge v-if="tab.badge" :variant="tab.badgeVariant || 'primary'" size="sm">
          {{ tab.badge }}
        </UiBadge>
      </button>
    </div>

    <!-- Tab Panels -->
    <div class="mt-4">
      <slot :active-tab="modelValue" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Component } from 'vue'

interface Tab {
  key: string
  label: string
  icon?: Component
  badge?: string | number
  badgeVariant?: 'primary' | 'success' | 'warning' | 'danger' | 'gray'
  disabled?: boolean
}

interface Props {
  modelValue: string
  tabs: Tab[]
  variant?: 'underline' | 'pills' | 'boxed'
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'underline'
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  change: [value: string]
}>()

const tabListClasses = computed(() => {
  const base = 'flex'
  const variants: Record<string, string> = {
    underline: 'border-b border-gray-200 dark:border-gray-700 gap-4',
    pills: 'gap-2',
    boxed: 'bg-gray-100 dark:bg-gray-800 rounded-lg p-1 gap-1'
  }
  return `${base} ${variants[props.variant]}`
})

const tabClasses = computed(() => {
  const base = 'flex items-center gap-2 text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
  const variants: Record<string, string> = {
    underline: 'px-1 py-3 border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300 -mb-px',
    pills: 'px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700',
    boxed: 'px-4 py-2 rounded-md text-gray-600 dark:text-gray-400'
  }
  return `${base} ${variants[props.variant]}`
})

const activeTabClasses = computed(() => {
  const variants: Record<string, string> = {
    underline: '!text-primary-600 !border-primary-600 dark:!text-primary-400 dark:!border-primary-400',
    pills: '!bg-primary-600 !text-white',
    boxed: '!bg-white dark:!bg-gray-700 !text-gray-900 dark:!text-white shadow-sm'
  }
  return variants[props.variant]
})

const selectTab = (key: string) => {
  emit('update:modelValue', key)
  emit('change', key)
}
</script>
