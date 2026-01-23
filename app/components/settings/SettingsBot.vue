<template>
  <UiCard :title="t('settings.botSettings')">
    <form @submit.prevent="handleSubmit" class="space-y-6">
      <!-- Bot Enabled -->
      <div class="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
        <div>
          <div class="font-medium text-gray-900 dark:text-white">
            {{ t('settings.botEnabled') }}
          </div>
          <div class="text-sm text-gray-500">
            {{ t('settings.botEnabledDescription') }}
          </div>
        </div>
        <FormSwitch v-model="form.botEnabled" />
      </div>

      <!-- Auto Reply -->
      <div class="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
        <div>
          <div class="font-medium text-gray-900 dark:text-white">
            {{ t('settings.autoReply') }}
          </div>
          <div class="text-sm text-gray-500">
            {{ t('settings.autoReplyDescription') }}
          </div>
        </div>
        <FormSwitch v-model="form.autoReplyEnabled" :disabled="!form.botEnabled" />
      </div>

      <!-- Human Handoff -->
      <div class="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
        <div>
          <div class="font-medium text-gray-900 dark:text-white">
            {{ t('settings.humanHandoff') }}
          </div>
          <div class="text-sm text-gray-500">
            {{ t('settings.humanHandoffDescription') }}
          </div>
        </div>
        <FormSwitch v-model="form.humanHandoffEnabled" :disabled="!form.botEnabled" />
      </div>

      <!-- Max Auto Replies -->
      <div v-if="form.humanHandoffEnabled" class="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
        <FormInput
          v-model.number="form.maxAutoRepliesBeforeHandoff"
          type="number"
          :label="t('settings.maxAutoReplies')"
          :placeholder="t('settings.maxAutoRepliesPlaceholder')"
          :min="1"
          :max="20"
          class="max-w-xs"
        />
        <p class="text-sm text-gray-500 mt-2">
          {{ t('settings.maxAutoRepliesDescription') }}
        </p>
      </div>

      <div class="flex justify-end">
        <UiButton type="submit" :loading="saving">
          {{ t('common.save') }}
        </UiButton>
      </div>
    </form>
  </UiCard>
</template>

<script setup lang="ts">
import type { StoreSettings } from '~/types/settings'

interface Props {
  settings: StoreSettings | null
  saving?: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  save: [data: Partial<StoreSettings>]
}>()

const { t } = useI18n()

const form = reactive({
  botEnabled: true,
  autoReplyEnabled: true,
  humanHandoffEnabled: true,
  maxAutoRepliesBeforeHandoff: 5
})

watch(() => props.settings, (settings) => {
  if (settings) {
    form.botEnabled = settings.botEnabled ?? true
    form.autoReplyEnabled = settings.autoReplyEnabled ?? true
    form.humanHandoffEnabled = settings.humanHandoffEnabled ?? true
    form.maxAutoRepliesBeforeHandoff = settings.maxAutoRepliesBeforeHandoff ?? 5
  }
}, { immediate: true })

function handleSubmit() {
  emit('save', { ...form })
}
</script>
