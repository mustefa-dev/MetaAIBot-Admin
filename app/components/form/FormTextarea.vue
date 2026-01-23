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
    <UiTextarea
      :id="id"
      v-model="model"
      :placeholder="placeholder"
      :disabled="disabled"
      :readonly="readonly"
      :required="required"
      :error="!!error"
      :rows="rows"
      :resize="resize"
      @blur="$emit('blur', $event)"
      @focus="$emit('focus', $event)"
    />
    <p v-if="maxLength" class="mt-1 text-xs text-gray-400 text-end">
      {{ modelValue?.length || 0 }} / {{ maxLength }}
    </p>
  </FormField>
</template>

<script setup lang="ts">
interface Props {
  id?: string
  label?: string
  modelValue?: string
  placeholder?: string
  disabled?: boolean
  readonly?: boolean
  required?: boolean
  optional?: boolean
  error?: string
  hint?: string
  rows?: number
  resize?: 'none' | 'vertical' | 'horizontal' | 'both'
  maxLength?: number
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  disabled: false,
  readonly: false,
  required: false,
  optional: false,
  rows: 3,
  resize: 'vertical'
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  blur: [event: FocusEvent]
  focus: [event: FocusEvent]
}>()

const model = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})
</script>
