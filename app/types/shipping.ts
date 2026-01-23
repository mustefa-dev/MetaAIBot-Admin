// Shipping/Governorate Types - Matches backend entities

export interface Governorate {
  id: string
  name: string
  nameArabic: string
  shippingCost: number
  estimatedDays: number
  isActive: boolean
  sortOrder: number
  aliases?: string[]
}

export interface GovernorateListItem {
  id: string
  name: string
  nameArabic: string
  shippingCost: number
  estimatedDays: number
  isActive: boolean
  orderCount?: number
}

export interface UpdateGovernorateRequest {
  name?: string
  nameArabic?: string
  shippingCost?: number
  estimatedDays?: number
  isActive?: boolean
  sortOrder?: number
  aliases?: string[]
}

export interface ShippingCalculation {
  governorateId: string
  governorateName: string
  shippingCost: number
  estimatedDays: number
  estimatedDelivery: string
}

export interface ShippingSettings {
  defaultShippingCost: number
  freeShippingThreshold?: number
  freeShippingEnabled: boolean
}
