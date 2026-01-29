// Settings Types - Matches backend entities

export interface StoreSettings {
  // Store Info
  storeName: string
  storeNameArabic: string
  storeDescription?: string
  storeDescriptionArabic?: string
  storePhone?: string
  storeEmail?: string
  storeAddress?: string
  storeAddressArabic?: string
  storeLogo?: string

  // Business Hours
  workingHoursStart?: string
  workingHoursEnd?: string
  workingDays?: string[]
  timezone?: string

  // Currency & Pricing
  currency: string
  currencySymbol: string
  currencyPosition: 'before' | 'after'
  lowStockThreshold: number

  // Shipping
  defaultShippingCost: number
  freeShippingThreshold?: number
  freeShippingEnabled: boolean

  // Bot Settings
  botEnabled: boolean
  autoReplyEnabled: boolean
  humanHandoffEnabled: boolean
  maxAutoRepliesBeforeHandoff: number

  // Notifications
  notifyOnNewOrder: boolean
  notifyOnHandoff: boolean
  notifyOnLowStock: boolean
  notificationEmail?: string
  notificationPhone?: string
}

export interface UpdateStoreSettingsRequest extends Partial<StoreSettings> {}

// Message Templates
export interface MessageTemplate {
  id: string
  key: string
  name: string
  nameArabic: string
  content: string
  contentArabic: string
  variables: string[]
  category: TemplateCategory
  isActive: boolean
  updatedAt: string
}

export type TemplateCategory =
  | 'greeting'
  | 'order'
  | 'shipping'
  | 'payment'
  | 'support'
  | 'general'

export interface UpdateMessageTemplateRequest {
  content?: string
  contentArabic?: string
  isActive?: boolean
}

// Knowledge Base
export interface KnowledgeEntry {
  id: string
  category: string
  question: string
  questionArabic?: string
  answer: string
  answerArabic?: string
  keywords: string[]
  isActive: boolean
  priority: number
  usageCount: number
  createdAt: string
  updatedAt: string
}

export interface CreateKnowledgeEntryRequest {
  category: string
  question: string
  questionArabic?: string
  answer: string
  answerArabic?: string
  keywords?: string[]
  isActive?: boolean
  priority?: number
}

export interface UpdateKnowledgeEntryRequest {
  category?: string
  question?: string
  questionArabic?: string
  answer?: string
  answerArabic?: string
  keywords?: string[]
  isActive?: boolean
  priority?: number
}

export interface KnowledgeFilter {
  category?: string
  isActive?: boolean
  search?: string
}

// AI Provider Settings
export interface AIProviderConfig {
  provider: string
  isEnabled: boolean
  apiKey?: string
  priority: number
  dailyLimit: number
  model?: string
}

export interface UpdateAIProviderConfigRequest {
  isEnabled?: boolean
  apiKey?: string
  priority?: number
  dailyLimit?: number
  model?: string
}

// Style Learning Types
export interface StyleProfile {
  ownerId: string
  isActive: boolean
  styleWeight: number
  totalMessagesAnalyzed: number
  lastAnalyzedAt: string | null
  formality: string
  warmth: string
  directness: string
  responseLength: string
  emojiFrequency: number
}

export interface StylePatterns {
  greetings: PatternItem[]
  closings: PatternItem[]
  favoritePhrases: PatternItem[]
  endearments: PatternItem[]
  emojis: PatternItem[]
  tone: ToneProfile
  exampleResponses: string[]
}

export interface PatternItem {
  pattern: string
  count?: number
  frequency?: number
}

export interface ToneProfile {
  formality: string
  warmth: string
  directness: string
  responseLength: string
  emojiFrequency: number
}

export interface ImportProgress {
  pageId: string
  status: 'pending' | 'in_progress' | 'completed' | 'failed'
  totalConversations: number
  processedConversations: number
  ownerMessagesImported: number
  customerMessagesImported: number
  progressPercentage: number
  startedAt: string
  completedAt: string | null
  errorMessage: string | null
}

export interface ImportStatistics {
  totalMessages: number
  ownerMessages: number
  customerMessages: number
  analyzedMessages: number
  unanalyzedMessages: number
  oldestMessageDate: string | null
  newestMessageDate: string | null
  lastImportDate: string | null
}

export interface ImportHistoryRequest {
  pageId: string
  accessToken: string
  since?: string
}

export interface ImportResult {
  success: boolean
  errorMessage: string | null
  conversationsProcessed: number
  ownerMessagesImported: number
  customerMessagesImported: number
  totalMessagesImported: number
  duration: string
  hasMore: boolean
}

export interface StyleAnalysisResult {
  success: boolean
  errorMessage: string | null
  messagesAnalyzed: number
  patternsExtracted: number
  duration: string
  patterns: StylePatterns | null
}

export interface StylePreviewResult {
  customerMessage: string
  generatedResponse: string
  stylePromptUsed: string
  styleApplied: boolean
}

export interface AddPatternRequest {
  patternType: 'greeting' | 'closing' | 'phrase' | 'endearment' | 'emoji'
  pattern: string
}

export interface ConnectedAccountForImport {
  id: string
  accountName: string
  platform: string
  pageId: string
  profilePictureUrl: string | null
  connectedAt: string
  hasToken: boolean
}
