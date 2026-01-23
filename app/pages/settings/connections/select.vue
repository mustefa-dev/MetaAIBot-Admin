<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
    <div class="w-full max-w-2xl">
      <!-- Card -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <!-- Header -->
        <div class="px-6 py-5 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-500 to-purple-600">
          <h1 class="text-xl font-bold text-white">
            {{ t('settings.connections.selectAccounts') }}
          </h1>
          <p class="mt-1 text-blue-100">
            {{ t('settings.connections.selectAccountsDescription') }}
          </p>
        </div>

        <!-- Loading -->
        <div v-if="loading" class="p-8 space-y-4">
          <div v-for="i in 2" :key="i" class="flex items-center gap-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
            <UiSkeleton class="w-14 h-14 rounded-lg" />
            <div class="flex-1">
              <UiSkeleton class="h-5 w-1/2 mb-2" />
              <UiSkeleton class="h-4 w-1/3" />
            </div>
          </div>
        </div>

        <!-- Error -->
        <div v-else-if="error" class="p-8 text-center">
          <svg class="w-12 h-12 mx-auto text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 class="mt-4 text-lg font-medium text-gray-900 dark:text-white">
            {{ t('common.error') }}
          </h3>
          <p class="mt-2 text-gray-500 dark:text-gray-400">{{ error }}</p>
          <UiButton class="mt-4" @click="router.push('/settings/connections')">
            {{ t('common.back') }}
          </UiButton>
        </div>

        <!-- No Pages -->
        <div v-else-if="pages.length === 0" class="p-8 text-center">
          <svg class="w-12 h-12 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 class="mt-4 text-lg font-medium text-gray-900 dark:text-white">
            {{ t('settings.connections.noPages') }}
          </h3>
          <p class="mt-2 text-gray-500 dark:text-gray-400">
            {{ t('settings.connections.noPagesDescription') }}
          </p>
          <UiButton class="mt-4" @click="router.push('/settings/connections')">
            {{ t('common.back') }}
          </UiButton>
        </div>

        <!-- Pages List -->
        <div v-else class="p-6 space-y-4">
          <div
            v-for="page in pages"
            :key="page.pageId"
            class="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
            :class="{ 'ring-2 ring-primary-500': selectedPage?.pageId === page.pageId }"
          >
            <!-- Page Header -->
            <button
              class="w-full p-4 flex items-center gap-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
              @click="togglePage(page)"
            >
              <img
                v-if="page.pagePictureUrl"
                :src="page.pagePictureUrl"
                :alt="page.pageName"
                class="w-14 h-14 rounded-lg object-cover"
              />
              <div
                v-else
                class="w-14 h-14 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center"
              >
                <svg class="w-7 h-7 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.989C18.343 21.129 22 16.99 22 12c0-5.523-4.477-10-10-10z"/>
                </svg>
              </div>
              <div class="flex-1 text-start">
                <h3 class="font-medium text-gray-900 dark:text-white">
                  {{ page.pageName }}
                </h3>
                <p class="text-sm text-gray-500 dark:text-gray-400">
                  Facebook Page
                </p>
              </div>
              <div
                class="w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors"
                :class="selectedPage?.pageId === page.pageId
                  ? 'border-primary-500 bg-primary-500'
                  : 'border-gray-300 dark:border-gray-600'"
              >
                <svg
                  v-if="selectedPage?.pageId === page.pageId"
                  class="w-4 h-4 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                </svg>
              </div>
            </button>

            <!-- Instagram Account (if available) -->
            <div
              v-if="page.hasInstagram && selectedPage?.pageId === page.pageId"
              class="px-4 pb-4 pt-0"
            >
              <div class="ms-18 border-s-2 border-gray-200 dark:border-gray-700 ps-4">
                <div class="flex items-center gap-3 p-3 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg">
                  <img
                    v-if="page.instagramProfilePicture"
                    :src="page.instagramProfilePicture"
                    :alt="page.instagramUsername"
                    class="w-10 h-10 rounded-full object-cover"
                  />
                  <div
                    v-else
                    class="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center"
                  >
                    <svg class="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                  </div>
                  <div class="flex-1">
                    <p class="font-medium text-gray-900 dark:text-white">
                      @{{ page.instagramUsername }}
                    </p>
                    <p class="text-xs text-gray-500">Instagram Business Account</p>
                  </div>
                  <label class="flex items-center gap-2 cursor-pointer">
                    <input
                      v-model="connectInstagram"
                      type="checkbox"
                      class="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                    />
                    <span class="text-sm text-gray-600 dark:text-gray-300">{{ t('settings.connections.connect') }}</span>
                  </label>
                </div>
              </div>
            </div>

            <!-- Messenger Option -->
            <div
              v-if="selectedPage?.pageId === page.pageId"
              class="px-4 pb-4"
            >
              <div class="ms-18 border-s-2 border-gray-200 dark:border-gray-700 ps-4">
                <div class="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div class="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center">
                    <svg class="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C6.477 2 2 6.145 2 11.243c0 2.908 1.438 5.503 3.686 7.199V22l3.387-1.861c.904.251 1.863.387 2.859.387 5.523 0 10-4.145 10-9.243S17.523 2 12 2zm1.002 12.463l-2.545-2.717-4.97 2.717 5.467-5.804 2.609 2.717 4.906-2.717-5.467 5.804z"/>
                    </svg>
                  </div>
                  <div class="flex-1">
                    <p class="font-medium text-gray-900 dark:text-white">
                      {{ page.pageName }}
                    </p>
                    <p class="text-xs text-gray-500">Facebook Messenger</p>
                  </div>
                  <label class="flex items-center gap-2 cursor-pointer">
                    <input
                      v-model="connectMessenger"
                      type="checkbox"
                      class="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                    />
                    <span class="text-sm text-gray-600 dark:text-gray-300">{{ t('settings.connections.connect') }}</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div
          v-if="!loading && !error && pages.length > 0"
          class="px-6 py-4 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700 flex justify-between"
        >
          <UiButton variant="outline" @click="router.push('/settings/connections')">
            {{ t('common.cancel') }}
          </UiButton>
          <UiButton
            :disabled="!selectedPage || (!connectInstagram && !connectMessenger)"
            :loading="connecting"
            @click="connectSelected"
          >
            {{ t('settings.connections.connectSelected') }}
          </UiButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface AvailablePage {
  pageId: string
  pageName: string
  pagePictureUrl?: string
  hasInstagram: boolean
  instagramAccountId?: string
  instagramUsername?: string
  instagramProfilePicture?: string
}

definePageMeta({
  layout: false
})

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const { $api } = useNuxtApp()

const loading = ref(true)
const connecting = ref(false)
const error = ref<string | null>(null)
const pages = ref<AvailablePage[]>([])
const selectedPage = ref<AvailablePage | null>(null)
const connectInstagram = ref(true)
const connectMessenger = ref(true)

const state = computed(() => route.query.state as string)

onMounted(async () => {
  if (!state.value) {
    error.value = 'Missing OAuth state'
    loading.value = false
    return
  }

  await loadPages()
})

async function loadPages() {
  loading.value = true
  try {
    const response = await $api(`/oauth/meta/pages?state=${state.value}`) as { pages: AvailablePage[] }
    pages.value = response.pages || []

    // Auto-select first page if only one
    if (pages.value.length === 1) {
      selectedPage.value = pages.value[0]
    }
  } catch (e: any) {
    error.value = e.message || 'Failed to load pages'
  } finally {
    loading.value = false
  }
}

function togglePage(page: AvailablePage) {
  if (selectedPage.value?.pageId === page.pageId) {
    selectedPage.value = null
  } else {
    selectedPage.value = page
    connectInstagram.value = page.hasInstagram
    connectMessenger.value = true
  }
}

async function connectSelected() {
  if (!selectedPage.value) return

  connecting.value = true
  try {
    await $api('/oauth/meta/connect', {
      method: 'POST',
      body: {
        state: state.value,
        pageId: selectedPage.value.pageId,
        connectInstagram: connectInstagram.value && selectedPage.value.hasInstagram,
        connectMessenger: connectMessenger.value
      }
    })

    // Success - redirect to connections page
    router.push('/settings/connections?success=1')
  } catch (e: any) {
    error.value = e.message || 'Failed to connect accounts'
  } finally {
    connecting.value = false
  }
}
</script>
