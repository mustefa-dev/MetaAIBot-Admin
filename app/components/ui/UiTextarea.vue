<template>
  <textarea
    :id="id"
    :value="modelValue"
    :placeholder="placeholder"
    :disabled="disabled"
    :readonly="readonly"
    :required="required"
    :rows="rows"
    :class="textareaClasses"
    v-bind="$attrs"
    @input="onInput"
    @blur="$emit('blur', $event)"
    @focus="$emit('focus', $event)"
  />
</template>

<script setup lang="ts">
interface Props {
  id?: string
  modelValue?: string
  placeholder?: string
  disabled?: boolean
  readonly?: boolean
  required?: boolean
  error?: boolean
  rows?: number
  resize?: 'none' | 'vertical' | 'horizontal' | 'both'
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  disabled: false,
  readonly: false,
  required: false,
  error: false,
  rows: 3,
  resize: 'vertical'
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  blur: [event: FocusEvent]
  focus: [event: FocusEvent]
}>()

const resizeClasses: Record<string, string> = {
  none: 'resize-none',
  vertical: 'resize-y',
  horizontal: 'resize-x',
  both: 'resize'
}

const textareaClasses = computed(() => [
  'input',
  resizeClasses[props.resize],
  {
    'input-error': props.error
  }
])

const onInput = (event: Event) => {
  const target = event.target as HTMLTextAreaElement
  emit('update:modelValue', target.value)
}
</script>
