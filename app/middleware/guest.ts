export default defineNuxtRouteMiddleware(() => {
  // Skip auth check on server - will be handled on client
  if (import.meta.server) {
    return
  }

  const authStore = useAuthStore()

  // Initialize auth state from localStorage
  if (!authStore.token) {
    authStore.initAuth()
  }

  // If already authenticated, redirect to dashboard
  if (authStore.isAuthenticated) {
    return navigateTo('/dashboard')
  }
})
