<template>
  <UiDropdown position="right" width="sm">
    <template #trigger>
      <button
        class="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
      >
        <svg class="w-5 h-5 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
        </svg>
        <span class="hidden sm:inline text-sm font-medium text-gray-700 dark:text-gray-300">
          {{ currentLocaleName }}
        </span>
      </button>
    </template>

    <template #default="{ close }">
      <UiDropdownItem
        v-for="locale in locales"
        :key="locale.code"
        :class="{ 'bg-gray-100 dark:bg-gray-700': locale.code === currentLocale }"
        @click="changeLocale(locale.code); close()"
      >
        <span class="flex-1">{{ locale.name }}</span>
        <svg
          v-if="locale.code === currentLocale"
          class="w-4 h-4 text-primary-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
        </svg>
      </UiDropdownItem>
    </template>
  </UiDropdown>
</template>

<script setup lang="ts">
const localeStore = useLocaleStore()
const { setLocale: setI18nLocale } = useI18n()

const currentLocale = computed(() => localeStore.currentLocale)
const currentLocaleName = computed(() => localeStore.currentLocaleName)
const locales = computed(() => localeStore.availableLocales)

const changeLocale = (code: 'ar' | 'en') => {
  localeStore.setLocale(code)
  setI18nLocale(code)
}
</script>
