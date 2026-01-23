// Keyboard shortcuts composable
type KeyHandler = (event: KeyboardEvent) => void

interface Shortcut {
  key: string
  ctrl?: boolean
  shift?: boolean
  alt?: boolean
  handler: KeyHandler
  description?: string
}

const registeredShortcuts = ref<Map<string, Shortcut>>(new Map())

function getShortcutKey(shortcut: Omit<Shortcut, 'handler' | 'description'>): string {
  const parts: string[] = []
  if (shortcut.ctrl) parts.push('ctrl')
  if (shortcut.shift) parts.push('shift')
  if (shortcut.alt) parts.push('alt')
  parts.push(shortcut.key.toLowerCase())
  return parts.join('+')
}

export function useKeyboardShortcuts() {
  const register = (shortcut: Shortcut) => {
    const key = getShortcutKey(shortcut)
    registeredShortcuts.value.set(key, shortcut)

    return () => {
      registeredShortcuts.value.delete(key)
    }
  }

  const unregister = (shortcut: Omit<Shortcut, 'handler'>) => {
    const key = getShortcutKey(shortcut)
    registeredShortcuts.value.delete(key)
  }

  return {
    register,
    unregister,
    shortcuts: readonly(registeredShortcuts)
  }
}

// Global keyboard listener - set up once
export function setupKeyboardShortcuts() {
  if (import.meta.server) return

  const handleKeydown = (event: KeyboardEvent) => {
    // Don't trigger shortcuts when typing in inputs
    const target = event.target as HTMLElement
    if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
      // Still allow Escape
      if (event.key !== 'Escape') return
    }

    const key = getShortcutKey({
      key: event.key,
      ctrl: event.ctrlKey || event.metaKey,
      shift: event.shiftKey,
      alt: event.altKey
    })

    const shortcut = registeredShortcuts.value.get(key)
    if (shortcut) {
      event.preventDefault()
      shortcut.handler(event)
    }
  }

  window.addEventListener('keydown', handleKeydown)

  return () => {
    window.removeEventListener('keydown', handleKeydown)
  }
}
