<template>
  <div class="relative inline-block" ref="dropdownRef">
    <!-- Trigger -->
    <div @click="toggle">
      <slot name="trigger" :open="isOpen">
        <UiButton variant="secondary">
          {{ label }}
          <template #icon-end>
            <svg
              :class="['w-4 h-4 transition-transform', { 'rotate-180': isOpen }]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </template>
        </UiButton>
      </slot>
    </div>

    <!-- Menu -->
    <Transition name="dropdown">
      <div
        v-if="isOpen"
        :class="menuClasses"
      >
        <div class="py-1">
          <slot :close="close" />
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { onClickOutside } from '@vueuse/core'

interface Props {
  label?: string
  position?: 'left' | 'right'
  width?: 'auto' | 'sm' | 'md' | 'lg'
}

const props = withDefaults(defineProps<Props>(), {
  label: 'Options',
  position: 'right',
  width: 'auto'
})

const isOpen = ref(false)
const dropdownRef = ref<HTMLElement | null>(null)

const widthClasses: Record<string, string> = {
  auto: 'w-auto min-w-[12rem]',
  sm: 'w-40',
  md: 'w-56',
  lg: 'w-72'
}

const menuClasses = computed(() => [
  'absolute z-50 mt-2 rounded-lg bg-white shadow-lg ring-1 ring-black/5',
  'dark:bg-gray-800 dark:ring-white/10',
  widthClasses[props.width],
  props.position === 'left' ? 'start-0' : 'end-0'
])

const toggle = () => {
  isOpen.value = !isOpen.value
}

const close = () => {
  isOpen.value = false
}

// Close on click outside
onClickOutside(dropdownRef, () => {
  if (isOpen.value) close()
})

// Close on Escape
onMounted(() => {
  const handleEscape = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && isOpen.value) {
      close()
    }
  }
  document.addEventListener('keydown', handleEscape)
  onUnmounted(() => document.removeEventListener('keydown', handleEscape))
})
</script>

<style scoped>
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.15s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-4px) scale(0.95);
}
</style>
