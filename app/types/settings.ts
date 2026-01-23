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
