<template>
  <label :class="['inline-flex items-center gap-3 cursor-pointer', { 'opacity-50 cursor-not-allowed': disabled }]">
    <button
      type="button"
      role="switch"
      :aria-checked="modelValue"
      :disabled="disabled"
      :class="switchClasses"
      @click="toggle"
    >
      <span :class="dotClasses" />
    </button>
    <span v-if="$slots.default || label" class="text-sm text-gray-700 dark:text-gray-300">
      <slot>{{ label }}</slot>
    </span>
  </label>
</template>

<script setup lang="ts">
interface Props {
  modelValue?: boolean
  label?: string
  disabled?: boolean
  size?: 'sm' | 'md' | 'lg'
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  disabled: false,
  size: 'md'
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const sizes = {
  sm: { switch: 'w-8 h-4', dot: 'w-3 h-3', translate: 'translate-x-4 rtl:-translate-x-4' },
  md: { switch: 'w-11 h-6', dot: 'w-5 h-5', translate: 'translate-x-5 rtl:-translate-x-5' },
  lg: { switch: 'w-14 h-7', dot: 'w-6 h-6', translate: 'translate-x-7 rtl:-translate-x-7' }
}

const switchClasses = computed(() => [
  'relative inline-flex shrink-0 rounded-full transition-colors duration-200 ease-in-out',
  'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2',
  'dark:focus-visible:ring-offset-gray-900',
  sizes[props.size].switch,
  props.modelValue
    ? 'bg-primary-600'
    : 'bg-gray-200 dark:bg-gray-700',
  { 'cursor-not-allowed': props.disabled }
])

const dotClasses = computed(() => [
  'inline-block rounded-full bg-white shadow-sm transform transition-transform duration-200 ease-in-out',
  sizes[props.size].dot,
  props.modelValue
    ? sizes[props.size].translate
    : 'translate-x-0.5 rtl:-translate-x-0.5'
])

const toggle = () => {
  if (!props.disabled) {
    emit('update:modelValue', !props.modelValue)
  }
}
</script>
