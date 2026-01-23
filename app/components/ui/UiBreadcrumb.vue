<template>
  <nav aria-label="Breadcrumb">
    <ol class="flex items-center gap-2 text-sm">
      <li v-for="(item, index) in items" :key="index" class="flex items-center gap-2">
        <!-- Separator -->
        <svg
          v-if="index > 0"
          class="w-4 h-4 text-gray-400 rtl:rotate-180"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>

        <!-- Link or Text -->
        <NuxtLink
          v-if="item.to && index < items.length - 1"
          :to="item.to"
          class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-colors"
        >
          <component v-if="item.icon" :is="item.icon" class="w-4 h-4" />
          <span v-else>{{ item.label }}</span>
        </NuxtLink>

        <span
          v-else
          :class="[
            index === items.length - 1
              ? 'text-gray-900 dark:text-white font-medium'
              : 'text-gray-500 dark:text-gray-400'
          ]"
        >
          <component v-if="item.icon" :is="item.icon" class="w-4 h-4" />
          <span v-else>{{ item.label }}</span>
        </span>
      </li>
    </ol>
  </nav>
</template>

<script setup lang="ts">
import type { Component } from 'vue'

interface BreadcrumbItem {
  label: string
  to?: string
  icon?: Component
}

interface Props {
  items: BreadcrumbItem[]
}

defineProps<Props>()
</script>
