// Theme Store - Manages dark/light mode
import { defineStore } from 'pinia'
import { STORAGE_KEYS } from '~/utils/constants'

interface ThemeState {
  isDark: boolean
}

export const useThemeStore = defineStore('theme', {
  state: (): ThemeState => ({
    isDark: false
  }),

  getters: {
    currentTheme: (state): 'dark' | 'light' => state.isDark ? 'dark' : 'light'
  },

  actions: {
    /**
     * Toggle between dark and light mode
     */
    toggleTheme() {
      this.isDark = !this.isDark
      this.applyTheme()
      this.saveTheme()
    },

    /**
     * Set specific theme
     */
    setTheme(isDark: boolean) {
      this.isDark = isDark
      this.applyTheme()
      this.saveTheme()
    },

    /**
     * Apply theme to document
     */
    applyTheme() {
      if (typeof document !== 'undefined') {
        if (this.isDark) {
          document.documentElement.classList.add('dark')
        } else {
          document.documentElement.classList.remove('dark')
        }
      }
    },

    /**
     * Save theme to localStorage
     */
    saveTheme() {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(STORAGE_KEYS.THEME, this.isDark ? 'dark' : 'light')
      }
    },

    /**
     * Initialize theme from localStorage or system preference
     */
    initTheme() {
      if (typeof localStorage !== 'undefined' && typeof window !== 'undefined') {
        const savedTheme = localStorage.getItem(STORAGE_KEYS.THEME)

        if (savedTheme) {
          this.isDark = savedTheme === 'dark'
        } else {
          // Use system preference
          this.isDark = window.matchMedia('(prefers-color-scheme: dark)').matches
        }

        this.applyTheme()

        // Listen for system theme changes
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
          if (!localStorage.getItem(STORAGE_KEYS.THEME)) {
            this.isDark = e.matches
            this.applyTheme()
          }
        })
      }
    }
  }
})
