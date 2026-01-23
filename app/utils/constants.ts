// Application Constants

// Local Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'accessToken',
  ACCESS_TOKEN: 'accessToken',
  REFRESH_TOKEN: 'refreshToken',
  USER: 'user',
  THEME: 'theme',
  LOCALE: 'i18n_locale',
  SIDEBAR_COLLAPSED: 'sidebarCollapsed'
} as const

// API Endpoints
export const API_ENDPOINTS = {
  // Auth
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    ME: '/auth/me',
    REFRESH: '/auth/refresh',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password'
  },
  // Dashboard
  DASHBOARD: {
    STATS: '/admin/stats',
    DAILY_STATS: '/admin/stats/daily'
  },
  // Conversations
  CONVERSATIONS: {
    BASE: '/admin/conversations',
    LIST: '/admin/conversations',
    DETAIL: (id: string) => `/admin/conversations/${id}`,
    MESSAGES: (id: string) => `/admin/conversations/${id}/messages`,
    STATUS: (id: string) => `/admin/conversations/${id}/status`,
    REPLY: (id: string) => `/admin/conversations/${id}/reply`,
    SEND: (id: string) => `/admin/conversations/${id}/reply`,
    CLOSE: (id: string) => `/admin/conversations/${id}/close`,
    TODAY: '/admin/conversations/today'
  },
  // Orders
  ORDERS: {
    BASE: '/orders',
    LIST: '/orders',
    DETAIL: (id: string) => `/orders/${id}`,
    BY_NUMBER: (num: string) => `/orders/number/${num}`,
    STATUS: (id: string) => `/orders/${id}/status`,
    CANCEL: (id: string) => `/orders/${id}/cancel`,
    STATS: '/orders/stats',
    CALCULATE: '/orders/calculate'
  },
  // Products
  PRODUCTS: {
    BASE: '/products',
    LIST: '/products',
    DETAIL: (id: string) => `/products/id/${id}`,
    BY_CODE: (code: string) => `/products/${code}`,
    BY_CATEGORY: (catId: string) => `/products/category/${catId}`,
    SEARCH: '/products/search',
    LOW_STOCK: '/products/low-stock',
    TOP_SELLING: '/products/top-selling',
    STOCK: (id: string) => `/products/${id}/stock`,
    IMAGES: (id: string) => `/products/${id}/images`,
    SEED: '/products/seed'
  },
  // Categories
  CATEGORIES: {
    BASE: '/categories',
    LIST: '/categories',
    DETAIL: (id: string) => `/categories/${id}`,
    TREE: '/categories/tree'
  },
  // Customers
  CUSTOMERS: {
    BASE: '/customers',
    LIST: '/customers',
    DETAIL: (id: string) => `/customers/${id}`,
    ORDERS: (id: string) => `/customers/${id}/orders`,
    CONVERSATIONS: (id: string) => `/customers/${id}/conversations`,
    BLOCK: (id: string) => `/customers/${id}/block`,
    STATS: (id: string) => `/customers/${id}/stats`
  },
  // Shipping
  SHIPPING: {
    GOVERNORATES: '/shipping/governorates',
    GOVERNORATE: (id: string) => `/shipping/governorates/${id}`,
    CALCULATE: '/shipping/calculate'
  },
  // Settings
  SETTINGS: {
    STORE: '/settings',
    GET: '/settings',
    UPDATE: '/settings',
    KNOWLEDGE: '/admin/knowledge'
  },
  // Templates
  TEMPLATES: {
    LIST: '/templates',
    DETAIL: (key: string) => `/templates/${key}`,
    UPDATE: (key: string) => `/templates/${key}`,
    PREVIEW: (key: string) => `/templates/${key}/preview`,
    RENDER: (key: string) => `/templates/${key}/render`,
    RESET: (key: string) => `/templates/${key}/reset`
  },
  // Knowledge Base
  KNOWLEDGE: {
    LIST: '/admin/knowledge',
    DETAIL: (id: string) => `/admin/knowledge/${id}`
  },
  // Stats
  STATS: {
    DASHBOARD: '/admin/stats',
    PROVIDERS: '/admin/stats/providers',
    HEALTH: '/health/ready',
    CONVERSATIONS: '/admin/stats/conversations',
    ORDERS: '/admin/stats/orders',
    AI_USAGE: '/admin/stats/ai-usage'
  },
  // Health
  HEALTH: {
    BASIC: '/health',
    READY: '/health/ready',
    DETAILED: '/health/detailed',
    AI_STATUS: '/health/ai-status'
  },
  // Test
  TEST: {
    CHAT: '/test/chat',
    INTENT: '/test/intent',
    PRODUCTS: '/test/products',
    AI: '/test/ai',
    AI_STATUS: '/test/ai/status',
    BATCH: '/test/batch',
    SAMPLES: '/test/samples'
  }
} as const

// Order Status Colors
export const ORDER_STATUS_COLORS: Record<string, string> = {
  Pending: 'warning',
  Confirmed: 'primary',
  Processing: 'primary',
  Shipped: 'info',
  OutForDelivery: 'info',
  Delivered: 'success',
  Cancelled: 'danger',
  Returned: 'gray'
}

// Conversation Status Colors
export const CONVERSATION_STATUS_COLORS: Record<string, string> = {
  Active: 'success',
  PendingHandoff: 'warning',
  Resolved: 'gray',
  Closed: 'gray'
}

// Platform Colors
export const PLATFORM_COLORS: Record<string, string> = {
  WhatsApp: '#25D366',
  Messenger: '#0084FF',
  Instagram: '#E4405F'
}

// Platform Icons (for reference)
export const PLATFORM_ICONS: Record<string, string> = {
  WhatsApp: 'whatsapp',
  Messenger: 'messenger',
  Instagram: 'instagram'
}

// AI Provider Colors
export const AI_PROVIDER_COLORS: Record<string, string> = {
  Groq: '#F55036',
  Mistral: '#FF7000',
  Cloudflare: '#F38020',
  GeminiFree: '#4285F4',
  GitHubModels: '#24292E',
  GeminiPaid: '#0F9D58'
}

// Intent Labels (Arabic)
export const INTENT_LABELS_AR: Record<string, string> = {
  Greeting: 'تحية',
  PriceInquiry: 'استفسار سعر',
  Availability: 'استفسار توفر',
  WantToOrder: 'طلب شراء',
  Shipping: 'استفسار شحن',
  TrackOrder: 'تتبع طلب',
  ProvideInfo: 'تقديم معلومات',
  Complaint: 'شكوى',
  Return: 'إرجاع',
  HumanHandoff: 'طلب موظف',
  ThankYou: 'شكر',
  Goodbye: 'وداع',
  ProductInfo: 'معلومات منتج',
  Sizes: 'أحجام',
  Colors: 'ألوان',
  Discount: 'خصم',
  PaymentMethods: 'طرق دفع',
  Unknown: 'غير معروف'
}

// Pagination Defaults
export const PAGINATION_DEFAULTS = {
  PAGE: 1,
  PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [10, 25, 50, 100]
} as const

// Date Formats
export const DATE_FORMATS = {
  DATE: 'YYYY-MM-DD',
  TIME: 'HH:mm',
  DATETIME: 'YYYY-MM-DD HH:mm',
  DISPLAY_DATE: 'DD/MM/YYYY',
  DISPLAY_DATETIME: 'DD/MM/YYYY HH:mm'
} as const

// Currency
export const DEFAULT_CURRENCY = {
  CODE: 'IQD',
  SYMBOL: 'د.ع',
  POSITION: 'after' as const
}
