// Order Types - Matches backend entities

export type OrderStatus =
  | 'Pending'
  | 'Confirmed'
  | 'Processing'
  | 'Shipped'
  | 'OutForDelivery'
  | 'Delivered'
  | 'Cancelled'
  | 'Returned'

export type PaymentMethod = 'CashOnDelivery' | 'Online'

export type PaymentStatus = 'Pending' | 'Paid' | 'Failed' | 'Refunded'

export interface Order {
  id: string
  orderNumber: string
  customerId: string
  customer?: OrderCustomer
  status: OrderStatus
  items: OrderItem[]
  subTotal: number
  shippingCost: number
  discountAmount: number
  total: number
  currency: string
  shippingGovernorateId?: string
  shippingGovernorate?: string
  shippingAddress: string
  customerPhone: string
  customerNotes?: string
  adminNotes?: string
  paymentMethod: PaymentMethod
  paymentStatus: PaymentStatus
  couponCode?: string
  trackingNumber?: string
  estimatedDelivery?: string
  deliveredAt?: string
  cancelledAt?: string
  cancellationReason?: string
  conversationId?: string
  createdAt: string
  updatedAt: string
}

export interface OrderCustomer {
  id: string
  name?: string
  phone?: string
  platform: string
}

export interface OrderItem {
  id: string
  productId: string
  productCode: string
  productName: string
  productImage?: string
  quantity: number
  unitPrice: number
  totalPrice: number
  variant?: string
  notes?: string
}

export interface CreateOrderRequest {
  customerId?: string
  customerPhone: string
  customerName?: string
  shippingGovernorateId: string
  shippingAddress: string
  items: CreateOrderItemRequest[]
  couponCode?: string
  customerNotes?: string
  adminNotes?: string
  paymentMethod?: PaymentMethod
}

export interface CreateOrderItemRequest {
  productCode: string
  quantity: number
  variant?: string
  notes?: string
}

export interface UpdateOrderRequest {
  status?: OrderStatus
  shippingAddress?: string
  customerPhone?: string
  customerNotes?: string
  adminNotes?: string
  trackingNumber?: string
  estimatedDelivery?: string
}

export interface UpdateOrderStatusRequest {
  status: OrderStatus
  trackingNumber?: string
  cancellationReason?: string
  adminNotes?: string
}

export interface OrderFilter {
  status?: OrderStatus
  paymentStatus?: PaymentStatus
  paymentMethod?: PaymentMethod
  customerId?: string
  governorateId?: string
  search?: string
  startDate?: string
  endDate?: string
  minTotal?: number
  maxTotal?: number
}

export interface OrderCalculation {
  items: OrderCalculationItem[]
  subTotal: number
  shippingCost: number
  discountAmount: number
  total: number
  couponApplied?: string
}

export interface OrderCalculationItem {
  productCode: string
  productName: string
  quantity: number
  unitPrice: number
  totalPrice: number
  available: boolean
}

export interface CalculateOrderRequest {
  items: { productCode: string; quantity: number }[]
  governorateId: string
  couponCode?: string
}

export interface OrderStats {
  totalOrders: number
  pendingOrders: number
  processingOrders: number
  shippedOrders: number
  deliveredOrders: number
  cancelledOrders: number
  totalRevenue: number
  averageOrderValue: number
}
