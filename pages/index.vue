<template>
	<div id="top" class="app">
		<userLoginForm
			:closeoverlay="closeOverlay"
			:submitform="loginUser"
			:message="loginMessage"
			:active="loginActive"
			:processing="loginProcessing"
		/>
		<div class="container">
			<div class="apex flex p-2 justify-between">
				<div class="item-count">
					<div v-if="searchQuery" class="search-count">
						{{ items.length }}
						<span v-if="items.length > 1">items</span
						><span v-else>item</span> found
					</div>
					<div v-else class="grand-count">
						{{ grandTotal }} <span v-if="grandTotal > 1">items</span
						><span v-else>item</span> found
					</div>
				</div>
				<div class="login-area">
					<div
						v-if="$auth.loggedIn"
						class="cursor-pointer hover:underline"
						@click="logout"
					>
						Log Out
					</div>
					<div
						v-else
						class="cursor-pointer hover:underline"
						@click="login"
					>
						Log In
					</div>
				</div>
			</div>
		</div>

		<a
			id="top-link"
			href="#top"
			class="top-link fixed no-underline opacity-0 p-2 pointer-events-none"
			@click="scrollToTop"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 492 492"
				class="block mx-auto"
			>
				<path
					d="M198.608 246.104L382.664 62.04c5.068-5.056 7.856-11.816 7.856-19.024 0-7.212-2.788-13.968-7.856-19.032l-16.128-16.12C361.476 2.792 354.712 0 347.504 0s-13.964 2.792-19.028 7.864L109.328 227.008c-5.084 5.08-7.868 11.868-7.848 19.084-.02 7.248 2.76 14.028 7.848 19.112l218.944 218.932c5.064 5.072 11.82 7.864 19.032 7.864 7.208 0 13.964-2.792 19.032-7.864l16.124-16.12c10.492-10.492 10.492-27.572 0-38.06L198.608 246.104z"
				/>
			</svg>
		</a>
		<div class="container">
			<div class="communicator fixed text-center w-full">
				<message />
			</div>
			<main class="px-2">
				<header id="app-header" class="app-header flex mb-2">
					<nuxt-link
						v-if="searchQuery"
						to="/"
						class="backlink flex flex-none items-center mr-2 no-underline px-2 py-1"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 512 512"
							class="block mx-auto"
						>
							<path
								d="M491.318 235.318H20.682C9.26 235.318 0 244.578 0 256c0 11.423 9.26 20.682 20.682 20.682h470.636c11.423 0 20.682-9.259 20.682-20.682 0-11.422-9.259-20.682-20.682-20.682z"
							/>
							<path
								d="M49.932 256L211.795 94.136c8.077-8.077 8.077-21.172 0-29.249-8.077-8.076-21.172-8.076-29.249 0L6.058 241.375c-8.077 8.077-8.077 21.172 0 29.249l176.488 176.488a20.616 20.616 0 0 0 14.625 6.058 20.616 20.616 0 0 0 14.625-6.058c8.077-8.077 8.077-21.172 0-29.249L49.932 256z"
							/>
						</svg>
					</nuxt-link>
					<form
						id="form--search"
						class="form form--search flex-auto"
						role="search"
						aria-label="Search"
						@submit.prevent="searchItems"
					>
						<fieldset>
							<div class="form-field flex">
								<input
									id="search-field"
									v-model="searchTerms"
									class="p-2 w-full flex-auto rounded-none bg-transparent"
									type="text"
									placeholder="Search"
								/>
							</div>
						</fieldset>
					</form>
					<button
						class="app-action flex-none ml-2"
						:class="{ subtle: addingItem }"
						data-entity="open-add-item-menu"
						@click="addingItem = !addingItem"
					>
						<span v-if="!addingItem" class="block">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 491.86 491.86"
								class="block mx-auto"
							>
								<path
									d="M465.167 211.614H280.245V26.691c0-8.424-11.439-26.69-34.316-26.69s-34.316 18.267-34.316 26.69v184.924H26.69C18.267 211.614 0 223.053 0 245.929s18.267 34.316 26.69 34.316h184.924v184.924c0 8.422 11.438 26.69 34.316 26.69s34.316-18.268 34.316-26.69V280.245H465.17c8.422 0 26.69-11.438 26.69-34.316s-18.27-34.315-26.693-34.315z"
								/>
							</svg>
						</span>
						<span v-if="addingItem" class="block">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 47.971 47.971"
								class="block mx-auto"
							>
								<path
									d="M28.228 23.986L47.092 5.122a2.998 2.998 0 0 0 0-4.242 2.998 2.998 0 0 0-4.242 0L23.986 19.744 5.121.88a2.998 2.998 0 0 0-4.242 0 2.998 2.998 0 0 0 0 4.242l18.865 18.864L.879 42.85a2.998 2.998 0 1 0 4.242 4.241l18.865-18.864L42.85 47.091c.586.586 1.354.879 2.121.879s1.535-.293 2.121-.879a2.998 2.998 0 0 0 0-4.242L28.228 23.986z"
								/>
							</svg>
						</span>
					</button>
				</header>
				<transition-expand>
					<div
						v-show="addingItem"
						class="add w-full"
						data-entity="add-item-menu"
					>
						<div class="add-interior pb-2">
							<form class="form form--add" @submit.prevent>
								<fieldset>
									<div
										class="instructions leading-normal pb-2"
									>
										<div
											class="instructions__content px-2 py-3"
										>
											<p>
												To add an item, use the file
												input below to select a JSON
												file generated from
												<a
													class="underline hover:no-underline"
													href="https://instaloader.github.io/"
													rel="noreferrer"
													target="_blank"
													>Instaloader</a
												>.
											</p>
										</div>
									</div>
									<transition-expand>
										<div
											v-show="newItemContent"
											class="item-preview mb-2"
											data-entity="item-preview"
										>
											<div class="item editing">
												<div class="header-wrap">
													<div
														class="item__header relative"
													>
														<div
															class="item__title absolute bottom-0 p-2 w-full"
														>
															<label>Title</label>
															<div
																class="title-interior relative"
															>
																<div
																	ref="newItemName"
																	class="item-name px-4 py-2 relative w-full"
																	contenteditable="true"
																	spellcheck="false"
																	@paste="
																		stripMarkup
																	"
																>
																	{{
																		newItemName
																	}}
																</div>
															</div>
														</div>
														<div
															class="item__media opacity-100"
														>
															<carousel
																v-if="
																	newItemMedia.length >
																		1
																"
																:item-media="
																	newItemMedia
																"
															/>
															<div
																v-if="
																	newItemMedia.length ===
																		1
																"
																class="media-item"
															>
																<div
																	v-for="(media,
																	index) in newItemMedia"
																	:key="
																		'new-item-media-' +
																			index
																	"
																	class="media-shell"
																>
																	<img
																		v-if="
																			media.type ===
																				'GraphImage'
																		"
																		:src="
																			media.url
																		"
																		alt
																	/>
																	<img
																		v-else-if="
																			media.type ===
																				'GraphVideo'
																		"
																		:src="
																			media.url
																		"
																		alt
																	/>
																</div>
															</div>
															<div
																v-if="
																	newItemMedia.length ===
																		0
																"
																class="media-item"
															>
																<img
																	src="~/assets/drunk-uncle-720x720-recipe.jpg"
																	alt
																/>
															</div>
														</div>
													</div>
												</div>
												<div
													class="item__contents p-2 relative"
												>
													<div
														class="item__content mb-4 relative whitespace-pre-line"
													>
														<div
															ref="newItemContent"
															class="item-content p-4 leading-relaxed relative"
															contenteditable="true"
															spellcheck="false"
														>
															{{ newItemContent }}
														</div>
													</div>
												</div>
											</div>
										</div>
									</transition-expand>
									<footer class="add-footer flex flex-auto">
										<input
											ref="jsonFile"
											class="w-full"
											type="file"
											accept="application/json"
											data-entity="choose-json-file"
											@change="processFile($event)"
										/>
										<div
											class="add-actions flex flex-none flex-no-wrap"
										>
											<div
												v-if="$auth.loggedIn"
												class="add-action ml-2 whitespace-no-wrap"
												data-entity="add-item-action"
											>
												<button
													v-show="newItemContent"
													:disabled="
														itemAddProcessing
													"
													@click="addItem"
												>
													Add Item
												</button>
											</div>
											<div
												v-else
												class="add-action ml-2 whitespace-no-wrap"
												data-entity="add-item-action"
											>
												<button
													v-show="newItemContent"
													:disabled="
														itemAddProcessing
													"
													class="unauthorized"
													@click="login"
												>
													Add Item
												</button>
											</div>
											<div
												class="add-action ml-2 whitespace-no-wrap"
											>
												<button
													v-show="newItemContent"
													class="subtle h-full"
													:disabled="
														itemAddProcessing
													"
													@click="resetAddForm"
												>
													<svg
														class="block mx-auto"
														xmlns="http://www.w3.org/2000/svg"
														viewBox="0 0 47.971 47.971"
													>
														<path
															d="M28.228 23.986L47.092 5.122a2.998 2.998 0 0 0 0-4.242 2.998 2.998 0 0 0-4.242 0L23.986 19.744 5.121.88a2.998 2.998 0 0 0-4.242 0 2.998 2.998 0 0 0 0 4.242l18.865 18.864L.879 42.85a2.998 2.998 0 1 0 4.242 4.241l18.865-18.864L42.85 47.091c.586.586 1.354.879 2.121.879s1.535-.293 2.121-.879a2.998 2.998 0 0 0 0-4.242L28.228 23.986z"
														/>
													</svg>
												</button>
											</div>
										</div>
									</footer>
								</fieldset>
							</form>
						</div>
					</div>
				</transition-expand>
				<div
					v-if="items.length"
					id="items"
					ref="items"
					class="items pb-8"
				>
					<item v-for="item in items" :key="item._id" :item="item" />
					<div ref="itemsFooter" class="items-footer"></div>
				</div>
				<div v-else class="disclaimer py-4 text-center">
					<p>No items were found.</p>
				</div>
			</main>
			<div class="lower-brow bottom-0 fixed pointer-events-none right-0">
				<loading />
			</div>
		</div>
	</div>
</template>

<script>
import carousel from '@@/components/carousel.vue'
import item from '@@/components/item.vue'
import loading from '@@/components/loading.vue'
import message from '@@/components/message.vue'
import TransitionExpand from '@@/components/TransitionExpand.vue'
import userLoginForm from '@@/components/loginForm.vue'

import { mapActions, mapState } from 'vuex'

export default {
	watchQuery: ['search'],
	components: {
		carousel,
		item,
		loading,
		message,
		TransitionExpand,
		userLoginForm
	},
	// async fetch({ store, query }) {
	// 	try {
	// 		if (query.search) {
	// 			await store.dispatch('items/searchItems', query.search)
	// 			// await context.searchItems(query.search)
	// 		} else {
	// 			await store.dispatch('items/getItems')
	// 			// await context.getItems
	// 		}
	// 	} catch (err) {}
	// },
	fetch({ store, query }) {
		try {
			if (query.search) {
				return store.dispatch('items/searchItems', query.search)
			} else {
				return store.dispatch('items/getItems')
			}
		} catch (err) {}
	},
	// asyncData({ store, query }) {
	// 	try {
	// 		if (query.search) {
	// 			store.dispatch('items/searchItems', query.search)
	// 		} else {
	// 			store.dispatch('items/getItems')
	// 		}
	// 	} catch (err) {}
	// },
	data() {
		return {
			addingItem: false,
			itemIncrementer: 0,
			itemAddProcessing: false,
			jsonData: null,
			loginActive: false,
			loginMessage: null,
			loginProcessing: false,
			newItemMedia: [],
			newItemContent: null,
			newItemName: null,
			newItemSourceCategory: null,
			newItemSourceUrl: null,
			searchTerms: this.$route.query.search
		}
	},
	computed: {
		...mapState({
			grandTotal: state => state.items.itemCount,
			items: state => state.items.items,
			loading: state => state.loading.loading
		}),
		searchQuery() {
			return this.$route.query.search
		}
	},
	watch: {
		$route: 'prepareForRouteChange'
	},
	mounted() {
		this.$root.$on('login', () => {
			this.login()
		})
		if (this.$refs.itemsFooter) {
			this.configureInfiniteFooter()
		}

		const appHeader = document.getElementById('app-header')
		const topLink = document.getElementById('top-link')
		const options = {
			root: null,
			rootMargin: '0px',
			threshold: 1.0
		}
		const callback = (entries, observer) => {
			entries.forEach(entry => {
				if (entry.intersectionRatio !== 1) {
					topLink.classList.add('active')
				} else {
					topLink.classList.remove('active')
				}
			})
		}

		const observer = new IntersectionObserver(callback, options)
		observer.observe(appHeader)
	},
	methods: {
		...mapActions({
			addItemAction: 'items/addItem',
			getAdditionalItems: 'items/getAdditionalItems'
		}),
		closeOverlay() {
			this.loginActive = false
		},
		async loginUser(loginInfo) {
			this.loginProcessing = true
			this.$store.dispatch('loading/triggerBusyState')
			this.loginMessage = null
			await this.$auth
				.loginWith('local', {
					data: loginInfo
				})
				.then(() => {
					this.loginActive = false
					this.$root.$emit('transmitMessage', 'Login successful.')
				})
				.catch(e => {
					// console.log(e)
					this.loginMessage = 'Authentication failed'
				})
			this.$store.dispatch('loading/stopBusyState')
			this.loginProcessing = false
		},
		login() {
			this.loginActive = true
		},
		async logout() {
			this.$store.dispatch('loading/triggerBusyState')
			await this.$auth.logout()
			this.$store.dispatch('loading/stopBusyState')
			this.$root.$emit('transmitMessage', 'Logout successful.')
		},
		searchItems() {
			if (this.searchTerms) {
				this.addingItem = false
				this.resetAddForm()
				this.$router.push({
					name: 'index',
					query: {
						search: this.searchTerms
					}
				})
			} else {
				return false
			}
		},
		setEndOfContenteditable(contentEditableElement) {
			let range
			let selection
			if (document.createRange) {
				range = document.createRange() // Create a range (a range is a like the selection but invisible)
				range.selectNodeContents(contentEditableElement) // Select the entire contents of the element with the range
				range.collapse(false) // collapse the range to the end point. false means collapse to end rather than the start
				selection = window.getSelection() // get the selection object (allows you to change selection)
				selection.removeAllRanges() // remove any selections already made
				selection.addRange(range) // make the range you have just created the visible selection
			}
		},
		processFile(event) {
			if (event.target.files[0]) {
				const reader = new FileReader()
				reader.readAsText(event.target.files[0])
				reader.addEventListener(
					'load',
					function(evt) {
						this.newItemName = null
						this.newItemMedia = []
						this.newItemContent = null
						this.jsonData = JSON.parse(evt.target.result)
						this.newItemId = this.jsonData.node.id
						const instaNode = this.jsonData.node
						if (
							Object.prototype.hasOwnProperty.call(
								instaNode,
								'edge_sidecar_to_children'
							)
						) {
							const sidecars = this.jsonData.node
								.edge_sidecar_to_children.edges
							sidecars.forEach(function(sidecar) {
								const sidecarToPush = {}
								sidecarToPush.type = sidecar.node.__typename
								sidecarToPush.id = sidecar.node.id // For file name
								sidecarToPush.url = sidecar.node.display_url
								this.newItemMedia.push(sidecarToPush)
							}, this)
						} else {
							const newMediaToPush = {}
							newMediaToPush.type = this.jsonData.node.__typename
							newMediaToPush.id = this.jsonData.node.id // For file name
							newMediaToPush.url = this.jsonData.node.display_url
							if (newMediaToPush.type === 'GraphVideo') {
								newMediaToPush.video_url = this.jsonData.node.video_url
							}
							this.newItemMedia.push(newMediaToPush)
						}
						this.newItemContent = this.jsonData.node.edge_media_to_caption.edges[0].node.text
						this.newItemSourceIdentifier = this.jsonData.node.shortcode
					}.bind(this),
					false
				)
			}
		},
		addItem() {
			if (
				!this.newItemContent ||
				!this.$refs.newItemContent.textContent
			) {
				return
			}
			this.saveItems()
		},
		async saveItems() {
			if (this.$auth.loggedIn) {
				this.itemAddProcessing = true
				const payload = {
					name: this.$refs.newItemName.textContent,
					media: this.newItemMedia,
					content: this.$refs.newItemContent.textContent,
					sourceCategory: 'Instagram',
					sourceIdentifier: this.newItemSourceIdentifier
				}
				const newItem = await this.addItemAction(payload)
				if (newItem) {
					this.resetAddForm()
					this.addingItem = false
					this.scrollToTop()
					this.$root.$emit(
						'transmitMessage',
						'Item successfully added.'
					)
				}
				this.itemAddProcessing = false
			}
		},
		resetAddForm() {
			// Resetting Addition Form Values
			this.newItemName = null
			this.$refs.newItemName.textContent = ''
			this.newItemMedia = []
			this.newItemContent = null
			this.$refs.jsonFile.value = ''
			this.newItemSourceCategory = null
			this.newItemSourceIdentifier = null
		},
		prepareForRouteChange() {
			this.addingItem = false
			this.resetAddForm()
			this.configureInfiniteFooter()
			// Improve this
			if (!this.$route.query.search) {
				this.searchTerms = null
			} else {
				this.searchTerms = this.$route.query.search
			}
		},
		configureInfiniteFooter() {
			if (this.observer) {
				this.observer.unobserve(this.$refs.itemsFooter)
			}
			// Strengthen this logic
			this.observer = new IntersectionObserver(entries => {
				entries.forEach(entry => {
					if (entry.intersectionRatio > 0) {
						if (this.$store.state.itemsRemaining === false) {
							this.observer.unobserve(this.$refs.itemsFooter)
						} else {
							// Get id of last element in state
							const lastItemId = this.items[this.items.length - 1]
								._id
							if (
								this.loading === false &&
								!this.$route.query.search
							) {
								this.getAdditionalItems(lastItemId)
							}
						}
					}
				})
			})

			if (!this.$route.query.search && this.$refs.itemsFooter) {
				// Find a better way to do this
				window.setTimeout(() => {
					this.observer.observe(this.$refs.itemsFooter)
				}, 400)
			}
		},
		scrollToTop() {
			if (event) {
				event.preventDefault()
			}
			window.scrollTo(0, 0)
		},
		stripMarkup(event) {
			event.preventDefault()
			const paste = (event.clipboardData || window.clipboardData).getData(
				'text'
			)
			// To do :: Non-destructive pasting
			// let originalContent = this.$refs.newItemName.textContent;
			event.target.textContent = paste
			this.setEndOfContenteditable(event.target)
		}
	}
}
</script>

<style lang="postcss">
html {
	background-color: var(--black);
	color: var(--white);
}
img {
	max-width: 100%;
}

.container {
	margin: 0 auto;
	max-width: 40rem;
}

.backlink {
	background-color: var(--yellow);
	font-size: 2rem;
	line-height: 0;
	transition: box-shadow 400ms;
	svg {
		height: 20px;
		width: 20px;
		fill {
			color: var(--white);
		}
	}
	&:hover,
	&:focus,
	&:active {
		box-shadow: 0 0 8px var(--yellow);
	}
}

.lower-brow {
	z-index: 100;
}

.communicator {
	left: 50%;
	max-width: 80%;
	top: 10%;
	transform: translateX(-50%);
	z-index: 10;
}

.form {
	&--search {
		input {
			color: var(--white);
			&:hover,
			&:focus,
			&:active {
				border-color: var(--yellow);
			}
		}
	}
}

.item-preview {
	.item__header {
		cursor: default;
	}
	.item__title {
		z-index: 2;
		label {
			font-size: 80%;
		}
	}
	.item-name {
		min-height: 3rem;
	}
	.item__content {
		margin-bottom: 0;
	}
}

.app-action {
	svg {
		fill: var(--black);
		height: 20px;
		width: 20px;
	}
}

.disclaimer {
	border-top: 2px solid var(--yellow);
}

.instructions {
	border-top: 2px solid var(--yellow);
	&__content {
		a {
			color: var(--yellow);
		}
	}
}

.add-action {
	button {
		svg {
			fill: var(--white);
			height: 18px;
			width: 18px;
		}
	}
	.subtle {
		svg {
			fill: var(--black);
		}
	}
}

.top-link {
	background-color: var(--yellow);
	right: 0.5rem;
	transition: opacity 400ms;
	top: 0.5rem;
	z-index: -1;
	svg {
		height: 20px;
		transform: rotate(90deg);
		width: 20px;
		path {
			fill: var(--black);
			stroke: var(--yellow);
			stroke-width: 8px;
			transition: fill 400ms;
		}
	}
	&.active {
		opacity: 1;
		pointer-events: auto;
		z-index: 2;
	}
}

.login-area {
	color: var(--yellow);
}
</style>
