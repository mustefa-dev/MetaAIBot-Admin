import type { Governorate, ShippingCalculation } from '~/types/shipping'
import { API_ENDPOINTS } from '~/utils/constants'

export function useShipping() {
  const api = useApi()
  const toast = useAppToast()
  const { t } = useI18n()

  // Governorates
  const governorates = ref<Governorate[]>([])
  const isLoadingGovernorates = ref(false)

  // Fetch all governorates
  async function fetchGovernorates() {
    isLoadingGovernorates.value = true

    const { data, error } = await api.get<Governorate[]>(API_ENDPOINTS.SHIPPING.GOVERNORATES)

    if (error) {
      toast.error(error.message)
      isLoadingGovernorates.value = false
      return []
    }

    governorates.value = data || []
    isLoadingGovernorates.value = false
    return governorates.value
  }

  // Calculate shipping cost
  async function calculateShipping(
    governorateId: string,
    weight?: number,
    subtotal?: number
  ): Promise<ShippingCalculation | null> {
    const { data, error } = await api.post<ShippingCalculation>(
      API_ENDPOINTS.SHIPPING.CALCULATE,
      { governorateId, weight, subtotal }
    )

    if (error) {
      toast.error(error.message)
      return null
    }

    return data || null
  }

  // Update governorate shipping settings
  async function updateGovernorate(id: string, data: Partial<Governorate>): Promise<boolean> {
    const { error } = await api.put(`${API_ENDPOINTS.SHIPPING.GOVERNORATES}/${id}`, data)

    if (error) {
      toast.error(error.message)
      return false
    }

    const index = governorates.value.findIndex(g => g.id === id)
    if (index !== -1) {
      governorates.value[index] = { ...governorates.value[index], ...data }
    }

    toast.updated()
    return true
  }

  // Toggle governorate availability
  async function toggleGovernorateAvailability(id: string): Promise<boolean> {
    const governorate = governorates.value.find(g => g.id === id)
    if (!governorate) return false

    return updateGovernorate(id, { isActive: !governorate.isActive })
  }

  // Bulk update shipping prices
  async function bulkUpdatePrices(updates: Array<{ id: string; price: number }>): Promise<boolean> {
    const { error } = await api.post(`${API_ENDPOINTS.SHIPPING.GOVERNORATES}/bulk-update`, { updates })

    if (error) {
      toast.error(error.message)
      return false
    }

    // Update local state
    updates.forEach(update => {
      const index = governorates.value.findIndex(g => g.id === update.id)
      if (index !== -1) {
        governorates.value[index].shippingPrice = update.price
      }
    })

    toast.success(t('shipping.pricesUpdated'))
    return true
  }

  // Get governorate by ID
  function getGovernorate(id: string): Governorate | undefined {
    return governorates.value.find(g => g.id === id)
  }

  // Get active governorates for select
  const activeGovernorates = computed(() =>
    governorates.value.filter(g => g.isActive)
  )

  return {
    // State
    governorates,
    isLoadingGovernorates,
    activeGovernorates,

    // Actions
    fetchGovernorates,
    calculateShipping,
    updateGovernorate,
    toggleGovernorateAvailability,
    bulkUpdatePrices,
    getGovernorate
  }
}
