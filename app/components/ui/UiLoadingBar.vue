<template>
  <Transition name="loading-bar">
    <div v-if="isLoading" class="loading-bar">
      <div class="loading-bar-progress" :style="{ width: `${progress}%` }" />
    </div>
  </Transition>
</template>

<script setup lang="ts">
const nuxtApp = useNuxtApp()
const isLoading = ref(false)
const progress = ref(0)
let timer: ReturnType<typeof setInterval> | null = null

const startLoading = () => {
  isLoading.value = true
  progress.value = 0

  timer = setInterval(() => {
    if (progress.value < 90) {
      progress.value += Math.random() * 10
    }
  }, 200)
}

const finishLoading = () => {
  if (timer) {
    clearInterval(timer)
    timer = null
  }
  progress.value = 100

  setTimeout(() => {
    isLoading.value = false
    progress.value = 0
  }, 300)
}

nuxtApp.hook('page:start', startLoading)
nuxtApp.hook('page:finish', finishLoading)

onUnmounted(() => {
  if (timer) clearInterval(timer)
})
</script>

<style scoped>
.loading-bar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  z-index: 99999;
  background: transparent;
}

.loading-bar-progress {
  height: 100%;
  background: linear-gradient(90deg, #3b82f6, #8b5cf6);
  transition: width 0.2s ease;
  box-shadow: 0 0 10px rgba(59, 130, 246, 0.5);
}

.loading-bar-enter-active,
.loading-bar-leave-active {
  transition: opacity 0.3s ease;
}

.loading-bar-enter-from,
.loading-bar-leave-to {
  opacity: 0;
}
</style>
