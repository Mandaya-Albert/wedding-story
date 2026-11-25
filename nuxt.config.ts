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
  // vite: {
  //   server: {
  //     host: '0.0.0.0',
  //     allowedHosts: true
  //   }
  // },
  ssr: false,
  css: ['~/assets/main.css'],
  app: {
    head: {
      htmlAttrs: { lang: 'id' },
      meta: [
        { name: 'description', content: 'Undangan pernikahan Tius & Hania — Sabtu, 19 Desember 2026' },
        { property: 'og:title', content: 'The Wedding of Tius & Hania' },
        { property: 'og:description', content: 'Dengan penuh suka cita, kami mengundang Anda untuk merayakan hari bahagia kami.' },
        { property: 'og:image', content: `${process.env.APP_URL}/images/hero.jpeg` },
        { property: 'og:type', content: 'website' }
      ],
      link: [{ rel: 'icon', href: '/favicon.ico' }]
    }
  }
})
