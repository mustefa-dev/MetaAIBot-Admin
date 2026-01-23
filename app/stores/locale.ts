// Locale Store - Manages language and RTL
import { defineStore } from 'pinia'
import { STORAGE_KEYS } from '~/utils/constants'

type LocaleCode = 'ar' | 'en'

interface LocaleState {
  currentLocale: LocaleCode
  isRtl: boolean
  availableLocales: { code: LocaleCode; name: string; dir: 'rtl' | 'ltr' }[]
}

export const useLocaleStore = defineStore('locale', {
  state: (): LocaleState => ({
    currentLocale: 'ar',
    isRtl: true,
    availableLocales: [
      { code: 'ar', name: 'العربية', dir: 'rtl' },
      { code: 'en', name: 'English', dir: 'ltr' }
    ]
  }),

  getters: {
    getLocale: (state): LocaleCode => state.currentLocale,
    getDirection: (state): 'rtl' | 'ltr' => state.isRtl ? 'rtl' : 'ltr',
    getLocales: (state) => state.availableLocales,
    currentLocaleName: (state) => {
      const locale = state.availableLocales.find(l => l.code === state.currentLocale)
      return locale?.name || state.currentLocale
    }
  },

  actions: {
    /**
     * Set locale and direction
     */
    setLocale(locale: LocaleCode) {
      const localeInfo = this.availableLocales.find(l => l.code === locale)
      if (!localeInfo) return

      this.currentLocale = locale
      this.isRtl = localeInfo.dir === 'rtl'

      this.applyDirection()
      this.saveLocale()
    },

    /**
     * Toggle between available locales
     */
    toggleLocale() {
      const currentIndex = this.availableLocales.findIndex(l => l.code === this.currentLocale)
      const nextIndex = (currentIndex + 1) % this.availableLocales.length
      this.setLocale(this.availableLocales[nextIndex].code)
    },

    /**
     * Apply direction to document
     */
    applyDirection() {
      if (typeof document !== 'undefined') {
        document.documentElement.dir = this.isRtl ? 'rtl' : 'ltr'
        document.documentElement.lang = this.currentLocale

        // Update font family based on locale
        if (this.isRtl) {
          document.body.classList.add('font-arabic')
          document.body.classList.remove('font-sans')
        } else {
          document.body.classList.add('font-sans')
          document.body.classList.remove('font-arabic')
        }
      }
    },

    /**
     * Save locale to localStorage
     */
    saveLocale() {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(STORAGE_KEYS.LOCALE, this.currentLocale)
      }
    },

    /**
     * Initialize locale from localStorage
     */
    initLocale() {
      if (typeof localStorage !== 'undefined') {
        const savedLocale = localStorage.getItem(STORAGE_KEYS.LOCALE) as LocaleCode | null

        if (savedLocale && this.availableLocales.some(l => l.code === savedLocale)) {
          this.currentLocale = savedLocale
          const localeInfo = this.availableLocales.find(l => l.code === savedLocale)
          this.isRtl = localeInfo?.dir === 'rtl'
        }

        this.applyDirection()
      }
    }
  }
})
