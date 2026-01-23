<template>
  <div :class="cardClasses">
    <!-- Header -->
    <div v-if="$slots.header || title" :class="headerClasses">
      <slot name="header">
        <div class="flex items-center justify-between">
          <div>
            <h3 v-if="title" class="text-lg font-semibold text-gray-900 dark:text-white">
              {{ title }}
            </h3>
            <p v-if="subtitle" class="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {{ subtitle }}
            </p>
          </div>
          <slot name="header-actions" />
        </div>
      </slot>
    </div>

    <!-- Body -->
    <div v-if="$slots.default" :class="bodyClasses">
      <slot />
    </div>

    <!-- Footer -->
    <div v-if="$slots.footer" :class="footerClasses">
      <slot name="footer" />
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title?: string
  subtitle?: string
  noPadding?: boolean
  hover?: boolean
  bordered?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  noPadding: false,
  hover: false,
  bordered: false
})

const cardClasses = computed(() => [
  'bg-white rounded-xl border border-gray-100 dark:bg-gray-800 dark:border-gray-700',
  {
    'shadow-soft': !props.bordered,
    'hover:shadow-soft-lg transition-shadow duration-200': props.hover
  }
])

const headerClasses = computed(() => [
  'border-b border-gray-100 dark:border-gray-700',
  props.noPadding ? '' : 'px-6 py-4'
])

const bodyClasses = computed(() => [
  props.noPadding ? '' : 'p-6'
])

const footerClasses = computed(() => [
  'border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50',
  props.noPadding ? '' : 'px-6 py-4'
])
</script>
