<template>
  <Teleport to="body">
    <Transition :name="transitionName">
      <div v-if="modelValue" class="fixed inset-0 z-50 overflow-hidden">
        <!-- Backdrop -->
        <div
          class="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
          @click="closeOnBackdrop && close()"
        />

        <!-- Drawer -->
        <div :class="drawerContainerClasses">
          <div :class="drawerClasses">
            <!-- Header -->
            <div v-if="$slots.header || title" class="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-700">
              <slot name="header">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                  {{ title }}
                </h3>
              </slot>
              <button
                v-if="showClose"
                type="button"
                class="p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:text-gray-300 dark:hover:bg-gray-700 transition-colors"
                @click="close"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <!-- Body -->
            <div class="flex-1 overflow-y-auto p-6">
              <slot />
            </div>

            <!-- Footer -->
            <div v-if="$slots.footer" class="px-6 py-4 border-t border-gray-100 dark:border-gray-700">
              <slot name="footer" />
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
interface Props {
  modelValue: boolean
  title?: string
  position?: 'left' | 'right'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  showClose?: boolean
  closeOnBackdrop?: boolean
  closeOnEscape?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  position: 'right',
  size: 'md',
  showClose: true,
  closeOnBackdrop: true,
  closeOnEscape: true
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  close: []
}>()

const sizeClasses: Record<string, string> = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl'
}

const transitionName = computed(() => `drawer-${props.position}`)

const drawerContainerClasses = computed(() => [
  'fixed inset-y-0 flex',
  props.position === 'left' ? 'start-0' : 'end-0'
])

const drawerClasses = computed(() => [
  'relative flex flex-col w-full bg-white dark:bg-gray-800 shadow-xl',
  sizeClasses[props.size]
])

const close = () => {
  emit('update:modelValue', false)
  emit('close')
}

// Close on Escape key
onMounted(() => {
  const handleEscape = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && props.modelValue && props.closeOnEscape) {
      close()
    }
  }
  document.addEventListener('keydown', handleEscape)
  onUnmounted(() => document.removeEventListener('keydown', handleEscape))
})

// Prevent body scroll when drawer is open
watch(() => props.modelValue, (isOpen) => {
  if (typeof document !== 'undefined') {
    document.body.style.overflow = isOpen ? 'hidden' : ''
  }
})
</script>

<style scoped>
.drawer-right-enter-active,
.drawer-right-leave-active,
.drawer-left-enter-active,
.drawer-left-leave-active {
  transition: all 0.3s ease;
}

.drawer-right-enter-from,
.drawer-right-leave-to {
  transform: translateX(100%);
}

.drawer-left-enter-from,
.drawer-left-leave-to {
  transform: translateX(-100%);
}

[dir="rtl"] .drawer-right-enter-from,
[dir="rtl"] .drawer-right-leave-to {
  transform: translateX(-100%);
}

[dir="rtl"] .drawer-left-enter-from,
[dir="rtl"] .drawer-left-leave-to {
  transform: translateX(100%);
}
</style>
