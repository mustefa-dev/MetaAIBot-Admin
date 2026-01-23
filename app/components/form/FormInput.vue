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
    <UiInput
      :id="id"
      v-model="model"
      :type="type"
      :placeholder="placeholder"
      :disabled="disabled"
      :readonly="readonly"
      :required="required"
      :error="!!error"
      :autocomplete="autocomplete"
      :clearable="clearable"
      :size="size"
      @blur="$emit('blur', $event)"
      @focus="$emit('focus', $event)"
    >
      <template v-if="$slots['icon-start']" #icon-start>
        <slot name="icon-start" />
      </template>
      <template v-if="$slots['icon-end']" #icon-end>
        <slot name="icon-end" />
      </template>
    </UiInput>
  </FormField>
</template>

<script setup lang="ts">
interface Props {
  id?: string
  label?: string
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search'
  modelValue?: string | number
  placeholder?: string
  disabled?: boolean
  readonly?: boolean
  required?: boolean
  optional?: boolean
  error?: string
  hint?: string
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
  optional: false,
  clearable: false,
  size: 'md'
})

const emit = defineEmits<{
  'update:modelValue': [value: string | number]
  blur: [event: FocusEvent]
  focus: [event: FocusEvent]
}>()

const model = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})
</script>
