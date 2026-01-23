export default defineNuxtPlugin(() => {
  const localeStore = useLocaleStore()

  // Initialize locale from localStorage
  localeStore.initLocale()
})
