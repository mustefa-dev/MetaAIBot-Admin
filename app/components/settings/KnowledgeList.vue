<template>
  <div>
    <!-- Search & Filter -->
    <div class="flex items-center gap-4 mb-6">
      <FormInput
        v-model="search"
        :placeholder="t('knowledge.searchPlaceholder')"
        class="flex-1"
      >
        <template #prefix>
          <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </template>
      </FormInput>
      <FormSelect
        v-model="categoryFilter"
        :options="categoryOptions"
        :placeholder="t('knowledge.category')"
        class="w-48"
      />
      <UiButton @click="$emit('create')">
        <svg class="w-4 h-4 me-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        {{ t('knowledge.addEntry') }}
      </UiButton>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="space-y-4">
      <div v-for="i in 3" :key="i" class="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <UiSkeleton class="h-5 w-2/3 mb-2" />
        <UiSkeleton class="h-4 w-full" />
      </div>
    </div>

    <!-- Empty State -->
    <div v-else-if="filteredEntries.length === 0" class="text-center py-12">
      <svg class="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
      <p class="text-gray-500 mb-4">{{ t('knowledge.noEntries') }}</p>
      <UiButton @click="$emit('create')">
        {{ t('knowledge.addEntry') }}
      </UiButton>
    </div>

    <!-- Entries List -->
    <div v-else class="space-y-4">
      <div
        v-for="entry in filteredEntries"
        :key="entry.id"
        class="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
      >
        <div class="flex items-start justify-between mb-3">
          <div class="flex-1">
            <div class="flex items-center gap-2 mb-1">
              <UiBadge variant="gray" size="sm">{{ entry.category }}</UiBadge>
              <UiBadge :variant="entry.isActive ? 'success' : 'gray'" size="sm">
                {{ entry.isActive ? t('common.active') : t('common.inactive') }}
              </UiBadge>
              <span class="text-xs text-gray-400">
                {{ t('knowledge.usedTimes', { count: entry.usageCount }) }}
              </span>
            </div>
            <h3 class="font-medium text-gray-900 dark:text-white">
              {{ entry.question }}
            </h3>
            <p v-if="entry.questionArabic" class="text-sm text-gray-500" dir="rtl">
              {{ entry.questionArabic }}
            </p>
          </div>
          <div class="flex items-center gap-1">
            <UiButton variant="ghost" size="sm" @click="$emit('edit', entry)">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </UiButton>
            <UiButton variant="ghost" size="sm" class="text-red-600 hover:text-red-700" @click="$emit('delete', entry)">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </UiButton>
          </div>
        </div>

        <!-- Answer Preview -->
        <div class="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
          <p class="text-sm text-gray-700 dark:text-gray-300 line-clamp-2">
            {{ entry.answer }}
          </p>
        </div>

        <!-- Keywords -->
        <div v-if="entry.keywords?.length" class="mt-3 flex items-center gap-2">
          <span class="text-xs text-gray-500">{{ t('knowledge.keywords') }}:</span>
          <div class="flex flex-wrap gap-1">
            <span
              v-for="keyword in entry.keywords.slice(0, 5)"
              :key="keyword"
              class="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-xs"
            >
              {{ keyword }}
            </span>
            <span v-if="entry.keywords.length > 5" class="text-xs text-gray-400">
              +{{ entry.keywords.length - 5 }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { KnowledgeEntry } from '~/types/settings'

interface Props {
  entries: KnowledgeEntry[]
  loading?: boolean
}

const props = defineProps<Props>()

defineEmits<{
  create: []
  edit: [entry: KnowledgeEntry]
  delete: [entry: KnowledgeEntry]
}>()

const { t } = useI18n()

const search = ref('')
const categoryFilter = ref('')

const categories = computed(() => {
  const cats = new Set(props.entries.map(e => e.category))
  return Array.from(cats)
})

const categoryOptions = computed(() => [
  { value: '', label: t('common.all') },
  ...categories.value.map(cat => ({ value: cat, label: cat }))
])

const filteredEntries = computed(() => {
  let result = props.entries

  if (categoryFilter.value) {
    result = result.filter(e => e.category === categoryFilter.value)
  }

  if (search.value) {
    const searchLower = search.value.toLowerCase()
    result = result.filter(e =>
      e.question.toLowerCase().includes(searchLower) ||
      e.answer.toLowerCase().includes(searchLower) ||
      e.keywords?.some(k => k.toLowerCase().includes(searchLower))
    )
  }

  return result
})
</script>
