<template>
  <div>
    <!-- Category Tabs -->
    <div class="flex flex-wrap gap-2 mb-6">
      <button
        v-for="cat in categories"
        :key="cat.value"
        class="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        :class="activeCategory === cat.value
          ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400'
          : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700'"
        @click="activeCategory = cat.value"
      >
        {{ cat.label }}
      </button>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="space-y-4">
      <div v-for="i in 3" :key="i" class="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <UiSkeleton class="h-5 w-48 mb-2" />
        <UiSkeleton class="h-4 w-full" />
      </div>
    </div>

    <!-- Empty State -->
    <div v-else-if="filteredTemplates.length === 0" class="text-center py-12">
      <svg class="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
      </svg>
      <p class="text-gray-500">{{ t('templates.noTemplates') }}</p>
    </div>

    <!-- Templates List -->
    <div v-else class="space-y-4">
      <div
        v-for="template in filteredTemplates"
        :key="template.id"
        class="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
      >
        <div class="flex items-start justify-between mb-3">
          <div>
            <div class="flex items-center gap-2">
              <h3 class="font-medium text-gray-900 dark:text-white">
                {{ template.name }}
              </h3>
              <UiBadge :variant="template.isActive ? 'success' : 'gray'" size="sm">
                {{ template.isActive ? t('common.active') : t('common.inactive') }}
              </UiBadge>
            </div>
            <div class="text-sm text-gray-500 font-mono">{{ template.key }}</div>
          </div>
          <UiButton variant="ghost" size="sm" @click="$emit('edit', template)">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </UiButton>
        </div>

        <!-- Content Preview -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <div class="text-xs text-gray-500 mb-1">English</div>
            <p class="text-sm text-gray-700 dark:text-gray-300 line-clamp-3">
              {{ template.content }}
            </p>
          </div>
          <div class="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg" dir="rtl">
            <div class="text-xs text-gray-500 mb-1">العربية</div>
            <p class="text-sm text-gray-700 dark:text-gray-300 line-clamp-3">
              {{ template.contentArabic }}
            </p>
          </div>
        </div>

        <!-- Variables -->
        <div v-if="template.variables?.length" class="mt-3 flex items-center gap-2">
          <span class="text-xs text-gray-500">{{ t('templates.variables') }}:</span>
          <div class="flex flex-wrap gap-1">
            <code
              v-for="variable in template.variables"
              :key="variable"
              class="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-xs font-mono"
            >
              {{ formatVariable(variable) }}
            </code>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { MessageTemplate, TemplateCategory } from '~/types/settings'

interface Props {
  templates: MessageTemplate[]
  loading?: boolean
}

const props = defineProps<Props>()

defineEmits<{
  edit: [template: MessageTemplate]
}>()

const { t } = useI18n()

const activeCategory = ref<TemplateCategory | 'all'>('all')

const categories = computed(() => [
  { value: 'all' as const, label: t('common.all') },
  { value: 'greeting' as TemplateCategory, label: t('templates.greeting') },
  { value: 'order' as TemplateCategory, label: t('templates.order') },
  { value: 'shipping' as TemplateCategory, label: t('templates.shipping') },
  { value: 'payment' as TemplateCategory, label: t('templates.payment') },
  { value: 'support' as TemplateCategory, label: t('templates.support') },
  { value: 'general' as TemplateCategory, label: t('templates.general') }
])

const filteredTemplates = computed(() => {
  if (activeCategory.value === 'all') {
    return props.templates
  }
  return props.templates.filter(t => t.category === activeCategory.value)
})

function formatVariable(variable: string): string {
  return `{{${variable}}}`
}
</script>
