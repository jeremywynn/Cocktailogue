export default {
  mode: "spa",
  /*
   ** Headers of the page
   */
  head: {
    title: process.env.npm_package_name || "",
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      {
        hid: "description",
        name: "description",
        content: process.env.npm_package_description || ""
      },
      { name: 'og:image', content: '/static/cocktail.jpg' },
    ],
    link: [
      { rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
      { rel: "apple-touch-icon", sizes: "180x180", href: "/apple-touch-icon.png" },
      { rel: "icon", type: "image/png", sizes: "32x32", href: "/favicon-32x32.png" },
      { rel: "icon", type: "image/png", sizes: "16x16", href: "/favicon-16x16.png" },
      { rel: "manifest", href: "/site.webmanifest" },
      { rel: "mask-icon", color: "#fffa0e", href: "/safari-pinned-tab.svg" },
      {
        rel: "stylesheet",
        href:
          "https://fonts.googleapis.com/css?family=Open+Sans|Roboto:500&display=swap"
      }
    ]
  },
  /*
   ** Customize the progress-bar color
   */
  // loading: '~/components/loading.vue',
  loading: false,
  // loading: { color: "#fff" },
  /*
   ** Global CSS
   */
  css: ["normalize.css/normalize.css"],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: [],
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: ["@nuxtjs/vuetify"],
  /*
   ** Nuxt.js modules
   */
  vuetify: {
    // css: false,
    defaultAssets: false,
    // materialIcons: true,
    treeShake: true
  },
  modules: ["@nuxtjs/proxy", "@nuxtjs/dotenv"],
  proxy: {
    "/.netlify": {
      target: "http://localhost:9000",
      pathRewrite: { "^/.netlify/functions": "" }
    }
  },
  /*
   ** Build configuration
   */
  build: {
    /*
     ** You can extend webpack config here
     */
    extend(config, ctx) {}
  },
  loadingIndicator: {
    name: 'pulse',
    color: 'rgb(255, 250, 14)',
    background: '#000000'
  },
  env: {
    IMAGEKIT_ID: process.env.IMAGEKIT_ID
  }
};
