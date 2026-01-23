<template>
  <div>
    <!-- Global Loading Bar -->
    <UiLoadingBar />

    <!-- Offline Indicator -->
    <UiOfflineIndicator />

    <!-- Main Content -->
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>

    <!-- Global Toasts -->
    <UiToast />

    <!-- Global Confirm Dialog -->
    <GlobalConfirmDialog />
  </div>
</template>

<script setup lang="ts">
// Initialize theme and locale on app mount
const { initTheme } = useThemeStore()
const { initLocale } = useLocaleStore()

onMounted(() => {
  initTheme()
  initLocale()
})
</script>

<style>
/* Page transitions */
.page-enter-active,
.page-leave-active {
  transition: all 0.2s ease-out;
}

.page-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.page-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* Layout transitions */
.layout-enter-active,
.layout-leave-active {
  transition: all 0.3s ease-out;
}

.layout-enter-from,
.layout-leave-to {
  opacity: 0;
}
</style>
