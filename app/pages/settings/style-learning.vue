<template>
  <div>
    <PageHeader :title="t('styleLearning.title')">
      <template #subtitle>
        {{ t('styleLearning.subtitle') }}
      </template>
      <template #actions>
        <UiButton variant="ghost" @click="navigateTo('/settings')">
          <ArrowRightIcon class="w-4 h-4 me-2" />
          {{ t('common.back') }}
        </UiButton>
      </template>
    </PageHeader>

    <!-- Loading -->
    <div v-if="loading" class="flex items-center justify-center h-64">
      <UiSpinner size="lg" />
    </div>

    <template v-else>
      <div class="space-y-6">
        <!-- Status Overview -->
        <UiCard>
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              {{ t('styleLearning.status') }}
            </h3>
            <UiBadge :variant="profile?.isActive ? 'success' : 'gray'">
              {{ profile?.isActive ? t('common.active') : t('common.inactive') }}
            </UiBadge>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div class="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
              <div class="text-sm text-gray-500 dark:text-gray-400">
                {{ t('styleLearning.messagesAnalyzed') }}
              </div>
              <div class="text-2xl font-bold text-gray-900 dark:text-white">
                {{ profile?.totalMessagesAnalyzed || 0 }}
              </div>
            </div>
            <div class="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
              <div class="text-sm text-gray-500 dark:text-gray-400">
                {{ t('styleLearning.styleWeight') }}
              </div>
              <div class="text-2xl font-bold text-gray-900 dark:text-white">
                {{ profile?.styleWeight || 0 }}%
              </div>
            </div>
            <div class="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
              <div class="text-sm text-gray-500 dark:text-gray-400">
                {{ t('styleLearning.formality') }}
              </div>
              <div class="text-2xl font-bold text-gray-900 dark:text-white">
                {{ formatTone(profile?.formality) }}
              </div>
            </div>
            <div class="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
              <div class="text-sm text-gray-500 dark:text-gray-400">
                {{ t('styleLearning.warmth') }}
              </div>
              <div class="text-2xl font-bold text-gray-900 dark:text-white">
                {{ formatWarmth(profile?.warmth) }}
              </div>
            </div>
          </div>

          <!-- Enable/Disable Toggle -->
          <div class="mt-6 flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
            <div>
              <div class="font-medium text-gray-900 dark:text-white">
                {{ t('styleLearning.enableStyleLearning') }}
              </div>
              <div class="text-sm text-gray-500">
                {{ t('styleLearning.enableDescription') }}
              </div>
            </div>
            <FormSwitch
              :model-value="profile?.isActive || false"
              @update:model-value="handleToggleActive"
              :disabled="!profile || profile.totalMessagesAnalyzed < 10"
            />
          </div>

          <!-- Style Weight Slider -->
          <div v-if="profile?.isActive" class="mt-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
            <label class="block text-sm font-medium text-gray-900 dark:text-white mb-2">
              {{ t('styleLearning.styleWeightLabel') }}: {{ weightValue }}%
            </label>
            <input
              type="range"
              v-model.number="weightValue"
              min="0"
              max="100"
              step="5"
              class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
              @change="handleWeightChange"
            />
            <div class="flex justify-between text-xs text-gray-500 mt-1">
              <span>{{ t('styleLearning.lessStyle') }}</span>
              <span>{{ t('styleLearning.moreStyle') }}</span>
            </div>
          </div>
        </UiCard>

        <!-- Import Section -->
        <UiCard :title="t('styleLearning.importTitle')">
          <p class="text-gray-600 dark:text-gray-400 mb-4">
            {{ t('styleLearning.importDescription') }}
          </p>

          <div class="space-y-4">
            <!-- Connected Accounts Dropdown -->
            <div v-if="connectedAccounts.length > 0">
              <label class="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                {{ t('styleLearning.selectAccount') }}
              </label>
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                <button
                  v-for="account in connectedAccounts"
                  :key="account.id"
                  @click="selectedAccount = account"
                  :class="[
                    'p-4 rounded-lg border-2 text-start transition-all',
                    selectedAccount?.id === account.id
                      ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                  ]"
                >
                  <div class="flex items-center gap-3">
                    <img
                      v-if="account.profilePictureUrl"
                      :src="account.profilePictureUrl"
                      :alt="account.accountName"
                      class="w-10 h-10 rounded-full"
                    />
                    <div v-else class="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                      <span class="text-gray-500 text-lg">{{ account.accountName?.charAt(0) || 'P' }}</span>
                    </div>
                    <div class="flex-1 min-w-0">
                      <div class="font-medium text-gray-900 dark:text-white truncate">
                        {{ account.accountName }}
                      </div>
                      <div class="text-xs text-gray-500">
                        {{ account.platform }} • {{ account.pageId }}
                      </div>
                    </div>
                    <div v-if="selectedAccount?.id === account.id" class="text-primary-500">
                      <CheckCircleIcon class="w-5 h-5" />
                    </div>
                  </div>
                </button>
              </div>
            </div>

            <!-- No Accounts Warning -->
            <div v-else class="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <div class="flex items-center gap-2 text-yellow-800 dark:text-yellow-300">
                <ExclamationTriangleIcon class="w-5 h-5" />
                <span>{{ t('styleLearning.noAccounts') }}</span>
              </div>
              <p class="mt-2 text-sm text-yellow-700 dark:text-yellow-400">
                {{ t('styleLearning.noAccountsDescription') }}
              </p>
              <UiButton variant="outline" class="mt-3" @click="navigateTo('/settings/connections')">
                {{ t('styleLearning.connectAccount') }}
              </UiButton>
            </div>

            <!-- Import Progress -->
            <div v-if="importProgress" class="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div class="flex items-center justify-between mb-2">
                <span class="text-sm font-medium text-blue-900 dark:text-blue-300">
                  {{ t('styleLearning.importProgress') }}
                </span>
                <UiBadge :variant="importProgress.status === 'completed' ? 'success' : 'primary'">
                  {{ importProgress.status }}
                </UiBadge>
              </div>
              <UiProgress :value="importProgress.progressPercentage" class="mb-2" />
              <div class="text-sm text-blue-700 dark:text-blue-400">
                {{ importProgress.processedConversations }} / {{ importProgress.totalConversations }}
                {{ t('styleLearning.conversations') }}
                •
                {{ importProgress.ownerMessagesImported }} {{ t('styleLearning.ownerMessages') }}
              </div>
            </div>

            <!-- Statistics -->
            <div v-if="statistics && statistics.totalMessages > 0" class="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div class="text-sm font-medium text-green-900 dark:text-green-300 mb-2">
                {{ t('styleLearning.importedData') }}
              </div>
              <div class="grid grid-cols-2 gap-2 text-sm text-green-700 dark:text-green-400">
                <div>{{ t('styleLearning.totalMessages') }}: {{ statistics.totalMessages }}</div>
                <div>{{ t('styleLearning.ownerMessages') }}: {{ statistics.ownerMessages }}</div>
                <div>{{ t('styleLearning.analyzedMessages') }}: {{ statistics.analyzedMessages }}</div>
                <div>{{ t('styleLearning.unanalyzedMessages') }}: {{ statistics.unanalyzedMessages }}</div>
              </div>
            </div>

            <div class="flex gap-3">
              <UiButton
                @click="handleImport"
                :loading="importing"
                :disabled="!selectedAccount"
              >
                <CloudArrowDownIcon class="w-4 h-4 me-2" />
                {{ t('styleLearning.startImport') }}
              </UiButton>
              <UiButton
                variant="outline"
                @click="handleRefreshProgress"
                :disabled="!selectedAccount"
              >
                <ArrowPathIcon class="w-4 h-4 me-2" />
                {{ t('common.refresh') }}
              </UiButton>
            </div>
          </div>
        </UiCard>

        <!-- Analysis Section -->
        <UiCard :title="t('styleLearning.analysisTitle')">
          <p class="text-gray-600 dark:text-gray-400 mb-4">
            {{ t('styleLearning.analysisDescription') }}
          </p>

          <div v-if="statistics && statistics.unanalyzedMessages > 0" class="mb-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
            <div class="text-sm text-yellow-800 dark:text-yellow-300">
              {{ t('styleLearning.unanalyzedWarning', { count: statistics.unanalyzedMessages }) }}
            </div>
          </div>

          <UiButton
            @click="handleAnalyze"
            :loading="analyzing"
            :disabled="!statistics || statistics.unanalyzedMessages === 0"
          >
            <SparklesIcon class="w-4 h-4 me-2" />
            {{ t('styleLearning.runAnalysis') }}
          </UiButton>

          <div v-if="profile?.lastAnalyzedAt" class="mt-3 text-sm text-gray-500">
            {{ t('styleLearning.lastAnalyzed') }}: {{ formatDate(profile.lastAnalyzedAt) }}
          </div>
        </UiCard>

        <!-- Patterns Section -->
        <UiCard :title="t('styleLearning.patternsTitle')">
          <div v-if="!patterns || Object.keys(patterns).length === 0" class="text-center py-8">
            <UiEmptyState
              :title="t('styleLearning.noPatterns')"
              :description="t('styleLearning.noPatternsDescription')"
            />
          </div>

          <div v-else class="space-y-6">
            <!-- Greetings -->
            <PatternSection
              :title="t('styleLearning.greetings')"
              :patterns="patterns.greetings"
              pattern-type="greeting"
              @remove="handleRemovePattern"
            />

            <!-- Closings -->
            <PatternSection
              :title="t('styleLearning.closings')"
              :patterns="patterns.closings"
              pattern-type="closing"
              @remove="handleRemovePattern"
            />

            <!-- Favorite Phrases -->
            <PatternSection
              :title="t('styleLearning.favoritePhrases')"
              :patterns="patterns.favoritePhrases"
              pattern-type="phrase"
              @remove="handleRemovePattern"
            />

            <!-- Endearments -->
            <PatternSection
              :title="t('styleLearning.endearments')"
              :patterns="patterns.endearments"
              pattern-type="endearment"
              @remove="handleRemovePattern"
            />

            <!-- Emojis -->
            <PatternSection
              :title="t('styleLearning.emojis')"
              :patterns="patterns.emojis"
              pattern-type="emoji"
              @remove="handleRemovePattern"
            />
          </div>

          <!-- Add Pattern -->
          <div class="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <h4 class="font-medium text-gray-900 dark:text-white mb-3">
              {{ t('styleLearning.addPattern') }}
            </h4>
            <div class="flex gap-3">
              <FormSelect
                v-model="newPattern.type"
                :options="patternTypeOptions"
                class="w-40"
              />
              <FormInput
                v-model="newPattern.value"
                :placeholder="t('styleLearning.patternPlaceholder')"
                class="flex-1"
              />
              <UiButton @click="handleAddPattern" :disabled="!newPattern.type || !newPattern.value">
                <PlusIcon class="w-4 h-4" />
              </UiButton>
            </div>
          </div>
        </UiCard>

        <!-- Preview Section -->
        <UiCard :title="t('styleLearning.previewTitle')">
          <p class="text-gray-600 dark:text-gray-400 mb-4">
            {{ t('styleLearning.previewDescription') }}
          </p>

          <div class="space-y-4">
            <FormTextarea
              v-model="previewMessage"
              :label="t('styleLearning.customerMessage')"
              :placeholder="t('styleLearning.customerMessagePlaceholder')"
              :rows="2"
            />

            <UiButton @click="handlePreview" :loading="previewing" :disabled="!previewMessage">
              <EyeIcon class="w-4 h-4 me-2" />
              {{ t('styleLearning.generatePreview') }}
            </UiButton>

            <div v-if="previewResult" class="mt-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
              <div class="text-sm font-medium text-gray-900 dark:text-white mb-2">
                {{ t('styleLearning.generatedResponse') }}
              </div>
              <div class="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                {{ previewResult.generatedResponse }}
              </div>
              <div class="mt-3 text-xs text-gray-500">
                {{ previewResult.styleApplied ? t('styleLearning.styleApplied') : t('styleLearning.styleNotApplied') }}
              </div>
            </div>
          </div>
        </UiCard>

        <!-- Style Prompt Preview -->
        <UiCard :title="t('styleLearning.promptPreviewTitle')">
          <p class="text-gray-600 dark:text-gray-400 mb-4">
            {{ t('styleLearning.promptPreviewDescription') }}
          </p>

          <UiButton variant="outline" @click="handleFetchPrompt" :loading="loadingPrompt">
            {{ t('styleLearning.viewPrompt') }}
          </UiButton>

          <div v-if="stylePrompt" class="mt-4 p-4 bg-gray-900 dark:bg-gray-950 rounded-lg">
            <pre class="text-sm text-green-400 whitespace-pre-wrap font-mono" dir="rtl">{{ stylePrompt }}</pre>
          </div>
        </UiCard>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import {
  ArrowRightIcon,
  CloudArrowDownIcon,
  ArrowPathIcon,
  SparklesIcon,
  PlusIcon,
  EyeIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/vue/24/outline'
import type { StylePreviewResult, ConnectedAccountForImport } from '~/types/settings'

definePageMeta({
  layout: 'dashboard',
  middleware: 'auth'
})

const { t } = useI18n()
const styleLearning = useStyleLearning()

const {
  profile,
  patterns,
  importProgress,
  statistics,
  stylePrompt,
  connectedAccounts,
  loading,
  importing,
  analyzing
} = styleLearning

// Selected account
const selectedAccount = ref<ConnectedAccountForImport | null>(null)

const weightValue = ref(70)
const previewMessage = ref('')
const previewResult = ref<StylePreviewResult | null>(null)
const previewing = ref(false)
const loadingPrompt = ref(false)

const newPattern = reactive({
  type: 'greeting',
  value: ''
})

const patternTypeOptions = computed(() => [
  { value: 'greeting', label: t('styleLearning.greetings') },
  { value: 'closing', label: t('styleLearning.closings') },
  { value: 'phrase', label: t('styleLearning.favoritePhrases') },
  { value: 'endearment', label: t('styleLearning.endearments') },
  { value: 'emoji', label: t('styleLearning.emojis') }
])

// Format helpers
function formatTone(value?: string): string {
  if (!value) return '-'
  const map: Record<string, string> = {
    formal: t('styleLearning.toneTypes.formal'),
    informal: t('styleLearning.toneTypes.informal'),
    mixed: t('styleLearning.toneTypes.mixed')
  }
  return map[value] || value
}

function formatWarmth(value?: string): string {
  if (!value) return '-'
  const map: Record<string, string> = {
    cold: t('styleLearning.warmthTypes.cold'),
    neutral: t('styleLearning.warmthTypes.neutral'),
    warm: t('styleLearning.warmthTypes.warm'),
    very_warm: t('styleLearning.warmthTypes.veryWarm')
  }
  return map[value] || value
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleString()
}

// Handlers
async function handleToggleActive(value: boolean) {
  await styleLearning.setActive(value)
}

async function handleWeightChange() {
  await styleLearning.updateWeight(weightValue.value)
}

async function handleImport() {
  if (!selectedAccount.value) return

  await styleLearning.importFromAccount(selectedAccount.value.id)
  await handleRefreshProgress()
}

async function handleRefreshProgress() {
  if (selectedAccount.value) {
    await styleLearning.fetchImportProgress(selectedAccount.value.pageId)
    await styleLearning.fetchStatistics(selectedAccount.value.pageId)
  }
}

async function handleAnalyze() {
  await styleLearning.analyzeStyle()
}

async function handleAddPattern() {
  if (!newPattern.type || !newPattern.value) return

  const success = await styleLearning.addPattern({
    patternType: newPattern.type as any,
    pattern: newPattern.value
  })

  if (success) {
    newPattern.value = ''
  }
}

async function handleRemovePattern(type: string, pattern: string) {
  await styleLearning.removePattern(type, pattern)
}

async function handlePreview() {
  if (!previewMessage.value) return
  previewing.value = true
  try {
    previewResult.value = await styleLearning.previewStyle(previewMessage.value)
  } finally {
    previewing.value = false
  }
}

async function handleFetchPrompt() {
  loadingPrompt.value = true
  try {
    await styleLearning.fetchStylePrompt()
  } finally {
    loadingPrompt.value = false
  }
}

// Initial load
onMounted(async () => {
  await styleLearning.fetchConnectedAccounts()
  await styleLearning.fetchProfile()
  await styleLearning.fetchPatterns()

  if (profile.value) {
    weightValue.value = profile.value.styleWeight
  }

  // Auto-select first account if available
  if (connectedAccounts.value.length > 0) {
    selectedAccount.value = connectedAccounts.value[0]
    await handleRefreshProgress()
  }
})

// Watch for profile changes
watch(profile, (newProfile) => {
  if (newProfile) {
    weightValue.value = newProfile.styleWeight
  }
})
</script>
