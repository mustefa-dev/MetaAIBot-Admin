<template>
  <div>
    <NuxtLayout name="auth">
      <!-- Header -->
      <div class="text-center mb-8">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
          {{ t('auth.loginTitle') }}
        </h1>
        <p class="text-gray-600 dark:text-gray-400 mt-2">
          {{ t('auth.loginSubtitle') }}
        </p>
      </div>

      <!-- Login Form -->
      <form @submit.prevent="handleLogin" class="space-y-6">
        <!-- Email -->
        <FormInput
          v-model="form.email"
          :label="t('auth.email')"
          type="email"
          :placeholder="t('auth.email')"
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

        <!-- Password -->
        <FormInput
          v-model="form.password"
          :label="t('auth.password')"
          :type="showPassword ? 'text' : 'password'"
          :placeholder="t('auth.password')"
          :error="errors.password"
          required
          autocomplete="current-password"
        >
          <template #prefix>
            <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </template>
          <template #suffix>
            <button
              type="button"
              @click="showPassword = !showPassword"
              class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <svg v-if="showPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
              </svg>
              <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </button>
          </template>
        </FormInput>

        <!-- Remember Me & Forgot Password -->
        <div class="flex items-center justify-between">
          <label class="flex items-center gap-2 cursor-pointer">
            <input
              v-model="form.rememberMe"
              type="checkbox"
              class="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700"
            />
            <span class="text-sm text-gray-600 dark:text-gray-400">
              {{ t('auth.rememberMe') }}
            </span>
          </label>

          <NuxtLink
            to="/forgot-password"
            class="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400"
          >
            {{ t('auth.forgotPassword') }}
          </NuxtLink>
        </div>

        <!-- Error Message -->
        <UiAlert v-if="authError" variant="danger" :dismissible="false">
          {{ authError }}
        </UiAlert>

        <!-- Submit Button -->
        <UiButton
          type="submit"
          variant="primary"
          size="lg"
          block
          :loading="isLoading"
        >
          {{ t('auth.login') }}
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
const route = useRoute()
const authStore = useAuthStore()

const form = reactive({
  email: '',
  password: '',
  rememberMe: false
})

const errors = reactive({
  email: '',
  password: ''
})

const showPassword = ref(false)
const isLoading = ref(false)
const authError = ref('')

function validateForm(): boolean {
  let valid = true
  errors.email = ''
  errors.password = ''

  if (!form.email) {
    errors.email = t('validation.required')
    valid = false
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = t('validation.email')
    valid = false
  }

  if (!form.password) {
    errors.password = t('validation.required')
    valid = false
  } else if (form.password.length < 6) {
    errors.password = t('validation.minLength', { min: 6 })
    valid = false
  }

  return valid
}

async function handleLogin() {
  authError.value = ''

  if (!validateForm()) {
    return
  }

  isLoading.value = true

  const success = await authStore.login({
    email: form.email,
    password: form.password,
    rememberMe: form.rememberMe
  })

  isLoading.value = false

  if (success) {
    // Redirect to intended page or dashboard
    const redirect = route.query.redirect as string
    navigateTo(redirect || '/dashboard')
  } else {
    authError.value = authStore.error || t('auth.invalidCredentials')
  }
}
</script>
