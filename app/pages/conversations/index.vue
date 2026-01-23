<template>
  <div>
    <PageHeader :title="t('conversations.title')">
      <template #subtitle>
        {{ t('conversations.all') }}
      </template>
      <template #actions>
        <UiButton variant="outline" @click="refresh">
          <svg class="w-4 h-4 me-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          {{ t('common.refresh') }}
        </UiButton>
      </template>
    </PageHeader>

    <!-- Stats Cards -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      <UiCard class="text-center">
        <div class="text-2xl font-bold text-gray-900 dark:text-white">
          {{ stats.active }}
        </div>
        <div class="text-sm text-gray-500">{{ t('conversations.active') }}</div>
      </UiCard>
      <UiCard class="text-center">
        <div class="text-2xl font-bold text-yellow-600">
          {{ stats.pendingHandoff }}
        </div>
        <div class="text-sm text-gray-500">{{ t('conversations.pendingHandoff') }}</div>
      </UiCard>
      <UiCard class="text-center">
        <div class="text-2xl font-bold text-blue-600">
          {{ stats.resolved }}
        </div>
        <div class="text-sm text-gray-500">{{ t('conversations.resolved') }}</div>
      </UiCard>
      <UiCard class="text-center">
        <div class="text-2xl font-bold text-gray-600">
          {{ stats.closed }}
        </div>
        <div class="text-sm text-gray-500">{{ t('conversations.closed') }}</div>
      </UiCard>
    </div>

    <!-- Filters -->
    <UiCard class="mb-6">
      <ConversationsConversationFilters
        :filters="filters"
        @update:filters="handleFiltersUpdate"
      />
    </UiCard>

    <!-- Tabs -->
    <div class="mb-4 border-b border-gray-200 dark:border-gray-700">
      <nav class="flex gap-4">
        <button
          v-for="tab in tabs"
          :key="tab.value"
          class="pb-3 px-1 text-sm font-medium border-b-2 transition-colors"
          :class="activeTab === tab.value
            ? 'border-primary-500 text-primary-600 dark:text-primary-400'
            : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'"
          @click="setActiveTab(tab.value)"
        >
          {{ tab.label }}
          <span
            v-if="tab.count > 0"
            class="ms-2 px-2 py-0.5 text-xs rounded-full"
            :class="activeTab === tab.value
              ? 'bg-primary-100 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400'
              : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'"
          >
            {{ tab.count }}
          </span>
        </button>
      </nav>
    </div>

    <!-- Conversation List -->
    <ConversationsConversationList
      :conversations="filteredConversations"
      :loading="loading"
      @resolve="handleResolve"
      @handoff="handleHandoff"
    />

    <!-- Pagination -->
    <div v-if="totalPages > 1" class="mt-6">
      <UiPagination
        :current-page="currentPage"
        :total-pages="totalPages"
        :total-items="totalItems"
        :page-size="pageSize"
        @page-change="handlePageChange"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Conversation, ConversationFilter, ConversationStatus } from '~/types/conversation'

definePageMeta({
  layout: 'dashboard',
  middleware: 'auth'
})

const { t } = useI18n()
const toast = useAppToast()
const conversationsComposable = useConversations()

// State
const loading = ref(false)
const conversations = ref<Conversation[]>([])
const currentPage = ref(1)
const pageSize = ref(20)
const totalItems = ref(0)
const totalPages = ref(1)
const activeTab = ref<ConversationStatus | 'all'>('all')

const filters = ref<ConversationFilter>({
  search: undefined,
  platform: undefined,
  status: undefined,
  startDate: undefined,
  endDate: undefined
})

// Stats
const stats = computed(() => ({
  active: conversations.value.filter(c => c.status === 'Active').length,
  pendingHandoff: conversations.value.filter(c => c.status === 'PendingHandoff').length,
  resolved: conversations.value.filter(c => c.status === 'Resolved').length,
  closed: conversations.value.filter(c => c.status === 'Closed').length
}))

// Tabs
const tabs = computed(() => [
  { value: 'all' as const, label: t('common.all'), count: totalItems.value },
  { value: 'Active' as const, label: t('conversations.active'), count: stats.value.active },
  { value: 'PendingHandoff' as const, label: t('conversations.pendingHandoff'), count: stats.value.pendingHandoff },
  { value: 'Resolved' as const, label: t('conversations.resolved'), count: stats.value.resolved },
  { value: 'Closed' as const, label: t('conversations.closed'), count: stats.value.closed }
])

// Filtered conversations based on active tab
const filteredConversations = computed(() => {
  if (activeTab.value === 'all') {
    return conversations.value
  }
  return conversations.value.filter(c => c.status === activeTab.value)
})

// Fetch conversations
async function fetchConversations() {
  loading.value = true
  try {
    const result = await conversationsComposable.fetchList({
      page: currentPage.value,
      pageSize: pageSize.value,
      ...filters.value
    })
    conversations.value = result.data
    totalItems.value = result.total
    totalPages.value = result.totalPages
  } catch (error) {
    toast.error(t('errors.somethingWrong'))
  } finally {
    loading.value = false
  }
}

// Event handlers
function handleFiltersUpdate(newFilters: ConversationFilter) {
  filters.value = newFilters
  currentPage.value = 1
  fetchConversations()
}

function handlePageChange(page: number) {
  currentPage.value = page
  fetchConversations()
}

function setActiveTab(tab: ConversationStatus | 'all') {
  activeTab.value = tab
  if (tab === 'all') {
    filters.value.status = undefined
  } else {
    filters.value.status = tab
  }
  currentPage.value = 1
  fetchConversations()
}

async function handleResolve(conversation: Conversation) {
  try {
    await conversationsComposable.updateStatus(conversation.id, 'Resolved')
    toast.success(t('conversations.statusUpdated'))
    fetchConversations()
  } catch {
    toast.error(t('errors.somethingWrong'))
  }
}

async function handleHandoff(conversation: Conversation) {
  try {
    await conversationsComposable.updateStatus(conversation.id, 'PendingHandoff')
    toast.success(t('conversations.statusUpdated'))
    fetchConversations()
  } catch {
    toast.error(t('errors.somethingWrong'))
  }
}

function refresh() {
  fetchConversations()
}

// Initial fetch
onMounted(() => {
  fetchConversations()
})
</script>
