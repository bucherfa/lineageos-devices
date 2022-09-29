module.exports = {
  // mode
  mode: 'universal',
  target: 'static',
  /*
  ** Headers of the page
  */
  head: {
    title: 'Devices for LineageOS',
    htmlAttrs: {
      lang: 'en'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: process.env.npm_package_description || '' },
      { name: 'msapplication-TileColor', content: '#00aba9' },
      { name: 'msapplication-config', content: '/browserconfig.xml' },
      { name: 'theme-color', content: '#ffffff' }
    ],
    link: [
      { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
      { rel: 'icon', sizes: '32x32', type: 'image/png', href: '/favicon-32x32.png' },
      { rel: 'icon', sizes: '16x16', type: 'image/png', href: '/favicon-16x16.png' },
      { rel: 'manifest', href: '/site.webmanifest' },
      { rel: 'mask-icon', color: '#5bbad5', href: '/safari-pinned-tab.svg' },
      { rel: 'shortcut icon', href: '/favicon.ico' }
    ],
    script: [
      { src: '/count.js', 'data-goatcounter': `https://${process.env.GOAT_COUNTER_CODE}.goatcounter.com/count`, async: true }
    ]
  },
  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#fff' },
  /*
  ** Global CSS
  */
  css: [
    { src: 'ant-design-vue/dist/antd.less', lang: 'less' }
  ],
  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    '@/plugins/antd-ui',
    { src: '@/plugins/inject-ww', ssr: false }
  ],
  /*
  ** Nuxt.js dev-modules
  */
  buildModules: [
    // Doc: https://github.com/nuxt-community/eslint-module
    '@nuxtjs/eslint-module'
  ],
  /*
  ** Nuxt.js modules
  */
  modules: [],
  /*
  ** Build configuration
  */
  build: {
    /*
    ** You can extend webpack config here
    */
    extend (config, { isDev, isClient }) {
      if (isDev && isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
      config.output.globalObject = 'this'

      if (isClient) { // web workers are only available client-side
        config.module.rules.push({
          test: /\.worker\.js$/, // this will pick up all .js files that ends with ".worker.js"
          loader: 'worker-loader',
          exclude: /(node_modules)/
        })
      }
    },
    loaders: {
      less: {
        lessOptions: {
          javascriptEnabled: true,
          modifyVars: {
            'primary-color': '#167c80',
            'link-color': '#167c80'
          }
        }
      }
    }
  }
}
