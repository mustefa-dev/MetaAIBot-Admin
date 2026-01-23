<template>
  <UiConfirmDialog
    v-model="confirmState.isOpen"
    :title="confirmState.options.title"
    :message="confirmState.options.message"
    :variant="confirmState.options.variant"
    :confirm-text="confirmState.options.confirmText"
    :cancel-text="confirmState.options.cancelText"
    @confirm="handleConfirm"
    @cancel="handleCancel"
  />
</template>

<script setup lang="ts">
const { state: confirmState, handleConfirm, handleCancel } = useConfirm()
</script>
