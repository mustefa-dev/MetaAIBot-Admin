import type { ApiError, PaginatedResponse, PaginationParams } from '~/types/api'

interface RequestOptions extends RequestInit {
  params?: Record<string, any>
  skipAuth?: boolean
}

interface ApiResponse<T> {
  data: T | null
  error: ApiError | null
  status: number
}

export function useApi() {
  const config = useRuntimeConfig()
  const authStore = useAuthStore()
  const { t } = useI18n()

  const baseURL = config.public.apiBase as string

  const defaultHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }

  function buildUrl(endpoint: string, params?: Record<string, any>): string {
    // Remove leading slash from endpoint if baseURL ends with /api
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint
    const fullUrl = `${baseURL}/${cleanEndpoint}`
    const url = new URL(fullUrl)

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          url.searchParams.append(key, String(value))
        }
      })
    }

    return url.toString()
  }

  function getAuthHeaders(): Record<string, string> {
    if (authStore.token) {
      return { 'Authorization': `Bearer ${authStore.token}` }
    }
    return {}
  }

  async function request<T>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<ApiResponse<T>> {
    const { params, skipAuth = false, ...fetchOptions } = options

    const headers: Record<string, string> = {
      ...defaultHeaders,
      ...(skipAuth ? {} : getAuthHeaders()),
      ...(options.headers as Record<string, string> || {})
    }

    // Remove Content-Type for FormData
    if (options.body instanceof FormData) {
      delete headers['Content-Type']
    }

    const url = buildUrl(endpoint, params)

    try {
      const response = await fetch(url, {
        ...fetchOptions,
        headers
      })

      // Handle 401 Unauthorized
      if (response.status === 401 && !skipAuth) {
        authStore.logout()
        navigateTo('/login')
        return {
          data: null,
          error: { message: t('errors.sessionExpired'), statusCode: 401 },
          status: 401
        }
      }

      // Handle no content
      if (response.status === 204) {
        return { data: null, error: null, status: 204 }
      }

      const contentType = response.headers.get('content-type')
      let data: any = null

      if (contentType?.includes('application/json')) {
        data = await response.json()
      } else {
        data = await response.text()
      }

      if (!response.ok) {
        const error: ApiError = {
          message: data?.message || data?.title || t('errors.unknown'),
          statusCode: response.status,
          errors: data?.errors
        }
        return { data: null, error, status: response.status }
      }

      return { data, error: null, status: response.status }
    } catch (err) {
      console.error('API Request Error:', err)
      const error: ApiError = {
        message: t('errors.networkError'),
        statusCode: 0
      }
      return { data: null, error, status: 0 }
    }
  }

  async function get<T>(endpoint: string, params?: Record<string, any>, options?: RequestOptions): Promise<ApiResponse<T>> {
    return request<T>(endpoint, { ...options, method: 'GET', params })
  }

  async function post<T>(endpoint: string, body?: any, options?: RequestOptions): Promise<ApiResponse<T>> {
    return request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: body instanceof FormData ? body : JSON.stringify(body)
    })
  }

  async function put<T>(endpoint: string, body?: any, options?: RequestOptions): Promise<ApiResponse<T>> {
    return request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: body instanceof FormData ? body : JSON.stringify(body)
    })
  }

  async function patch<T>(endpoint: string, body?: any, options?: RequestOptions): Promise<ApiResponse<T>> {
    return request<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: body instanceof FormData ? body : JSON.stringify(body)
    })
  }

  async function del<T>(endpoint: string, options?: RequestOptions): Promise<ApiResponse<T>> {
    return request<T>(endpoint, { ...options, method: 'DELETE' })
  }

  // Paginated request helper
  async function getPaginated<T>(
    endpoint: string,
    pagination: PaginationParams,
    additionalParams?: Record<string, any>
  ): Promise<ApiResponse<PaginatedResponse<T>>> {
    const params = {
      page: pagination.page,
      pageSize: pagination.pageSize,
      sortBy: pagination.sortBy,
      sortDesc: pagination.sortDesc,
      search: pagination.search,
      ...additionalParams
    }
    return get<PaginatedResponse<T>>(endpoint, params)
  }

  return {
    get,
    post,
    put,
    patch,
    del,
    getPaginated,
    request,
    baseURL
  }
}
