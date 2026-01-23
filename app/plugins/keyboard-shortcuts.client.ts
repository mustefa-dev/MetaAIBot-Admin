import { setupKeyboardShortcuts } from '~/composables/useKeyboardShortcuts'

export default defineNuxtPlugin(() => {
  const cleanup = setupKeyboardShortcuts()

  // Cleanup on app unmount
  if (cleanup) {
    // Note: Nuxt doesn't have a standard cleanup hook, but the listener
    // will be removed when the page is unloaded anyway
  }
})
