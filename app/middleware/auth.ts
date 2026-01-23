export default defineNuxtRouteMiddleware((to) => {
  // Skip auth check on server - will be handled on client
  if (import.meta.server) {
    return
  }

  const authStore = useAuthStore()

  // Initialize auth state from localStorage
  if (!authStore.token) {
    authStore.initAuth()
  }

  // Check if authenticated after initialization
  if (!authStore.isAuthenticated) {
    // Store the intended destination
    const redirectTo = to.fullPath !== '/login' ? to.fullPath : undefined

    return navigateTo({
      path: '/login',
      query: redirectTo ? { redirect: redirectTo } : undefined
    })
  }
})
