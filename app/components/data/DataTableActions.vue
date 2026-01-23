<template>
  <div class="flex items-center justify-end gap-1">
    <!-- View -->
    <UiTooltip v-if="showView" :text="$t('common.view')">
      <button
        type="button"
        class="p-2 text-gray-500 hover:text-primary-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
        @click="$emit('view')"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
      </button>
    </UiTooltip>

    <!-- Edit -->
    <UiTooltip v-if="showEdit" :text="$t('common.edit')">
      <button
        type="button"
        class="p-2 text-gray-500 hover:text-primary-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
        @click="$emit('edit')"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      </button>
    </UiTooltip>

    <!-- Delete -->
    <UiTooltip v-if="showDelete" :text="$t('common.delete')">
      <button
        type="button"
        class="p-2 text-gray-500 hover:text-danger-600 hover:bg-danger-50 dark:hover:bg-danger-900/20 rounded-lg transition-colors"
        @click="$emit('delete')"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>
    </UiTooltip>

    <!-- More Actions Dropdown -->
    <slot />
  </div>
</template>

<script setup lang="ts">
interface Props {
  showView?: boolean
  showEdit?: boolean
  showDelete?: boolean
}

withDefaults(defineProps<Props>(), {
  showView: false,
  showEdit: true,
  showDelete: true
})

defineEmits<{
  view: []
  edit: []
  delete: []
}>()
</script>
