<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4">
    <div class="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow p-8">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-6">Privacy Policy</h1>

      <div class="prose dark:prose-invert max-w-none">
        <p class="text-gray-600 dark:text-gray-300 mb-4">
          Last updated: January 2026
        </p>

        <h2 class="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">1. Information We Collect</h2>
        <p class="text-gray-600 dark:text-gray-300 mb-4">
          When you connect your Facebook or Instagram account, we collect:
        </p>
        <ul class="list-disc list-inside text-gray-600 dark:text-gray-300 mb-4">
          <li>Your public profile information (name, profile picture)</li>
          <li>Page access tokens for messaging</li>
          <li>Messages sent through connected platforms</li>
        </ul>

        <h2 class="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">2. How We Use Your Information</h2>
        <p class="text-gray-600 dark:text-gray-300 mb-4">
          We use the collected information to:
        </p>
        <ul class="list-disc list-inside text-gray-600 dark:text-gray-300 mb-4">
          <li>Enable automated responses to customer messages</li>
          <li>Manage conversations across platforms</li>
          <li>Provide customer support features</li>
        </ul>

        <h2 class="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">3. Data Storage</h2>
        <p class="text-gray-600 dark:text-gray-300 mb-4">
          Your data is stored securely on our servers. We do not sell or share your personal information with third parties.
        </p>

        <h2 class="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">4. Data Deletion</h2>
        <p class="text-gray-600 dark:text-gray-300 mb-4">
          You can disconnect your accounts at any time from the Settings page. Upon disconnection, we will delete your access tokens and associated data.
        </p>

        <h2 class="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">5. Contact Us</h2>
        <p class="text-gray-600 dark:text-gray-300 mb-4">
          If you have any questions about this Privacy Policy, please contact us.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: false
})
</script>
