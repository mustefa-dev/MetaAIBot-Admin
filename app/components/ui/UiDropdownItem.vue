<template>
  <component
    :is="as"
    :class="itemClasses"
    :disabled="disabled"
    v-bind="$attrs"
    @click="handleClick"
  >
    <slot name="icon" />
    <span class="flex-1">
      <slot />
    </span>
    <slot name="suffix" />
  </component>
</template>

<script setup lang="ts">
interface Props {
  as?: 'button' | 'a' | 'div'
  variant?: 'default' | 'danger'
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  as: 'button',
  variant: 'default',
  disabled: false
})

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

const variantClasses: Record<string, string> = {
  default: 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700',
  danger: 'text-danger-600 hover:bg-danger-50 dark:text-danger-400 dark:hover:bg-danger-900/20'
}

const itemClasses = computed(() => [
  'flex items-center gap-2 w-full px-4 py-2 text-sm text-start',
  'transition-colors cursor-pointer',
  variantClasses[props.variant],
  {
    'opacity-50 cursor-not-allowed pointer-events-none': props.disabled
  }
])

const handleClick = (event: MouseEvent) => {
  if (!props.disabled) {
    emit('click', event)
  }
}
</script>
