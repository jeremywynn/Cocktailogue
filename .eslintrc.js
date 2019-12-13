module.exports = {
	root: true,
	env: {
		browser: true,
		node: true
	},
	parserOptions: {
		parser: 'babel-eslint'
	},
	extends: [
		'@nuxtjs',
		'prettier',
		'prettier/vue',
		'plugin:cypress/recommended',
		'plugin:prettier/recommended',
		'plugin:nuxt/recommended'
	],
	plugins: ['cypress', 'no-loops', 'prettier'],
	// add your custom rules here
	rules: {
		'no-loops/no-loops': 2,
    'semi': [2, 'never'],
    'no-console': 'off',
    'vue/max-attributes-per-line': 'off',
    'prettier/prettier': ['error', { 'semi': false }]
  }
}
