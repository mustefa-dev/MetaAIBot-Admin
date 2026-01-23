<template>
  <!-- Desktop Sidebar -->
  <aside :class="sidebarClasses">
    <!-- Logo -->
    <div class="flex items-center justify-between h-16 px-4 border-b border-gray-200 dark:border-gray-700">
      <NuxtLink to="/dashboard" class="flex items-center gap-3">
        <div class="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
          <span class="text-white font-bold text-lg">M</span>
        </div>
        <span v-if="!isCollapsed" class="font-semibold text-gray-900 dark:text-gray-100">
          MetaAIBot
        </span>
      </NuxtLink>
      <button
        type="button"
        class="hidden lg:flex p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
        @click="toggle"
      >
        <svg v-if="!isCollapsed" class="w-5 h-5 rtl:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
        </svg>
        <svg v-else class="w-5 h-5 rtl:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
        </svg>
      </button>
    </div>

    <!-- Navigation -->
    <nav class="flex-1 overflow-y-auto py-4 px-3">
      <ul class="space-y-1">
        <SidebarItem
          v-for="item in menuItems"
          :key="item.to"
          :to="item.to"
          :icon="item.icon"
          :label="item.label"
          :badge="item.badge"
          :collapsed="isCollapsed"
        />
      </ul>

      <!-- Divider -->
      <div class="my-4 border-t border-gray-200 dark:border-gray-700" />

      <!-- Settings Section -->
      <p v-if="!isCollapsed" class="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
        {{ $t('nav.settings') }}
      </p>

      <ul class="space-y-1">
        <SidebarItem
          v-for="item in settingsItems"
          :key="item.to"
          :to="item.to"
          :icon="item.icon"
          :label="item.label"
          :collapsed="isCollapsed"
        />
      </ul>
    </nav>

    <!-- Footer -->
    <div class="p-3 border-t border-gray-200 dark:border-gray-700">
      <ThemeToggle :collapsed="isCollapsed" />
    </div>
  </aside>

  <!-- Mobile Overlay -->
  <Transition
    enter-active-class="transition-opacity ease-linear duration-300"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="transition-opacity ease-linear duration-300"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div
      v-if="isMobileOpen"
      class="fixed inset-0 z-40 bg-black/50 lg:hidden"
      @click="closeMobile"
    />
  </Transition>

  <!-- Mobile Sidebar -->
  <Transition
    enter-active-class="transition ease-in-out duration-300 transform"
    enter-from-class="ltr:-translate-x-full rtl:translate-x-full"
    enter-to-class="translate-x-0"
    leave-active-class="transition ease-in-out duration-300 transform"
    leave-from-class="translate-x-0"
    leave-to-class="ltr:-translate-x-full rtl:translate-x-full"
  >
    <aside
      v-if="isMobileOpen"
      class="fixed inset-y-0 start-0 z-50 w-64 bg-white dark:bg-gray-800 lg:hidden"
    >
      <!-- Logo -->
      <div class="flex items-center justify-between h-16 px-4 border-b border-gray-200 dark:border-gray-700">
        <NuxtLink to="/dashboard" class="flex items-center gap-3">
          <div class="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
            <span class="text-white font-bold text-lg">M</span>
          </div>
          <span class="font-semibold text-gray-900 dark:text-gray-100">MetaAIBot</span>
        </NuxtLink>
        <button
          type="button"
          class="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          @click="closeMobile"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Navigation -->
      <nav class="flex-1 overflow-y-auto py-4 px-3">
        <ul class="space-y-1">
          <SidebarItem
            v-for="item in menuItems"
            :key="item.to"
            :to="item.to"
            :icon="item.icon"
            :label="item.label"
            :badge="item.badge"
            :collapsed="false"
            @click="closeMobile"
          />
        </ul>

        <!-- Divider -->
        <div class="my-4 border-t border-gray-200 dark:border-gray-700" />

        <!-- Settings Section -->
        <p class="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
          {{ $t('nav.settings') }}
        </p>

        <ul class="space-y-1">
          <SidebarItem
            v-for="item in settingsItems"
            :key="item.to"
            :to="item.to"
            :icon="item.icon"
            :label="item.label"
            :collapsed="false"
            @click="closeMobile"
          />
        </ul>
      </nav>

      <!-- Footer -->
      <div class="p-3 border-t border-gray-200 dark:border-gray-700">
        <ThemeToggle :collapsed="false" />
      </div>
    </aside>
  </Transition>
</template>

<script setup lang="ts">
const { t } = useI18n()
const sidebarStore = useSidebarStore()

const isCollapsed = computed(() => sidebarStore.collapsed)
const isMobileOpen = computed(() => sidebarStore.mobileOpen)

const menuItems = computed(() => [
  { to: '/dashboard', icon: 'home', label: t('nav.dashboard') },
  { to: '/conversations', icon: 'chat', label: t('nav.conversations'), badge: '3' },
  { to: '/orders', icon: 'shopping-bag', label: t('nav.orders') },
  { to: '/products', icon: 'cube', label: t('nav.products') },
  { to: '/categories', icon: 'folder', label: t('nav.categories') },
  { to: '/customers', icon: 'users', label: t('nav.customers') },
  { to: '/shipping', icon: 'truck', label: t('nav.shipping') }
])

const settingsItems = computed(() => [
  { to: '/settings', icon: 'cog', label: t('nav.settings') },
  { to: '/settings/templates', icon: 'template', label: t('nav.templates') },
  { to: '/settings/knowledge', icon: 'book', label: t('nav.knowledge') },
  { to: '/settings/ai-providers', icon: 'chip', label: t('nav.aiProviders') }
])

const sidebarClasses = computed(() => [
  'hidden lg:flex flex-col fixed inset-y-0 start-0 z-30 bg-white dark:bg-gray-800 border-e border-gray-200 dark:border-gray-700 transition-all duration-300',
  isCollapsed.value ? 'w-20' : 'w-64'
])

const toggle = () => sidebarStore.toggle()
const closeMobile = () => sidebarStore.closeMobile()

// Initialize sidebar state
onMounted(() => {
  sidebarStore.initSidebar()
})
</script>
