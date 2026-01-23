<template>
  <div>
    <PageHeader :title="t('settings.title')">
      <template #subtitle>
        {{ t('settings.subtitle') }}
      </template>
    </PageHeader>

    <!-- Tabs -->
    <div class="border-b border-gray-200 dark:border-gray-700 mb-6">
      <nav class="flex gap-4 -mb-px">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          class="pb-3 px-1 border-b-2 font-medium text-sm transition-colors"
          :class="activeTab === tab.id
            ? 'border-primary-500 text-primary-600 dark:text-primary-400'
            : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'"
          @click="activeTab = tab.id"
        >
          {{ tab.label }}
        </button>
      </nav>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex items-center justify-center h-64">
      <UiSpinner size="lg" />
    </div>

    <!-- Tab Content -->
    <template v-else>
      <!-- General Settings -->
      <div v-show="activeTab === 'general'" class="space-y-6">
        <SettingsSettingsStoreInfo
          :settings="settings"
          :saving="saving"
          @save="handleSaveSettings"
        />
        <SettingsSettingsCurrency
          :settings="settings"
          :saving="saving"
          @save="handleSaveSettings"
        />
      </div>

      <!-- Bot Settings -->
      <div v-show="activeTab === 'bot'" class="space-y-6">
        <SettingsSettingsBot
          :settings="settings"
          :saving="saving"
          @save="handleSaveSettings"
        />
      </div>

      <!-- Shipping Settings -->
      <div v-show="activeTab === 'shipping'" class="space-y-6">
        <SettingsSettingsShipping
          :settings="settings"
          :saving="saving"
          @save="handleSaveSettings"
        />
      </div>

      <!-- Notifications -->
      <div v-show="activeTab === 'notifications'" class="space-y-6">
        <SettingsSettingsNotifications
          :settings="settings"
          :saving="saving"
          @save="handleSaveSettings"
        />
      </div>

      <!-- Templates -->
      <div v-show="activeTab === 'templates'">
        <UiCard :title="t('templates.title')">
          <SettingsTemplatesList
            :templates="templates"
            :loading="loadingTemplates"
            @edit="editTemplate"
          />
        </UiCard>
      </div>

      <!-- Knowledge Base -->
      <div v-show="activeTab === 'knowledge'">
        <UiCard :title="t('knowledge.title')">
          <SettingsKnowledgeList
            :entries="knowledgeEntries"
            :loading="loadingKnowledge"
            @create="openKnowledgeModal(null)"
            @edit="openKnowledgeModal"
            @delete="confirmDeleteKnowledge"
          />
        </UiCard>
      </div>
    </template>

    <!-- Edit Template Modal -->
    <UiModal v-model="showTemplateModal" :title="t('templates.editTemplate')" size="lg">
      <SettingsTemplateForm
        ref="templateFormRef"
        :template="selectedTemplate"
        @submit="handleSaveTemplate"
      />
      <template #footer>
        <div class="flex justify-end gap-3">
          <UiButton variant="ghost" @click="showTemplateModal = false">
            {{ t('common.cancel') }}
          </UiButton>
          <UiButton :loading="savingTemplate" @click="templateFormRef?.handleSubmit()">
            {{ t('common.save') }}
          </UiButton>
        </div>
      </template>
    </UiModal>

    <!-- Knowledge Entry Modal -->
    <UiModal
      v-model="showKnowledgeModal"
      :title="selectedKnowledge ? t('knowledge.editEntry') : t('knowledge.addEntry')"
      size="lg"
    >
      <SettingsKnowledgeForm
        ref="knowledgeFormRef"
        :entry="selectedKnowledge"
        @submit="handleSaveKnowledge"
      />
      <template #footer>
        <div class="flex justify-end gap-3">
          <UiButton variant="ghost" @click="showKnowledgeModalVisible = false">
            {{ t('common.cancel') }}
          </UiButton>
          <UiButton :loading="savingKnowledge" @click="knowledgeFormRef?.handleSubmit()">
            {{ t('common.save') }}
          </UiButton>
        </div>
      </template>
    </UiModal>

    <!-- Delete Confirmation Modal -->
    <UiModal v-model="showDeleteModal" :title="t('common.confirmDelete')">
      <p class="text-gray-600 dark:text-gray-400">
        {{ t('knowledge.deleteConfirm') }}
      </p>
      <template #footer>
        <div class="flex justify-end gap-3">
          <UiButton variant="ghost" @click="showDeleteModal = false">
            {{ t('common.cancel') }}
          </UiButton>
          <UiButton variant="danger" :loading="deleting" @click="handleDeleteKnowledge">
            {{ t('common.delete') }}
          </UiButton>
        </div>
      </template>
    </UiModal>
  </div>
</template>

<script setup lang="ts">
import type { StoreSettings, MessageTemplate, KnowledgeEntry, UpdateMessageTemplateRequest, CreateKnowledgeEntryRequest } from '~/types/settings'

definePageMeta({
  layout: 'dashboard',
  middleware: 'auth'
})

const { t } = useI18n()
const toast = useAppToast()
const settingsComposable = useSettings()

// Tabs
const tabs = computed(() => [
  { id: 'general', label: t('settings.general') },
  { id: 'bot', label: t('settings.bot') },
  { id: 'shipping', label: t('settings.shipping') },
  { id: 'notifications', label: t('settings.notifications') },
  { id: 'templates', label: t('templates.title') },
  { id: 'knowledge', label: t('knowledge.title') }
])

const activeTab = ref('general')

// State
const loading = ref(true)
const saving = ref(false)
const settings = ref<StoreSettings | null>(null)

// Templates
const templates = ref<MessageTemplate[]>([])
const loadingTemplates = ref(false)
const showTemplateModal = ref(false)
const selectedTemplate = ref<MessageTemplate | null>(null)
const savingTemplate = ref(false)
const templateFormRef = ref<{ handleSubmit: () => void } | null>(null)

// Knowledge
const knowledgeEntries = ref<KnowledgeEntry[]>([])
const loadingKnowledge = ref(false)
const showKnowledgeModalVisible = ref(false)
const selectedKnowledge = ref<KnowledgeEntry | null>(null)
const savingKnowledge = ref(false)
const knowledgeFormRef = ref<{ handleSubmit: () => void } | null>(null)
const showDeleteModal = ref(false)
const knowledgeToDelete = ref<KnowledgeEntry | null>(null)
const deleting = ref(false)

// Computed alias for v-model
const showKnowledgeModal = computed({
  get: () => showKnowledgeModalVisible.value,
  set: (value) => { showKnowledgeModalVisible.value = value }
})

// Fetch settings
async function fetchSettings() {
  loading.value = true
  try {
    settings.value = await settingsComposable.fetchSettings()
  } finally {
    loading.value = false
  }
}

// Fetch templates
async function fetchTemplates() {
  loadingTemplates.value = true
  try {
    templates.value = await settingsComposable.fetchTemplates()
  } finally {
    loadingTemplates.value = false
  }
}

// Fetch knowledge
async function fetchKnowledge() {
  loadingKnowledge.value = true
  try {
    knowledgeEntries.value = await settingsComposable.fetchKnowledge()
  } finally {
    loadingKnowledge.value = false
  }
}

// Save settings
async function handleSaveSettings(data: Partial<StoreSettings>) {
  saving.value = true
  try {
    const success = await settingsComposable.updateSettings(data)
    if (success) {
      // Refresh settings
      settings.value = { ...settings.value, ...data } as StoreSettings
    }
  } finally {
    saving.value = false
  }
}

// Edit template
function editTemplate(template: MessageTemplate) {
  selectedTemplate.value = template
  showTemplateModal.value = true
}

// Save template
async function handleSaveTemplate(data: UpdateMessageTemplateRequest) {
  if (!selectedTemplate.value) return

  savingTemplate.value = true
  try {
    const success = await settingsComposable.updateTemplate(selectedTemplate.value.id, data)
    if (success) {
      showTemplateModal.value = false
      fetchTemplates()
    }
  } finally {
    savingTemplate.value = false
  }
}

// Open knowledge modal
function openKnowledgeModal(entry: KnowledgeEntry | null) {
  selectedKnowledge.value = entry
  showKnowledgeModalVisible.value = true
}

// Save knowledge
async function handleSaveKnowledge(data: CreateKnowledgeEntryRequest) {
  savingKnowledge.value = true
  try {
    if (selectedKnowledge.value) {
      const success = await settingsComposable.updateKnowledgeEntry(selectedKnowledge.value.id, data)
      if (success) {
        showKnowledgeModalVisible.value = false
        fetchKnowledge()
      }
    } else {
      const result = await settingsComposable.createKnowledgeEntry(data)
      if (result) {
        showKnowledgeModalVisible.value = false
        fetchKnowledge()
      }
    }
  } finally {
    savingKnowledge.value = false
  }
}

// Confirm delete knowledge
function confirmDeleteKnowledge(entry: KnowledgeEntry) {
  knowledgeToDelete.value = entry
  showDeleteModal.value = true
}

// Delete knowledge
async function handleDeleteKnowledge() {
  if (!knowledgeToDelete.value) return

  deleting.value = true
  try {
    const success = await settingsComposable.deleteKnowledgeEntry(knowledgeToDelete.value.id)
    if (success) {
      showDeleteModal.value = false
      fetchKnowledge()
    }
  } finally {
    deleting.value = false
  }
}

// Initial fetch
onMounted(() => {
  fetchSettings()
  fetchTemplates()
  fetchKnowledge()
})
</script>
