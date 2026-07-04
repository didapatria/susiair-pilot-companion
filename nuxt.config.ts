export default defineNuxtConfig({
  compatibilityDate: '2026-07-04',
  devtools: { enabled: false },
  modules: ['@pinia/nuxt', '@nuxt/eslint', '@nuxt/fonts'],
  css: ['~/assets/scss/main.scss'],
  components: [{ path: '~/components', pathPrefix: false }],
  app: {
    pageTransition: { name: 'page', mode: 'out-in' },
    head: {
      title: 'Susi Air Pilot Companion',
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1, viewport-fit=cover' },
        { name: 'theme-color', content: '#0E2138' },
      ],
    },
  },
  fonts: {
    families: [{ name: 'Plus Jakarta Sans', provider: 'google', weights: [400, 500, 600, 700, 800] }],
  },
  typescript: { strict: true },
  vite: {
    css: { preprocessorOptions: { scss: { additionalData: '@use "~/assets/scss/abstracts" as *;' } } },
  },
})
