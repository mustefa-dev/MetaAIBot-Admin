// API Response Types

export interface ApiResponse<T> {
  success: boolean
  data?: T
  message?: string
  error?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  meta: PaginationMeta
}

export interface PaginationMeta {
  page: number
  pageSize: number
  totalCount: number
  totalPages: number
}

export interface PaginationParams {
  page?: number
  pageSize?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
  search?: string
}

export interface ApiError {
  message: string
  status: number
  errors?: Record<string, string[]>
}

// Common filter types
export interface DateRangeFilter {
  startDate?: string
  endDate?: string
}

export interface StatusFilter<T> {
  status?: T
}
