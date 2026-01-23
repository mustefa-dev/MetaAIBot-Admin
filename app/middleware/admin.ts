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

  // Check if user is admin
  if (!authStore.isAdmin) {
    throw createError({
      statusCode: 403,
      message: 'Access denied. Admin privileges required.'
    })
  }
})
