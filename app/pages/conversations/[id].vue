<template>
  <div class="h-[calc(100vh-8rem)]">
    <!-- Loading -->
    <div v-if="loadingConversation" class="flex items-center justify-center h-full">
      <UiSpinner size="lg" />
    </div>

    <!-- Not Found -->
    <div v-else-if="!conversation" class="flex flex-col items-center justify-center h-full">
      <svg class="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">
        {{ t('errors.notFound') }}
      </h2>
      <p class="text-gray-500 mb-4">
        {{ t('errors.notFoundMessage') }}
      </p>
      <UiButton @click="router.back()">
        <svg class="w-4 h-4 me-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        {{ t('common.goBack') }}
      </UiButton>
    </div>

    <!-- Conversation View -->
    <div v-else class="flex h-full bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
      <!-- Chat Area -->
      <div class="flex-1 flex flex-col min-w-0">
        <!-- Back Button (Mobile) -->
        <div class="lg:hidden p-2 border-b border-gray-200 dark:border-gray-700">
          <UiButton variant="ghost" size="sm" @click="router.back()">
            <svg class="w-5 h-5 me-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            {{ t('common.back') }}
          </UiButton>
        </div>

        <!-- Chat Component -->
        <ConversationsConversationChat
          :conversation="conversation"
          :messages="messages"
          :loading="loadingMessages"
          :sending="sending"
          @send="handleSendMessage"
          @resolve="handleResolve"
          @view-customer="showCustomerSidebar = true"
          @view-media="handleViewMedia"
        />
      </div>

      <!-- Customer Sidebar -->
      <Transition
        enter-active-class="transition-all duration-300 ease-out"
        enter-from-class="opacity-0 translate-x-full"
        enter-to-class="opacity-100 translate-x-0"
        leave-active-class="transition-all duration-200 ease-in"
        leave-from-class="opacity-100 translate-x-0"
        leave-to-class="opacity-0 translate-x-full"
      >
        <div
          v-if="showCustomerSidebar"
          class="w-80 shrink-0"
        >
          <ConversationsCustomerSidebar
            :customer="customer"
            :loading="loadingCustomer"
            @close="showCustomerSidebar = false"
            @view-orders="navigateToCustomerOrders"
            @view-conversations="navigateToCustomerConversations"
            @block="handleBlockCustomer"
            @unblock="handleUnblockCustomer"
          />
        </div>
      </Transition>
    </div>

    <!-- Media Viewer Modal -->
    <UiModal v-model="showMediaViewer" size="xl">
      <div class="p-4">
        <img
          :src="mediaUrl"
          alt="Media"
          class="max-w-full max-h-[80vh] mx-auto rounded-lg"
        />
      </div>
    </UiModal>
  </div>
</template>

<script setup lang="ts">
import type { Conversation, Message } from '~/types/conversation'
import type { Customer } from '~/types/customer'

definePageMeta({
  layout: 'dashboard',
  middleware: 'auth'
})

const route = useRoute()
const router = useRouter()
const { t } = useI18n()
const toast = useAppToast()
const api = useApi()
const conversationsComposable = useConversations()

const conversationId = computed(() => route.params.id as string)

// State
const conversation = ref<Conversation | null>(null)
const messages = ref<Message[]>([])
const customer = ref<Customer | null>(null)
const loadingConversation = ref(true)
const loadingMessages = ref(false)
const loadingCustomer = ref(false)
const sending = ref(false)
const showCustomerSidebar = ref(false)
const showMediaViewer = ref(false)
const mediaUrl = ref('')

// Fetch conversation
async function fetchConversation() {
  loadingConversation.value = true
  try {
    conversation.value = await conversationsComposable.fetchById(conversationId.value)
    // Auto-open customer sidebar on desktop if customer exists
    if (conversation.value?.customerId && window.innerWidth >= 1024) {
      showCustomerSidebar.value = true
      fetchCustomer()
    }
  } catch {
    conversation.value = null
  } finally {
    loadingConversation.value = false
  }
}

// Fetch messages
async function fetchMessages() {
  loadingMessages.value = true
  try {
    const { data, error } = await api.get<Message[]>(`/conversations/${conversationId.value}/messages`)
    if (!error && data) {
      messages.value = data
    }
  } catch {
    messages.value = []
  } finally {
    loadingMessages.value = false
  }
}

// Fetch customer
async function fetchCustomer() {
  if (!conversation.value?.customerId) return

  loadingCustomer.value = true
  try {
    const { data, error } = await api.get<Customer>(`/customers/${conversation.value.customerId}`)
    if (!error) {
      customer.value = data
    }
  } catch {
    customer.value = null
  } finally {
    loadingCustomer.value = false
  }
}

// Send message
async function handleSendMessage(content: string) {
  if (!content.trim() || sending.value) return

  sending.value = true
  try {
    const { data, error } = await api.post<Message>(`/conversations/${conversationId.value}/messages`, {
      content,
      direction: 'Outgoing'
    })

    if (!error && data) {
      messages.value.push(data)
      toast.success(t('messages.saved'))
    } else {
      toast.error(t('errors.somethingWrong'))
    }
  } catch {
    toast.error(t('errors.somethingWrong'))
  } finally {
    sending.value = false
  }
}

// Resolve conversation
async function handleResolve() {
  try {
    await conversationsComposable.updateStatus(conversationId.value, 'Resolved')
    if (conversation.value) {
      conversation.value.status = 'Resolved'
    }
    toast.success(t('conversations.statusUpdated'))
  } catch {
    toast.error(t('errors.somethingWrong'))
  }
}

// View media
function handleViewMedia(url: string) {
  mediaUrl.value = url
  showMediaViewer.value = true
}

// Navigation
function navigateToCustomerOrders() {
  if (customer.value?.id) {
    router.push(`/orders?customerId=${customer.value.id}`)
  }
}

function navigateToCustomerConversations() {
  if (customer.value?.id) {
    router.push(`/conversations?customerId=${customer.value.id}`)
  }
}

// Block/Unblock customer
async function handleBlockCustomer() {
  if (!customer.value) return

  try {
    const { error } = await api.post(`/customers/${customer.value.id}/block`)
    if (!error) {
      customer.value.isBlocked = true
      toast.success(t('messages.updated'))
    } else {
      toast.error(t('errors.somethingWrong'))
    }
  } catch {
    toast.error(t('errors.somethingWrong'))
  }
}

async function handleUnblockCustomer() {
  if (!customer.value) return

  try {
    const { error } = await api.post(`/customers/${customer.value.id}/unblock`)
    if (!error) {
      customer.value.isBlocked = false
      toast.success(t('messages.updated'))
    } else {
      toast.error(t('errors.somethingWrong'))
    }
  } catch {
    toast.error(t('errors.somethingWrong'))
  }
}

// Watch for sidebar toggle to fetch customer
watch(showCustomerSidebar, (show) => {
  if (show && !customer.value && conversation.value?.customerId) {
    fetchCustomer()
  }
})

// Initial fetch
onMounted(async () => {
  await fetchConversation()
  if (conversation.value) {
    fetchMessages()
  }
})

// Polling for new messages (optional real-time updates)
const pollInterval = ref<ReturnType<typeof setInterval> | null>(null)

onMounted(() => {
  // Poll for new messages every 10 seconds if conversation is active
  pollInterval.value = setInterval(() => {
    if (conversation.value && conversation.value.status === 'Active') {
      fetchMessages()
    }
  }, 10000)
})

onUnmounted(() => {
  if (pollInterval.value) {
    clearInterval(pollInterval.value)
  }
})
</script>
