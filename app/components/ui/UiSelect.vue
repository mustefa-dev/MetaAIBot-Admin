<template>
  <div class="relative">
    <select
      :id="id"
      :value="modelValue"
      :disabled="disabled"
      :required="required"
      :class="selectClasses"
      v-bind="$attrs"
      @change="onChange"
    >
      <option v-if="placeholder" value="" disabled>
        {{ placeholder }}
      </option>
      <option
        v-for="option in normalizedOptions"
        :key="option.value"
        :value="option.value"
        :disabled="option.disabled"
      >
        {{ option.label }}
      </option>
    </select>

    <!-- Dropdown Icon -->
    <div class="absolute inset-y-0 end-0 flex items-center pe-3 pointer-events-none">
      <svg
        class="w-4 h-4 text-gray-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
      </svg>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Option {
  value: string | number
  label: string
  disabled?: boolean
}

interface Props {
  id?: string
  modelValue?: string | number | null
  options: Option[] | string[] | number[]
  placeholder?: string
  disabled?: boolean
  required?: boolean
  error?: boolean
  size?: 'sm' | 'md' | 'lg'
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  disabled: false,
  required: false,
  error: false,
  size: 'md'
})

const emit = defineEmits<{
  'update:modelValue': [value: string | number]
}>()

const normalizedOptions = computed((): Option[] => {
  return props.options.map((opt) => {
    if (typeof opt === 'object') {
      return opt as Option
    }
    return { value: opt, label: String(opt) }
  })
})

const sizeClasses: Record<string, string> = {
  sm: 'py-1.5 text-xs',
  md: 'py-2.5 text-sm',
  lg: 'py-3 text-base'
}

const selectClasses = computed(() => [
  'input appearance-none pe-10 cursor-pointer',
  sizeClasses[props.size],
  {
    'input-error': props.error
  }
])

const onChange = (event: Event) => {
  const target = event.target as HTMLSelectElement
  emit('update:modelValue', target.value)
}
</script>
