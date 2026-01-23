export function useLocalStorage<T>(key: string, defaultValue: T) {
  const storedValue = ref<T>(defaultValue) as Ref<T>

  // Initialize from localStorage
  if (import.meta.client) {
    try {
      const item = localStorage.getItem(key)
      if (item !== null) {
        storedValue.value = JSON.parse(item)
      }
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error)
    }
  }

  // Watch for changes and sync to localStorage
  watch(
    storedValue,
    (newValue) => {
      if (import.meta.client) {
        try {
          if (newValue === null || newValue === undefined) {
            localStorage.removeItem(key)
          } else {
            localStorage.setItem(key, JSON.stringify(newValue))
          }
        } catch (error) {
          console.warn(`Error setting localStorage key "${key}":`, error)
        }
      }
    },
    { deep: true }
  )

  // Listen for storage events from other tabs
  if (import.meta.client) {
    window.addEventListener('storage', (event) => {
      if (event.key === key) {
        try {
          storedValue.value = event.newValue ? JSON.parse(event.newValue) : defaultValue
        } catch (error) {
          console.warn(`Error parsing storage event for key "${key}":`, error)
        }
      }
    })
  }

  function remove() {
    storedValue.value = defaultValue
    if (import.meta.client) {
      localStorage.removeItem(key)
    }
  }

  return {
    value: storedValue,
    remove
  }
}

// Simple string storage
export function useLocalStorageString(key: string, defaultValue: string = '') {
  const storedValue = ref(defaultValue)

  if (import.meta.client) {
    const item = localStorage.getItem(key)
    if (item !== null) {
      storedValue.value = item
    }
  }

  watch(storedValue, (newValue) => {
    if (import.meta.client) {
      if (newValue === null || newValue === '') {
        localStorage.removeItem(key)
      } else {
        localStorage.setItem(key, newValue)
      }
    }
  })

  return storedValue
}
