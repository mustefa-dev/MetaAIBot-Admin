// Category Types - Matches backend entities

export interface Category {
  id: string
  name: string
  nameArabic: string
  parentId?: string
  parent?: CategoryParent
  imageUrl?: string
  sortOrder: number
  isActive: boolean
  productCount?: number
  children?: Category[]
  createdAt?: string
  updatedAt?: string
}

export interface CategoryParent {
  id: string
  name: string
  nameArabic: string
}

export interface CategoryListItem {
  id: string
  name: string
  nameArabic: string
  parentId?: string
  parentName?: string
  imageUrl?: string
  sortOrder: number
  isActive: boolean
  productCount: number
}

export interface CreateCategoryRequest {
  name: string
  nameArabic?: string
  parentId?: string
  imageUrl?: string
  sortOrder?: number
  isActive?: boolean
}

export interface UpdateCategoryRequest {
  name?: string
  nameArabic?: string
  parentId?: string
  imageUrl?: string
  sortOrder?: number
  isActive?: boolean
}

export interface CategoryFilter {
  parentId?: string
  isActive?: boolean
  search?: string
}

export interface CategoryTree {
  id: string
  name: string
  nameArabic: string
  children: CategoryTree[]
  productCount: number
}
