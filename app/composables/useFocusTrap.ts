// Focus trap composable for modals and dialogs
export function useFocusTrap(containerRef: Ref<HTMLElement | null>) {
  const focusableSelectors = [
    'button:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    'a[href]',
    '[tabindex]:not([tabindex="-1"])'
  ].join(', ')

  let previousActiveElement: Element | null = null

  const getFocusableElements = (): HTMLElement[] => {
    if (!containerRef.value) return []
    return Array.from(containerRef.value.querySelectorAll(focusableSelectors))
  }

  const handleKeydown = (e: KeyboardEvent) => {
    if (e.key !== 'Tab') return

    const focusableElements = getFocusableElements()
    if (focusableElements.length === 0) return

    const firstElement = focusableElements[0]
    const lastElement = focusableElements[focusableElements.length - 1]

    if (e.shiftKey) {
      // Shift + Tab
      if (document.activeElement === firstElement) {
        e.preventDefault()
        lastElement.focus()
      }
    } else {
      // Tab
      if (document.activeElement === lastElement) {
        e.preventDefault()
        firstElement.focus()
      }
    }
  }

  const activate = () => {
    previousActiveElement = document.activeElement
    document.addEventListener('keydown', handleKeydown)

    // Focus first focusable element
    nextTick(() => {
      const focusableElements = getFocusableElements()
      if (focusableElements.length > 0) {
        focusableElements[0].focus()
      }
    })
  }

  const deactivate = () => {
    document.removeEventListener('keydown', handleKeydown)

    // Restore focus to previous element
    if (previousActiveElement instanceof HTMLElement) {
      previousActiveElement.focus()
    }
  }

  onUnmounted(() => {
    deactivate()
  })

  return {
    activate,
    deactivate
  }
}
