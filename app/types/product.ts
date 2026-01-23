// Product Types - Matches backend entities

export type ProductStatus = 'Available' | 'OutOfStock' | 'Discontinued'

export interface Product {
  id: string
  code: string
  name: string
  nameArabic: string
  description?: string
  descriptionArabic?: string
  price: number
  oldPrice?: number
  currency: string
  categoryId?: string
  category?: string
  status: ProductStatus
  stockQuantity: number
  lowStockThreshold: number
  soldCount: number
  isActive: boolean
  sortOrder: number
  imageUrl?: string
  images?: ProductImage[]
  variants?: ProductVariant[]
  createdAt: string
  updatedAt: string
}

export interface ProductImage {
  id: string
  imageUrl: string
  altText?: string
  isPrimary: boolean
  sortOrder: number
}

export interface ProductVariant {
  id: string
  variantType: string
  value: string
  priceDifference: number
  stockQuantity: number
  isActive: boolean
}

export interface CreateProductRequest {
  code: string
  name: string
  nameArabic?: string
  description?: string
  descriptionArabic?: string
  price: number
  oldPrice?: number
  currency?: string
  categoryId?: string
  status?: ProductStatus
  isActive?: boolean
  stockQuantity?: number
  lowStockThreshold?: number
  sortOrder?: number
}

export interface UpdateProductRequest {
  name?: string
  nameArabic?: string
  description?: string
  descriptionArabic?: string
  price?: number
  oldPrice?: number
  currency?: string
  categoryId?: string
  status?: ProductStatus
  isActive?: boolean
  stockQuantity?: number
  lowStockThreshold?: number
  sortOrder?: number
}

export interface UpdateStockRequest {
  stockQuantity: number
}

export interface ProductFilter {
  categoryId?: string
  status?: ProductStatus
  isActive?: boolean
  lowStock?: boolean
  search?: string
  minPrice?: number
  maxPrice?: number
}

export interface ProductListItem {
  id: string
  code: string
  name: string
  nameArabic: string
  price: number
  oldPrice?: number
  category?: string
  status: ProductStatus
  stockQuantity: number
  isActive: boolean
  soldCount: number
  imageUrl?: string
}

export interface ProductStats {
  totalProducts: number
  activeProducts: number
  outOfStock: number
  lowStock: number
  totalValue: number
}
