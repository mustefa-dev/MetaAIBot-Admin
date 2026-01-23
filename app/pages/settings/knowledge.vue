<template>
  <div>
    <PageHeader :title="t('knowledge.title')">
      <template #actions>
        <UiButton variant="primary" @click="showAddModal = true">
          {{ t('knowledge.addEntry') }}
        </UiButton>
      </template>
    </PageHeader>

    <UiCard>
      <div v-if="isLoading" class="p-8 text-center">
        <UiSpinner class="mx-auto" />
      </div>

      <div v-else-if="entries.length === 0" class="p-8 text-center text-gray-500">
        {{ t('knowledge.noEntries') }}
      </div>

      <div v-else class="divide-y divide-gray-200 dark:divide-gray-700">
        <div
          v-for="entry in entries"
          :key="entry.id"
          class="p-4"
        >
          <div class="flex items-start justify-between">
            <div>
              <UiBadge variant="info" size="sm" class="mb-2">{{ entry.category }}</UiBadge>
              <h3 class="font-medium text-gray-900 dark:text-white">{{ entry.question }}</h3>
              <p class="text-sm text-gray-500 mt-1">{{ entry.answer }}</p>
            </div>
            <UiButton variant="ghost" size="sm" @click="deleteEntry(entry.id)">
              <svg class="w-4 h-4 text-danger-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </UiButton>
          </div>
        </div>
      </div>
    </UiCard>

    <UiModal v-model="showAddModal" :title="t('knowledge.addEntry')">
      <form @submit.prevent="addEntry" class="space-y-4">
        <FormInput v-model="form.category" :label="t('common.category')" required />
        <FormInput v-model="form.question" :label="t('knowledge.question')" required />
        <FormTextarea v-model="form.answer" :label="t('knowledge.answer')" required />
      </form>
      <template #footer>
        <UiButton variant="outline" @click="showAddModal = false">{{ t('common.cancel') }}</UiButton>
        <UiButton variant="primary" @click="addEntry">{{ t('common.save') }}</UiButton>
      </template>
    </UiModal>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'dashboard',
  middleware: 'auth'
})

const { t } = useI18n()
const api = useApi()
const toast = useAppToast()

interface KnowledgeEntry {
  id: string
  category: string
  question: string
  answer: string
}

const entries = ref<KnowledgeEntry[]>([])
const isLoading = ref(false)
const showAddModal = ref(false)

const form = reactive({
  category: '',
  question: '',
  answer: '',
  keywords: [] as string[]
})

async function fetchEntries() {
  isLoading.value = true
  const { data, error } = await api.get<KnowledgeEntry[]>('/admin/knowledge')
  if (!error && data) {
    entries.value = Array.isArray(data) ? data : []
  }
  isLoading.value = false
}

async function addEntry() {
  const { error } = await api.post('/admin/knowledge', form)
  if (!error) {
    toast.success(t('common.saved'))
    showAddModal.value = false
    form.category = ''
    form.question = ''
    form.answer = ''
    fetchEntries()
  } else {
    toast.error(error.message)
  }
}

async function deleteEntry(id: string) {
  if (confirm(t('common.confirmDelete'))) {
    const { error } = await api.del(`/admin/knowledge/${id}`)
    if (!error) {
      toast.success(t('common.deleted'))
      fetchEntries()
    }
  }
}

onMounted(() => {
  fetchEntries()
})
</script>
