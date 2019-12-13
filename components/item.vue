<template>
	<div
		ref="item"
		class="item"
		:class="['overflow-hidden', { editing: editingItem, reveal: revealed }]"
	>
		<div class="header-wrap relative">
			<div
				class="item__header cursor-pointer relative"
				@click="revealItem"
			>
				<div class="item__title absolute bottom-0 p-2 w-full">
					<div class="title-interior relative">
						<div
							ref="itemName"
							class="item-name px-4 py-2 relative w-full"
						>
							{{ itemName }}
						</div>
					</div>
				</div>
				<div class="item__media opacity-0">
					<carousel
						v-if="item.media.length > 1"
						:item-media="item.media"
					/>
					<div v-if="item.media.length === 1" class="media-item">
						<div
							v-for="(media, index) in item.media"
							:key="itemID + '-media-' + index"
							class="media-shell"
						>
							<img
								v-if="media.path"
								:src="
									'https://ik.imagekit.io/' +
										imageKitID +
										media.path
								"
								class="block object-contain w-full"
								alt
							/>
							<img
								v-else
								src="~/assets/drunk-uncle-720x720-recipe.jpg"
								class="block object-contain w-full"
								alt
							/>
						</div>
					</div>
					<div v-if="item.media.length === 0" class="media-item">
						<img
							src="~/assets/drunk-uncle-720x720-recipe.jpg"
							class="block object-contain w-full"
							alt
						/>
					</div>
				</div>
			</div>
		</div>

		<transition-expand>
			<div v-show="revealed" class="expander">
				<div class="item__contents p-2 relative">
					<div
						class="item__content mb-4 relative whitespace-pre-line"
					>
						<div
							ref="itemContent"
							class="item-content p-4 leading-relaxed relative"
						>
							<text-highlight :queries="searchQuery">{{
								itemContent
							}}</text-highlight>
						</div>
					</div>
					<div class="item__meta px-4">
						<div
							v-if="sourceCategory"
							class="item__source-category"
						>
							{{ sourceCategory }}
						</div>
						<div v-if="sourceIdentifier" class="item__source-url">
							<a
								class="underline hover:no-underline"
								:href="reconstructedUrl"
								target="_blank"
								rel="noreferrer"
								>{{ reconstructedUrl }}</a
							>
						</div>
					</div>
					<div
						class="item__actions flex items-start justify-between mt-4 pb-4 px-4"
					>
						<div
							class="action-group action-group--editing flex justify-between w-full"
						>
							<div
								v-if="isLoggedIn"
								class="edit-option flex justify-between w-full"
							>
								<button
									:disabled="itemProcessing"
									:class="[
										'block whitespace-no-wrap',
										{ subtle: editingItem }
									]"
									@click="triggerEditItem"
								>
									<span v-if="editingItem">Cancel Edits</span>
									<span v-else>Edit Item</span>
								</button>
								<button
									v-show="editingItem"
									:disabled="itemProcessing"
									class="block whitespace-no-wrap"
									@click="editItem"
								>
									Save Edits
								</button>
							</div>
							<div
								v-else
								class="edit-option flex justify-between w-full"
							>
								<button
									:disabled="itemProcessing"
									class="unauthorized block whitespace-no-wrap"
									@click="
										triggerNetlifyIdentityAction('login')
									"
								>
									<span>Edit Item</span>
								</button>
							</div>
						</div>
						<div v-if="!editingItem" class="action-group">
							<transition name="fade">
								<div class="button-group flex ml-8">
									<transition name="fade" mode="out-in">
										<div
											v-if="isLoggedIn"
											class="removal-option flex justify-between w-full"
										>
											<div
												v-if="confirmRemoval === false"
												key="hideChoice"
												class="original-removal"
											>
												<button
													v-show="!editingItem"
													class="negative block whitespace-no-wrap"
													:disabled="itemProcessing"
													@click="
														confirmRemoval = true
													"
												>
													Delete Item
												</button>
											</div>
											<div
												v-if="confirmRemoval === true"
												key="showChoice"
												class="confirm-removal flex ml-2 items-center"
											>
												<span class="confirm-text"
													>Delete?</span
												>
												<div class="choice ml-2">
													<button @click="removeItem">
														Yes
													</button>
												</div>
												<div class="choice ml-2">
													<button
														class="subtle"
														@click="
															confirmRemoval = false
														"
													>
														No
													</button>
												</div>
											</div>
										</div>
										<div
											v-else
											class="removal-option flex justify-between w-full"
										>
											<div
												v-if="confirmRemoval === false"
												key="hideChoice"
												class="original-removal"
											>
												<button
													v-show="!editingItem"
													class="negative unauthorized block whitespace-no-wrap"
													:disabled="itemProcessing"
													@click="
														triggerNetlifyIdentityAction(
															'login'
														)
													"
												>
													Delete Item
												</button>
											</div>
										</div>
									</transition>
								</div>
							</transition>
						</div>
					</div>
				</div>
			</div>
		</transition-expand>
	</div>
</template>

<script>
import { mapActions, mapMutations, mapState } from 'vuex'
import carousel from '@@/components/carousel.vue'
import netlifyIdentity from 'netlify-identity-widget'
import TextHighlight from 'vue-text-highlight'
import TransitionExpand from '@@/components/TransitionExpand.vue'

netlifyIdentity.init({
	logo: false
})

export default {
	components: {
		carousel,
		TextHighlight,
		TransitionExpand
	},
	props: {
		item: {
			type: Object,
			default: () => {}
		}
	},
	data() {
		return {
			confirmRemoval: false,
			editingItem: false,
			imageKitID: process.env.IMAGEKIT_ID,
			itemContent: this.item.content,
			itemID: this.item._id,
			itemName: this.item.name,
			itemProcessing: false,
			mediaCount: this.item.media.length,
			mediaUrl: null,
			reconstructedUrl:
				'https://www.instagram.com/p/' + this.item.sourceIdentifier,
			revealed: false,
			sourceCategory: this.item.sourceCategory,
			sourceIdentifier: this.item.sourceIdentifier
		}
	},
	computed: {
		...mapState({
			isLoggedIn: state => state.user.user
		}),
		searchQuery() {
			if (this.$route.query.search) {
				return this.$route.query.search
			} else {
				return ''
			}
		}
	},
	mounted() {
		this.observer = new IntersectionObserver(entries => {
			entries.forEach(entry => {
				if (entry.intersectionRatio > 0) {
					entry.target.classList.add('unveil')
					this.observer.unobserve(entry.target)
				}
			})
		})
		this.$el.querySelectorAll('.item__media').forEach(item => {
			const imageElement = item.querySelector('img')
			if (imageElement) {
				imageElement.addEventListener('load', () => {
					this.observer.observe(item)
				})
			}
		})
	},
	methods: {
		...mapActions({
			editItemAction: 'items/editItem',
			removeItemAction: 'items/deleteItem'
		}),
		...mapMutations({
			setAuth: 'user/SET_AUTH'
		}),
		triggerNetlifyIdentityAction(action) {
			if (action === 'login') {
				netlifyIdentity.open(action)
				netlifyIdentity.on(action, user => {
					this.setAuth(user)
					netlifyIdentity.close()
				})
			} else if (action === 'logout') {
				this.setAuth(null)
				netlifyIdentity.logout()
			}
		},
		disableEditMode() {
			this.$refs.itemContent.setAttribute('contenteditable', false)
			this.$refs.itemName.setAttribute('contenteditable', false)
			this.$refs.itemName.textContent = this.item.name
			this.$refs.itemContent.textContent = this.item.content
			this.editingItem = false
		},
		enableEditMode() {
			this.editingItem = true
			this.$refs.itemName.setAttribute('contenteditable', true)
			this.$refs.itemContent.setAttribute('contenteditable', true)
		},
		revealItem() {
			if (!this.editingItem) {
				this.revealed = !this.revealed
			}
		},
		triggerEditItem() {
			if (this.editingItem === false) {
				this.enableEditMode()
			} else {
				this.disableEditMode()
			}
		},
		async editItem() {
			if (netlifyIdentity.currentUser()) {
				this.itemProcessing = true
				const payload = {
					ID: this.$vnode.key,
					name: this.$refs.itemName.textContent,
					content: this.$refs.itemContent.textContent
				}
				this.editingItem = false
				this.$refs.itemName.setAttribute('contenteditable', false)
				this.$refs.itemContent.setAttribute('contenteditable', false)
				const editedItem = await this.editItemAction(payload)
				if (editedItem.matchedCount && editedItem.modifiedCount) {
					this.$root.$emit(
						'transmitMessage',
						'Item successfully edited.'
					)
				}
				this.itemProcessing = false
			}
		},
		async removeItem() {
			if (netlifyIdentity.currentUser()) {
				this.itemProcessing = true
				this.confirmRemoval = false
				const payload = {
					ID: this.$vnode.key,
					media: this.item.media
				}
				const deletedItem = await this.removeItemAction(payload)
				if (deletedItem) {
					this.$root.$emit(
						'transmitMessage',
						'Item successfully deleted.'
					)
				}
				this.itemProcessing = false
			}
		}
	}
}
</script>

<style lang="postcss">
.text__highlight {
	background-color: var(--yellow) !important;
}
.fade-enter-active,
.fade-leave-active {
	transition: opacity 0.5s;
}
.fade-enter,
.fade-leave-to {
	opacity: 0;
}
.confirm-text {
	font-size: 80%;
}

.item {
	border: 1px solid var(--white);
	border-top: 0;
	&__contents {
		font-size: 95%;
	}
	&__media {
		transition: opacity 400ms;
		&.unveil {
			opacity: 1;
		}
	}
	&:first-child {
		border-top: 1px solid var(--white);
	}
	&.reveal {
		.item__media {
			display: block;
		}
	}
}

.item__title {
	background-color: rgba(0, 0, 0, 0.667);
	font-size: calc(1rem + 1vw);
	text-shadow: 0 0 3px black;
	z-index: 2;
	@media only all and (min-width: 56em) {
		font-size: 1.5rem;
	}
}

.item-name {
	transition: box-shadow 200ms;
	&:after,
	&:before {
		background-color: var(--yellow);
		content: '';
		display: block;
		opacity: 0;
		position: absolute;
		transition: opacity 400ms;
	}
	&:after {
		bottom: 0;
		height: 1px;
		left: 1px;
		transform-origin: left;
		width: calc(100% - 2px);
	}
	&:before {
		height: calc(100% - 1px);
		right: 0;
		top: 1px;
		transform-origin: top;
		width: 1px;
	}
}

.title-interior {
	&:after,
	&:before {
		background-color: var(--yellow);
		content: '';
		display: block;
		opacity: 0;
		position: absolute;
		transition: opacity 400ms;
	}
	&:after {
		height: 1px;
		top: 0;
		transform-origin: left;
		width: 100%;
	}
	&:before {
		height: calc(100% - 1px);
		left: 0;
		top: 1px;
		transform-origin: top;
		width: 1px;
	}
}

.item__source-url {
	a {
		color: var(--yellow);
	}
}

.item__content {
	&:after,
	&:before {
		background-color: var(--yellow);
		content: '';
		display: block;
		opacity: 0;
		position: absolute;
		transition: opacity 400ms;
	}
	&:after {
		height: 1px;
		top: 0;
		transform-origin: left;
		width: 100%;
	}
	&:before {
		height: calc(100% - 1px);
		left: 0;
		top: 1px;
		transform-origin: top;
		width: 1px;
	}
}

.item-content {
	transition: box-shadow 200ms;
	&:after,
	&:before {
		background-color: var(--yellow);
		content: '';
		display: block;
		opacity: 0;
		position: absolute;
		transition: opacity 400ms;
	}
	&:after {
		bottom: 0;
		height: 1px;
		left: 1px;
		transform-origin: left;
		width: calc(100% - 2px);
	}
	&:before {
		height: calc(100% - 1px);
		right: 0;
		top: 1px;
		transform-origin: top;
		width: 1px;
	}
}

.highlighted {
	background-color: var(--yellow);
	color: #000;
}

/* Editing Item Mode */

.editing {
	.item__header {
		cursor: default;
	}
	.title-interior {
		&:after {
			animation: editIndicatorTopLtR 150ms linear forwards;
			opacity: 1;
			transition: none;
		}
		&:before {
			animation: editIndicatorTopLtB 150ms linear forwards;
			opacity: 1;
			transition: none;
		}
	}
	.item__title {
		z-index: 2;
	}
	.item-name {
		cursor: text;
		&:after {
			animation: editIndicatorTopLtR 150ms linear forwards 150ms;
			opacity: 1;
			transition-delay: 150ms;
			transition-duration: 0s;
		}
		&:before {
			animation: editIndicatorTopLtB 150ms linear forwards 150ms;
			opacity: 1;
			transition-delay: 150ms;
			transition-duration: 0s;
		}
		&:focus,
		&:active,
		&:hover {
			box-shadow: 0 0 1rem var(--yellow) inset;
		}
	}
	.item__content {
		&:after {
			animation: editIndicatorTopLtR 150ms linear forwards;
			opacity: 1;
			transition: none;
		}
		&:before {
			animation: editIndicatorTopLtB 150ms linear forwards;
			opacity: 1;
			transition: none;
		}
	}
	.item-content {
		&:after {
			animation: editIndicatorTopLtR 150ms linear forwards 150ms;
			opacity: 1;
			transition-delay: 150ms;
			transition-duration: 0s;
		}
		&:before {
			animation: editIndicatorTopLtB 150ms linear forwards 150ms;
			opacity: 1;
			transition-delay: 150ms;
			transition-duration: 0s;
		}
		&:focus,
		&:active,
		&:hover {
			box-shadow: 0 0 1rem var(--yellow) inset;
		}
	}
}

@keyframes editIndicatorTopLtR {
	0% {
		transform: scaleX(0);
	}
	100% {
		transform: scaleX(1);
	}
}

@keyframes editIndicatorTopLtB {
	0% {
		transform: scaleY(0);
	}
	100% {
		transform: scaleY(1);
	}
}
</style>
