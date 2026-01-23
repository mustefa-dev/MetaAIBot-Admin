<template>
  <div :class="['space-y-1.5', { 'opacity-50': disabled }]">
    <!-- Label -->
    <label v-if="label" :for="id" class="label">
      {{ label }}
      <span v-if="required" class="text-danger-500">*</span>
      <span v-if="optional" class="text-gray-400 font-normal">({{ $t('common.optional') }})</span>
    </label>

    <!-- Input Slot -->
    <slot />

    <!-- Error Message -->
    <p v-if="error" class="error-text">
      {{ error }}
    </p>

    <!-- Hint -->
    <p v-else-if="hint" class="hint-text">
      {{ hint }}
    </p>
  </div>
</template>

<script setup lang="ts">
interface Props {
  id?: string
  label?: string
  error?: string
  hint?: string
  required?: boolean
  optional?: boolean
  disabled?: boolean
}

withDefaults(defineProps<Props>(), {
  required: false,
  optional: false,
  disabled: false
})
</script>
