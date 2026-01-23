<template>
  <div :class="['space-y-1.5', { 'opacity-50': disabled }]">
    <div class="flex items-center justify-between">
      <div v-if="label || description">
        <label v-if="label" class="label mb-0">{{ label }}</label>
        <p v-if="description" class="text-sm text-gray-500 dark:text-gray-400">
          {{ description }}
        </p>
      </div>
      <UiSwitch
        v-model="model"
        :disabled="disabled"
        :size="size"
      />
    </div>

    <!-- Error Message -->
    <p v-if="error" class="error-text">
      {{ error }}
    </p>
  </div>
</template>

<script setup lang="ts">
interface Props {
  modelValue?: boolean
  label?: string
  description?: string
  disabled?: boolean
  error?: string
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
