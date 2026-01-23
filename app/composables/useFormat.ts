import { formatCurrency, formatDate, formatRelativeTime, formatPhoneNumber, truncate as truncateHelper } from '~/utils/helpers'
import type { OrderStatus } from '~/types/order'
import type { MessagePlatform, CustomerIntent, ConversationStatus } from '~/types/conversation'
import type { ProductStatus } from '~/types/product'

export function useFormat() {
  const { locale, t } = useI18n()

  // Currency formatting
  function currency(amount: number | undefined | null): string {
    if (amount === undefined || amount === null) return '-'
    // formatCurrency expects (value, currencyCode, locale)
    // Use IQD as default currency, and map locale to proper locale string
    const localeString = locale.value === 'ar' ? 'ar-IQ' : 'en-US'
    return formatCurrency(amount, 'IQD', localeString)
  }

  // Date formatting
  function date(dateValue: string | Date | undefined | null, format: 'short' | 'long' | 'datetime' = 'short'): string {
    if (!dateValue) return '-'
    const localeString = locale.value === 'ar' ? 'ar-IQ' : 'en-US'
    const options: Intl.DateTimeFormatOptions = format === 'datetime'
      ? { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }
      : format === 'long'
        ? { year: 'numeric', month: 'long', day: 'numeric' }
        : { year: 'numeric', month: 'short', day: 'numeric' }
    return formatDate(dateValue, options, localeString)
  }

  // Relative time (e.g., "2 hours ago")
  function relativeTime(dateValue: string | Date | undefined | null): string {
    if (!dateValue) return '-'
    return formatRelativeTime(dateValue, locale.value)
  }

  // Phone number formatting
  function phone(phoneNumber: string | undefined | null): string {
    if (!phoneNumber) return '-'
    return formatPhoneNumber(phoneNumber)
  }

  // Text truncation
  function truncate(text: string | undefined | null, maxLength: number = 50): string {
    if (!text) return '-'
    return truncateHelper(text, maxLength)
  }

  // Order status with translation
  function orderStatus(status: OrderStatus | undefined | null): string {
    if (!status) return '-'
    return t(`orders.statuses.${status}`)
  }

  // Order status color
  function orderStatusColor(status: OrderStatus | undefined | null): string {
    const colors: Record<OrderStatus, string> = {
      'Pending': 'warning',
      'Confirmed': 'info',
      'Processing': 'info',
      'Shipped': 'primary',
      'Delivered': 'success',
      'Cancelled': 'danger',
      'Returned': 'secondary'
    }
    return status ? colors[status] || 'secondary' : 'secondary'
  }

  // Platform with translation
  function platform(p: MessagePlatform | undefined | null): string {
    if (!p) return '-'
    return t(`platforms.${p}`)
  }

  // Platform icon
  function platformIcon(p: MessagePlatform | undefined | null): string {
    const icons: Record<MessagePlatform, string> = {
      'WhatsApp': 'whatsapp',
      'Messenger': 'messenger',
      'Instagram': 'instagram'
    }
    return p ? icons[p] || 'message' : 'message'
  }

  // Platform color
  function platformColor(p: MessagePlatform | undefined | null): string {
    const colors: Record<MessagePlatform, string> = {
      'WhatsApp': 'success',
      'Messenger': 'primary',
      'Instagram': 'danger'
    }
    return p ? colors[p] || 'secondary' : 'secondary'
  }

  // Conversation status with translation
  function conversationStatus(status: ConversationStatus | undefined | null): string {
    if (!status) return '-'
    return t(`conversations.statuses.${status}`)
  }

  // Conversation status color
  function conversationStatusColor(status: ConversationStatus | undefined | null): string {
    const colors: Record<ConversationStatus, string> = {
      'Active': 'success',
      'PendingHandoff': 'warning',
      'Resolved': 'info',
      'Closed': 'secondary'
    }
    return status ? colors[status] || 'secondary' : 'secondary'
  }

  // Intent with translation
  function intent(i: CustomerIntent | undefined | null): string {
    if (!i) return '-'
    return t(`intents.${i}`)
  }

  // Intent color
  function intentColor(i: CustomerIntent | undefined | null): string {
    const colors: Record<string, string> = {
      'Greeting': 'info',
      'PriceInquiry': 'warning',
      'Availability': 'primary',
      'WantToOrder': 'success',
      'Shipping': 'info',
      'TrackOrder': 'info',
      'ProvideInfo': 'primary',
      'Complaint': 'danger',
      'Return': 'warning',
      'HumanHandoff': 'danger',
      'ThankYou': 'success',
      'Goodbye': 'secondary',
      'ProductInfo': 'primary',
      'Sizes': 'info',
      'Colors': 'info',
      'Discount': 'warning',
      'PaymentMethods': 'info',
      'Unknown': 'secondary'
    }
    return i ? colors[i] || 'secondary' : 'secondary'
  }

  // Product status with translation
  function productStatus(status: ProductStatus | undefined | null): string {
    if (!status) return '-'
    return t(`products.statuses.${status}`)
  }

  // Product status color
  function productStatusColor(status: ProductStatus | undefined | null): string {
    const colors: Record<ProductStatus, string> = {
      'Active': 'success',
      'Draft': 'warning',
      'Archived': 'secondary'
    }
    return status ? colors[status] || 'secondary' : 'secondary'
  }

  // Number formatting
  function number(value: number | undefined | null, decimals: number = 0): string {
    if (value === undefined || value === null) return '-'
    return new Intl.NumberFormat(locale.value === 'ar' ? 'ar-IQ' : 'en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    }).format(value)
  }

  // Percentage formatting
  function percentage(value: number | undefined | null, decimals: number = 0): string {
    if (value === undefined || value === null) return '-'
    return new Intl.NumberFormat(locale.value === 'ar' ? 'ar-IQ' : 'en-US', {
      style: 'percent',
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    }).format(value / 100)
  }

  // File size formatting
  function fileSize(bytes: number | undefined | null): string {
    if (bytes === undefined || bytes === null) return '-'
    const units = ['B', 'KB', 'MB', 'GB']
    let unitIndex = 0
    let size = bytes

    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024
      unitIndex++
    }

    return `${size.toFixed(1)} ${units[unitIndex]}`
  }

  // Boolean formatting
  function boolean(value: boolean | undefined | null): string {
    if (value === undefined || value === null) return '-'
    return value ? t('common.yes') : t('common.no')
  }

  return {
    currency,
    date,
    relativeTime,
    phone,
    truncate,
    orderStatus,
    orderStatusColor,
    platform,
    platformIcon,
    platformColor,
    conversationStatus,
    conversationStatusColor,
    intent,
    intentColor,
    productStatus,
    productStatusColor,
    number,
    percentage,
    fileSize,
    boolean
  }
}
