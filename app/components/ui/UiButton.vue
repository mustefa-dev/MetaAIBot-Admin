<template>
  <button
    :type="type"
    :class="buttonClasses"
    :disabled="disabled || loading"
    v-bind="$attrs"
  >
    <UiSpinner v-if="loading" :size="spinnerSize" class="shrink-0" />
    <slot v-else name="icon-start" />
    <span v-if="$slots.default" :class="{ 'opacity-0': loading && !$slots['icon-start'] }">
      <slot />
    </span>
    <slot name="icon-end" />
  </button>
</template>

<script setup lang="ts">
interface Props {
  type?: 'button' | 'submit' | 'reset'
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'success' | 'warning' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  loading?: boolean
  block?: boolean
  iconOnly?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  type: 'button',
  variant: 'primary',
  size: 'md',
  disabled: false,
  loading: false,
  block: false,
  iconOnly: false
})

const variantClasses: Record<string, string> = {
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  outline: 'btn-outline',
  danger: 'btn-danger',
  success: 'btn-success',
  warning: 'btn-warning',
  ghost: 'btn-ghost'
}

const sizeClasses: Record<string, string> = {
  sm: 'btn-sm',
  md: '',
  lg: 'btn-lg'
}

const buttonClasses = computed(() => [
  'btn',
  variantClasses[props.variant],
  sizeClasses[props.size],
  {
    'w-full': props.block,
    'btn-icon': props.iconOnly,
    'cursor-not-allowed': props.disabled || props.loading
  }
])

const spinnerSize = computed(() => {
  const sizes: Record<string, 'xs' | 'sm' | 'md'> = {
    sm: 'xs',
    md: 'sm',
    lg: 'md'
  }
  return sizes[props.size]
})
</script>
