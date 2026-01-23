<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
    <div class="text-center">
      <UiSpinner class="w-8 h-8 text-primary-500" />
      <p class="mt-4 text-gray-600 dark:text-gray-400">{{ $t('common.loading') }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'auth'
})

// Redirect to dashboard
navigateTo('/dashboard', { replace: true })
</script>
