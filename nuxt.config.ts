export default defineNuxtConfig({
  compatibilityDate: '2026-07-04',
  devtools: { enabled: false },
  modules: ['@pinia/nuxt', '@nuxt/eslint', '@nuxt/fonts', '@vite-pwa/nuxt'],
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
      link: [
        { rel: 'icon', type: 'image/png', href: '/icons/icon-192.png' },
        { rel: 'apple-touch-icon', href: '/icons/apple-touch-icon.png' },
      ],
    },
  },
  pwa: {
    registerType: 'autoUpdate',
    manifest: {
      name: 'Susi Air Pilot Companion',
      short_name: 'Pilot',
      description: 'Pilot logbook and schedule companion for Susi Air operations.',
      theme_color: '#0E2138',
      background_color: '#F5F6F8',
      display: 'standalone',
      icons: [
        { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png' },
        { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png' },
        { src: 'icons/icon-512-maskable.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
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
