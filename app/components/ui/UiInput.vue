<template>
  <div class="relative">
    <!-- Icon Start -->
    <div
      v-if="$slots['icon-start']"
      class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none text-gray-400"
    >
      <slot name="icon-start" />
    </div>

    <!-- Input -->
    <input
      :id="id"
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :readonly="readonly"
      :required="required"
      :autocomplete="autocomplete"
      :class="inputClasses"
      v-bind="$attrs"
      @input="onInput"
      @blur="$emit('blur', $event)"
      @focus="$emit('focus', $event)"
    />

    <!-- Icon End -->
    <div
      v-if="$slots['icon-end'] || clearable"
      class="absolute inset-y-0 end-0 flex items-center pe-3"
    >
      <button
        v-if="clearable && modelValue"
        type="button"
        class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        @click="$emit('update:modelValue', '')"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      <slot v-else name="icon-end" />
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  id?: string
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search'
  modelValue?: string | number
  placeholder?: string
  disabled?: boolean
  readonly?: boolean
  required?: boolean
  error?: boolean
  autocomplete?: string
  clearable?: boolean
  size?: 'sm' | 'md' | 'lg'
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  modelValue: '',
  disabled: false,
  readonly: false,
  required: false,
  error: false,
  clearable: false,
  size: 'md'
})

const emit = defineEmits<{
  'update:modelValue': [value: string | number]
  blur: [event: FocusEvent]
  focus: [event: FocusEvent]
}>()

const sizeClasses: Record<string, string> = {
  sm: 'py-1.5 text-xs',
  md: 'py-2.5 text-sm',
  lg: 'py-3 text-base'
}

const inputClasses = computed(() => [
  'input',
  sizeClasses[props.size],
  {
    'input-error': props.error,
    'ps-10': !!useSlots()['icon-start'],
    'pe-10': !!useSlots()['icon-end'] || props.clearable
  }
])

const onInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  const value = props.type === 'number' ? Number(target.value) : target.value
  emit('update:modelValue', value)
}
</script>
