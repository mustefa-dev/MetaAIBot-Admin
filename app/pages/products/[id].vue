<template>
  <div>
    <!-- Loading -->
    <div v-if="loading" class="flex items-center justify-center h-64">
      <UiSpinner size="lg" />
    </div>

    <!-- Not Found -->
    <div v-else-if="!product" class="flex flex-col items-center justify-center h-64">
      <svg class="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">
        {{ t('errors.notFound') }}
      </h2>
      <UiButton @click="router.back()">
        {{ t('common.goBack') }}
      </UiButton>
    </div>

    <!-- Product Content -->
    <template v-else>
      <!-- View Mode -->
      <template v-if="!isEditing">
        <PageHeader :title="product.name">
          <template #subtitle>
            <div class="flex items-center gap-3">
              <span class="font-mono text-gray-500">{{ product.code }}</span>
              <UiBadge
                :variant="product.isActive ? 'success' : 'gray'"
              >
                {{ product.isActive ? t('common.active') : t('common.inactive') }}
              </UiBadge>
              <StockBadge
                :quantity="product.stockQuantity"
                :threshold="product.lowStockThreshold"
              />
            </div>
          </template>
          <template #actions>
            <UiButton variant="outline" @click="isEditing = true">
              <svg class="w-4 h-4 me-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              {{ t('common.edit') }}
            </UiButton>
            <UiButton variant="danger" @click="showDeleteModal = true">
              <svg class="w-4 h-4 me-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              {{ t('common.delete') }}
            </UiButton>
          </template>
        </PageHeader>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <!-- Main Content -->
          <div class="lg:col-span-2 space-y-6">
            <!-- Images -->
            <UiCard :title="t('products.images')">
              <div v-if="product.images?.length" class="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div
                  v-for="(image, index) in product.images"
                  :key="image.id || index"
                  class="aspect-square rounded-lg overflow-hidden border-2"
                  :class="image.isPrimary ? 'border-primary-500' : 'border-gray-200 dark:border-gray-700'"
                >
                  <img
                    :src="image.imageUrl"
                    :alt="image.altText || product.name"
                    class="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div
                v-else-if="product.imageUrl"
                class="aspect-video max-w-md rounded-lg overflow-hidden"
              >
                <img
                  :src="product.imageUrl"
                  :alt="product.name"
                  class="w-full h-full object-cover"
                />
              </div>
              <div v-else class="text-center py-8 text-gray-500">
                {{ t('products.noImages') }}
              </div>
            </UiCard>

            <!-- Description -->
            <UiCard :title="t('products.description')">
              <div class="space-y-4">
                <div v-if="product.description">
                  <h4 class="text-sm font-medium text-gray-500 mb-1">English</h4>
                  <p class="text-gray-900 dark:text-white whitespace-pre-wrap">
                    {{ product.description }}
                  </p>
                </div>
                <div v-if="product.descriptionArabic">
                  <h4 class="text-sm font-medium text-gray-500 mb-1">Arabic</h4>
                  <p class="text-gray-900 dark:text-white whitespace-pre-wrap" dir="rtl">
                    {{ product.descriptionArabic }}
                  </p>
                </div>
                <div v-if="!product.description && !product.descriptionArabic" class="text-gray-500">
                  {{ t('products.noDescription') }}
                </div>
              </div>
            </UiCard>

            <!-- Variants -->
            <UiCard v-if="product.variants?.length" :title="t('products.variants')">
              <div class="overflow-x-auto">
                <table class="w-full">
                  <thead>
                    <tr class="text-left text-sm text-gray-500 border-b border-gray-200 dark:border-gray-700">
                      <th class="pb-3 font-medium">{{ t('products.variantType') }}</th>
                      <th class="pb-3 font-medium">{{ t('products.variantValue') }}</th>
                      <th class="pb-3 font-medium">{{ t('products.priceDiff') }}</th>
                      <th class="pb-3 font-medium">{{ t('products.stock') }}</th>
                      <th class="pb-3 font-medium">{{ t('common.status') }}</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-gray-100 dark:divide-gray-700">
                    <tr v-for="variant in product.variants" :key="variant.id">
                      <td class="py-3">{{ variant.variantType }}</td>
                      <td class="py-3">{{ variant.value }}</td>
                      <td class="py-3">
                        <span v-if="variant.priceDifference > 0" class="text-green-600">
                          +{{ format.currency(variant.priceDifference) }}
                        </span>
                        <span v-else-if="variant.priceDifference < 0" class="text-red-600">
                          {{ format.currency(variant.priceDifference) }}
                        </span>
                        <span v-else class="text-gray-400">-</span>
                      </td>
                      <td class="py-3">{{ variant.stockQuantity }}</td>
                      <td class="py-3">
                        <UiBadge :variant="variant.isActive ? 'success' : 'gray'" size="sm">
                          {{ variant.isActive ? t('common.active') : t('common.inactive') }}
                        </UiBadge>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </UiCard>
          </div>

          <!-- Sidebar -->
          <div class="space-y-6">
            <!-- Pricing -->
            <UiCard :title="t('products.pricing')">
              <div class="space-y-4">
                <div class="flex items-center justify-between">
                  <span class="text-gray-500">{{ t('products.price') }}</span>
                  <span class="text-2xl font-bold text-gray-900 dark:text-white">
                    {{ format.currency(product.price) }}
                  </span>
                </div>
                <div v-if="product.oldPrice" class="flex items-center justify-between">
                  <span class="text-gray-500">{{ t('products.oldPrice') }}</span>
                  <span class="text-lg text-gray-400 line-through">
                    {{ format.currency(product.oldPrice) }}
                  </span>
                </div>
                <div v-if="hasDiscount" class="pt-3 border-t border-gray-200 dark:border-gray-700">
                  <div class="flex items-center justify-between">
                    <span class="text-gray-500">{{ t('products.discount') }}</span>
                    <span class="text-lg font-bold text-green-600">
                      -{{ discountPercent }}%
                    </span>
                  </div>
                </div>
              </div>
            </UiCard>

            <!-- Inventory -->
            <UiCard :title="t('products.inventory')">
              <div class="space-y-4">
                <div class="flex items-center justify-between">
                  <span class="text-gray-500">{{ t('products.stock') }}</span>
                  <span class="font-medium text-gray-900 dark:text-white">
                    {{ product.stockQuantity }}
                  </span>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-gray-500">{{ t('products.lowStockThreshold') }}</span>
                  <span class="font-medium text-gray-900 dark:text-white">
                    {{ product.lowStockThreshold }}
                  </span>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-gray-500">{{ t('products.soldCount') }}</span>
                  <span class="font-medium text-gray-900 dark:text-white">
                    {{ product.soldCount }}
                  </span>
                </div>
                <div class="pt-3 border-t border-gray-200 dark:border-gray-700">
                  <UiButton variant="outline" block @click="showStockModal = true">
                    {{ t('products.updateStock') }}
                  </UiButton>
                </div>
              </div>
            </UiCard>

            <!-- Category -->
            <UiCard :title="t('products.category')">
              <div v-if="product.category" class="flex items-center gap-2">
                <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
                <span class="text-gray-900 dark:text-white">{{ product.category }}</span>
              </div>
              <div v-else class="text-gray-500">{{ t('products.noCategory') }}</div>
            </UiCard>

            <!-- Info -->
            <UiCard :title="t('common.details')">
              <div class="space-y-3 text-sm">
                <div class="flex items-center justify-between">
                  <span class="text-gray-500">{{ t('products.sortOrder') }}</span>
                  <span class="text-gray-900 dark:text-white">{{ product.sortOrder }}</span>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-gray-500">{{ t('time.today') }}</span>
                  <span class="text-gray-900 dark:text-white">
                    {{ format.date(product.createdAt) }}
                  </span>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-gray-500">{{ t('common.updated') }}</span>
                  <span class="text-gray-900 dark:text-white">
                    {{ format.date(product.updatedAt) }}
                  </span>
                </div>
              </div>
            </UiCard>
          </div>
        </div>
      </template>

      <!-- Edit Mode -->
      <template v-else>
        <PageHeader :title="t('products.editProduct')">
          <template #subtitle>
            <span class="font-mono text-gray-500">{{ product.code }}</span>
          </template>
        </PageHeader>

        <ProductForm
          :product="product"
          :categories="flatCategories"
          :submitting="submitting"
          @submit="handleUpdate"
          @cancel="isEditing = false"
          @upload-image="handleImageUpload"
          @remove-image="handleImageRemove"
        />
      </template>
    </template>

    <!-- Update Stock Modal -->
    <UiModal v-model="showStockModal" :title="t('products.updateStock')">
      <div class="space-y-4">
        <FormInput
          v-model.number="newStock"
          type="number"
          :label="t('products.stock')"
          :min="0"
        />
      </div>
      <template #footer>
        <div class="flex justify-end gap-3">
          <UiButton variant="ghost" @click="showStockModal = false">
            {{ t('common.cancel') }}
          </UiButton>
          <UiButton :loading="updatingStock" @click="updateStock">
            {{ t('common.save') }}
          </UiButton>
        </div>
      </template>
    </UiModal>

    <!-- Delete Confirmation Modal -->
    <UiModal v-model="showDeleteModal" :title="t('common.confirmDelete')">
      <p class="text-gray-600 dark:text-gray-400">
        {{ t('messages.confirmDeleteItem', { item: product?.name }) }}
      </p>
      <template #footer>
        <div class="flex justify-end gap-3">
          <UiButton variant="ghost" @click="showDeleteModal = false">
            {{ t('common.cancel') }}
          </UiButton>
          <UiButton variant="danger" :loading="deleting" @click="deleteProduct">
            {{ t('common.delete') }}
          </UiButton>
        </div>
      </template>
    </UiModal>
  </div>
</template>

<script setup lang="ts">
import type { Product, UpdateProductRequest } from '~/types/product'
import { API_ENDPOINTS } from '~/utils/constants'

definePageMeta({
  layout: 'dashboard',
  middleware: 'auth'
})

const route = useRoute()
const router = useRouter()
const { t } = useI18n()
const toast = useAppToast()
const format = useFormat()
const api = useApi()
const productsComposable = useProducts()
const categoriesComposable = useCategories()

const productId = computed(() => route.params.id as string)
const isEditing = ref(route.query.edit === 'true')

// State
const product = ref<Product | null>(null)
const loading = ref(true)
const submitting = ref(false)
const deleting = ref(false)
const updatingStock = ref(false)
const showDeleteModal = ref(false)
const showStockModal = ref(false)
const newStock = ref(0)

// Computed
const flatCategories = computed(() => {
  return categoriesComposable.getFlatCategories()
})

const hasDiscount = computed(() => {
  return product.value?.oldPrice && product.value.oldPrice > product.value.price
})

const discountPercent = computed(() => {
  if (!hasDiscount.value || !product.value) return 0
  return Math.round((1 - product.value.price / product.value.oldPrice!) * 100)
})

// Fetch product
async function fetchProduct() {
  loading.value = true
  try {
    const { data, error } = await api.get<Product>(`${API_ENDPOINTS.PRODUCTS.BASE}/${productId.value}`)

    if (error) {
      product.value = null
      return
    }

    product.value = data || null
    newStock.value = product.value?.stockQuantity || 0
  } catch {
    product.value = null
  } finally {
    loading.value = false
  }
}

// Update product
async function handleUpdate(data: UpdateProductRequest) {
  if (!product.value) return

  submitting.value = true
  try {
    const result = await productsComposable.updateProduct(product.value.id, data)
    if (result) {
      product.value = result
      isEditing.value = false
      toast.success(t('messages.updated'))
    }
  } finally {
    submitting.value = false
  }
}

// Update stock
async function updateStock() {
  if (!product.value) return

  updatingStock.value = true
  try {
    const success = await productsComposable.updateStock(product.value.id, newStock.value)
    if (success) {
      product.value.stockQuantity = newStock.value
      showStockModal.value = false
    }
  } finally {
    updatingStock.value = false
  }
}

// Delete product
async function deleteProduct() {
  if (!product.value) return

  deleting.value = true
  try {
    const success = await productsComposable.deleteProduct(product.value.id)
    if (success) {
      toast.success(t('messages.deleted'))
      router.push('/products')
    }
  } finally {
    deleting.value = false
  }
}

// Image handlers
async function handleImageUpload(file: File) {
  if (!product.value) return
  const url = await productsComposable.uploadImage(product.value.id, file)
  if (url) {
    fetchProduct() // Refresh to get updated images
  }
}

async function handleImageRemove(imageId: string) {
  if (!product.value) return
  const success = await productsComposable.deleteImage(product.value.id, imageId)
  if (success) {
    fetchProduct() // Refresh to get updated images
  }
}

// Initial fetch
onMounted(() => {
  fetchProduct()
  categoriesComposable.fetchCategoryTree()
})
</script>
