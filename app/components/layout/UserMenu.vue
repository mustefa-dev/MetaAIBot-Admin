<template>
  <UiDropdown position="right" width="md">
    <template #trigger>
      <button class="flex items-center gap-2 p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
        <UiAvatar
          :name="userName"
          size="sm"
          status="online"
        />
        <span class="hidden sm:inline text-sm font-medium text-gray-700 dark:text-gray-300">
          {{ userName }}
        </span>
        <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
    </template>

    <template #default="{ close }">
      <!-- User Info -->
      <div class="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
        <p class="text-sm font-medium text-gray-900 dark:text-white">
          {{ userName }}
        </p>
        <p class="text-xs text-gray-500 dark:text-gray-400 truncate">
          {{ userEmail }}
        </p>
      </div>

      <!-- Menu Items -->
      <div class="py-1">
        <UiDropdownItem @click="close(); navigateTo('/profile')">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          {{ $t('nav.profile') }}
        </UiDropdownItem>

        <UiDropdownItem @click="close(); navigateTo('/settings')">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {{ $t('nav.settings') }}
        </UiDropdownItem>
      </div>

      <!-- Divider -->
      <div class="border-t border-gray-100 dark:border-gray-700" />

      <!-- Logout -->
      <div class="py-1">
        <UiDropdownItem variant="danger" @click="handleLogout">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          {{ $t('auth.logout') }}
        </UiDropdownItem>
      </div>
    </template>
  </UiDropdown>
</template>

<script setup lang="ts">
const authStore = useAuthStore()

const userName = computed(() => authStore.user?.name || 'User')
const userEmail = computed(() => authStore.user?.email || '')

const handleLogout = () => {
  authStore.logout()
  navigateTo('/login')
}
</script>
