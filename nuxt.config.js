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
      }
      // { name: 'og:image', content: '/static/cocktail.jpg' },
    ],
    link: [
      { rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
      {
        rel: "apple-touch-icon",
        sizes: "180x180",
        href: "/apple-touch-icon.png"
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "32x32",
        href: "/favicon-32x32.png"
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "16x16",
        href: "/favicon-16x16.png"
      },
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
  css: [],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: [],
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [
    // Doc: https://github.com/nuxt-community/eslint-module
    "@nuxtjs/eslint-module",
    // Doc: https://github.com/nuxt-community/nuxt-tailwindcss
    "@nuxtjs/tailwindcss"
  ],
  /*
   ** Nuxt.js modules
   */
  modules: ["@nuxtjs/proxy", "@nuxtjs/dotenv"],

  proxy: {
    "/.netlify": {
      target: "http://localhost:9000",
      pathRewrite: { "^/.netlify/functions": "" }
    },
    "/.netlify/identity": {
      target: "https://cocktailogue.netlify.com",
      pathRewrite: { "^/.netlify/identity": "" }
    }
  },
  /*
   ** Build configuration
   */
  build: {
    /*
     ** You can extend webpack config here
     */
    // analyze: true,
    extend(config, ctx) {
      // Run ESLint on save
      if (ctx.isDev && ctx.isClient) {
        config.module.rules.push({
          enforce: "pre",
          test: /\.(js|vue)$/,
          loader: "eslint-loader",
          exclude: /(node_modules)/
        });
      }
    },
    postcss: {
      // Add plugin names as key and arguments as value
      // Install them before as dependencies with npm or yarn
      plugins: {
        // Disable a plugin by passing false as value
        // 'postcss-url': false,
        "postcss-nested": {}
        // 'postcss-responsive-type': {},
        // 'postcss-hexrgba': {}
      },
      preset: {
        // Change the postcss-preset-env settings
        autoprefixer: {
          grid: true
        }
      }
    }
  },
  loadingIndicator: {
    name: "pulse",
    color: "rgb(255, 250, 14)",
    background: "#000000"
  },
  env: {
    IMAGEKIT_ID: process.env.IMAGEKIT_ID
  }
};
