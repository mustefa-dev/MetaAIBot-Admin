<template>
  <div class="space-y-4">
    <!-- Current Images -->
    <div v-if="images.length > 0" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      <div
        v-for="(image, index) in images"
        :key="image.id || index"
        class="relative group aspect-square rounded-lg overflow-hidden border-2 transition-colors"
        :class="image.isPrimary ? 'border-primary-500' : 'border-gray-200 dark:border-gray-700'"
      >
        <img
          :src="image.imageUrl"
          :alt="image.altText || `Image ${index + 1}`"
          class="w-full h-full object-cover"
        />

        <!-- Primary Badge -->
        <div
          v-if="image.isPrimary"
          class="absolute top-2 start-2 px-2 py-1 bg-primary-500 text-white text-xs rounded"
        >
          {{ t('products.primaryImage') }}
        </div>

        <!-- Actions Overlay -->
        <div class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
          <button
            v-if="!image.isPrimary"
            class="p-2 bg-white rounded-full text-gray-700 hover:bg-gray-100 transition-colors"
            :title="t('products.setAsPrimary')"
            @click="setPrimary(index)"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
          </button>
          <button
            class="p-2 bg-white rounded-full text-red-600 hover:bg-red-50 transition-colors"
            :title="t('common.delete')"
            @click="removeImage(index)"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>

        <!-- Sort Handle -->
        <div class="absolute bottom-2 end-2 px-2 py-1 bg-black/50 text-white text-xs rounded">
          {{ index + 1 }}
        </div>
      </div>
    </div>

    <!-- Upload Area -->
    <div
      class="border-2 border-dashed rounded-lg p-8 text-center transition-colors"
      :class="isDragging ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' : 'border-gray-300 dark:border-gray-600 hover:border-primary-400'"
      @dragover.prevent="isDragging = true"
      @dragleave="isDragging = false"
      @drop.prevent="handleDrop"
    >
      <input
        ref="fileInput"
        type="file"
        accept="image/*"
        multiple
        class="hidden"
        @change="handleFileSelect"
      />

      <div v-if="uploading" class="flex flex-col items-center">
        <UiSpinner size="lg" class="mb-2" />
        <p class="text-gray-600 dark:text-gray-400">{{ t('products.uploading') }}...</p>
      </div>

      <div v-else class="flex flex-col items-center">
        <svg class="w-12 h-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <p class="text-gray-600 dark:text-gray-400 mb-2">
          {{ t('products.dragDropImages') }}
        </p>
        <p class="text-sm text-gray-400 mb-4">
          {{ t('products.imageFormats') }}
        </p>
        <UiButton variant="outline" @click="$refs.fileInput.click()">
          <svg class="w-4 h-4 me-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          {{ t('products.selectImages') }}
        </UiButton>
      </div>
    </div>

    <!-- Image Limit Warning -->
    <p v-if="images.length >= maxImages" class="text-sm text-amber-600">
      {{ t('products.maxImagesReached', { max: maxImages }) }}
    </p>
  </div>
</template>

<script setup lang="ts">
import type { ProductImage } from '~/types/product'

interface Props {
  images: ProductImage[]
  maxImages?: number
  uploading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  maxImages: 10,
  uploading: false
})

const emit = defineEmits<{
  'update:images': [images: ProductImage[]]
  upload: [files: File[]]
  remove: [index: number]
  setPrimary: [index: number]
}>()

const { t } = useI18n()

const fileInput = ref<HTMLInputElement>()
const isDragging = ref(false)

function handleFileSelect(event: Event) {
  const input = event.target as HTMLInputElement
  if (input.files) {
    processFiles(Array.from(input.files))
  }
  // Reset input
  input.value = ''
}

function handleDrop(event: DragEvent) {
  isDragging.value = false
  if (event.dataTransfer?.files) {
    processFiles(Array.from(event.dataTransfer.files))
  }
}

function processFiles(files: File[]) {
  // Filter valid images
  const validFiles = files.filter(file => {
    if (!file.type.startsWith('image/')) return false
    if (file.size > 5 * 1024 * 1024) return false // 5MB limit
    return true
  })

  // Respect max images limit
  const remaining = props.maxImages - props.images.length
  const filesToUpload = validFiles.slice(0, remaining)

  if (filesToUpload.length > 0) {
    emit('upload', filesToUpload)
  }
}

function removeImage(index: number) {
  emit('remove', index)
}

function setPrimary(index: number) {
  emit('setPrimary', index)
}
</script>
