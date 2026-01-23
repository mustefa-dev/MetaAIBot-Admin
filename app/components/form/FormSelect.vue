<template>
  <FormField
    :id="id"
    :label="label"
    :error="error"
    :hint="hint"
    :required="required"
    :optional="optional"
    :disabled="disabled"
  >
    <UiSelect
      :id="id"
      v-model="model"
      :options="options"
      :placeholder="placeholder"
      :disabled="disabled"
      :required="required"
      :error="!!error"
      :size="size"
    />
  </FormField>
</template>

<script setup lang="ts">
interface Option {
  value: string | number
  label: string
  disabled?: boolean
}

interface Props {
  id?: string
  label?: string
  modelValue?: string | number | null
  options: Option[] | string[] | number[]
  placeholder?: string
  disabled?: boolean
  required?: boolean
  optional?: boolean
  error?: string
  hint?: string
  size?: 'sm' | 'md' | 'lg'
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  disabled: false,
  required: false,
  optional: false,
  size: 'md'
})

const emit = defineEmits<{
  'update:modelValue': [value: string | number]
}>()

const model = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})
</script>
