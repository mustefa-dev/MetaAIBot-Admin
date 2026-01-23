<template>
  <div>
    <NuxtLayout name="auth">
      <!-- Back Link -->
      <NuxtLink
        to="/login"
        class="inline-flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 mb-6"
      >
        <svg class="w-4 h-4 rtl:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
        {{ t('common.back') }}
      </NuxtLink>

      <!-- Header -->
      <div class="text-center mb-8">
        <div class="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
          </svg>
        </div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
          {{ t('auth.forgotPassword') }}
        </h1>
        <p class="text-gray-600 dark:text-gray-400 mt-2">
          {{ t('auth.forgotPasswordSubtitle') }}
        </p>
      </div>

      <!-- Success State -->
      <div v-if="isSubmitted" class="text-center">
        <div class="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          {{ t('auth.checkEmail') }}
        </h2>
        <p class="text-gray-600 dark:text-gray-400 mb-6">
          {{ t('auth.resetEmailSent', { email: form.email }) }}
        </p>
        <UiButton variant="outline" @click="isSubmitted = false">
          {{ t('auth.tryAnotherEmail') }}
        </UiButton>
      </div>

      <!-- Form -->
      <form v-else @submit.prevent="handleSubmit" class="space-y-6">
        <!-- Email -->
        <FormInput
          v-model="form.email"
          :label="t('auth.email')"
          type="email"
          :placeholder="t('auth.enterEmail')"
          :error="errors.email"
          required
          autocomplete="email"
        >
          <template #prefix>
            <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
            </svg>
          </template>
        </FormInput>

        <!-- Error Message -->
        <UiAlert v-if="submitError" variant="danger" :dismissible="false">
          {{ submitError }}
        </UiAlert>

        <!-- Submit Button -->
        <UiButton
          type="submit"
          variant="primary"
          size="lg"
          block
          :loading="isLoading"
        >
          {{ t('auth.sendResetLink') }}
        </UiButton>
      </form>
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: false,
  middleware: 'guest'
})

const { t } = useI18n()
const api = useApi()

const form = reactive({
  email: ''
})

const errors = reactive({
  email: ''
})

const isLoading = ref(false)
const isSubmitted = ref(false)
const submitError = ref('')

function validateForm(): boolean {
  errors.email = ''

  if (!form.email) {
    errors.email = t('validation.required')
    return false
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = t('validation.email')
    return false
  }

  return true
}

async function handleSubmit() {
  submitError.value = ''

  if (!validateForm()) {
    return
  }

  isLoading.value = true

  const { error } = await api.post('/auth/forgot-password', {
    email: form.email
  })

  isLoading.value = false

  if (error) {
    submitError.value = error.message
  } else {
    isSubmitted.value = true
  }
}
</script>
