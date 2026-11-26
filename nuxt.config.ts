const siteUrl = process.env.NUXT_PUBLIC_APP_URL || process.env.URL || process.env.DEPLOY_PRIME_URL || 'http://localhost:3001'

export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      firebaseApiKey: '',
      firebaseAuthDomain: '',
      firebaseProjectId: '',
      firebaseStorageBucket: '',
      firebaseMessagingSenderId: '',
      firebaseAppId: ''
    }
  },
  compatibilityDate: '2026-11-25',
  devtools: { enabled: true },
  vite: {
    server: {
      host: '0.0.0.0',
      allowedHosts: true
    }
  },
  ssr: false,
  css: ['~/assets/main.css'],
  app: {
    head: {
      htmlAttrs: { lang: 'id' },
      title: 'The Wedding of Tius & Hania',
      meta: [
        { name: 'description', content: 'Undangan pernikahan Tius & Hania — Sabtu, 19 Desember 2026' },
        { property: 'og:title', content: 'The Wedding of Tius & Hania' },
        { property: 'og:description', content: 'Dengan penuh suka cita, kami mengundang Anda untuk merayakan hari bahagia kami.' },
        { property: 'og:image', content: new URL('/images/hero.jpeg', siteUrl).toString() },
        { property: 'og:image:type', content: 'image/jpeg' },
        { property: 'og:type', content: 'website' },
        { property: 'og:url', content: new URL('/', siteUrl).toString() },
        { property: 'og:image:alt', content: 'Tius dan Hania' },
        { name: 'twitter:card', content: 'summary_large_image' }
      ],
      link: [{ rel: 'icon', href: '/favicon.ico' }]
    }
  }
})
