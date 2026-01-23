<template>
  <Teleport to="body">
    <div class="fixed top-4 end-4 z-50 flex flex-col gap-2 pointer-events-none">
      <TransitionGroup name="toast">
        <div
          v-for="toast in toasts"
          :key="toast.id"
          :class="['toast pointer-events-auto', variantClasses[toast.type]]"
        >
          <!-- Icon -->
          <div class="shrink-0">
            <component :is="icons[toast.type]" class="w-5 h-5" />
          </div>

          <!-- Content -->
          <div class="flex-1">
            <p v-if="toast.title" class="font-medium text-gray-900 dark:text-white">
              {{ toast.title }}
            </p>
            <p :class="['text-sm', toast.title ? 'text-gray-500 dark:text-gray-400' : 'text-gray-700 dark:text-gray-300']">
              {{ toast.message }}
            </p>
          </div>

          <!-- Close -->
          <button
            type="button"
            class="shrink-0 p-1 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            @click="removeToast(toast.id)"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { h } from 'vue'

// Use the global toast state
const { toasts, remove } = useToast()

const variantClasses: Record<string, string> = {
  success: 'toast-success',
  error: 'toast-error',
  warning: 'toast-warning',
  info: 'toast-info'
}

const icons = {
  success: h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24', class: 'text-success-500' }, [
    h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' })
  ]),
  error: h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24', class: 'text-danger-500' }, [
    h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z' })
  ]),
  warning: h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24', class: 'text-warning-500' }, [
    h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z' })
  ]),
  info: h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24', class: 'text-primary-500' }, [
    h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' })
  ])
}

const removeToast = (id: string) => {
  remove(id)
}
</script>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

[dir="rtl"] .toast-enter-from,
[dir="rtl"] .toast-leave-to {
  transform: translateX(-100%);
}

.toast-move {
  transition: transform 0.3s ease;
}
</style>
