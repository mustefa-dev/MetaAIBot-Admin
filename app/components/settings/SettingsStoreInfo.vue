<template>
  <UiCard :title="t('settings.storeInfo')">
    <form @submit.prevent="handleSubmit" class="space-y-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <!-- Store Name -->
        <FormInput
          v-model="form.storeName"
          :label="t('settings.storeName')"
          :placeholder="t('settings.storeNamePlaceholder')"
          required
        />

        <!-- Store Name Arabic -->
        <FormInput
          v-model="form.storeNameArabic"
          :label="t('settings.storeNameArabic')"
          :placeholder="t('settings.storeNameArabicPlaceholder')"
          dir="rtl"
        />

        <!-- Store Description -->
        <div class="md:col-span-2">
          <FormTextarea
            v-model="form.storeDescription"
            :label="t('settings.storeDescription')"
            :placeholder="t('settings.storeDescriptionPlaceholder')"
            :rows="2"
          />
        </div>

        <!-- Store Description Arabic -->
        <div class="md:col-span-2">
          <FormTextarea
            v-model="form.storeDescriptionArabic"
            :label="t('settings.storeDescriptionArabic')"
            :placeholder="t('settings.storeDescriptionArabicPlaceholder')"
            :rows="2"
            dir="rtl"
          />
        </div>

        <!-- Store Phone -->
        <FormInput
          v-model="form.storePhone"
          :label="t('settings.storePhone')"
          :placeholder="t('settings.storePhonePlaceholder')"
          type="tel"
        />

        <!-- Store Email -->
        <FormInput
          v-model="form.storeEmail"
          :label="t('settings.storeEmail')"
          :placeholder="t('settings.storeEmailPlaceholder')"
          type="email"
        />

        <!-- Store Address -->
        <FormInput
          v-model="form.storeAddress"
          :label="t('settings.storeAddress')"
          :placeholder="t('settings.storeAddressPlaceholder')"
        />

        <!-- Store Address Arabic -->
        <FormInput
          v-model="form.storeAddressArabic"
          :label="t('settings.storeAddressArabic')"
          :placeholder="t('settings.storeAddressArabicPlaceholder')"
          dir="rtl"
        />
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
  storeName: '',
  storeNameArabic: '',
  storeDescription: '',
  storeDescriptionArabic: '',
  storePhone: '',
  storeEmail: '',
  storeAddress: '',
  storeAddressArabic: ''
})

watch(() => props.settings, (settings) => {
  if (settings) {
    form.storeName = settings.storeName || ''
    form.storeNameArabic = settings.storeNameArabic || ''
    form.storeDescription = settings.storeDescription || ''
    form.storeDescriptionArabic = settings.storeDescriptionArabic || ''
    form.storePhone = settings.storePhone || ''
    form.storeEmail = settings.storeEmail || ''
    form.storeAddress = settings.storeAddress || ''
    form.storeAddressArabic = settings.storeAddressArabic || ''
  }
}, { immediate: true })

function handleSubmit() {
  emit('save', { ...form })
}
</script>
