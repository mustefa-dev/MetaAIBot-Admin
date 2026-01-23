<template>
  <div>
    <!-- Loading -->
    <div v-if="loading" class="flex items-center justify-center h-64">
      <UiSpinner size="lg" />
    </div>

    <!-- Not Found -->
    <div v-else-if="!customer" class="flex flex-col items-center justify-center h-64">
      <svg class="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">
        {{ t('errors.notFound') }}
      </h2>
      <UiButton @click="router.back()">
        {{ t('common.goBack') }}
      </UiButton>
    </div>

    <!-- Customer Content -->
    <template v-else>
      <PageHeader :title="customer.name || t('customers.anonymous')">
        <template #subtitle>
          <div class="flex items-center gap-3">
            <ConversationsPlatformIcon :platform="customer.platform" size="sm" />
            <span class="text-gray-500">{{ t(`platforms.${customer.platform}`) }}</span>
            <UiBadge
              :variant="customer.isBlocked ? 'danger' : 'success'"
            >
              {{ customer.isBlocked ? t('customers.blocked') : t('common.active') }}
            </UiBadge>
          </div>
        </template>
        <template #actions>
          <UiButton variant="outline" @click="isEditing = true">
            <svg class="w-4 h-4 me-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            {{ t('common.edit') }}
          </UiButton>
          <UiButton
            :variant="customer.isBlocked ? 'primary' : 'danger'"
            @click="showBlockModal = true"
          >
            <svg v-if="customer.isBlocked" class="w-4 h-4 me-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
            </svg>
            <svg v-else class="w-4 h-4 me-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
            </svg>
            {{ customer.isBlocked ? t('customers.unblock') : t('customers.block') }}
          </UiButton>
        </template>
      </PageHeader>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Main Content -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Orders -->
          <UiCard :title="t('customers.orderHistory')">
            <template #actions>
              <NuxtLink
                :to="`/orders?customerId=${customer.id}`"
                class="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400"
              >
                {{ t('common.viewAll') }}
              </NuxtLink>
            </template>
            <CustomersCustomerOrders
              :orders="orders"
              :customer-id="customer.id"
              :loading="loadingOrders"
              :show-view-all="false"
            />
          </UiCard>

          <!-- Conversations -->
          <UiCard :title="t('customers.conversationHistory')">
            <template #actions>
              <NuxtLink
                :to="`/conversations?customerId=${customer.id}`"
                class="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400"
              >
                {{ t('common.viewAll') }}
              </NuxtLink>
            </template>
            <CustomersCustomerConversations
              :conversations="conversations"
              :customer-id="customer.id"
              :loading="loadingConversations"
              :show-view-all="false"
            />
          </UiCard>

          <!-- Notes -->
          <UiCard v-if="customer.notes" :title="t('customers.notes')">
            <p class="text-gray-600 dark:text-gray-400 whitespace-pre-wrap">
              {{ customer.notes }}
            </p>
          </UiCard>
        </div>

        <!-- Sidebar -->
        <div class="space-y-6">
          <!-- Customer Info -->
          <UiCard :title="t('customers.contactInfo')">
            <div class="space-y-4">
              <!-- Platform ID -->
              <div>
                <div class="text-sm text-gray-500 mb-1">{{ t('customers.platformId') }}</div>
                <div class="font-mono text-sm text-gray-900 dark:text-white break-all">
                  {{ customer.platformId }}
                </div>
              </div>

              <!-- Phone -->
              <div v-if="customer.phone">
                <div class="text-sm text-gray-500 mb-1">{{ t('customers.phone') }}</div>
                <a
                  :href="`tel:${customer.phone}`"
                  class="text-primary-600 hover:text-primary-700 dark:text-primary-400"
                >
                  {{ customer.phone }}
                </a>
              </div>

              <!-- Email -->
              <div v-if="customer.email">
                <div class="text-sm text-gray-500 mb-1">{{ t('customers.email') }}</div>
                <a
                  :href="`mailto:${customer.email}`"
                  class="text-primary-600 hover:text-primary-700 dark:text-primary-400"
                >
                  {{ customer.email }}
                </a>
              </div>

              <!-- Address -->
              <div v-if="customer.address || customer.governorate">
                <div class="text-sm text-gray-500 mb-1">{{ t('customers.address') }}</div>
                <div class="text-gray-900 dark:text-white">
                  <span v-if="customer.address">{{ customer.address }}</span>
                  <span v-if="customer.address && customer.governorate">, </span>
                  <span v-if="customer.governorate">{{ customer.governorate }}</span>
                </div>
              </div>
            </div>
          </UiCard>

          <!-- Stats -->
          <UiCard :title="t('customers.statistics')">
            <div class="space-y-4">
              <div class="flex items-center justify-between">
                <span class="text-gray-500">{{ t('customers.orderCount') }}</span>
                <span class="text-xl font-bold text-gray-900 dark:text-white">
                  {{ customer.orderCount }}
                </span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-gray-500">{{ t('customers.totalSpent') }}</span>
                <span class="text-xl font-bold text-gray-900 dark:text-white">
                  {{ format.currency(customer.totalSpent) }}
                </span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-gray-500">{{ t('customers.avgOrderValue') }}</span>
                <span class="font-medium text-gray-900 dark:text-white">
                  {{ format.currency(customer.averageOrderValue) }}
                </span>
              </div>
              <div v-if="customer.lastOrderAt" class="flex items-center justify-between">
                <span class="text-gray-500">{{ t('customers.lastOrder') }}</span>
                <span class="text-gray-900 dark:text-white">
                  {{ format.relativeTime(customer.lastOrderAt) }}
                </span>
              </div>
            </div>
          </UiCard>

          <!-- Tags -->
          <UiCard v-if="customer.tags?.length" :title="t('customers.tags')">
            <div class="flex flex-wrap gap-2">
              <UiBadge
                v-for="tag in customer.tags"
                :key="tag"
                variant="gray"
              >
                {{ tag }}
              </UiBadge>
            </div>
          </UiCard>

          <!-- Block Reason -->
          <UiCard
            v-if="customer.isBlocked && customer.blockReason"
            :title="t('customers.blockReason')"
            class="border-red-200 dark:border-red-800"
          >
            <p class="text-red-600 dark:text-red-400">
              {{ customer.blockReason }}
            </p>
          </UiCard>

          <!-- Dates -->
          <UiCard :title="t('common.details')">
            <div class="space-y-3 text-sm">
              <div class="flex items-center justify-between">
                <span class="text-gray-500">{{ t('customers.memberSince') }}</span>
                <span class="text-gray-900 dark:text-white">
                  {{ format.date(customer.createdAt) }}
                </span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-gray-500">{{ t('common.updated') }}</span>
                <span class="text-gray-900 dark:text-white">
                  {{ format.date(customer.updatedAt) }}
                </span>
              </div>
            </div>
          </UiCard>
        </div>
      </div>
    </template>

    <!-- Edit Modal -->
    <UiModal v-model="isEditing" :title="t('customers.editCustomer')" size="lg">
      <form @submit.prevent="saveChanges">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput
            v-model="editForm.name"
            :label="t('customers.name')"
            :placeholder="t('customers.namePlaceholder')"
          />
          <FormInput
            v-model="editForm.phone"
            :label="t('customers.phone')"
            :placeholder="t('customers.phonePlaceholder')"
          />
          <FormInput
            v-model="editForm.email"
            type="email"
            :label="t('customers.email')"
            :placeholder="t('customers.emailPlaceholder')"
          />
          <FormInput
            v-model="editForm.governorate"
            :label="t('shipping.governorate')"
            :placeholder="t('customers.governoratePlaceholder')"
          />
          <div class="md:col-span-2">
            <FormInput
              v-model="editForm.address"
              :label="t('customers.address')"
              :placeholder="t('customers.addressPlaceholder')"
            />
          </div>
          <div class="md:col-span-2">
            <FormTextarea
              v-model="editForm.notes"
              :label="t('customers.notes')"
              :placeholder="t('customers.notesPlaceholder')"
              :rows="3"
            />
          </div>
        </div>
      </form>
      <template #footer>
        <div class="flex justify-end gap-3">
          <UiButton variant="ghost" @click="isEditing = false">
            {{ t('common.cancel') }}
          </UiButton>
          <UiButton :loading="saving" @click="saveChanges">
            {{ t('common.save') }}
          </UiButton>
        </div>
      </template>
    </UiModal>

    <!-- Block/Unblock Modal -->
    <UiModal v-model="showBlockModal" :title="blockModalTitle">
      <div class="space-y-4">
        <p class="text-gray-600 dark:text-gray-400">
          {{ blockModalMessage }}
        </p>
        <FormTextarea
          v-if="!customer?.isBlocked"
          v-model="blockReason"
          :label="t('customers.blockReason')"
          :placeholder="t('customers.blockReasonPlaceholder')"
          :rows="3"
        />
      </div>
      <template #footer>
        <div class="flex justify-end gap-3">
          <UiButton variant="ghost" @click="showBlockModal = false">
            {{ t('common.cancel') }}
          </UiButton>
          <UiButton
            :variant="customer?.isBlocked ? 'primary' : 'danger'"
            :loading="blocking"
            @click="toggleBlock"
          >
            {{ customer?.isBlocked ? t('customers.unblock') : t('customers.block') }}
          </UiButton>
        </div>
      </template>
    </UiModal>
  </div>
</template>

<script setup lang="ts">
import type { Customer, UpdateCustomerRequest } from '~/types/customer'
import type { Order } from '~/types/order'
import type { Conversation } from '~/types/conversation'
import { API_ENDPOINTS } from '~/utils/constants'

definePageMeta({
  layout: 'dashboard',
  middleware: 'auth'
})

const route = useRoute()
const router = useRouter()
const { t } = useI18n()
const toast = useAppToast()
const format = useFormat()
const api = useApi()
const customersComposable = useCustomers()

const customerId = computed(() => route.params.id as string)

// State
const customer = ref<Customer | null>(null)
const orders = ref<Order[]>([])
const conversations = ref<Conversation[]>([])
const loading = ref(true)
const loadingOrders = ref(false)
const loadingConversations = ref(false)
const isEditing = ref(false)
const saving = ref(false)
const showBlockModal = ref(false)
const blocking = ref(false)
const blockReason = ref('')

const editForm = reactive<UpdateCustomerRequest>({
  name: '',
  phone: '',
  email: '',
  address: '',
  governorate: '',
  notes: ''
})

// Computed
const blockModalTitle = computed(() => {
  return customer.value?.isBlocked
    ? t('customers.unblockCustomer')
    : t('customers.blockCustomer')
})

const blockModalMessage = computed(() => {
  const name = customer.value?.name || t('customers.thisCustomer')
  return customer.value?.isBlocked
    ? t('customers.unblockConfirm', { name })
    : t('customers.blockConfirm', { name })
})

// Fetch customer
async function fetchCustomer() {
  loading.value = true
  try {
    const { data, error } = await api.get<Customer>(`${API_ENDPOINTS.CUSTOMERS.BASE}/${customerId.value}`)

    if (error) {
      customer.value = null
      return
    }

    customer.value = data || null

    // Populate edit form
    if (customer.value) {
      editForm.name = customer.value.name || ''
      editForm.phone = customer.value.phone || ''
      editForm.email = customer.value.email || ''
      editForm.address = customer.value.address || ''
      editForm.governorate = customer.value.governorate || ''
      editForm.notes = customer.value.notes || ''
    }
  } catch {
    customer.value = null
  } finally {
    loading.value = false
  }
}

// Fetch orders
async function fetchOrders() {
  loadingOrders.value = true
  try {
    orders.value = await customersComposable.fetchCustomerOrders(customerId.value)
  } finally {
    loadingOrders.value = false
  }
}

// Fetch conversations
async function fetchConversations() {
  loadingConversations.value = true
  try {
    conversations.value = await customersComposable.fetchCustomerConversations(customerId.value)
  } finally {
    loadingConversations.value = false
  }
}

// Save changes
async function saveChanges() {
  if (!customer.value) return

  saving.value = true
  try {
    const result = await customersComposable.updateCustomer(customer.value.id, editForm)
    if (result) {
      customer.value = result
      isEditing.value = false
      toast.success(t('messages.updated'))
    }
  } finally {
    saving.value = false
  }
}

// Toggle block
async function toggleBlock() {
  if (!customer.value) return

  blocking.value = true
  try {
    const { error } = await api.post(
      API_ENDPOINTS.CUSTOMERS.BLOCK(customer.value.id),
      {
        isBlocked: !customer.value.isBlocked,
        blockReason: blockReason.value || undefined
      }
    )

    if (error) {
      toast.error(error.message)
      return
    }

    customer.value.isBlocked = !customer.value.isBlocked
    customer.value.blockReason = blockReason.value || undefined

    toast.success(
      customer.value.isBlocked
        ? t('customers.customerBlocked')
        : t('customers.customerUnblocked')
    )
    showBlockModal.value = false
    blockReason.value = ''
  } finally {
    blocking.value = false
  }
}

// Initial fetch
onMounted(() => {
  fetchCustomer()
  fetchOrders()
  fetchConversations()
})
</script>
