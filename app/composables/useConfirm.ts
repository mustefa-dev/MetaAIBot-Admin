// Programmatic confirm dialog
interface ConfirmOptions {
  title?: string
  message: string
  variant?: 'danger' | 'warning' | 'info'
  confirmText?: string
  cancelText?: string
}

interface ConfirmState {
  isOpen: boolean
  options: ConfirmOptions
  resolve: ((value: boolean) => void) | null
}

const state = reactive<ConfirmState>({
  isOpen: false,
  options: {
    message: ''
  },
  resolve: null
})

export function useConfirm() {
  const { t } = useI18n()

  const confirm = (options: ConfirmOptions): Promise<boolean> => {
    return new Promise((resolve) => {
      state.options = {
        title: options.title || t('common.confirm'),
        message: options.message,
        variant: options.variant || 'danger',
        confirmText: options.confirmText || t('common.confirm'),
        cancelText: options.cancelText || t('common.cancel')
      }
      state.resolve = resolve
      state.isOpen = true
    })
  }

  const confirmDelete = (itemName?: string): Promise<boolean> => {
    const message = itemName
      ? t('messages.confirmDeleteItem', { item: itemName })
      : t('messages.confirmDelete')

    return confirm({
      title: t('common.confirmDelete'),
      message,
      variant: 'danger',
      confirmText: t('common.delete')
    })
  }

  const handleConfirm = () => {
    if (state.resolve) {
      state.resolve(true)
      state.resolve = null
    }
    state.isOpen = false
  }

  const handleCancel = () => {
    if (state.resolve) {
      state.resolve(false)
      state.resolve = null
    }
    state.isOpen = false
  }

  return {
    // State (for the dialog component)
    state: readonly(state),

    // Methods
    confirm,
    confirmDelete,
    handleConfirm,
    handleCancel
  }
}
