<template>
  <div class="min-h-screen flex bg-gray-50 dark:bg-gray-900">
    <!-- Left Side - Branding -->
    <div class="hidden lg:flex lg:w-1/2 bg-primary-600 p-12 flex-col justify-between">
      <div>
        <!-- Logo -->
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
            <span class="text-primary-600 font-bold text-xl">M</span>
          </div>
          <span class="text-white text-2xl font-bold">MetaAIBot</span>
        </div>
      </div>

      <!-- Feature Highlights -->
      <div class="space-y-8">
        <div class="flex items-start gap-4">
          <div class="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center shrink-0">
            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <div>
            <h3 class="text-white font-semibold">Automated Customer Support</h3>
            <p class="text-white/70 text-sm mt-1">
              AI-powered responses for WhatsApp, Messenger, and Instagram
            </p>
          </div>
        </div>

        <div class="flex items-start gap-4">
          <div class="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center shrink-0">
            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
          </div>
          <div>
            <h3 class="text-white font-semibold">Order Management</h3>
            <p class="text-white/70 text-sm mt-1">
              Track and manage orders from conversation to delivery
            </p>
          </div>
        </div>

        <div class="flex items-start gap-4">
          <div class="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center shrink-0">
            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <div>
            <h3 class="text-white font-semibold">Analytics & Insights</h3>
            <p class="text-white/70 text-sm mt-1">
              Real-time dashboard with AI provider monitoring
            </p>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="text-white/50 text-sm">
        &copy; {{ new Date().getFullYear() }} MetaAIBot. All rights reserved.
      </div>
    </div>

    <!-- Right Side - Auth Form -->
    <div class="flex-1 flex items-center justify-center p-8">
      <div class="w-full max-w-md">
        <!-- Mobile Logo -->
        <div class="lg:hidden flex items-center justify-center gap-3 mb-8">
          <div class="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center">
            <span class="text-white font-bold text-xl">M</span>
          </div>
          <span class="text-gray-900 dark:text-white text-2xl font-bold">MetaAIBot</span>
        </div>

        <!-- Theme Toggle -->
        <div class="absolute top-4 end-4">
          <ThemeToggle />
        </div>

        <!-- Page Content -->
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Auth layout
</script>
