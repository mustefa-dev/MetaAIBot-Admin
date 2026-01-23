<template>
  <form @submit.prevent="handleSubmit">
    <div class="space-y-6">
      <!-- Basic Info -->
      <UiCard :title="t('products.basicInfo')">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- Code -->
          <FormInput
            v-model="form.code"
            :label="t('products.code')"
            :placeholder="t('products.codePlaceholder')"
            :error="errors.code"
            :disabled="isEdit"
            required
          />

          <!-- Name -->
          <FormInput
            v-model="form.name"
            :label="t('products.name')"
            :placeholder="t('products.namePlaceholder')"
            :error="errors.name"
            required
          />

          <!-- Name Arabic -->
          <FormInput
            v-model="form.nameArabic"
            :label="t('products.nameArabic')"
            :placeholder="t('products.nameArabicPlaceholder')"
            dir="rtl"
          />

          <!-- Category -->
          <FormSelect
            v-model="form.categoryId"
            :label="t('products.category')"
            :options="categoryOptions"
            :placeholder="t('common.selectOption')"
          />

          <!-- Description -->
          <div class="md:col-span-2">
            <FormTextarea
              v-model="form.description"
              :label="t('products.description')"
              :placeholder="t('products.descriptionPlaceholder')"
              :rows="3"
            />
          </div>

          <!-- Description Arabic -->
          <div class="md:col-span-2">
            <FormTextarea
              v-model="form.descriptionArabic"
              :label="t('products.descriptionArabic')"
              :placeholder="t('products.descriptionArabicPlaceholder')"
              :rows="3"
              dir="rtl"
            />
          </div>
        </div>
      </UiCard>

      <!-- Pricing -->
      <UiCard :title="t('products.pricing')">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <!-- Price -->
          <FormInput
            v-model.number="form.price"
            type="number"
            :label="t('products.price')"
            :placeholder="t('products.pricePlaceholder')"
            :error="errors.price"
            required
          >
            <template #suffix>
              <span class="text-gray-400">{{ currency }}</span>
            </template>
          </FormInput>

          <!-- Old Price -->
          <FormInput
            v-model.number="form.oldPrice"
            type="number"
            :label="t('products.oldPrice')"
            :placeholder="t('products.oldPricePlaceholder')"
          >
            <template #suffix>
              <span class="text-gray-400">{{ currency }}</span>
            </template>
          </FormInput>

          <!-- Discount Preview -->
          <div v-if="hasDiscount" class="flex items-end">
            <div class="w-full p-3 bg-green-50 dark:bg-green-900/20 rounded-lg text-center">
              <div class="text-sm text-green-600 dark:text-green-400">{{ t('products.discount') }}</div>
              <div class="text-2xl font-bold text-green-600 dark:text-green-400">
                -{{ discountPercent }}%
              </div>
            </div>
          </div>
        </div>
      </UiCard>

      <!-- Inventory -->
      <UiCard :title="t('products.inventory')">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <!-- Stock Quantity -->
          <FormInput
            v-model.number="form.stockQuantity"
            type="number"
            :label="t('products.stock')"
            :placeholder="t('products.stockPlaceholder')"
            :min="0"
          />

          <!-- Low Stock Threshold -->
          <FormInput
            v-model.number="form.lowStockThreshold"
            type="number"
            :label="t('products.lowStockThreshold')"
            :placeholder="t('products.lowStockThresholdPlaceholder')"
            :min="0"
          />

          <!-- Status -->
          <FormSelect
            v-model="form.status"
            :label="t('common.status')"
            :options="statusOptions"
          />
        </div>

        <div class="mt-4 flex items-center gap-4">
          <FormSwitch
            v-model="form.isActive"
            :label="t('products.isActive')"
          />
        </div>
      </UiCard>

      <!-- Images -->
      <UiCard :title="t('products.images')">
        <ProductImages
          :images="form.images || []"
          :uploading="uploadingImages"
          @update:images="form.images = $event"
          @upload="handleImageUpload"
          @remove="handleImageRemove"
          @set-primary="handleSetPrimaryImage"
        />
      </UiCard>

      <!-- Variants -->
      <UiCard :title="t('products.variants')">
        <ProductVariants
          :variants="form.variants || []"
          @update:variants="form.variants = $event"
        />
      </UiCard>

      <!-- Sort Order -->
      <UiCard :title="t('products.displaySettings')">
        <FormInput
          v-model.number="form.sortOrder"
          type="number"
          :label="t('products.sortOrder')"
          :placeholder="t('products.sortOrderPlaceholder')"
          class="max-w-xs"
        />
      </UiCard>
    </div>

    <!-- Actions -->
    <div class="flex items-center justify-end gap-3 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
      <UiButton variant="ghost" type="button" @click="$emit('cancel')">
        {{ t('common.cancel') }}
      </UiButton>
      <UiButton type="submit" :loading="submitting">
        {{ isEdit ? t('common.save') : t('common.create') }}
      </UiButton>
    </div>
  </form>
</template>

<script setup lang="ts">
import type { Product, CreateProductRequest, UpdateProductRequest, ProductImage, ProductVariant } from '~/types/product'

interface Props {
  product?: Product | null
  categories?: Array<{ id: string; name: string }>
  submitting?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  product: null,
  categories: () => [],
  submitting: false
})

const emit = defineEmits<{
  submit: [data: CreateProductRequest | UpdateProductRequest]
  cancel: []
  uploadImage: [file: File]
  removeImage: [imageId: string]
}>()

const { t } = useI18n()

const isEdit = computed(() => !!props.product?.id)
const currency = 'IQD'
const uploadingImages = ref(false)

interface ProductForm {
  code: string
  name: string
  nameArabic: string
  description: string
  descriptionArabic: string
  price: number | undefined
  oldPrice: number | undefined
  categoryId: string
  status: string
  stockQuantity: number
  lowStockThreshold: number
  isActive: boolean
  sortOrder: number
  images: ProductImage[]
  variants: ProductVariant[]
}

const form = reactive<ProductForm>({
  code: '',
  name: '',
  nameArabic: '',
  description: '',
  descriptionArabic: '',
  price: undefined,
  oldPrice: undefined,
  categoryId: '',
  status: 'Available',
  stockQuantity: 0,
  lowStockThreshold: 10,
  isActive: true,
  sortOrder: 0,
  images: [],
  variants: []
})

const errors = reactive({
  code: '',
  name: '',
  price: ''
})

// Initialize form with product data
watch(() => props.product, (product) => {
  if (product) {
    form.code = product.code || ''
    form.name = product.name || ''
    form.nameArabic = product.nameArabic || ''
    form.description = product.description || ''
    form.descriptionArabic = product.descriptionArabic || ''
    form.price = product.price
    form.oldPrice = product.oldPrice
    form.categoryId = product.categoryId || ''
    form.status = product.status || 'Available'
    form.stockQuantity = product.stockQuantity || 0
    form.lowStockThreshold = product.lowStockThreshold || 10
    form.isActive = product.isActive ?? true
    form.sortOrder = product.sortOrder || 0
    form.images = product.images || []
    form.variants = product.variants || []
  }
}, { immediate: true })

const categoryOptions = computed(() => [
  { value: '', label: t('common.selectOption') },
  ...props.categories.map(cat => ({
    value: cat.id,
    label: cat.name
  }))
])

const statusOptions = computed(() => [
  { value: 'Available', label: t('products.statuses.available') },
  { value: 'OutOfStock', label: t('products.statuses.outOfStock') },
  { value: 'Discontinued', label: t('products.statuses.discontinued') }
])

const hasDiscount = computed(() => {
  return form.oldPrice && form.price && form.oldPrice > form.price
})

const discountPercent = computed(() => {
  if (!hasDiscount.value) return 0
  return Math.round((1 - form.price! / form.oldPrice!) * 100)
})

function validate(): boolean {
  let valid = true
  errors.code = ''
  errors.name = ''
  errors.price = ''

  if (!form.code.trim()) {
    errors.code = t('validation.required')
    valid = false
  }

  if (!form.name.trim()) {
    errors.name = t('validation.required')
    valid = false
  }

  if (!form.price || form.price <= 0) {
    errors.price = t('validation.required')
    valid = false
  }

  return valid
}

function handleSubmit() {
  if (!validate()) return

  const data: CreateProductRequest | UpdateProductRequest = {
    code: form.code,
    name: form.name,
    nameArabic: form.nameArabic || undefined,
    description: form.description || undefined,
    descriptionArabic: form.descriptionArabic || undefined,
    price: form.price!,
    oldPrice: form.oldPrice || undefined,
    categoryId: form.categoryId || undefined,
    status: form.status as any,
    stockQuantity: form.stockQuantity,
    lowStockThreshold: form.lowStockThreshold,
    isActive: form.isActive,
    sortOrder: form.sortOrder
  }

  emit('submit', data)
}

async function handleImageUpload(files: File[]) {
  uploadingImages.value = true
  for (const file of files) {
    emit('uploadImage', file)
  }
  uploadingImages.value = false
}

function handleImageRemove(index: number) {
  const image = form.images[index]
  if (image?.id && !image.id.startsWith('temp-')) {
    emit('removeImage', image.id)
  }
  form.images.splice(index, 1)
}

function handleSetPrimaryImage(index: number) {
  form.images.forEach((img, i) => {
    img.isPrimary = i === index
  })
}
</script>
