import type {
  SimulateChatRequest,
  SimulateChatResponse,
  IntentDetectionRequest,
  IntentDetectionResponse,
  MessagePlatform
} from '~/types/conversation'
import { API_ENDPOINTS } from '~/utils/constants'

export function useTestChat() {
  const api = useApi()
  const toast = useAppToast()

  const isLoading = ref(false)
  const lastResponse = ref<SimulateChatResponse | null>(null)
  const lastIntent = ref<IntentDetectionResponse | null>(null)

  // Simulate chat conversation
  async function simulateChat(request: SimulateChatRequest): Promise<SimulateChatResponse | null> {
    isLoading.value = true

    const { data, error } = await api.post<SimulateChatResponse>(
      API_ENDPOINTS.TEST.CHAT,
      request
    )

    if (error) {
      toast.error(error.message)
      isLoading.value = false
      return null
    }

    lastResponse.value = data
    isLoading.value = false
    return data
  }

  // Detect intent only
  async function detectIntent(message: string): Promise<IntentDetectionResponse | null> {
    isLoading.value = true

    const { data, error } = await api.post<IntentDetectionResponse>(
      API_ENDPOINTS.TEST.INTENT,
      { message } as IntentDetectionRequest
    )

    if (error) {
      toast.error(error.message)
      isLoading.value = false
      return null
    }

    lastIntent.value = data
    isLoading.value = false
    return data
  }

  // Get AI status
  async function getAIStatus() {
    const { data, error } = await api.get(API_ENDPOINTS.TEST.AI_STATUS)

    if (error) {
      return null
    }

    return data
  }

  // Get sample messages for testing
  async function getSampleMessages() {
    const { data, error } = await api.get<string[]>(API_ENDPOINTS.TEST.SAMPLES)

    if (error) {
      return []
    }

    return data || []
  }

  // Quick chat helper
  function quickChat(message: string, platform: MessagePlatform = 'WhatsApp') {
    return simulateChat({
      message,
      platform,
      customerName: 'Test Customer'
    })
  }

  function clear() {
    lastResponse.value = null
    lastIntent.value = null
  }

  return {
    isLoading,
    lastResponse,
    lastIntent,
    simulateChat,
    detectIntent,
    getAIStatus,
    getSampleMessages,
    quickChat,
    clear
  }
}
