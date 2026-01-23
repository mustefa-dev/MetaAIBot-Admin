export default defineNuxtRouteMiddleware(() => {
  const authStore = useAuthStore()

  // Initialize auth state if not done
  if (import.meta.client && !authStore.token) {
    authStore.initAuth()
  }

  // Check if authenticated
  if (!authStore.isAuthenticated) {
    return navigateTo('/login')
  }

  // Check if user is manager or admin
  if (!authStore.isManager) {
    throw createError({
      statusCode: 403,
      message: 'Access denied. Manager privileges required.'
    })
  }
})
