<template>
  <div class="p-6">
    <!-- Page Header -->
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
        {{ $t('dashboard.title') }}
      </h1>
      <p class="mt-1 text-gray-500 dark:text-gray-400">
        {{ $t('dashboard.welcome') }}
      </p>
    </div>

    <!-- Placeholder Content -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <!-- Stat Cards Placeholder -->
      <div v-for="i in 4" :key="i" class="card card-body">
        <div class="skeleton h-4 w-24 mb-2"></div>
        <div class="skeleton h-8 w-16"></div>
      </div>
    </div>

    <!-- Info Card -->
    <div class="card card-body">
      <div class="flex items-start gap-4">
        <div class="flex-shrink-0">
          <div class="w-12 h-12 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
            <svg class="w-6 h-6 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
        <div>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Phase 1 Complete
          </h3>
          <p class="text-gray-600 dark:text-gray-400 mb-4">
            Project setup is complete. The following have been configured:
          </p>
          <ul class="list-disc list-inside text-sm text-gray-500 dark:text-gray-400 space-y-1">
            <li>Nuxt 4 + Vue 3 project structure</li>
            <li>Tailwind CSS with dark mode</li>
            <li>Pinia state management</li>
            <li>i18n (Arabic + English)</li>
            <li>TypeScript types for all backend entities</li>
            <li>Utility functions and validators</li>
          </ul>
          <p class="mt-4 text-sm text-gray-500 dark:text-gray-400">
            Run <code class="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded">npm install</code> then <code class="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded">npm run dev</code> to start the development server.
          </p>
        </div>
      </div>
    </div>

    <!-- Theme & Language Toggle Demo -->
    <div class="mt-6 card card-body">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Test Theme & Language
      </h3>
      <div class="flex flex-wrap gap-4">
        <button @click="toggleTheme" class="btn-secondary">
          <svg v-if="isDark" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
          </svg>
          {{ isDark ? 'Light Mode' : 'Dark Mode' }}
        </button>

        <button @click="toggleLocale" class="btn-secondary">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
          </svg>
          {{ currentLocaleName }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'dashboard',
  middleware: 'auth'
})

// Theme
const themeStore = useThemeStore()
const isDark = computed(() => themeStore.isDark)
const toggleTheme = () => themeStore.toggleTheme()

// Locale
const localeStore = useLocaleStore()
const currentLocaleName = computed(() => localeStore.currentLocaleName)
const toggleLocale = () => localeStore.toggleLocale()

// Also sync with i18n
const { setLocale } = useI18n()
watch(() => localeStore.currentLocale, (newLocale) => {
  setLocale(newLocale)
})
</script>
