<template>
  <header :class="headerClasses">
    <div class="flex items-center gap-4">
      <!-- Mobile Menu Toggle -->
      <button
        type="button"
        class="lg:hidden p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
        @click="sidebarStore.openMobile()"
      >
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      <!-- Breadcrumb or Page Title -->
      <slot name="left">
        <div v-if="pageTitle" class="hidden sm:block">
          <h1 class="text-lg font-semibold text-gray-900 dark:text-white">
            {{ pageTitle }}
          </h1>
        </div>
      </slot>
    </div>

    <!-- Right Side -->
    <div class="flex items-center gap-3">
      <!-- Language Switcher -->
      <LanguageSwitcher />

      <!-- Theme Toggle -->
      <ThemeToggle />

      <!-- Notifications -->
      <button
        type="button"
        class="relative p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
      >
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        <!-- Notification Badge -->
        <span class="absolute top-1 end-1 w-2 h-2 bg-red-500 rounded-full" />
      </button>

      <!-- User Menu -->
      <UserMenu />
    </div>
  </header>
</template>

<script setup lang="ts">
interface Props {
  pageTitle?: string
}

defineProps<Props>()

const sidebarStore = useSidebarStore()

const headerClasses = computed(() => [
  'fixed top-0 end-0 z-20 h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700',
  'flex items-center justify-between px-4 lg:px-6 transition-all duration-300',
  sidebarStore.collapsed ? 'lg:start-20' : 'lg:start-64',
  'start-0'
])
</script>
