export default {
	mode: 'universal',
	head: {
		title: process.env.npm_package_name || '',
		meta: [
			{ charset: 'utf-8' },
			{
				name: 'viewport',
				content: 'width=device-width, initial-scale=1'
			},
			{
				hid: 'description',
				name: 'description',
				content: process.env.npm_package_description || ''
			}
		],
		link: [
			{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
			{
				rel: 'apple-touch-icon',
				sizes: '180x180',
				href: '/apple-touch-icon.png'
			},
			{
				rel: 'icon',
				type: 'image/png',
				sizes: '32x32',
				href: '/favicon-32x32.png'
			},
			{
				rel: 'icon',
				type: 'image/png',
				sizes: '16x16',
				href: '/favicon-16x16.png'
			},
			{ rel: 'manifest', href: '/site.webmanifest' },
			{
				rel: 'mask-icon',
				color: '#fffa0e',
				href: '/safari-pinned-tab.svg'
			},
			{
				rel: 'stylesheet',
				href:
					'https://fonts.googleapis.com/css?family=Open+Sans|Roboto:500&display=swap'
			}
		]
	},
	/*
	 ** Customize the progress-bar color
	 */
	loading: false,
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
		'@nuxtjs/eslint-module',
		// Doc: https://github.com/nuxt-community/nuxt-tailwindcss
		'@nuxtjs/tailwindcss'
	],
	/*
	 ** Nuxt.js modules
	 */
	modules: [
		'@nuxtjs/axios',
		'@nuxtjs/proxy',
		'@nuxtjs/dotenv',
		'@nuxtjs/auth',
		'nuxt-validate'
	],
	axios: {
		baseURL: 'http://localhost:3000'
	},
	auth: {
		strategies: {
			local: {
				endpoints: {
					login: {
						url: '/api/auth/login',
						method: 'post',
						propertyName: 'token.secret'
					},
					logout: { url: '/api/auth/logout', method: 'post' },
					user: {
						url: '/api/auth/user',
						method: 'get',
						propertyName: 'user'
					}
				}
			}
		}
	},
	serverMiddleware: ['~/api/login.js', '~/api/logout.js', '~/api/user.js'],
	proxy: {
		'/.netlify': {
			target: 'http://localhost:9000',
			pathRewrite: { '^/.netlify/functions': '' }
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
					enforce: 'pre',
					test: /\.(js|vue)$/,
					loader: 'eslint-loader',
					exclude: /(node_modules)/
				})
			}
		},
		postcss: {
			// Add plugin names as key and arguments as value
			// Install them before as dependencies with npm or yarn
			plugins: {
				// Disable a plugin by passing false as value
				'postcss-nested': {}
			},
			preset: {
				// Change the postcss-preset-env settings
				autoprefixer: {
					grid: true
				}
			}
		}
	},
	env: {
		IMAGEKIT_ID: process.env.IMAGEKIT_ID
	}
}
