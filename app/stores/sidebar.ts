// Sidebar Store - Manages sidebar state
import { defineStore } from 'pinia'
import { STORAGE_KEYS } from '~/utils/constants'

interface SidebarState {
  isCollapsed: boolean
  isMobileOpen: boolean
}

export const useSidebarStore = defineStore('sidebar', {
  state: (): SidebarState => ({
    isCollapsed: false,
    isMobileOpen: false
  }),

  getters: {
    collapsed: (state): boolean => state.isCollapsed,
    mobileOpen: (state): boolean => state.isMobileOpen
  },

  actions: {
    /**
     * Toggle sidebar collapsed state
     */
    toggle() {
      this.isCollapsed = !this.isCollapsed
      this.saveSidebarState()
    },

    /**
     * Collapse sidebar
     */
    collapse() {
      this.isCollapsed = true
      this.saveSidebarState()
    },

    /**
     * Expand sidebar
     */
    expand() {
      this.isCollapsed = false
      this.saveSidebarState()
    },

    /**
     * Toggle mobile sidebar
     */
    toggleMobile() {
      this.isMobileOpen = !this.isMobileOpen
    },

    /**
     * Open mobile sidebar
     */
    openMobile() {
      this.isMobileOpen = true
    },

    /**
     * Close mobile sidebar
     */
    closeMobile() {
      this.isMobileOpen = false
    },

    /**
     * Save sidebar state to localStorage
     */
    saveSidebarState() {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(STORAGE_KEYS.SIDEBAR_COLLAPSED, String(this.isCollapsed))
      }
    },

    /**
     * Initialize sidebar state from localStorage
     */
    initSidebar() {
      if (typeof localStorage !== 'undefined') {
        const saved = localStorage.getItem(STORAGE_KEYS.SIDEBAR_COLLAPSED)
        if (saved !== null) {
          this.isCollapsed = saved === 'true'
        }
      }
    }
  }
})
