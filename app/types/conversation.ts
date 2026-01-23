// Conversation Types - Matches backend entities

export type MessagePlatform = 'WhatsApp' | 'Messenger' | 'Instagram'

export type ConversationStatus = 'Active' | 'PendingHandoff' | 'Resolved' | 'Closed'

export type MessageDirection = 'Incoming' | 'Outgoing'

export type CustomerIntent =
  | 'Greeting'
  | 'PriceInquiry'
  | 'Availability'
  | 'WantToOrder'
  | 'Shipping'
  | 'TrackOrder'
  | 'ProvideInfo'
  | 'Complaint'
  | 'Return'
  | 'HumanHandoff'
  | 'ThankYou'
  | 'Goodbye'
  | 'ProductInfo'
  | 'Sizes'
  | 'Colors'
  | 'Discount'
  | 'PaymentMethods'
  | 'Unknown'

export type AIProvider = 'Groq' | 'Mistral' | 'Cloudflare' | 'GeminiFree' | 'GitHubModels' | 'GeminiPaid'

export interface Conversation {
  id: string
  platformId: string
  platform: MessagePlatform
  customerName?: string
  status: ConversationStatus
  lastMessageAt: string
  lastMessage?: string
  unreadCount: number
  messageCount: number
  customerId?: string
  customer?: ConversationCustomer
  assignedTo?: string
  handoffReason?: string
  detectedIntent?: CustomerIntent
  resolvedAt?: string
  createdAt: string
  updatedAt: string
}

export interface ConversationCustomer {
  id: string
  name?: string
  phone?: string
  platform: MessagePlatform
  orderCount: number
  isBlocked: boolean
}

export type MessageStatus = 'Sending' | 'Sent' | 'Delivered' | 'Read' | 'Failed'

export interface Message {
  id: string
  conversationId: string
  content: string
  direction: MessageDirection
  timestamp: string
  sentAt: string // Alias for timestamp
  isRead: boolean
  isAIResponse?: boolean
  status?: MessageStatus
  mediaUrl?: string
  mediaType?: string
  detectedIntent?: CustomerIntent
  aiProvider?: AIProvider
  metadata?: MessageMetadata
}

export interface MessageMetadata {
  productCodes?: string[]
  orderNumber?: string
  extractedPhone?: string
  extractedAddress?: string
}

export interface ConversationFilter {
  platform?: MessagePlatform
  status?: ConversationStatus
  customerId?: string
  search?: string
  startDate?: string
  endDate?: string
  hasUnread?: boolean
}

export interface SendReplyRequest {
  message: string
  markAsResolved?: boolean
}

export interface UpdateConversationStatusRequest {
  status: ConversationStatus
  handoffReason?: string
}

// Intent detection test
export interface IntentDetectionRequest {
  message: string
}

export interface IntentDetectionResponse {
  primaryIntent: CustomerIntent
  secondaryIntent?: CustomerIntent
  confidence: number
  detectedLanguage: string
  extractedProductCodes: string[]
  requiresHumanHandoff: boolean
  handoffReason?: string
  entities: ExtractedEntities
}

export interface ExtractedEntities {
  productCodes: string[]
  phoneNumber?: string
  governorate?: string
  orderNumber?: string
  quantity?: number
  size?: string
  color?: string
  address?: string
}

// Chat simulation for testing
export interface SimulateChatRequest {
  message: string
  customerId?: string
  customerName?: string
  platform?: MessagePlatform
}

export interface SimulateChatResponse {
  success: boolean
  response: string
  intent: CustomerIntent
  requiresHumanHandoff: boolean
  handoffReason?: string
  conversationId: string
  customerId: string
  createdOrder?: {
    orderNumber: string
    total: number
  }
  usedProvider?: AIProvider
  error?: string
}
