export default defineNuxtPlugin((nuxtApp) => {
  // Scroll to top on route change
  nuxtApp.hook('page:finish', () => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  })
})
