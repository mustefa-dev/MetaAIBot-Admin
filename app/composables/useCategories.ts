import type { Category, CategoryTree, CreateCategoryRequest, UpdateCategoryRequest } from '~/types/category'
import { API_ENDPOINTS } from '~/utils/constants'

export function useCategories() {
  const crud = useCrud<Category>({
    endpoint: API_ENDPOINTS.CATEGORIES.BASE
  })

  const api = useApi()
  const toast = useAppToast()
  const { t } = useI18n()

  // Tree structure for nested categories
  const categoryTree = ref<CategoryTree[]>([])

  async function fetchCategories() {
    return crud.fetchAll()
  }

  async function fetchCategoryTree() {
    const { data, error } = await api.get<CategoryTree[]>(API_ENDPOINTS.CATEGORIES.TREE)

    if (error) {
      toast.error(error.message)
      return []
    }

    categoryTree.value = data || []
    return categoryTree.value
  }

  async function fetchCategory(id: string) {
    return crud.fetchOne(id)
  }

  async function createCategory(data: CreateCategoryRequest): Promise<Category | null> {
    const result = await crud.create(data as any)

    if (result) {
      toast.created()
      // Refresh tree
      fetchCategoryTree()
    } else if (crud.error.value) {
      toast.error(crud.error.value)
    }

    return result
  }

  async function updateCategory(id: string, data: UpdateCategoryRequest): Promise<Category | null> {
    const result = await crud.update(id, data as any)

    if (result) {
      toast.updated()
      // Refresh tree
      fetchCategoryTree()
    } else if (crud.error.value) {
      toast.error(crud.error.value)
    }

    return result
  }

  async function deleteCategory(id: string): Promise<boolean> {
    const result = await crud.remove(id)

    if (result) {
      toast.deleted()
      // Refresh tree
      fetchCategoryTree()
    } else if (crud.error.value) {
      toast.error(crud.error.value)
    }

    return result
  }

  async function reorderCategories(orderedIds: string[]): Promise<boolean> {
    const { error } = await api.post(`${API_ENDPOINTS.CATEGORIES.BASE}/reorder`, { orderedIds })

    if (error) {
      toast.error(error.message)
      return false
    }

    toast.success(t('categories.reordered'))
    fetchCategoryTree()
    return true
  }

  // Helper to flatten category tree for select options
  function getFlatCategories(tree: CategoryTree[] = categoryTree.value, prefix = ''): Array<{ id: string; name: string; level: number }> {
    const result: Array<{ id: string; name: string; level: number }> = []

    tree.forEach(cat => {
      const level = prefix ? prefix.split(' > ').length : 0
      result.push({
        id: cat.id,
        name: prefix ? `${prefix} > ${cat.name}` : cat.name,
        level
      })

      if (cat.children?.length) {
        result.push(...getFlatCategories(cat.children, prefix ? `${prefix} > ${cat.name}` : cat.name))
      }
    })

    return result
  }

  return {
    // From CRUD
    categories: crud.items,
    category: crud.item,
    isLoading: crud.isLoading,
    isSubmitting: crud.isSubmitting,
    error: crud.error,

    // Category specific
    categoryTree,

    // Actions
    fetchCategories,
    fetchCategoryTree,
    fetchCategory,
    createCategory,
    updateCategory,
    deleteCategory,
    reorderCategories,
    getFlatCategories
  }
}
