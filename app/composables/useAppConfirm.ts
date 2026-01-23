export interface ConfirmOptions {
  title?: string
  message: string
  confirmText?: string
  cancelText?: string
  variant?: 'danger' | 'warning' | 'info'
  icon?: string
}

export function useAppConfirm() {
  const confirmRef = inject<Ref<any>>('confirm')
  const { t } = useI18n()

  function confirm(options: ConfirmOptions): Promise<boolean> {
    if (confirmRef?.value) {
      return confirmRef.value.show(options)
    }

    // Fallback to native confirm
    return Promise.resolve(window.confirm(options.message))
  }

  function confirmDelete(itemName?: string): Promise<boolean> {
    return confirm({
      title: t('common.confirmDelete'),
      message: itemName
        ? t('messages.confirmDeleteItem', { item: itemName })
        : t('messages.confirmDelete'),
      confirmText: t('common.delete'),
      cancelText: t('common.cancel'),
      variant: 'danger'
    })
  }

  function confirmAction(action: string, message?: string): Promise<boolean> {
    return confirm({
      title: t('common.confirm'),
      message: message || t('messages.confirmAction', { action }),
      confirmText: t('common.confirm'),
      cancelText: t('common.cancel'),
      variant: 'warning'
    })
  }

  function confirmLogout(): Promise<boolean> {
    return confirm({
      title: t('auth.logout'),
      message: t('messages.confirmLogout'),
      confirmText: t('auth.logout'),
      cancelText: t('common.cancel'),
      variant: 'warning'
    })
  }

  function confirmDiscard(): Promise<boolean> {
    return confirm({
      title: t('common.unsavedChanges'),
      message: t('messages.confirmDiscard'),
      confirmText: t('common.discard'),
      cancelText: t('common.keepEditing'),
      variant: 'warning'
    })
  }

  return {
    confirm,
    confirmDelete,
    confirmAction,
    confirmLogout,
    confirmDiscard
  }
}
