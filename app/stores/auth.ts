import { defineStore } from 'pinia'
import type { AuthUser, LoginRequest, LoginResponse, UserRole } from '~/types/auth'
import { STORAGE_KEYS } from '~/utils/constants'

interface AuthState {
  user: AuthUser | null
  token: string | null
  refreshToken: string | null
  isLoading: boolean
  error: string | null
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    token: null,
    refreshToken: null,
    isLoading: false,
    error: null
  }),

  getters: {
    isAuthenticated: (state) => !!state.token && !!state.user,

    isAdmin: (state) => state.user?.role === 'Admin',

    isManager: (state) => state.user?.role === 'Admin' || state.user?.role === 'Manager',

    hasPermission: (state) => (requiredRole: UserRole): boolean => {
      if (!state.user) return false

      const roleHierarchy: Record<UserRole, number> = {
        'Admin': 3,
        'Manager': 2,
        'Operator': 1
      }

      return roleHierarchy[state.user.role] >= roleHierarchy[requiredRole]
    },

    userInitials: (state) => {
      if (!state.user?.name) return '?'
      return state.user.name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    }
  },

  actions: {
    async login(credentials: LoginRequest): Promise<boolean> {
      this.isLoading = true
      this.error = null

      try {
        const config = useRuntimeConfig()
        const response = await fetch(`${config.public.apiBase}/auth/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(credentials)
        })

        if (!response.ok) {
          const error = await response.json()
          this.error = error.message || 'Login failed'
          return false
        }

        const data: LoginResponse = await response.json()

        this.token = data.token
        this.refreshToken = data.refreshToken
        this.user = data.user

        // Persist to localStorage
        if (import.meta.client) {
          localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, data.token)
          if (data.refreshToken) {
            localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, data.refreshToken)
          }
          localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(data.user))
        }

        return true
      } catch (err) {
        console.error('Login error:', err)
        this.error = 'Network error'
        return false
      } finally {
        this.isLoading = false
      }
    },

    async refreshSession(): Promise<boolean> {
      if (!this.refreshToken) return false

      try {
        const config = useRuntimeConfig()
        const response = await fetch(`${config.public.apiBase}/auth/refresh`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ refreshToken: this.refreshToken })
        })

        if (!response.ok) {
          this.logout()
          return false
        }

        const data: LoginResponse = await response.json()

        this.token = data.token
        this.refreshToken = data.refreshToken
        this.user = data.user

        // Update localStorage
        if (import.meta.client) {
          localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, data.token)
          if (data.refreshToken) {
            localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, data.refreshToken)
          }
          localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(data.user))
        }

        return true
      } catch (err) {
        console.error('Refresh error:', err)
        this.logout()
        return false
      }
    },

    logout() {
      this.user = null
      this.token = null
      this.refreshToken = null
      this.error = null

      // Clear localStorage
      if (import.meta.client) {
        localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN)
        localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN)
        localStorage.removeItem(STORAGE_KEYS.USER)
      }
    },

    initAuth() {
      if (!import.meta.client) return

      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN)
      const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN)
      const userJson = localStorage.getItem(STORAGE_KEYS.USER)

      if (token && userJson) {
        try {
          this.token = token
          this.refreshToken = refreshToken
          this.user = JSON.parse(userJson)
        } catch (err) {
          console.error('Failed to parse stored user:', err)
          this.logout()
        }
      }
    },

    updateUser(updates: Partial<AuthUser>) {
      if (this.user) {
        this.user = { ...this.user, ...updates }

        if (import.meta.client) {
          localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(this.user))
        }
      }
    }
  }
})
