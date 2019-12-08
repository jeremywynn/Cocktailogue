<template>
  <div class="item" v-bind:class="['overflow-hidden', { 'editing': editingItem, 'reveal': revealed }]" ref="item">
    <div class="header-wrap relative">
      <div class="item__header cursor-pointer relative" ref="itemHeader">
        <div class="item__title absolute bottom-0 p-2 w-full">
          <div class="title-interior relative">
            <div class="item-name px-4 py-2 relative w-full" ref="itemName">{{ itemName }}</div>
          </div>
        </div>
        <div class="item__media opacity-0">
          <div class="carousel-wrapper relative" v-if="item.media.length > 1">
            <div class="carousel snap flex relative h-full overflow-hidden w-full whitespace-no-wrap" ref="carousel">
              <div class="carousel-item flex items-center justify-center min-h-full min-w-full text-center" v-for="(media, index) in item.media" :key="itemID + '-media-' + index">
                <img
                  v-bind:src="'https://ik.imagekit.io/' + imageKitID + media.path"
                  class="block object-contain w-full"
                  v-if="media.path"
                  alt
                />
              </div>
            </div>
          </div>
          <div
            class="media-item"
            v-if="item.media.length === 1"
          >
            <div class="media-shell" v-for="(media, index) in item.media"
            :key="itemID + '-media-' + index">
              <img v-bind:src="'https://ik.imagekit.io/' + imageKitID + media.path" class="block object-contain w-full" v-if="media.path" alt />
              <img v-bind:src="media.url" class="block object-contain w-full" v-else alt />
            </div>
          </div>
          <div class="media-item" v-if="item.media.length === 0">
            <img src="~/assets/drunk-uncle-720x720-recipe.jpg" class="block object-contain w-full -z-1" alt />
          </div>
        </div>
      </div>
      <div class="carousel-controls absolute px-4 w-full" v-if="item.media.length > 1">
        <button v-on:click="prevSlide" ref="prev" class="node node--prev bg-transparent float-left border-0 outline-none rounded-none">
          <svg class="block mx-auto" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 492 492">
            <path d="M198.608 246.104L382.664 62.04c5.068-5.056 7.856-11.816 7.856-19.024 0-7.212-2.788-13.968-7.856-19.032l-16.128-16.12C361.476 2.792 354.712 0 347.504 0s-13.964 2.792-19.028 7.864L109.328 227.008c-5.084 5.08-7.868 11.868-7.848 19.084-.02 7.248 2.76 14.028 7.848 19.112l218.944 218.932c5.064 5.072 11.82 7.864 19.032 7.864 7.208 0 13.964-2.792 19.032-7.864l16.124-16.12c10.492-10.492 10.492-27.572 0-38.06L198.608 246.104z"/>
          </svg>
        </button>
        <button v-on:click="nextSlide" ref="next" class="node node--next bg-transparent float-right border-0 outline-none rounded-none">
          <svg class="block mx-auto" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 492 492">
            <path d="M198.608 246.104L382.664 62.04c5.068-5.056 7.856-11.816 7.856-19.024 0-7.212-2.788-13.968-7.856-19.032l-16.128-16.12C361.476 2.792 354.712 0 347.504 0s-13.964 2.792-19.028 7.864L109.328 227.008c-5.084 5.08-7.868 11.868-7.848 19.084-.02 7.248 2.76 14.028 7.848 19.112l218.944 218.932c5.064 5.072 11.82 7.864 19.032 7.864 7.208 0 13.964-2.792 19.032-7.864l16.124-16.12c10.492-10.492 10.492-27.572 0-38.06L198.608 246.104z"/>
          </svg>
        </button>
      </div>
    </div>
    
    <transition-expand>
      <div class="expander" v-show="revealed">
        <div class="item__contents p-2 relative">
          <div class="item__content mb-4 relative whitespace-pre-line">
            <div class="item-content p-4 leading-relaxed relative" ref="itemContent" v-html="highlight()"></div>
          </div>
          <div class="item__meta px-4">
            <div class="item__source-category" v-if="sourceCategory">{{ sourceCategory }}</div>
            <div class="item__source-url" v-if="sourceIdentifier">
              <a class="underline hover:no-underline" :href="reconstructedUrl" target="_blank" rel="noreferrer">{{ reconstructedUrl }}</a>
            </div>
          </div>
          <div class="item__actions flex items-start justify-between mt-4 pb-4 px-4">
            <div class="action-group action-group--editing flex justify-between w-full">
              <div class="edit-option flex justify-between w-full" v-if="isLoggedIn">
                <button v-on:click="triggerEditItem" :disabled="itemProcessing" v-bind:class="['block whitespace-no-wrap', { 'subtle': editingItem }]">
                  <span v-if="editingItem">Cancel Edits</span>
                  <span v-else>Edit Item</span>
                </button>
                <button
                  v-on:click="editItem"
                  v-show="editingItem"
                  :disabled="itemProcessing"
                  class="block whitespace-no-wrap"
                >Save Edits</button>
              </div>
              <div class="edit-option flex justify-between w-full" v-else>
                <button v-on:click="triggerNetlifyIdentityAction('login')" :disabled="itemProcessing" class="unauthorized block whitespace-no-wrap">
                  <span>Edit Item</span>
                </button>
              </div>
            </div>
            <div class="action-group" v-if="!editingItem">
              <transition name="fade">
                <div class="button-group flex ml-8">
                  <transition name="fade" mode="out-in">
                    <div class="removal-option flex justify-between w-full" v-if="isLoggedIn">
                      <div class="original-removal" v-if="confirmRemoval === false" key="hideChoice">
                        <button
                          class="negative block whitespace-no-wrap"
                          v-on:click="confirmRemoval = true"
                          v-show="!editingItem"
                          :disabled="itemProcessing"
                        >Delete Item</button>
                      </div>
                      <div class="confirm-removal flex ml-2 items-center" v-if="confirmRemoval === true" key="showChoice">
                        <span class="confirm-text">Delete?</span>
                        <div class="choice ml-2">
                          <button v-on:click="removeItem">Yes</button>
                        </div>
                        <div class="choice ml-2">
                          <button class="subtle" v-on:click="confirmRemoval = false">No</button>
                        </div>
                      </div>
                    </div>
                    <div class="removal-option flex justify-between w-full" v-else>
                      <div class="original-removal" v-if="confirmRemoval === false" key="hideChoice">
                        <button
                          class="negative unauthorized block whitespace-no-wrap"
                          v-on:click="triggerNetlifyIdentityAction('login')"
                          v-show="!editingItem"
                          :disabled="itemProcessing"
                        >Delete Item</button>
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

import { mapActions, mapMutations, mapState } from "vuex";
import netlifyIdentity from "netlify-identity-widget";
import TransitionExpand from '@@/components/TransitionExpand.vue'

netlifyIdentity.init({
  logo: false
});

export default {
  components: {
		TransitionExpand
	},
  data: function() {
    return {
      carouselScrollMarker: 0,
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
        "https://www.instagram.com/p/" + this.item.sourceIdentifier,
      revealed: false,
      sourceCategory: this.item.sourceCategory,
      sourceIdentifier: this.item.sourceIdentifier
    };
  },
  computed: {
    ...mapState({
      isLoggedIn: state => state.user.user,
    }),
    searchQuery() {
      return this.$route.query.search;
    }
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
      if (action == "login") {
        netlifyIdentity.open(action);
        netlifyIdentity.on(action, user => {
          this.setAuth(user);
          netlifyIdentity.close();
        });
      } else if (action == "logout") {
        this.setAuth(null);
        netlifyIdentity.logout();
      }
    },
    disableEditMode() {
      this.$refs.itemContent.setAttribute("contenteditable", false);
      this.$refs.itemName.setAttribute("contenteditable", false);
      this.$refs.itemName.textContent = this.item.name;
      this.$refs.itemContent.innerText = this.item.content;
      this.editingItem = false;
    },
    enableEditMode() {
      this.editingItem = true;
      this.$refs.itemName.setAttribute("contenteditable", true);
      this.$refs.itemContent.setAttribute("contenteditable", true);
    },
    triggerEditItem() {
      if (this.editingItem === false) {
        this.enableEditMode();
      } else {
        this.disableEditMode();
      }
    },
    async editItem() {
      if (netlifyIdentity.currentUser()) {
        this.itemProcessing = true;
        let payload = {
          ID: this.$vnode.key,
          name: this.$refs.itemName.textContent,
          content: this.$refs.itemContent.innerText
        };
        this.editingItem = false;
        this.$refs.itemName.setAttribute("contenteditable", false);
        this.$refs.itemContent.setAttribute("contenteditable", false);
        const editedItem = await this.editItemAction(payload);
        if (editedItem.matchedCount && editedItem.modifiedCount) {
          this.$root.$emit("transmitMessage", "Item successfully edited.");
        }
        this.itemProcessing = false;
      }
    },
    async removeItem() {
      if (netlifyIdentity.currentUser()) {
        this.itemProcessing = true;
        this.confirmRemoval = false;
        let payload = {
          ID: this.$vnode.key,
          media: this.item.media
        };
        const deletedItem = await this.removeItemAction(payload);
        if (deletedItem) {
          this.$root.$emit("transmitMessage", "Item successfully deleted.");
        }
        this.itemProcessing = false;
      }
    },
    nextSlide() {
      this.carouselScrollMarker += this.$refs.carousel.clientWidth;
      this.$refs.carousel.scrollTo({
        left: this.carouselScrollMarker,
        behavior: "smooth"
      });
    },
    prevSlide() {
      this.carouselScrollMarker -= this.$refs.carousel.clientWidth;
      this.$refs.carousel.scrollTo({
        left: this.carouselScrollMarker,
        behavior: "smooth"
      });
    },
    highlight() {
      if(!this.searchQuery) {
        return this.itemContent;
      }
      return this.itemContent.replace(new RegExp(this.searchQuery, "gi"), match => {
        return '<span class="highlighted">' + match + '</span>';
      });
    }
  },
  mounted: function() {
    this.observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.intersectionRatio > 0) {
          entry.target.classList.add("unveil");
          this.observer.unobserve(entry.target);
        }
      });
    });
    this.$el.querySelectorAll(".item__media").forEach(item => {
      let imageElement = item.querySelector('img');
      if (imageElement) {
        imageElement.addEventListener("load", () => {
          this.observer.observe(item);
        });
      }
    });
    if (this.$refs.prev && this.$refs.carousel.scrollLeft === 0) {
      this.$refs.prev.setAttribute("disabled", "");
    }
    let itemHeader = this.$refs.itemHeader;
    itemHeader.addEventListener("click", event => {
      if (!this.editingItem) {
        this.revealed = !this.revealed;
      }
    });
  },
  watch: {
    carouselScrollMarker: function() {
      if (this.$refs.carousel) {
        if (this.carouselScrollMarker < this.$refs.carousel.clientWidth) {
          this.$refs.prev.setAttribute("disabled", "");
        } else {
          this.$refs.prev.removeAttribute("disabled");
        }
        if (
          this.carouselScrollMarker <
          this.$refs.carousel.clientWidth * (this.mediaCount - 1)
        ) {
          this.$refs.next.removeAttribute("disabled");
        } else {
          this.$refs.next.setAttribute("disabled", "");
        }
      }
    }
  },
  props: ["item"]
};
</script>

<style lang="scss">

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
.carousel-controls {
  top: 50%;
  transform: translateY(-100%);
}
.node {
  transition: opacity 400ms;
  &--next {
    svg {
      transform: rotate(180deg);
    }
  }
  svg {
    height: 40px;
    width: 40px;
    path {
      fill: var(--black);
      stroke: var(--yellow);
      stroke-width: 8px;
      transition: fill 400ms;
    }
  }
  &:disabled {
    cursor: default;
    opacity: 0.25;
    svg {
      path {
        fill: transparent !important;
        stroke: var(--white) !important;
        stroke-width: 8px !important;
      }
    }
  }
  &:hover {
    box-shadow: none !important;
    svg {
      path {
        fill: var(--yellow);
      }
    }
  }
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
    content: "";
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
    content: "";
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
    content: "";
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
    content: "";
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

// Editing Item Mode

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
