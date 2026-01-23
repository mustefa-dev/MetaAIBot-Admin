<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
    <div class="text-center">
      <!-- Error Icon -->
      <div class="mb-6">
        <div class="inline-flex items-center justify-center w-24 h-24 rounded-full bg-danger-100 dark:bg-danger-900/30">
          <svg
            class="w-12 h-12 text-danger-600 dark:text-danger-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
      </div>

      <!-- Error Code -->
      <h1 class="text-6xl font-bold text-gray-900 dark:text-white mb-4">
        {{ error?.statusCode || 500 }}
      </h1>

      <!-- Error Message -->
      <h2 class="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-4">
        {{ errorTitle }}
      </h2>

      <p class="text-gray-500 dark:text-gray-400 mb-8 max-w-md mx-auto">
        {{ errorMessage }}
      </p>

      <!-- Actions -->
      <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
        <button
          @click="handleGoBack"
          class="btn-secondary"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          {{ $t('common.goBack') }}
        </button>

        <button
          @click="handleClearError"
          class="btn-primary"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          {{ $t('common.backToHome') }}
        </button>
      </div>

      <!-- Debug Info (Development Only) -->
      <div
        v-if="isDev && error?.message"
        class="mt-8 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg text-left max-w-2xl mx-auto"
      >
        <p class="text-xs font-mono text-gray-600 dark:text-gray-400 break-all">
          {{ error.message }}
        </p>
        <p v-if="error.stack" class="mt-2 text-xs font-mono text-gray-500 dark:text-gray-500 break-all whitespace-pre-wrap">
          {{ error.stack }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps<{
  error: NuxtError
}>()

const { t } = useI18n()
const router = useRouter()

const isDev = import.meta.dev

const errorTitle = computed(() => {
  switch (props.error?.statusCode) {
    case 404:
      return t('errors.notFound')
    case 401:
      return t('errors.unauthorized')
    case 403:
      return t('errors.forbidden')
    case 500:
      return t('errors.serverError')
    default:
      return t('errors.somethingWrong')
  }
})

const errorMessage = computed(() => {
  switch (props.error?.statusCode) {
    case 404:
      return t('errors.notFoundMessage')
    case 401:
      return t('errors.unauthorizedMessage')
    case 403:
      return t('errors.forbiddenMessage')
    case 500:
      return t('errors.serverErrorMessage')
    default:
      return t('errors.somethingWrongMessage')
  }
})

const handleGoBack = () => {
  router.back()
}

const handleClearError = () => {
  clearError({ redirect: '/dashboard' })
}
</script>
