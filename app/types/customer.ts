// Customer Types - Matches backend entities

import type { MessagePlatform } from './conversation'

export interface Customer {
  id: string
  platformId: string
  platform: MessagePlatform
  name?: string
  phone?: string
  email?: string
  address?: string
  governorate?: string
  city?: string
  notes?: string
  orderCount: number
  totalSpent: number
  averageOrderValue: number
  lastOrderAt?: string
  lastOrderDate?: string // Alias for lastOrderAt
  lastConversationAt?: string
  isBlocked: boolean
  blockReason?: string
  tags?: string[]
  createdAt: string
  updatedAt: string
}

export interface CustomerListItem {
  id: string
  platformId: string
  platform: MessagePlatform
  name?: string
  phone?: string
  orderCount: number
  totalSpent: number
  lastOrderAt?: string
  isBlocked: boolean
  createdAt: string
}

export interface UpdateCustomerRequest {
  name?: string
  phone?: string
  email?: string
  address?: string
  governorate?: string
  city?: string
  notes?: string
  tags?: string[]
}

export interface BlockCustomerRequest {
  isBlocked: boolean
  blockReason?: string
}

export interface CustomerFilter {
  platform?: MessagePlatform
  isBlocked?: boolean
  hasOrders?: boolean
  search?: string
  minOrderCount?: number
  maxOrderCount?: number
  minTotalSpent?: number
  maxTotalSpent?: number
  startDate?: string
  endDate?: string
}

export interface CustomerStats {
  totalCustomers: number
  newCustomersToday: number
  newCustomersThisWeek: number
  newCustomersThisMonth: number
  activeCustomers: number
  blockedCustomers: number
  customersByPlatform: {
    whatsApp: number
    messenger: number
    instagram: number
  }
  averageOrderValue: number
  averageOrdersPerCustomer: number
}

export interface CustomerOrderSummary {
  totalOrders: number
  totalSpent: number
  averageOrderValue: number
  lastOrder?: {
    id: string
    orderNumber: string
    total: number
    status: string
    createdAt: string
  }
}

export interface CustomerConversationSummary {
  totalConversations: number
  lastConversation?: {
    id: string
    platform: MessagePlatform
    lastMessageAt: string
    status: string
  }
}
