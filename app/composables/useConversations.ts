import type { Conversation, Message, ConversationFilter, ConversationStatus } from '~/types/conversation'
import { API_ENDPOINTS } from '~/utils/constants'

export function useConversations() {
  const crud = useCrud<Conversation>({
    endpoint: API_ENDPOINTS.CONVERSATIONS.BASE
  })

  const api = useApi()
  const toast = useAppToast()
  const { t } = useI18n()

  // Additional state
  const messages = ref<Message[]>([])
  const isLoadingMessages = ref(false)
  const activeConversation = ref<Conversation | null>(null)

  // Filters
  const filters = reactive<ConversationFilter>({
    platform: undefined,
    status: undefined,
    startDate: undefined,
    endDate: undefined
  })

  async function fetchConversations(additionalParams?: Record<string, any>) {
    return crud.fetchList({
      ...filters,
      ...additionalParams
    })
  }

  // Alias for fetchConversations with pagination response
  async function fetchList(params?: ConversationFilter & { page?: number; pageSize?: number }) {
    const { data, error } = await api.get<{
      data: Conversation[]
      total: number
      page: number
      pageSize: number
      totalPages: number
    }>(API_ENDPOINTS.CONVERSATIONS.BASE, { params })

    if (error) {
      return { data: [], total: 0, page: 1, pageSize: 20, totalPages: 1 }
    }

    return data || { data: [], total: 0, page: 1, pageSize: 20, totalPages: 1 }
  }

  async function fetchConversation(id: string) {
    const conversation = await crud.fetchOne(id)
    if (conversation) {
      activeConversation.value = conversation
    }
    return conversation
  }

  // Alias for fetchConversation
  async function fetchById(id: string): Promise<Conversation | null> {
    const { data, error } = await api.get<Conversation>(`${API_ENDPOINTS.CONVERSATIONS.BASE}/${id}`)

    if (error) {
      return null
    }

    if (data) {
      activeConversation.value = data
    }

    return data || null
  }

  async function fetchMessages(conversationId: string) {
    isLoadingMessages.value = true

    const { data, error } = await api.get<Message[]>(
      API_ENDPOINTS.CONVERSATIONS.MESSAGES(conversationId)
    )

    if (error) {
      toast.error(error.message)
      isLoadingMessages.value = false
      return []
    }

    messages.value = data || []
    isLoadingMessages.value = false
    return messages.value
  }

  async function sendMessage(conversationId: string, content: string) {
    const { data, error } = await api.post<Message>(
      API_ENDPOINTS.CONVERSATIONS.SEND(conversationId),
      { content }
    )

    if (error) {
      toast.error(error.message)
      return null
    }

    if (data) {
      messages.value.push(data)
    }

    return data
  }

  async function updateStatus(id: string, status: ConversationStatus, handoffReason?: string) {
    const { error } = await api.patch(
      API_ENDPOINTS.CONVERSATIONS.STATUS(id),
      { status, handoffReason }
    )

    if (error) {
      toast.error(error.message)
      return false
    }

    // Update local state
    const index = crud.items.value.findIndex(c => c.id === id)
    if (index !== -1) {
      crud.items.value[index].status = status
    }
    if (activeConversation.value?.id === id) {
      activeConversation.value.status = status
    }

    toast.success(t('conversations.statusUpdated'))
    return true
  }

  async function closeConversation(id: string) {
    return updateStatus(id, 'Closed')
  }

  async function fetchTodayCount() {
    const { data, error } = await api.get<{ count: number }>(
      API_ENDPOINTS.CONVERSATIONS.TODAY
    )

    if (error) {
      return 0
    }

    return data?.count || 0
  }

  function setFilter<K extends keyof ConversationFilter>(key: K, value: ConversationFilter[K]) {
    filters[key] = value
    crud.pagination.page = 1
    fetchConversations()
  }

  function clearFilters() {
    filters.platform = undefined
    filters.status = undefined
    filters.startDate = undefined
    filters.endDate = undefined
    crud.pagination.page = 1
    fetchConversations()
  }

  function clearMessages() {
    messages.value = []
    activeConversation.value = null
  }

  return {
    // From CRUD
    conversations: crud.items,
    total: crud.total,
    isLoading: crud.isLoading,
    error: crud.error,
    pagination: crud.pagination,
    setPage: crud.setPage,
    setPageSize: crud.setPageSize,
    setSort: crud.setSort,
    setSearch: crud.setSearch,

    // Conversation specific
    messages,
    isLoadingMessages,
    activeConversation,
    filters,

    // Actions
    fetchConversations,
    fetchConversation,
    fetchList,
    fetchById,
    fetchMessages,
    sendMessage,
    updateStatus,
    closeConversation,
    fetchTodayCount,
    setFilter,
    clearFilters,
    clearMessages
  }
}
