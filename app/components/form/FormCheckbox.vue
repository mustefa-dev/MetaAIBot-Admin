<template>
  <div :class="['space-y-1.5', { 'opacity-50': disabled }]">
    <UiCheckbox
      v-model="model"
      :label="label"
      :disabled="disabled"
      :size="size"
    >
      <slot />
    </UiCheckbox>

    <!-- Error Message -->
    <p v-if="error" class="error-text ps-6">
      {{ error }}
    </p>

    <!-- Hint -->
    <p v-else-if="hint" class="hint-text ps-6">
      {{ hint }}
    </p>
  </div>
</template>

<script setup lang="ts">
interface Props {
  modelValue?: boolean
  label?: string
  disabled?: boolean
  error?: string
  hint?: string
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

const model = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})
</script>
