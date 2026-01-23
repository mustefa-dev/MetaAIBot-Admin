<template>
  <div class="relative inline-block" @mouseenter="show" @mouseleave="hide">
    <!-- Trigger -->
    <slot />

    <!-- Tooltip -->
    <Transition name="tooltip">
      <div
        v-if="isVisible && text"
        :class="tooltipClasses"
        role="tooltip"
      >
        {{ text }}
        <div :class="arrowClasses" />
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
interface Props {
  text?: string
  position?: 'top' | 'bottom' | 'left' | 'right'
  delay?: number
}

const props = withDefaults(defineProps<Props>(), {
  position: 'top',
  delay: 200
})

const isVisible = ref(false)
let timeout: ReturnType<typeof setTimeout>

const positionClasses: Record<string, string> = {
  top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
  bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
  left: 'right-full top-1/2 -translate-y-1/2 me-2',
  right: 'left-full top-1/2 -translate-y-1/2 ms-2'
}

const arrowPositionClasses: Record<string, string> = {
  top: 'top-full left-1/2 -translate-x-1/2 border-t-gray-900 dark:border-t-gray-700 border-x-transparent border-b-transparent',
  bottom: 'bottom-full left-1/2 -translate-x-1/2 border-b-gray-900 dark:border-b-gray-700 border-x-transparent border-t-transparent',
  left: 'left-full top-1/2 -translate-y-1/2 border-l-gray-900 dark:border-l-gray-700 border-y-transparent border-r-transparent',
  right: 'right-full top-1/2 -translate-y-1/2 border-r-gray-900 dark:border-r-gray-700 border-y-transparent border-l-transparent'
}

const tooltipClasses = computed(() => [
  'absolute z-50 px-2 py-1 text-xs font-medium text-white bg-gray-900 rounded whitespace-nowrap',
  'dark:bg-gray-700',
  positionClasses[props.position]
])

const arrowClasses = computed(() => [
  'absolute w-0 h-0 border-4',
  arrowPositionClasses[props.position]
])

const show = () => {
  timeout = setTimeout(() => {
    isVisible.value = true
  }, props.delay)
}

const hide = () => {
  clearTimeout(timeout)
  isVisible.value = false
}
</script>

<style scoped>
.tooltip-enter-active,
.tooltip-leave-active {
  transition: all 0.15s ease;
}

.tooltip-enter-from,
.tooltip-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(4px);
}
</style>
