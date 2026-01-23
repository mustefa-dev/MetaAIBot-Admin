<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
          {{ t('settings.connections.title') }}
        </h1>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {{ t('settings.connections.description') }}
        </p>
      </div>
    </div>

    <!-- Error Alert -->
    <div
      v-if="error"
      class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4"
    >
      <div class="flex">
        <svg class="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
        </svg>
        <div class="ms-3">
          <p class="text-sm text-red-700 dark:text-red-300">{{ error }}</p>
        </div>
        <button @click="error = null" class="ms-auto text-red-400 hover:text-red-500">
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Connect Meta Button -->
    <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
            <svg class="w-7 h-7 text-blue-600 dark:text-blue-400" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.989C18.343 21.129 22 16.99 22 12c0-5.523-4.477-10-10-10z"/>
            </svg>
          </div>
          <div>
            <h3 class="text-lg font-medium text-gray-900 dark:text-white">
              {{ t('settings.connections.connectMeta') }}
            </h3>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              {{ t('settings.connections.connectMetaDescription') }}
            </p>
          </div>
        </div>
        <UiButton
          :loading="connecting"
          @click="connectMeta"
        >
          <svg class="w-4 h-4 me-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          {{ t('settings.connections.connect') }}
        </UiButton>
      </div>
    </div>

    <!-- Connected Accounts -->
    <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
      <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <h2 class="text-lg font-medium text-gray-900 dark:text-white">
          {{ t('settings.connections.connectedAccounts') }}
        </h2>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="p-6 space-y-4">
        <div v-for="i in 2" :key="i" class="flex items-center gap-4">
          <UiSkeleton class="w-12 h-12 rounded-full" />
          <div class="flex-1">
            <UiSkeleton class="h-5 w-1/3 mb-2" />
            <UiSkeleton class="h-4 w-1/4" />
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div
        v-else-if="accounts.length === 0"
        class="p-12 text-center"
      >
        <svg class="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
        </svg>
        <h3 class="mt-4 text-sm font-medium text-gray-900 dark:text-white">
          {{ t('settings.connections.noAccounts') }}
        </h3>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {{ t('settings.connections.noAccountsDescription') }}
        </p>
      </div>

      <!-- Accounts List -->
      <div v-else class="divide-y divide-gray-200 dark:divide-gray-700">
        <div
          v-for="account in accounts"
          :key="account.id"
          class="p-6 flex items-center gap-4"
        >
          <!-- Platform Icon / Profile Picture -->
          <div class="relative">
            <img
              v-if="account.profilePictureUrl"
              :src="account.profilePictureUrl"
              :alt="account.accountName"
              class="w-12 h-12 rounded-full object-cover"
            />
            <div
              v-else
              class="w-12 h-12 rounded-full flex items-center justify-center"
              :class="getPlatformBgClass(account.platform)"
            >
              <component :is="getPlatformIcon(account.platform)" class="w-6 h-6" />
            </div>
            <!-- Platform Badge -->
            <div
              class="absolute -bottom-1 -end-1 w-5 h-5 rounded-full flex items-center justify-center"
              :class="getPlatformBgClass(account.platform)"
            >
              <component :is="getPlatformIcon(account.platform)" class="w-3 h-3 text-white" />
            </div>
          </div>

          <!-- Account Info -->
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2">
              <h3 class="font-medium text-gray-900 dark:text-white truncate">
                {{ account.accountName }}
              </h3>
              <UiBadge
                v-if="account.isActive"
                variant="success"
                size="sm"
              >
                {{ t('common.active') }}
              </UiBadge>
              <UiBadge
                v-else
                variant="gray"
                size="sm"
              >
                {{ t('common.inactive') }}
              </UiBadge>
              <UiBadge
                v-if="account.tokenExpiringSoon"
                variant="warning"
                size="sm"
              >
                {{ t('settings.connections.tokenExpiring') }}
              </UiBadge>
            </div>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              {{ account.platform }} &bull; {{ t('settings.connections.connectedOn') }} {{ formatDate(account.connectedAt) }}
            </p>
            <p v-if="account.lastError" class="text-sm text-red-500 mt-1 truncate">
              {{ account.lastError }}
            </p>
          </div>

          <!-- Actions -->
          <div class="flex items-center gap-2">
            <UiButton
              v-if="account.tokenExpiringSoon"
              variant="outline"
              size="sm"
              @click="refreshToken(account)"
            >
              {{ t('settings.connections.refresh') }}
            </UiButton>
            <UiButton
              variant="ghost"
              size="sm"
              class="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
              @click="confirmDisconnect(account)"
            >
              {{ t('settings.connections.disconnect') }}
            </UiButton>
          </div>
        </div>
      </div>
    </div>

    <!-- Disconnect Confirmation Modal -->
    <UiModal
      v-model="showDisconnectModal"
      :title="t('settings.connections.disconnectTitle')"
    >
      <p class="text-gray-600 dark:text-gray-300">
        {{ t('settings.connections.disconnectConfirm', { name: accountToDisconnect?.accountName }) }}
      </p>
      <template #footer>
        <div class="flex justify-end gap-3">
          <UiButton variant="outline" @click="showDisconnectModal = false">
            {{ t('common.cancel') }}
          </UiButton>
          <UiButton
            variant="danger"
            :loading="disconnecting"
            @click="disconnectAccount"
          >
            {{ t('settings.connections.disconnect') }}
          </UiButton>
        </div>
      </template>
    </UiModal>
  </div>
</template>

<script setup lang="ts">
import type { ConnectedAccountDto } from '~/types/oauth'

definePageMeta({
  layout: 'dashboard'
})

const { t } = useI18n()
const route = useRoute()
const { get, del } = useApi()

const loading = ref(true)
const connecting = ref(false)
const disconnecting = ref(false)
const accounts = ref<ConnectedAccountDto[]>([])
const error = ref<string | null>(null)
const showDisconnectModal = ref(false)
const accountToDisconnect = ref<ConnectedAccountDto | null>(null)

// Check for error in URL params (from OAuth callback)
onMounted(async () => {
  const errorParam = route.query.error as string
  if (errorParam) {
    error.value = errorParam
  }
  await loadAccounts()
})

async function loadAccounts() {
  loading.value = true
  try {
    const { data, error: apiError } = await get<ConnectedAccountDto[]>('/oauth/accounts')
    if (apiError) {
      console.error('Failed to load accounts:', apiError.message)
    } else if (data) {
      accounts.value = data
    }
  } catch (e: any) {
    console.error('Failed to load accounts:', e)
  } finally {
    loading.value = false
  }
}

async function connectMeta() {
  connecting.value = true
  error.value = null
  try {
    const { data, error: apiError } = await get<{ authorizationUrl: string }>('/oauth/meta/url')
    if (apiError) {
      error.value = apiError.message || 'Failed to start OAuth flow'
      connecting.value = false
      return
    }
    if (data?.authorizationUrl) {
      // Redirect to Meta OAuth
      window.location.href = data.authorizationUrl
    }
  } catch (e: any) {
    error.value = e.message || 'Failed to start OAuth flow'
    connecting.value = false
  }
}

function confirmDisconnect(account: ConnectedAccountDto) {
  accountToDisconnect.value = account
  showDisconnectModal.value = true
}

async function disconnectAccount() {
  if (!accountToDisconnect.value) return

  disconnecting.value = true
  try {
    const { error: apiError } = await del(`/oauth/accounts/${accountToDisconnect.value.id}`)
    if (apiError) {
      error.value = apiError.message || 'Failed to disconnect account'
    } else {
      await loadAccounts()
      showDisconnectModal.value = false
    }
  } catch (e: any) {
    error.value = e.message || 'Failed to disconnect account'
  } finally {
    disconnecting.value = false
  }
}

async function refreshToken(account: ConnectedAccountDto) {
  // Re-initiate OAuth flow to refresh token
  await connectMeta()
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString()
}

function getPlatformBgClass(platform: string) {
  switch (platform) {
    case 'Instagram':
      return 'bg-gradient-to-br from-purple-500 to-pink-500 text-white'
    case 'Messenger':
      return 'bg-blue-500 text-white'
    case 'WhatsApp':
      return 'bg-green-500 text-white'
    default:
      return 'bg-gray-500 text-white'
  }
}

function getPlatformIcon(platform: string) {
  // Return icon component based on platform
  return defineComponent({
    template: getPlatformIconSvg(platform)
  })
}

function getPlatformIconSvg(platform: string) {
  switch (platform) {
    case 'Instagram':
      return '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>'
    case 'Messenger':
      return '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.477 2 2 6.145 2 11.243c0 2.908 1.438 5.503 3.686 7.199V22l3.387-1.861c.904.251 1.863.387 2.859.387 5.523 0 10-4.145 10-9.243S17.523 2 12 2zm1.002 12.463l-2.545-2.717-4.97 2.717 5.467-5.804 2.609 2.717 4.906-2.717-5.467 5.804z"/></svg>'
    case 'WhatsApp':
      return '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>'
    default:
      return '<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10"/></svg>'
  }
}
</script>
