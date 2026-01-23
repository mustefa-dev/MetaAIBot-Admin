<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="modelValue" class="fixed inset-0 z-50 overflow-y-auto">
        <!-- Backdrop -->
        <div
          class="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
          @click="closeOnBackdrop && close()"
        />

        <!-- Modal Container -->
        <div class="flex min-h-full items-center justify-center p-4">
          <div
            ref="modalRef"
            :class="modalClasses"
            role="dialog"
            aria-modal="true"
            :aria-labelledby="title ? 'modal-title' : undefined"
          >
            <!-- Header -->
            <div v-if="$slots.header || title" class="modal-header">
              <slot name="header">
                <h3 id="modal-title" class="text-lg font-semibold text-gray-900 dark:text-white">
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
            <div class="modal-body">
              <slot />
            </div>

            <!-- Footer -->
            <div v-if="$slots.footer" class="modal-footer">
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
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  showClose?: boolean
  closeOnBackdrop?: boolean
  closeOnEscape?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showClose: true,
  closeOnBackdrop: true,
  closeOnEscape: true,
  size: 'md'
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  close: []
}>()

const sizeClasses: Record<string, string> = {
  sm: 'max-w-sm',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
  full: 'max-w-full mx-4'
}

const modalRef = ref<HTMLElement | null>(null)

const modalClasses = computed(() => [
  'relative w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl',
  'transform transition-all',
  sizeClasses[props.size]
])

const close = () => {
  emit('update:modelValue', false)
  emit('close')
}

// Focus trap
const { activate: activateFocusTrap, deactivate: deactivateFocusTrap } = useFocusTrap(modalRef)

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

// Prevent body scroll when modal is open and manage focus trap
watch(() => props.modelValue, (isOpen) => {
  if (typeof document !== 'undefined') {
    document.body.style.overflow = isOpen ? 'hidden' : ''

    if (isOpen) {
      nextTick(() => activateFocusTrap())
    } else {
      deactivateFocusTrap()
    }
  }
})
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .relative,
.modal-leave-to .relative {
  transform: scale(0.95) translateY(10px);
}
</style>
