<template>
  <label :class="['inline-flex items-center gap-2 cursor-pointer', { 'opacity-50 cursor-not-allowed': disabled }]">
    <input
      type="checkbox"
      :checked="modelValue"
      :disabled="disabled"
      :class="checkboxClasses"
      @change="onChange"
    />
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

const sizeClasses: Record<string, string> = {
  sm: 'w-3.5 h-3.5',
  md: 'w-4 h-4',
  lg: 'w-5 h-5'
}

const checkboxClasses = computed(() => [
  'rounded border-gray-300 text-primary-600 shadow-sm',
  'focus:ring-2 focus:ring-primary-500 focus:ring-offset-0',
  'dark:border-gray-600 dark:bg-gray-700 dark:checked:bg-primary-600',
  'disabled:opacity-50 disabled:cursor-not-allowed',
  sizeClasses[props.size]
])

const onChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.checked)
}
</script>
