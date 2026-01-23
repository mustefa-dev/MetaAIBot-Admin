<template>
  <div>
    <PageHeader :title="t('templates.title')" />
    <UiCard>
      <TemplatesList :templates="templates" :loading="isLoading" @edit="editTemplate" />
    </UiCard>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'dashboard',
  middleware: 'auth'
})

const { t } = useI18n()
const api = useApi()

interface MessageTemplate {
  id: string
  key: string
  name: string
  content: string
  contentArabic: string
  category: string
  variables: string[]
  isActive: boolean
}

const templates = ref<MessageTemplate[]>([])
const isLoading = ref(false)

async function fetchTemplates() {
  isLoading.value = true
  const { data, error } = await api.get<MessageTemplate[]>(API_ENDPOINTS.TEMPLATES.LIST)
  if (!error && data) {
    templates.value = Array.isArray(data) ? data : []
  }
  isLoading.value = false
}

function editTemplate(template: MessageTemplate) {
  // TODO: Open edit modal
  console.log('Edit template:', template)
}

onMounted(() => {
  fetchTemplates()
})
</script>
