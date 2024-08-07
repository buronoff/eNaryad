export default {
  // Disable server-side rendering: https://go.nuxtjs.dev/ssr-mode
  ssr: false,

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'Экспорт паспортов БВР',
    htmlAttrs: {
      lang: 'ru',
      translate:  'no'

    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
      'primeflex/primeflex.css',
      '@/static/main_style.css'
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    { src: '~/plugins/primevue_plugins.js', mode: 'client' }
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // Doc: https://www.primefaces.org/primevue/showcase-v2/#/setup
    ['primevue/nuxt',  {
      theme: 'saga-green'
    }],
    '@nuxtjs/auth',
    '@nuxtjs/axios'
  ],

  auth: {

    strategies: {

      local: {
        endpoints: {
          login: { url: '/api/auth/login/', method: 'post', propertyName: 'token'},
          logout: { url: '/api/auth/logout/', method: 'post' },
          user: { url: '/api/auth/user', method: 'get', propertyName: false },
        },
        tokenRequired: true,
        tokenType: 'bearer',
       }
    }
  },

  serverMiddleware: [
    {path:'/api', handler: '~/api'}
  ],

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    // https://github.com/primefaces/primevue/issues/844
    transpile: ['primevue']
  }

}
