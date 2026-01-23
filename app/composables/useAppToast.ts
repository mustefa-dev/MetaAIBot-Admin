// App-specific toast wrapper with i18n support
export function useAppToast() {
  const toast = useToast()
  const { t } = useI18n()

  function success(message: string, title?: string) {
    toast.success(message, title || t('common.success'))
  }

  function error(message: string, title?: string) {
    toast.error(message, title || t('common.error'))
  }

  function warning(message: string, title?: string) {
    toast.warning(message, title || t('common.warning'))
  }

  function info(message: string, title?: string) {
    toast.info(message, title || t('common.info'))
  }

  // Common toast messages
  function saved() {
    success(t('messages.saved'))
  }

  function created() {
    success(t('messages.created'))
  }

  function updated() {
    success(t('messages.updated'))
  }

  function deleted() {
    success(t('messages.deleted'))
  }

  function apiError(err: any) {
    const message = err?.message || err?.error?.message || t('errors.unknown')
    error(message)
  }

  function copied() {
    success(t('common.copied'))
  }

  return {
    success,
    error,
    warning,
    info,
    saved,
    created,
    updated,
    deleted,
    apiError,
    copied
  }
}
