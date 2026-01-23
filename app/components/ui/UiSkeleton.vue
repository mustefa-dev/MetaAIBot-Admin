<template>
  <div :class="skeletonClasses" />
</template>

<script setup lang="ts">
interface Props {
  variant?: 'text' | 'circular' | 'rectangular' | 'rounded'
  width?: string
  height?: string
  lines?: number
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'text',
  lines: 1
})

const variantClasses: Record<string, string> = {
  text: 'h-4 rounded',
  circular: 'rounded-full',
  rectangular: 'rounded-none',
  rounded: 'rounded-lg'
}

const skeletonClasses = computed(() => [
  'skeleton animate-pulse bg-gray-200 dark:bg-gray-700',
  variantClasses[props.variant]
])
</script>

<style scoped>
.skeleton {
  width: v-bind('width || "100%"');
  height: v-bind('height || (variant === "text" ? "1rem" : "100%")');
}
</style>
