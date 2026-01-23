import type { LoginRequest, UserRole } from '~/types/auth'

export function useAuth() {
  const authStore = useAuthStore()
  const router = useRouter()
  const { t } = useI18n()

  const isAuthenticated = computed(() => authStore.isAuthenticated)
  const user = computed(() => authStore.user)
  const isLoading = computed(() => authStore.isLoading)
  const error = computed(() => authStore.error)

  async function login(credentials: LoginRequest): Promise<boolean> {
    const success = await authStore.login(credentials)

    if (success) {
      // Redirect to dashboard after login
      await router.push('/dashboard')
    }

    return success
  }

  async function logout(): Promise<void> {
    authStore.logout()
    await router.push('/login')
  }

  function checkPermission(requiredRole: UserRole): boolean {
    return authStore.hasPermission(requiredRole)
  }

  function requirePermission(requiredRole: UserRole): void {
    if (!checkPermission(requiredRole)) {
      throw createError({
        statusCode: 403,
        message: t('errors.forbidden')
      })
    }
  }

  // Initialize auth state from localStorage
  function initAuth(): void {
    authStore.initAuth()
  }

  return {
    // State
    isAuthenticated,
    user,
    isLoading,
    error,

    // Getters
    isAdmin: computed(() => authStore.isAdmin),
    isManager: computed(() => authStore.isManager),
    userInitials: computed(() => authStore.userInitials),

    // Actions
    login,
    logout,
    checkPermission,
    requirePermission,
    initAuth,
    refreshSession: () => authStore.refreshSession(),
    updateUser: (updates: any) => authStore.updateUser(updates)
  }
}
