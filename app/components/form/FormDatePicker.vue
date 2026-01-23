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
    <div class="relative">
      <input
        :id="id"
        :type="type"
        :value="modelValue"
        :min="min"
        :max="max"
        :disabled="disabled"
        :required="required"
        :class="[
          'input pe-10',
          { 'input-error': error }
        ]"
        @input="onInput"
      />
      <div class="absolute inset-y-0 end-0 flex items-center pe-3 pointer-events-none text-gray-400">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>
    </div>
  </FormField>
</template>

<script setup lang="ts">
interface Props {
  id?: string
  label?: string
  modelValue?: string
  type?: 'date' | 'datetime-local' | 'time'
  min?: string
  max?: string
  disabled?: boolean
  required?: boolean
  optional?: boolean
  error?: string
  hint?: string
}

const props = withDefaults(defineProps<Props>(), {
  type: 'date',
  disabled: false,
  required: false,
  optional: false
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const onInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
}
</script>
