export function useClipboard() {
  const toast = useAppToast()
  const { t } = useI18n()

  const isSupported = computed(() => {
    return import.meta.client && navigator?.clipboard !== undefined
  })

  async function copy(text: string, showToast: boolean = true): Promise<boolean> {
    if (!isSupported.value) {
      // Fallback for older browsers
      try {
        const textArea = document.createElement('textarea')
        textArea.value = text
        textArea.style.position = 'fixed'
        textArea.style.left = '-9999px'
        document.body.appendChild(textArea)
        textArea.select()
        document.execCommand('copy')
        document.body.removeChild(textArea)

        if (showToast) {
          toast.success(t('common.copied'))
        }
        return true
      } catch (err) {
        console.error('Clipboard fallback failed:', err)
        if (showToast) {
          toast.error(t('errors.copyFailed'))
        }
        return false
      }
    }

    try {
      await navigator.clipboard.writeText(text)
      if (showToast) {
        toast.success(t('common.copied'))
      }
      return true
    } catch (err) {
      console.error('Clipboard write failed:', err)
      if (showToast) {
        toast.error(t('errors.copyFailed'))
      }
      return false
    }
  }

  async function read(): Promise<string | null> {
    if (!isSupported.value) {
      return null
    }

    try {
      return await navigator.clipboard.readText()
    } catch (err) {
      console.error('Clipboard read failed:', err)
      return null
    }
  }

  return {
    isSupported,
    copy,
    read
  }
}
