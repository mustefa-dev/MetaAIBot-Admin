<template>
  <form @submit.prevent="handleSubmit" class="space-y-4">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <!-- Category -->
      <FormInput
        v-model="form.category"
        :label="t('knowledge.category')"
        :placeholder="t('knowledge.categoryPlaceholder')"
        required
      />

      <!-- Priority -->
      <FormInput
        v-model.number="form.priority"
        type="number"
        :label="t('knowledge.priority')"
        :placeholder="t('knowledge.priorityPlaceholder')"
        :min="0"
        :max="100"
      />
    </div>

    <!-- Question English -->
    <FormTextarea
      v-model="form.question"
      :label="t('knowledge.question')"
      :placeholder="t('knowledge.questionPlaceholder')"
      :rows="2"
      required
    />

    <!-- Question Arabic -->
    <FormTextarea
      v-model="form.questionArabic"
      :label="t('knowledge.questionArabic')"
      :placeholder="t('knowledge.questionArabicPlaceholder')"
      :rows="2"
      dir="rtl"
    />

    <!-- Answer English -->
    <FormTextarea
      v-model="form.answer"
      :label="t('knowledge.answer')"
      :placeholder="t('knowledge.answerPlaceholder')"
      :rows="4"
      required
    />

    <!-- Answer Arabic -->
    <FormTextarea
      v-model="form.answerArabic"
      :label="t('knowledge.answerArabic')"
      :placeholder="t('knowledge.answerArabicPlaceholder')"
      :rows="4"
      dir="rtl"
    />

    <!-- Keywords -->
    <div>
      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        {{ t('knowledge.keywords') }}
      </label>
      <div class="flex flex-wrap gap-2 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg min-h-[60px]">
        <span
          v-for="(keyword, index) in form.keywords"
          :key="index"
          class="inline-flex items-center gap-1 px-2 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 rounded text-sm"
        >
          {{ keyword }}
          <button type="button" class="hover:text-primary-900" @click="removeKeyword(index)">
            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </span>
        <input
          v-model="keywordInput"
          type="text"
          class="flex-1 min-w-[120px] bg-transparent outline-none text-sm"
          :placeholder="t('knowledge.keywordsPlaceholder')"
          @keydown.enter.prevent="addKeyword"
          @keydown.comma.prevent="addKeyword"
        />
      </div>
      <p class="text-xs text-gray-500 mt-1">{{ t('knowledge.keywordsHint') }}</p>
    </div>

    <!-- Active Status -->
    <div class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
      <span class="text-sm font-medium text-gray-700 dark:text-gray-300">
        {{ t('knowledge.isActive') }}
      </span>
      <FormSwitch v-model="form.isActive" />
    </div>
  </form>
</template>

<script setup lang="ts">
import type { KnowledgeEntry, CreateKnowledgeEntryRequest } from '~/types/settings'

interface Props {
  entry?: KnowledgeEntry | null
}

const props = withDefaults(defineProps<Props>(), {
  entry: null
})

const emit = defineEmits<{
  submit: [data: CreateKnowledgeEntryRequest]
}>()

const { t } = useI18n()

const keywordInput = ref('')

const form = reactive({
  category: '',
  question: '',
  questionArabic: '',
  answer: '',
  answerArabic: '',
  keywords: [] as string[],
  isActive: true,
  priority: 0
})

watch(() => props.entry, (entry) => {
  if (entry) {
    form.category = entry.category || ''
    form.question = entry.question || ''
    form.questionArabic = entry.questionArabic || ''
    form.answer = entry.answer || ''
    form.answerArabic = entry.answerArabic || ''
    form.keywords = [...(entry.keywords || [])]
    form.isActive = entry.isActive ?? true
    form.priority = entry.priority ?? 0
  } else {
    // Reset form
    form.category = ''
    form.question = ''
    form.questionArabic = ''
    form.answer = ''
    form.answerArabic = ''
    form.keywords = []
    form.isActive = true
    form.priority = 0
  }
}, { immediate: true })

function addKeyword() {
  const keyword = keywordInput.value.trim()
  if (keyword && !form.keywords.includes(keyword)) {
    form.keywords.push(keyword)
  }
  keywordInput.value = ''
}

function removeKeyword(index: number) {
  form.keywords.splice(index, 1)
}

function handleSubmit() {
  emit('submit', {
    category: form.category,
    question: form.question,
    questionArabic: form.questionArabic || undefined,
    answer: form.answer,
    answerArabic: form.answerArabic || undefined,
    keywords: form.keywords,
    isActive: form.isActive,
    priority: form.priority
  })
}

// Expose handleSubmit for parent to call
defineExpose({ handleSubmit })
</script>
