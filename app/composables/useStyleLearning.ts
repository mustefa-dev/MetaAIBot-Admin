import { API_ENDPOINTS } from '~/utils/constants'
import type {
  StyleProfile,
  StylePatterns,
  ImportProgress,
  ImportStatistics,
  ImportHistoryRequest,
  ImportResult,
  StyleAnalysisResult,
  StylePreviewResult,
  AddPatternRequest,
  ConnectedAccountForImport
} from '~/types/settings'

export function useStyleLearning() {
  const api = useApi()
  const toast = useAppToast()
  const { t } = useI18n()

  // State
  const profile = ref<StyleProfile | null>(null)
  const patterns = ref<StylePatterns | null>(null)
  const importProgress = ref<ImportProgress | null>(null)
  const statistics = ref<ImportStatistics | null>(null)
  const stylePrompt = ref<string | null>(null)
  const connectedAccounts = ref<ConnectedAccountForImport[]>([])

  const loading = ref(false)
  const importing = ref(false)
  const analyzing = ref(false)

  // Fetch connected accounts
  async function fetchConnectedAccounts(): Promise<ConnectedAccountForImport[]> {
    try {
      const { data, error } = await api.get<ConnectedAccountForImport[]>(
        API_ENDPOINTS.STYLE_LEARNING.ACCOUNTS
      )
      if (error) {
        toast.error(error.message)
        return []
      }
      connectedAccounts.value = data || []
      return connectedAccounts.value
    } catch {
      return []
    }
  }

  // Import from connected account
  async function importFromAccount(accountId: string, since?: string): Promise<ImportResult | null> {
    importing.value = true
    try {
      let url = API_ENDPOINTS.STYLE_LEARNING.IMPORT_FROM_ACCOUNT(accountId)
      if (since) {
        url += `?since=${encodeURIComponent(since)}`
      }
      const { data, error } = await api.post<ImportResult>(url)
      if (error) {
        toast.error(error.message)
        return null
      }
      toast.success(t('styleLearning.importStarted'))
      return data
    } finally {
      importing.value = false
    }
  }

  // Fetch style profile
  async function fetchProfile(ownerId = 'default'): Promise<StyleProfile | null> {
    loading.value = true
    try {
      const { data, error } = await api.get<StyleProfile>(
        `${API_ENDPOINTS.STYLE_LEARNING.PROFILE}?ownerId=${ownerId}`
      )
      if (error) {
        if (error.statusCode !== 404) {
          toast.error(error.message)
        }
        return null
      }
      profile.value = data
      return data
    } finally {
      loading.value = false
    }
  }

  // Fetch patterns
  async function fetchPatterns(ownerId = 'default'): Promise<StylePatterns | null> {
    try {
      const { data, error } = await api.get<StylePatterns>(
        `${API_ENDPOINTS.STYLE_LEARNING.PATTERNS}?ownerId=${ownerId}`
      )
      if (error) {
        return null
      }
      patterns.value = data
      return data
    } catch {
      return null
    }
  }

  // Fetch import progress
  async function fetchImportProgress(pageId: string): Promise<ImportProgress | null> {
    try {
      const { data, error } = await api.get<ImportProgress>(
        `${API_ENDPOINTS.STYLE_LEARNING.IMPORT_PROGRESS}?pageId=${pageId}`
      )
      if (error) {
        return null
      }
      importProgress.value = data
      return data
    } catch {
      return null
    }
  }

  // Fetch import statistics
  async function fetchStatistics(pageId: string): Promise<ImportStatistics | null> {
    try {
      const { data, error } = await api.get<ImportStatistics>(
        `${API_ENDPOINTS.STYLE_LEARNING.IMPORT_STATISTICS}?pageId=${pageId}`
      )
      if (error) {
        return null
      }
      statistics.value = data
      return data
    } catch {
      return null
    }
  }

  // Start import
  async function startImport(request: ImportHistoryRequest): Promise<ImportResult | null> {
    importing.value = true
    try {
      const { data, error } = await api.post<ImportResult>(
        API_ENDPOINTS.STYLE_LEARNING.IMPORT,
        request
      )
      if (error) {
        toast.error(error.message)
        return null
      }
      toast.success(t('styleLearning.importStarted'))
      return data
    } finally {
      importing.value = false
    }
  }

  // Resume import
  async function resumeImport(request: ImportHistoryRequest): Promise<ImportResult | null> {
    importing.value = true
    try {
      const { data, error } = await api.post<ImportResult>(
        API_ENDPOINTS.STYLE_LEARNING.IMPORT_RESUME,
        request
      )
      if (error) {
        toast.error(error.message)
        return null
      }
      return data
    } finally {
      importing.value = false
    }
  }

  // Run style analysis
  async function analyzeStyle(ownerId = 'default'): Promise<StyleAnalysisResult | null> {
    analyzing.value = true
    try {
      const { data, error } = await api.post<StyleAnalysisResult>(
        `${API_ENDPOINTS.STYLE_LEARNING.ANALYZE}?ownerId=${ownerId}`
      )
      if (error) {
        toast.error(error.message)
        return null
      }
      if (data?.success) {
        toast.success(t('styleLearning.analysisComplete'))
        // Refresh profile and patterns
        await fetchProfile(ownerId)
        await fetchPatterns(ownerId)
      }
      return data
    } finally {
      analyzing.value = false
    }
  }

  // Update style weight
  async function updateWeight(weight: number, ownerId = 'default'): Promise<boolean> {
    try {
      const { error } = await api.put(
        `${API_ENDPOINTS.STYLE_LEARNING.WEIGHT}?ownerId=${ownerId}`,
        { weight }
      )
      if (error) {
        toast.error(error.message)
        return false
      }
      toast.success(t('common.saved'))
      if (profile.value) {
        profile.value.styleWeight = weight
      }
      return true
    } catch {
      return false
    }
  }

  // Toggle style active
  async function setActive(isActive: boolean, ownerId = 'default'): Promise<boolean> {
    try {
      const { error } = await api.put(
        `${API_ENDPOINTS.STYLE_LEARNING.ACTIVE}?ownerId=${ownerId}`,
        isActive
      )
      if (error) {
        toast.error(error.message)
        return false
      }
      toast.success(isActive ? t('styleLearning.enabled') : t('styleLearning.disabled'))
      if (profile.value) {
        profile.value.isActive = isActive
      }
      return true
    } catch {
      return false
    }
  }

  // Preview style
  async function previewStyle(customerMessage: string, ownerId = 'default'): Promise<StylePreviewResult | null> {
    try {
      const { data, error } = await api.post<StylePreviewResult>(
        `${API_ENDPOINTS.STYLE_LEARNING.PREVIEW}?ownerId=${ownerId}`,
        { customerMessage }
      )
      if (error) {
        toast.error(error.message)
        return null
      }
      return data
    } catch {
      return null
    }
  }

  // Fetch style prompt
  async function fetchStylePrompt(ownerId = 'default'): Promise<string | null> {
    try {
      const { data, error } = await api.get<{ hasStyle: boolean; prompt?: string; message?: string }>(
        `${API_ENDPOINTS.STYLE_LEARNING.PROMPT}?ownerId=${ownerId}`
      )
      if (error) {
        return null
      }
      stylePrompt.value = data?.prompt || null
      return data?.prompt || null
    } catch {
      return null
    }
  }

  // Add pattern
  async function addPattern(request: AddPatternRequest, ownerId = 'default'): Promise<boolean> {
    try {
      const { error } = await api.post(
        `${API_ENDPOINTS.STYLE_LEARNING.ADD_PATTERN}?ownerId=${ownerId}`,
        request
      )
      if (error) {
        toast.error(error.message)
        return false
      }
      toast.success(t('styleLearning.patternAdded'))
      await fetchPatterns(ownerId)
      return true
    } catch {
      return false
    }
  }

  // Remove pattern
  async function removePattern(patternType: string, pattern: string, ownerId = 'default'): Promise<boolean> {
    try {
      const { error } = await api.del(
        `${API_ENDPOINTS.STYLE_LEARNING.REMOVE_PATTERN(patternType, pattern)}?ownerId=${ownerId}`
      )
      if (error) {
        toast.error(error.message)
        return false
      }
      toast.success(t('styleLearning.patternRemoved'))
      await fetchPatterns(ownerId)
      return true
    } catch {
      return false
    }
  }

  return {
    // State
    profile,
    patterns,
    importProgress,
    statistics,
    stylePrompt,
    connectedAccounts,
    loading,
    importing,
    analyzing,

    // Methods
    fetchConnectedAccounts,
    importFromAccount,
    fetchProfile,
    fetchPatterns,
    fetchImportProgress,
    fetchStatistics,
    startImport,
    resumeImport,
    analyzeStyle,
    updateWeight,
    setActive,
    previewStyle,
    fetchStylePrompt,
    addPattern,
    removePattern
  }
}
