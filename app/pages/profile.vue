<template>
  <div>
    <PageHeader :title="t('nav.profile')">
      <template #actions>
        <UiButton
          variant="primary"
          :loading="isSaving"
          @click="saveProfile"
        >
          {{ t('common.save') }}
        </UiButton>
      </template>
    </PageHeader>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Profile Card -->
      <div class="lg:col-span-1">
        <UiCard>
          <div class="text-center">
            <!-- Avatar -->
            <div class="relative inline-block">
              <UiAvatar
                :src="user?.avatar"
                :name="user?.name"
                size="xl"
                class="w-24 h-24"
              />
              <label
                class="absolute bottom-0 end-0 w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-primary-700 transition-colors"
              >
                <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <input
                  type="file"
                  accept="image/*"
                  class="hidden"
                  @change="handleAvatarChange"
                />
              </label>
            </div>

            <!-- Name & Email -->
            <h2 class="mt-4 text-xl font-semibold text-gray-900 dark:text-white">
              {{ user?.name }}
            </h2>
            <p class="text-gray-600 dark:text-gray-400">
              {{ user?.email }}
            </p>

            <!-- Role Badge -->
            <div class="mt-3">
              <UiBadge :variant="getRoleColor(user?.role)">
                {{ user?.role }}
              </UiBadge>
            </div>

            <!-- Stats -->
            <div class="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <div class="text-sm text-gray-600 dark:text-gray-400">
                {{ t('profile.memberSince') }}
              </div>
              <div class="font-medium text-gray-900 dark:text-white">
                {{ formatDate(user?.createdAt) }}
              </div>
            </div>
          </div>
        </UiCard>
      </div>

      <!-- Profile Form -->
      <div class="lg:col-span-2 space-y-6">
        <!-- Personal Information -->
        <UiCard :title="t('profile.personalInfo')">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput
              v-model="form.name"
              :label="t('profile.fullName')"
              :error="errors.name"
              required
            />
            <FormInput
              v-model="form.email"
              :label="t('auth.email')"
              type="email"
              :error="errors.email"
              required
            />
          </div>
        </UiCard>

        <!-- Change Password -->
        <UiCard :title="t('profile.changePassword')">
          <div class="space-y-4">
            <FormInput
              v-model="passwordForm.currentPassword"
              :label="t('profile.currentPassword')"
              type="password"
              :error="passwordErrors.currentPassword"
              autocomplete="current-password"
            />
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormInput
                v-model="passwordForm.newPassword"
                :label="t('auth.newPassword')"
                type="password"
                :error="passwordErrors.newPassword"
                autocomplete="new-password"
              />
              <FormInput
                v-model="passwordForm.confirmPassword"
                :label="t('auth.confirmPassword')"
                type="password"
                :error="passwordErrors.confirmPassword"
                autocomplete="new-password"
              />
            </div>

            <div class="flex justify-end">
              <UiButton
                variant="outline"
                :loading="isChangingPassword"
                :disabled="!canChangePassword"
                @click="changePassword"
              >
                {{ t('profile.updatePassword') }}
              </UiButton>
            </div>
          </div>
        </UiCard>

        <!-- Preferences -->
        <UiCard :title="t('profile.preferences')">
          <div class="space-y-4">
            <!-- Theme -->
            <div class="flex items-center justify-between">
              <div>
                <div class="font-medium text-gray-900 dark:text-white">
                  {{ t('profile.darkMode') }}
                </div>
                <div class="text-sm text-gray-600 dark:text-gray-400">
                  {{ t('profile.darkModeDescription') }}
                </div>
              </div>
              <UiSwitch v-model="preferences.darkMode" @update:model-value="toggleTheme" />
            </div>

            <!-- Language -->
            <div class="flex items-center justify-between">
              <div>
                <div class="font-medium text-gray-900 dark:text-white">
                  {{ t('profile.language') }}
                </div>
                <div class="text-sm text-gray-600 dark:text-gray-400">
                  {{ t('profile.languageDescription') }}
                </div>
              </div>
              <UiSelect
                v-model="preferences.language"
                :options="[
                  { value: 'ar', label: 'العربية' },
                  { value: 'en', label: 'English' }
                ]"
                class="w-32"
                @update:model-value="changeLanguage"
              />
            </div>
          </div>
        </UiCard>

        <!-- Danger Zone -->
        <UiCard :title="t('profile.dangerZone')" class="border-red-200 dark:border-red-900">
          <div class="flex items-center justify-between">
            <div>
              <div class="font-medium text-red-600 dark:text-red-400">
                {{ t('profile.deleteAccount') }}
              </div>
              <div class="text-sm text-gray-600 dark:text-gray-400">
                {{ t('profile.deleteAccountDescription') }}
              </div>
            </div>
            <UiButton variant="danger" @click="showDeleteConfirm = true">
              {{ t('common.delete') }}
            </UiButton>
          </div>
        </UiCard>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <UiModal v-model="showDeleteConfirm" :title="t('profile.deleteAccount')">
      <p class="text-gray-600 dark:text-gray-400 mb-4">
        {{ t('profile.deleteAccountConfirm') }}
      </p>
      <FormInput
        v-model="deleteConfirmText"
        :label="t('profile.typeToConfirm', { text: 'DELETE' })"
        :placeholder="'DELETE'"
      />
      <template #footer>
        <div class="flex justify-end gap-3">
          <UiButton variant="ghost" @click="showDeleteConfirm = false">
            {{ t('common.cancel') }}
          </UiButton>
          <UiButton
            variant="danger"
            :disabled="deleteConfirmText !== 'DELETE'"
            @click="deleteAccount"
          >
            {{ t('profile.deleteAccount') }}
          </UiButton>
        </div>
      </template>
    </UiModal>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'dashboard',
  middleware: 'auth'
})

const { t } = useI18n()
const authStore = useAuthStore()
const themeStore = useThemeStore()
const localeStore = useLocaleStore()
const api = useApi()
const toast = useAppToast()
const { date: formatDate } = useFormat()

const user = computed(() => authStore.user)

// Profile form
const form = reactive({
  name: user.value?.name || '',
  email: user.value?.email || ''
})

const errors = reactive({
  name: '',
  email: ''
})

const isSaving = ref(false)

// Password form
const passwordForm = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const passwordErrors = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const isChangingPassword = ref(false)

const canChangePassword = computed(() =>
  passwordForm.currentPassword &&
  passwordForm.newPassword &&
  passwordForm.confirmPassword
)

// Preferences
const preferences = reactive({
  darkMode: themeStore.isDark,
  language: localeStore.locale
})

// Delete account
const showDeleteConfirm = ref(false)
const deleteConfirmText = ref('')

function getRoleColor(role?: string): string {
  const colors: Record<string, string> = {
    'Admin': 'danger',
    'Manager': 'warning',
    'Operator': 'info'
  }
  return colors[role || ''] || 'secondary'
}

async function handleAvatarChange(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return

  // Validate file
  if (!file.type.startsWith('image/')) {
    toast.error(t('validation.invalidFileType'))
    return
  }

  if (file.size > 5 * 1024 * 1024) {
    toast.error(t('validation.fileTooLarge'))
    return
  }

  const formData = new FormData()
  formData.append('avatar', file)

  const { data, error } = await api.post<{ url: string }>('/auth/avatar', formData)

  if (error) {
    toast.error(error.message)
    return
  }

  if (data?.url) {
    authStore.updateUser({ avatar: data.url })
    toast.success(t('profile.avatarUpdated'))
  }
}

async function saveProfile() {
  errors.name = ''
  errors.email = ''

  if (!form.name) {
    errors.name = t('validation.required')
    return
  }

  if (!form.email) {
    errors.email = t('validation.required')
    return
  }

  isSaving.value = true

  const { error } = await api.put('/auth/profile', {
    name: form.name,
    email: form.email
  })

  isSaving.value = false

  if (error) {
    toast.error(error.message)
    return
  }

  authStore.updateUser({ name: form.name, email: form.email })
  toast.saved()
}

async function changePassword() {
  passwordErrors.currentPassword = ''
  passwordErrors.newPassword = ''
  passwordErrors.confirmPassword = ''

  if (!passwordForm.currentPassword) {
    passwordErrors.currentPassword = t('validation.required')
    return
  }

  if (!passwordForm.newPassword) {
    passwordErrors.newPassword = t('validation.required')
    return
  }

  if (passwordForm.newPassword.length < 8) {
    passwordErrors.newPassword = t('validation.minLength', { min: 8 })
    return
  }

  if (passwordForm.newPassword !== passwordForm.confirmPassword) {
    passwordErrors.confirmPassword = t('validation.passwordMismatch')
    return
  }

  isChangingPassword.value = true

  const { error } = await api.post('/auth/change-password', {
    currentPassword: passwordForm.currentPassword,
    newPassword: passwordForm.newPassword
  })

  isChangingPassword.value = false

  if (error) {
    toast.error(error.message)
    return
  }

  // Clear form
  passwordForm.currentPassword = ''
  passwordForm.newPassword = ''
  passwordForm.confirmPassword = ''

  toast.success(t('profile.passwordChanged'))
}

function toggleTheme(value: boolean) {
  if (value) {
    themeStore.setTheme('dark')
  } else {
    themeStore.setTheme('light')
  }
}

function changeLanguage(value: string) {
  localeStore.setLocale(value as 'ar' | 'en')
}

async function deleteAccount() {
  const { error } = await api.del('/auth/account')

  if (error) {
    toast.error(error.message)
    return
  }

  authStore.logout()
  navigateTo('/login')
}

// Watch for user changes
watch(user, (newUser) => {
  if (newUser) {
    form.name = newUser.name
    form.email = newUser.email
  }
}, { immediate: true })
</script>
