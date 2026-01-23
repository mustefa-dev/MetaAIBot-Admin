export function useDebounce<T extends (...args: any[]) => any>(
  fn: T,
  delay: number = 300
): { debounced: (...args: Parameters<T>) => void; cancel: () => void } {
  let timeoutId: ReturnType<typeof setTimeout> | null = null

  function debounced(...args: Parameters<T>) {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }

    timeoutId = setTimeout(() => {
      fn(...args)
      timeoutId = null
    }, delay)
  }

  function cancel() {
    if (timeoutId) {
      clearTimeout(timeoutId)
      timeoutId = null
    }
  }

  // Clean up on component unmount
  onUnmounted(() => {
    cancel()
  })

  return { debounced, cancel }
}

// Debounced ref - updates value only after delay
export function useDebouncedRef<T>(initialValue: T, delay: number = 300) {
  const value = ref(initialValue) as Ref<T>
  const debouncedValue = ref(initialValue) as Ref<T>
  let timeoutId: ReturnType<typeof setTimeout> | null = null

  watch(value, (newValue) => {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }

    timeoutId = setTimeout(() => {
      debouncedValue.value = newValue
      timeoutId = null
    }, delay)
  })

  onUnmounted(() => {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }
  })

  return {
    value,
    debouncedValue: readonly(debouncedValue)
  }
}
