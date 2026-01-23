// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: false },

  future: {
    compatibilityVersion: 4
  },

  devServer: {
    port: 3000
  },

  vite: {
    server: {
      hmr: {
        overlay: false
      }
    }
  },

  app: {
    head: {
      title: 'MetaAIBot Admin',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'MetaAIBot Admin Dashboard' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap'
        }
      ]
    }
  },

  css: [
    '~/assets/css/main.css',
    '~/assets/css/rtl.css'
  ],

  modules: [
    '@pinia/nuxt',
    '@nuxtjs/i18n',
    '@nuxtjs/tailwindcss'
  ],

  components: [
    { path: '~/components/ui', pathPrefix: false, global: true },
    { path: '~/components/form', pathPrefix: false, global: true },
    { path: '~/components/layout', pathPrefix: false, global: true },
    { path: '~/components/data', pathPrefix: false, global: true },
    { path: '~/components/charts', pathPrefix: false, global: true },
    { path: '~/components/dashboard', pathPrefix: false, global: true },
    { path: '~/components/conversations', pathPrefix: false, global: true },
    { path: '~/components/orders', pathPrefix: false, global: true },
    { path: '~/components/products', pathPrefix: false, global: true },
    { path: '~/components/customers', pathPrefix: false, global: true },
    { path: '~/components/settings', pathPrefix: false, global: true },
    '~/components'
  ],

  imports: {
    dirs: [
      'composables',
      'composables/**',
      'utils',
      'stores'
    ]
  },

  i18n: {
    locales: [
      { code: 'ar', name: 'العربية', dir: 'rtl', file: 'ar.json' },
      { code: 'en', name: 'English', dir: 'ltr', file: 'en.json' }
    ],
    defaultLocale: 'ar',
    lazy: true,
    langDir: '../locales',
    strategy: 'no_prefix',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_locale',
      fallbackLocale: 'ar'
    },
    bundle: {
      optimizeTranslationDirective: false
    }
  },

  tailwindcss: {
    configPath: 'tailwind.config.ts',
    cssPath: '~/assets/css/main.css'
  },

  ssr: true, // SSR mode with Nuxt server

  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || '/api'
    }
  },

  typescript: {
    strict: true,
    typeCheck: false
  }
})
