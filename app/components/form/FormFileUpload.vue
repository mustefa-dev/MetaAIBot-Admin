<template>
  <FormField
    :label="label"
    :error="error"
    :hint="hint"
    :required="required"
    :optional="optional"
    :disabled="disabled"
  >
    <div
      :class="[
        'relative border-2 border-dashed rounded-lg transition-colors',
        isDragging
          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
          : error
            ? 'border-danger-300 dark:border-danger-700'
            : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
      ]"
      @dragover.prevent="isDragging = true"
      @dragleave="isDragging = false"
      @drop.prevent="handleDrop"
    >
      <input
        ref="inputRef"
        type="file"
        :accept="accept"
        :multiple="multiple"
        :disabled="disabled"
        class="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
        @change="handleChange"
      />

      <div class="p-6 text-center">
        <svg class="mx-auto w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>
        <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
          <span class="text-primary-600 dark:text-primary-400 font-medium">{{ $t('common.clickToUpload') || 'Click to upload' }}</span>
          {{ $t('common.orDragDrop') || 'or drag and drop' }}
        </p>
        <p v-if="acceptText" class="mt-1 text-xs text-gray-500 dark:text-gray-500">
          {{ acceptText }}
        </p>
        <p v-if="maxSizeText" class="text-xs text-gray-500 dark:text-gray-500">
          {{ maxSizeText }}
        </p>
      </div>
    </div>

    <!-- Preview -->
    <div v-if="files.length > 0" class="mt-3 space-y-2">
      <div
        v-for="(file, index) in files"
        :key="index"
        class="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
      >
        <!-- Preview/Icon -->
        <div class="shrink-0">
          <img
            v-if="file.preview"
            :src="file.preview"
            class="w-10 h-10 object-cover rounded"
            :alt="file.name"
          />
          <div v-else class="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center">
            <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
        </div>

        <!-- Info -->
        <div class="flex-1 min-w-0">
          <p class="text-sm font-medium text-gray-900 dark:text-white truncate">
            {{ file.name }}
          </p>
          <p class="text-xs text-gray-500 dark:text-gray-400">
            {{ formatFileSize(file.size) }}
          </p>
        </div>

        <!-- Remove -->
        <button
          type="button"
          class="p-1 text-gray-400 hover:text-danger-500 transition-colors"
          @click="removeFile(index)"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  </FormField>
</template>

<script setup lang="ts">
interface FileWithPreview {
  file: File
  name: string
  size: number
  preview?: string
}

interface Props {
  label?: string
  accept?: string
  multiple?: boolean
  maxSize?: number // in bytes
  disabled?: boolean
  required?: boolean
  optional?: boolean
  error?: string
  hint?: string
  acceptText?: string
  maxSizeText?: string
}

const props = withDefaults(defineProps<Props>(), {
  multiple: false,
  disabled: false,
  required: false,
  optional: false
})

const emit = defineEmits<{
  change: [files: File[]]
}>()

const inputRef = ref<HTMLInputElement | null>(null)
const isDragging = ref(false)
const files = ref<FileWithPreview[]>([])

const handleChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files) {
    addFiles(Array.from(target.files))
  }
}

const handleDrop = (event: DragEvent) => {
  isDragging.value = false
  if (event.dataTransfer?.files) {
    addFiles(Array.from(event.dataTransfer.files))
  }
}

const addFiles = (newFiles: File[]) => {
  const processed: FileWithPreview[] = newFiles.map(file => ({
    file,
    name: file.name,
    size: file.size,
    preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined
  }))

  if (props.multiple) {
    files.value = [...files.value, ...processed]
  } else {
    // Revoke previous preview URL
    if (files.value[0]?.preview) {
      URL.revokeObjectURL(files.value[0].preview)
    }
    files.value = processed.slice(0, 1)
  }

  emit('change', files.value.map(f => f.file))
}

const removeFile = (index: number) => {
  const file = files.value[index]
  if (file.preview) {
    URL.revokeObjectURL(file.preview)
  }
  files.value.splice(index, 1)
  emit('change', files.value.map(f => f.file))
}

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`
}

// Cleanup on unmount
onUnmounted(() => {
  files.value.forEach(file => {
    if (file.preview) {
      URL.revokeObjectURL(file.preview)
    }
  })
})
</script>
