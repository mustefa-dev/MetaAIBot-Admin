<template>
  <div>
    <PageHeader :title="t('products.addProduct')">
      <template #subtitle>
        {{ t('products.addProductSubtitle') }}
      </template>
    </PageHeader>

    <ProductForm
      :categories="flatCategories"
      :submitting="submitting"
      @submit="handleCreate"
      @cancel="router.back()"
      @upload-image="handleImageUpload"
    />
  </div>
</template>

<script setup lang="ts">
import type { CreateProductRequest, Product } from '~/types/product'

definePageMeta({
  layout: 'dashboard',
  middleware: 'auth'
})

const router = useRouter()
const { t } = useI18n()
const toast = useAppToast()
const productsComposable = useProducts()
const categoriesComposable = useCategories()

// State
const submitting = ref(false)
const createdProduct = ref<Product | null>(null)
const pendingImages = ref<File[]>([])

// Computed
const flatCategories = computed(() => {
  return categoriesComposable.getFlatCategories()
})

// Create product
async function handleCreate(data: CreateProductRequest) {
  submitting.value = true
  try {
    const result = await productsComposable.createProduct(data)
    if (result) {
      createdProduct.value = result

      // Upload any pending images
      if (pendingImages.value.length > 0) {
        for (const file of pendingImages.value) {
          await productsComposable.uploadImage(result.id, file)
        }
      }

      toast.success(t('messages.created'))
      router.push(`/products/${result.id}`)
    }
  } finally {
    submitting.value = false
  }
}

// Handle image upload before product is created
function handleImageUpload(file: File) {
  // Store for later upload after product creation
  pendingImages.value.push(file)
  toast.info(t('products.imageWillUpload'))
}

// Initial fetch
onMounted(() => {
  categoriesComposable.fetchCategoryTree()
})
</script>
