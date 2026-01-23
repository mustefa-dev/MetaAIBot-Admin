<template>
  <div>
    <NuxtLayout name="auth">
      <!-- Header -->
      <div class="text-center mb-8">
        <div class="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
          </svg>
        </div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
          {{ t('auth.resetPassword') }}
        </h1>
        <p class="text-gray-600 dark:text-gray-400 mt-2">
          {{ t('auth.enterNewPassword') }}
        </p>
      </div>

      <!-- Success State -->
      <div v-if="isSuccess" class="text-center">
        <div class="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          {{ t('auth.passwordResetSuccess') }}
        </h2>
        <p class="text-gray-600 dark:text-gray-400 mb-6">
          {{ t('auth.passwordResetSuccessMessage') }}
        </p>
        <UiButton variant="primary" @click="navigateTo('/login')">
          {{ t('auth.backToLogin') }}
        </UiButton>
      </div>

      <!-- Form -->
      <form v-else @submit.prevent="handleSubmit" class="space-y-6">
        <!-- New Password -->
        <FormInput
          v-model="form.password"
          :label="t('auth.newPassword')"
          :type="showPassword ? 'text' : 'password'"
          :placeholder="t('auth.newPassword')"
          :error="errors.password"
          required
          autocomplete="new-password"
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

        <!-- Confirm Password -->
        <FormInput
          v-model="form.confirmPassword"
          :label="t('auth.confirmPassword')"
          :type="showConfirmPassword ? 'text' : 'password'"
          :placeholder="t('auth.confirmPassword')"
          :error="errors.confirmPassword"
          required
          autocomplete="new-password"
        >
          <template #prefix>
            <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </template>
          <template #suffix>
            <button
              type="button"
              @click="showConfirmPassword = !showConfirmPassword"
              class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <svg v-if="showConfirmPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
              </svg>
              <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </button>
          </template>
        </FormInput>

        <!-- Password Strength -->
        <div class="space-y-2">
          <div class="flex gap-1">
            <div
              v-for="i in 4"
              :key="i"
              class="h-1 flex-1 rounded-full transition-colors"
              :class="passwordStrength >= i ? strengthColors[passwordStrength] : 'bg-gray-200 dark:bg-gray-700'"
            />
          </div>
          <p class="text-xs text-gray-500 dark:text-gray-400">
            {{ strengthLabels[passwordStrength] }}
          </p>
        </div>

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
          :disabled="passwordStrength < 2"
        >
          {{ t('auth.resetPassword') }}
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
const api = useApi()

const token = computed(() => route.query.token as string)

const form = reactive({
  password: '',
  confirmPassword: ''
})

const errors = reactive({
  password: '',
  confirmPassword: ''
})

const showPassword = ref(false)
const showConfirmPassword = ref(false)
const isLoading = ref(false)
const isSuccess = ref(false)
const submitError = ref('')

const strengthColors: Record<number, string> = {
  0: 'bg-gray-200 dark:bg-gray-700',
  1: 'bg-red-500',
  2: 'bg-yellow-500',
  3: 'bg-blue-500',
  4: 'bg-green-500'
}

const strengthLabels = computed(() => ({
  0: t('auth.passwordStrength.empty'),
  1: t('auth.passwordStrength.weak'),
  2: t('auth.passwordStrength.fair'),
  3: t('auth.passwordStrength.good'),
  4: t('auth.passwordStrength.strong')
}))

const passwordStrength = computed(() => {
  const password = form.password
  if (!password) return 0

  let strength = 0
  if (password.length >= 8) strength++
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++
  if (/\d/.test(password)) strength++
  if (/[^a-zA-Z0-9]/.test(password)) strength++

  return strength
})

function validateForm(): boolean {
  let valid = true
  errors.password = ''
  errors.confirmPassword = ''

  if (!form.password) {
    errors.password = t('validation.required')
    valid = false
  } else if (form.password.length < 8) {
    errors.password = t('validation.minLength', { min: 8 })
    valid = false
  }

  if (!form.confirmPassword) {
    errors.confirmPassword = t('validation.required')
    valid = false
  } else if (form.password !== form.confirmPassword) {
    errors.confirmPassword = t('validation.passwordMismatch')
    valid = false
  }

  return valid
}

async function handleSubmit() {
  submitError.value = ''

  if (!validateForm()) {
    return
  }

  if (!token.value) {
    submitError.value = t('auth.invalidResetToken')
    return
  }

  isLoading.value = true

  const { error } = await api.post('/auth/reset-password', {
    token: token.value,
    password: form.password
  })

  isLoading.value = false

  if (error) {
    submitError.value = error.message
  } else {
    isSuccess.value = true
  }
}

// Redirect if no token
onMounted(() => {
  if (!token.value) {
    navigateTo('/login')
  }
})
</script>
