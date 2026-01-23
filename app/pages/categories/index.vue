<template>
  <div>
    <PageHeader :title="t('categories.title')">
      <template #actions>
        <UiButton variant="primary" @click="showCreateModal = true">
          <svg class="w-4 h-4 me-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          {{ t('categories.addCategory') }}
        </UiButton>
      </template>
    </PageHeader>

    <!-- Categories List -->
    <UiCard>
      <div v-if="isLoading" class="p-8 text-center">
        <UiSpinner class="mx-auto" />
      </div>

      <div v-else-if="categories.length === 0" class="p-8 text-center text-gray-500">
        {{ t('categories.noCategories') }}
      </div>

      <div v-else class="divide-y divide-gray-200 dark:divide-gray-700">
        <div
          v-for="category in categories"
          :key="category.id"
          class="p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800/50"
        >
          <div class="flex items-center gap-3">
            <div
              class="w-10 h-10 rounded-lg flex items-center justify-center text-white"
              :style="{ backgroundColor: category.color || '#3B82F6' }"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
            </div>
            <div>
              <h3 class="font-medium text-gray-900 dark:text-white">
                {{ locale === 'ar' ? category.nameArabic || category.name : category.name }}
              </h3>
              <p class="text-sm text-gray-500">
                {{ category.productCount || 0 }} {{ t('products.title') }}
              </p>
            </div>
          </div>

          <div class="flex items-center gap-2">
            <UiBadge :variant="category.isActive ? 'success' : 'gray'" size="sm">
              {{ category.isActive ? t('common.active') : t('common.inactive') }}
            </UiBadge>
            <UiButton variant="ghost" size="sm" @click="editCategory(category)">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </UiButton>
            <UiButton variant="ghost" size="sm" @click="confirmDelete(category)">
              <svg class="w-4 h-4 text-danger-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </UiButton>
          </div>
        </div>
      </div>
    </UiCard>

    <!-- Create/Edit Modal -->
    <UiModal v-model="showCreateModal" :title="editingCategory ? t('categories.editCategory') : t('categories.addCategory')">
      <form @submit.prevent="saveCategory" class="space-y-4">
        <FormInput
          v-model="form.name"
          :label="t('categories.name')"
          required
        />
        <FormInput
          v-model="form.nameArabic"
          :label="t('categories.nameArabic')"
          dir="rtl"
        />
        <FormInput
          v-model="form.description"
          :label="t('common.description')"
        />
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {{ t('categories.color') }}
          </label>
          <input
            v-model="form.color"
            type="color"
            class="w-full h-10 rounded-lg cursor-pointer"
          />
        </div>
        <div class="flex items-center gap-2">
          <input
            v-model="form.isActive"
            type="checkbox"
            id="isActive"
            class="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
          />
          <label for="isActive" class="text-sm text-gray-700 dark:text-gray-300">
            {{ t('common.active') }}
          </label>
        </div>
      </form>
      <template #footer>
        <UiButton variant="outline" @click="showCreateModal = false">
          {{ t('common.cancel') }}
        </UiButton>
        <UiButton variant="primary" :loading="isSaving" @click="saveCategory">
          {{ t('common.save') }}
        </UiButton>
      </template>
    </UiModal>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'dashboard',
  middleware: 'auth'
})

const { t, locale } = useI18n()
const api = useApi()
const toast = useAppToast()

interface Category {
  id: string
  name: string
  nameArabic?: string
  description?: string
  color?: string
  isActive: boolean
  productCount?: number
}

const categories = ref<Category[]>([])
const isLoading = ref(false)
const showCreateModal = ref(false)
const editingCategory = ref<Category | null>(null)
const isSaving = ref(false)

const form = reactive({
  name: '',
  nameArabic: '',
  description: '',
  color: '#3B82F6',
  isActive: true
})

async function fetchCategories() {
  isLoading.value = true
  const { data, error } = await api.get<Category[]>('/categories')
  if (!error && data) {
    categories.value = Array.isArray(data) ? data : []
  }
  isLoading.value = false
}

function editCategory(category: Category) {
  editingCategory.value = category
  form.name = category.name
  form.nameArabic = category.nameArabic || ''
  form.description = category.description || ''
  form.color = category.color || '#3B82F6'
  form.isActive = category.isActive
  showCreateModal.value = true
}

function resetForm() {
  editingCategory.value = null
  form.name = ''
  form.nameArabic = ''
  form.description = ''
  form.color = '#3B82F6'
  form.isActive = true
}

async function saveCategory() {
  if (!form.name) {
    toast.error(t('validation.required'))
    return
  }

  isSaving.value = true

  if (editingCategory.value) {
    const { error } = await api.put(`/categories/${editingCategory.value.id}`, form)
    if (!error) {
      toast.success(t('common.saved'))
      showCreateModal.value = false
      resetForm()
      fetchCategories()
    } else {
      toast.error(error.message)
    }
  } else {
    const { error } = await api.post('/categories', form)
    if (!error) {
      toast.success(t('common.saved'))
      showCreateModal.value = false
      resetForm()
      fetchCategories()
    } else {
      toast.error(error.message)
    }
  }

  isSaving.value = false
}

async function confirmDelete(category: Category) {
  if (confirm(t('categories.confirmDelete'))) {
    const { error } = await api.del(`/categories/${category.id}`)
    if (!error) {
      toast.success(t('common.deleted'))
      fetchCategories()
    } else {
      toast.error(error.message)
    }
  }
}

watch(showCreateModal, (val) => {
  if (!val) {
    resetForm()
  }
})

onMounted(() => {
  fetchCategories()
})
</script>
