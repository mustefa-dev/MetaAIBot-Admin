<template>
  <div :dir="dir" class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Sidebar -->
    <TheSidebar />

    <!-- Main Content -->
    <div :class="mainClasses">
      <!-- Header -->
      <TheHeader />

      <!-- Page Content -->
      <main class="pt-20 pb-6 px-4 lg:px-6">
        <slot />
      </main>
    </div>

    <!-- Toast Container -->
    <UiToast ref="toastRef" />
  </div>
</template>

<script setup lang="ts">
const { locale, locales } = useI18n()
const sidebarStore = useSidebarStore()
const toastRef = ref()

// Provide toast to children
provide('toast', toastRef)

const isCollapsed = computed(() => sidebarStore.collapsed)

const dir = computed(() => {
  const currentLocale = (locales.value as Array<{ code: string; dir?: string }>)
    .find(l => l.code === locale.value)
  return currentLocale?.dir || 'ltr'
})

const mainClasses = computed(() => [
  'min-h-screen transition-all duration-300',
  isCollapsed.value ? 'lg:ms-20' : 'lg:ms-64'
])

// Initialize sidebar
onMounted(() => {
  sidebarStore.initSidebar()
})

// Watch locale changes and update document direction (client-side only)
if (import.meta.client) {
  watch(locale, (newLocale) => {
    const newDir = (locales.value as Array<{ code: string; dir?: string }>)
      .find(l => l.code === newLocale)?.dir || 'ltr'

    document.documentElement.dir = newDir
    document.documentElement.lang = newLocale
  }, { immediate: true })
}
</script>
