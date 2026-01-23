// Global toast state management
export interface Toast {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  message: string
  title?: string
  duration: number
}

const toasts = ref<Toast[]>([])
let toastId = 0

export function useToast() {
  const add = (toast: Omit<Toast, 'id'>): string => {
    const id = `toast-${++toastId}`
    const newToast: Toast = {
      ...toast,
      id,
      duration: toast.duration || 5000
    }

    toasts.value.push(newToast)

    // Auto remove after duration
    if (newToast.duration > 0) {
      setTimeout(() => {
        remove(id)
      }, newToast.duration)
    }

    return id
  }

  const remove = (id: string) => {
    const index = toasts.value.findIndex(t => t.id === id)
    if (index > -1) {
      toasts.value.splice(index, 1)
    }
  }

  const success = (message: string, title?: string, duration?: number) => {
    return add({ type: 'success', message, title, duration: duration || 5000 })
  }

  const error = (message: string, title?: string, duration?: number) => {
    return add({ type: 'error', message, title, duration: duration || 7000 })
  }

  const warning = (message: string, title?: string, duration?: number) => {
    return add({ type: 'warning', message, title, duration: duration || 6000 })
  }

  const info = (message: string, title?: string, duration?: number) => {
    return add({ type: 'info', message, title, duration: duration || 5000 })
  }

  const clear = () => {
    toasts.value = []
  }

  return {
    toasts: readonly(toasts),
    add,
    remove,
    success,
    error,
    warning,
    info,
    clear
  }
}
