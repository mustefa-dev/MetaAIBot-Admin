<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4">
    <div class="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow p-8">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-6">Data Deletion Request</h1>

      <div class="prose dark:prose-invert max-w-none">
        <p class="text-gray-600 dark:text-gray-300 mb-4">
          Last updated: January 2026
        </p>

        <h2 class="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">How to Delete Your Data</h2>
        <p class="text-gray-600 dark:text-gray-300 mb-4">
          We respect your right to control your personal data. You can request deletion of your data at any time.
        </p>

        <h2 class="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">Option 1: Self-Service Deletion</h2>
        <p class="text-gray-600 dark:text-gray-300 mb-4">
          You can delete your data directly from your account:
        </p>
        <ol class="list-decimal list-inside text-gray-600 dark:text-gray-300 mb-4">
          <li>Log in to your account</li>
          <li>Go to Settings → Connections</li>
          <li>Click "Disconnect" on any connected account</li>
          <li>Your access tokens and associated data will be deleted immediately</li>
        </ol>

        <h2 class="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">Option 2: Request Deletion</h2>
        <p class="text-gray-600 dark:text-gray-300 mb-4">
          If you cannot access your account or need assistance, you can request data deletion by contacting us.
        </p>

        <h2 class="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">What Data We Delete</h2>
        <p class="text-gray-600 dark:text-gray-300 mb-4">
          Upon deletion request, we will remove:
        </p>
        <ul class="list-disc list-inside text-gray-600 dark:text-gray-300 mb-4">
          <li>Your Facebook/Instagram access tokens</li>
          <li>Connected page information</li>
          <li>Message history and conversation data</li>
          <li>Customer interaction records</li>
        </ul>

        <h2 class="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">Processing Time</h2>
        <p class="text-gray-600 dark:text-gray-300 mb-4">
          Data deletion requests are processed within 30 days. You will receive confirmation once your data has been deleted.
        </p>

        <h2 class="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">Facebook Data Deletion</h2>
        <p class="text-gray-600 dark:text-gray-300 mb-4">
          You can also remove our app's access to your Facebook data directly from Facebook:
        </p>
        <ol class="list-decimal list-inside text-gray-600 dark:text-gray-300 mb-4">
          <li>Go to Facebook Settings → Apps and Websites</li>
          <li>Find our app and click "Remove"</li>
          <li>This will revoke our access to your Facebook data</li>
        </ol>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: false
})
</script>
