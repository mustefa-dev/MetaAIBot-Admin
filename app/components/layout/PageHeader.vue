<template>
  <div class="mb-6">
    <!-- Breadcrumb -->
    <UiBreadcrumb v-if="breadcrumbs?.length" :items="breadcrumbs" class="mb-4" />

    <!-- Title Row -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
          {{ title }}
        </h1>
        <p v-if="description" class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {{ description }}
        </p>
      </div>

      <!-- Actions Slot -->
      <div v-if="$slots.actions" class="flex items-center gap-3">
        <slot name="actions" />
      </div>
    </div>

    <!-- Tabs or Filters Slot -->
    <div v-if="$slots.tabs" class="mt-4">
      <slot name="tabs" />
    </div>
  </div>
</template>

<script setup lang="ts">
interface BreadcrumbItem {
  label: string
  to?: string
}

interface Props {
  title: string
  description?: string
  breadcrumbs?: BreadcrumbItem[]
}

defineProps<Props>()
</script>
