<template>
  <form @submit.prevent="handleSubmit" class="space-y-4">
    <!-- Status -->
    <div class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
      <span class="text-sm font-medium text-gray-700 dark:text-gray-300">
        {{ t('templates.isActive') }}
      </span>
      <FormSwitch v-model="form.isActive" />
    </div>

    <!-- Content English -->
    <FormTextarea
      v-model="form.content"
      :label="t('templates.content')"
      :placeholder="t('templates.contentPlaceholder')"
      :rows="4"
      required
    />

    <!-- Content Arabic -->
    <FormTextarea
      v-model="form.contentArabic"
      :label="t('templates.contentArabic')"
      :placeholder="t('templates.contentArabicPlaceholder')"
      :rows="4"
      dir="rtl"
    />

    <!-- Variables Reference -->
    <div v-if="template?.variables?.length" class="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
      <div class="text-sm font-medium text-blue-700 dark:text-blue-400 mb-2">
        {{ t('templates.availableVariables') }}
      </div>
      <div class="flex flex-wrap gap-2">
        <button
          v-for="variable in template.variables"
          :key="variable"
          type="button"
          class="px-2 py-1 bg-blue-100 dark:bg-blue-800 rounded text-xs font-mono text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-700 transition-colors"
          @click="insertVariable(variable)"
        >
          {{ formatVariable(variable) }}
        </button>
      </div>
      <p class="text-xs text-blue-600 dark:text-blue-400 mt-2">
        {{ t('templates.variablesHint') }}
      </p>
    </div>

    <!-- Preview -->
    <div class="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
      <div class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        {{ t('templates.preview') }}
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div class="p-2 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700">
          <div class="text-xs text-gray-500 mb-1">English</div>
          <p class="text-sm whitespace-pre-wrap">{{ previewContent }}</p>
        </div>
        <div class="p-2 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700" dir="rtl">
          <div class="text-xs text-gray-500 mb-1">العربية</div>
          <p class="text-sm whitespace-pre-wrap">{{ previewContentArabic }}</p>
        </div>
      </div>
    </div>
  </form>
</template>

<script setup lang="ts">
import type { MessageTemplate, UpdateMessageTemplateRequest } from '~/types/settings'

interface Props {
  template: MessageTemplate | null
}

const props = defineProps<Props>()

const emit = defineEmits<{
  submit: [data: UpdateMessageTemplateRequest]
}>()

const { t } = useI18n()

const form = reactive({
  content: '',
  contentArabic: '',
  isActive: true
})

// Sample data for preview
const sampleData: Record<string, string> = {
  customerName: 'Ahmed',
  orderNumber: '1234',
  total: '25,000 IQD',
  trackingNumber: 'TRK123456',
  storeName: 'My Store',
  productName: 'Sample Product'
}

const previewContent = computed(() => {
  let content = form.content
  Object.entries(sampleData).forEach(([key, value]) => {
    content = content.replace(new RegExp(`{{${key}}}`, 'g'), value)
  })
  return content
})

const previewContentArabic = computed(() => {
  let content = form.contentArabic
  Object.entries(sampleData).forEach(([key, value]) => {
    content = content.replace(new RegExp(`{{${key}}}`, 'g'), value)
  })
  return content
})

watch(() => props.template, (template) => {
  if (template) {
    form.content = template.content || ''
    form.contentArabic = template.contentArabic || ''
    form.isActive = template.isActive ?? true
  }
}, { immediate: true })

function formatVariable(variable: string): string {
  return `{{${variable}}}`
}

function insertVariable(variable: string) {
  // This would ideally insert at cursor position
  form.content += formatVariable(variable)
}

function handleSubmit() {
  emit('submit', {
    content: form.content,
    contentArabic: form.contentArabic,
    isActive: form.isActive
  })
}

// Expose handleSubmit for parent to call
defineExpose({ handleSubmit })
</script>
