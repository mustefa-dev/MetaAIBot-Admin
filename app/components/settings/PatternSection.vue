<template>
  <div>
    <h4 class="font-medium text-gray-900 dark:text-white mb-3">
      {{ title }}
    </h4>

    <div v-if="!patterns || patterns.length === 0" class="text-sm text-gray-500">
      {{ $t('styleLearning.noPatterns') }}
    </div>

    <div v-else class="flex flex-wrap gap-2">
      <span
        v-for="(item, index) in patterns"
        :key="index"
        class="inline-flex items-center gap-1 px-3 py-1.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm group"
      >
        <span>{{ item.pattern }}</span>
        <button
          @click="emit('remove', patternType, item.pattern)"
          class="opacity-0 group-hover:opacity-100 transition-opacity p-0.5 hover:text-red-500"
        >
          <XMarkIcon class="w-3.5 h-3.5" />
        </button>
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { XMarkIcon } from '@heroicons/vue/24/outline'
import type { PatternItem } from '~/types/settings'

interface Props {
  title: string
  patterns: PatternItem[] | null
  patternType: string
}

defineProps<Props>()

const emit = defineEmits<{
  remove: [type: string, pattern: string]
}>()
</script>
