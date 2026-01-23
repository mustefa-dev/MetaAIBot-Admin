import type { StoreSettings, MessageTemplate, KnowledgeEntry } from '~/types/settings'
import { API_ENDPOINTS } from '~/utils/constants'

export function useSettings() {
  const api = useApi()
  const toast = useAppToast()
  const { t } = useI18n()

  // Store settings
  const settings = ref<StoreSettings | null>(null)
  const isLoadingSettings = ref(false)

  // Message templates
  const templates = ref<MessageTemplate[]>([])
  const isLoadingTemplates = ref(false)

  // Knowledge base
  const knowledgeEntries = ref<KnowledgeEntry[]>([])
  const isLoadingKnowledge = ref(false)

  // Fetch store settings
  async function fetchSettings() {
    isLoadingSettings.value = true

    const { data, error } = await api.get<StoreSettings>(API_ENDPOINTS.SETTINGS.STORE)

    if (error) {
      toast.error(error.message)
      isLoadingSettings.value = false
      return null
    }

    settings.value = data
    isLoadingSettings.value = false
    return data
  }

  // Update store settings
  async function updateSettings(data: Partial<StoreSettings>): Promise<boolean> {
    const { error } = await api.put(API_ENDPOINTS.SETTINGS.STORE, data)

    if (error) {
      toast.error(error.message)
      return false
    }

    // Update local state
    if (settings.value) {
      settings.value = { ...settings.value, ...data }
    }

    toast.saved()
    return true
  }

  // Fetch message templates
  async function fetchTemplates() {
    isLoadingTemplates.value = true

    const { data, error } = await api.get<MessageTemplate[]>(API_ENDPOINTS.SETTINGS.TEMPLATES)

    if (error) {
      toast.error(error.message)
      isLoadingTemplates.value = false
      return []
    }

    templates.value = data || []
    isLoadingTemplates.value = false
    return templates.value
  }

  // Create template
  async function createTemplate(data: Omit<MessageTemplate, 'id'>): Promise<MessageTemplate | null> {
    const { data: result, error } = await api.post<MessageTemplate>(
      API_ENDPOINTS.SETTINGS.TEMPLATES,
      data
    )

    if (error) {
      toast.error(error.message)
      return null
    }

    if (result) {
      templates.value.push(result)
      toast.created()
    }

    return result || null
  }

  // Update template
  async function updateTemplate(id: string, data: Partial<MessageTemplate>): Promise<boolean> {
    const { error } = await api.put(`${API_ENDPOINTS.SETTINGS.TEMPLATES}/${id}`, data)

    if (error) {
      toast.error(error.message)
      return false
    }

    const index = templates.value.findIndex(t => t.id === id)
    if (index !== -1) {
      templates.value[index] = { ...templates.value[index], ...data }
    }

    toast.updated()
    return true
  }

  // Delete template
  async function deleteTemplate(id: string): Promise<boolean> {
    const { error } = await api.del(`${API_ENDPOINTS.SETTINGS.TEMPLATES}/${id}`)

    if (error) {
      toast.error(error.message)
      return false
    }

    templates.value = templates.value.filter(t => t.id !== id)
    toast.deleted()
    return true
  }

  // Fetch knowledge base entries
  async function fetchKnowledge() {
    isLoadingKnowledge.value = true

    const { data, error } = await api.get<KnowledgeEntry[]>(API_ENDPOINTS.SETTINGS.KNOWLEDGE)

    if (error) {
      toast.error(error.message)
      isLoadingKnowledge.value = false
      return []
    }

    knowledgeEntries.value = data || []
    isLoadingKnowledge.value = false
    return knowledgeEntries.value
  }

  // Create knowledge entry
  async function createKnowledgeEntry(data: Omit<KnowledgeEntry, 'id'>): Promise<KnowledgeEntry | null> {
    const { data: result, error } = await api.post<KnowledgeEntry>(
      API_ENDPOINTS.SETTINGS.KNOWLEDGE,
      data
    )

    if (error) {
      toast.error(error.message)
      return null
    }

    if (result) {
      knowledgeEntries.value.push(result)
      toast.created()
    }

    return result || null
  }

  // Update knowledge entry
  async function updateKnowledgeEntry(id: string, data: Partial<KnowledgeEntry>): Promise<boolean> {
    const { error } = await api.put(`${API_ENDPOINTS.SETTINGS.KNOWLEDGE}/${id}`, data)

    if (error) {
      toast.error(error.message)
      return false
    }

    const index = knowledgeEntries.value.findIndex(k => k.id === id)
    if (index !== -1) {
      knowledgeEntries.value[index] = { ...knowledgeEntries.value[index], ...data }
    }

    toast.updated()
    return true
  }

  // Delete knowledge entry
  async function deleteKnowledgeEntry(id: string): Promise<boolean> {
    const { error } = await api.del(`${API_ENDPOINTS.SETTINGS.KNOWLEDGE}/${id}`)

    if (error) {
      toast.error(error.message)
      return false
    }

    knowledgeEntries.value = knowledgeEntries.value.filter(k => k.id !== id)
    toast.deleted()
    return true
  }

  return {
    // State
    settings,
    isLoadingSettings,
    templates,
    isLoadingTemplates,
    knowledgeEntries,
    isLoadingKnowledge,

    // Settings actions
    fetchSettings,
    updateSettings,

    // Template actions
    fetchTemplates,
    createTemplate,
    updateTemplate,
    deleteTemplate,

    // Knowledge actions
    fetchKnowledge,
    createKnowledgeEntry,
    updateKnowledgeEntry,
    deleteKnowledgeEntry
  }
}
