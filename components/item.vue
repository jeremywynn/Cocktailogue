<template>
  <div class="item" v-bind:class="{ 'editing': editingItem, 'reveal': revealed }" ref="item">
    <div class="header-wrap">
      <div class="item__header" ref="itemHeader">
        <div class="item__title">
          <div class="title-interior">
            <div class="item-name" ref="itemName">{{ itemName }}</div>
          </div>
        </div>
        <div class="item__media">
          <div class="carousel-wrapper" v-if="item.media.length > 1">
            <div class="carousel snap" ref="carousel">
              <div class="media-item" v-for="media in item.media">
                <img
                  v-bind:src="'https://ik.imagekit.io/94ka2dfnz' + media.path"
                  v-if="media.path"
                  alt
                />
              </div>
            </div>
          </div>
          <div
            class="media-item"
            v-if="item.media.length === 1"
            v-for="media in item.media"
            ref="mediaItem"
          >
            <img v-bind:src="'https://ik.imagekit.io/94ka2dfnz' + media.path" v-if="media.path" alt />
            <img v-bind:src="media.url" v-else alt />
          </div>
          <div class="media-item" v-if="item.media.length === 0">
            <img src="~/assets/drunk-uncle-720x720-recipe.jpg" alt />
          </div>
        </div>
      </div>
      <div class="carousel-controls" v-if="item.media.length > 1">
        <button v-on:click="prevSlide" ref="prev" class="node node--prev">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 492 492">
            <path d="M198.608 246.104L382.664 62.04c5.068-5.056 7.856-11.816 7.856-19.024 0-7.212-2.788-13.968-7.856-19.032l-16.128-16.12C361.476 2.792 354.712 0 347.504 0s-13.964 2.792-19.028 7.864L109.328 227.008c-5.084 5.08-7.868 11.868-7.848 19.084-.02 7.248 2.76 14.028 7.848 19.112l218.944 218.932c5.064 5.072 11.82 7.864 19.032 7.864 7.208 0 13.964-2.792 19.032-7.864l16.124-16.12c10.492-10.492 10.492-27.572 0-38.06L198.608 246.104z"/>
          </svg>
        </button>
        <button v-on:click="nextSlide" ref="next" class="node node--next">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 492 492">
            <path d="M198.608 246.104L382.664 62.04c5.068-5.056 7.856-11.816 7.856-19.024 0-7.212-2.788-13.968-7.856-19.032l-16.128-16.12C361.476 2.792 354.712 0 347.504 0s-13.964 2.792-19.028 7.864L109.328 227.008c-5.084 5.08-7.868 11.868-7.848 19.084-.02 7.248 2.76 14.028 7.848 19.112l218.944 218.932c5.064 5.072 11.82 7.864 19.032 7.864 7.208 0 13.964-2.792 19.032-7.864l16.124-16.12c10.492-10.492 10.492-27.572 0-38.06L198.608 246.104z"/>
          </svg>
        </button>
      </div>
    </div>
    
    <v-expand-transition>
      <div class="expander" v-show="revealed">
        <div class="item__contents">
          <div class="item__content">
            <div class="item-content" ref="itemContent">{{ itemContent }}</div>
          </div>
          <div class="item__meta">
            <div class="item__source-category" v-if="sourceCategory">{{ sourceCategory }}</div>
            <div class="item__source-url" v-if="sourceIdentifier">
              <a :href="reconstructedUrl" target="_blank" rel="noreferrer">{{ reconstructedUrl }}</a>
            </div>
          </div>
          <div class="item__actions">
            <div class="action-group action-group--editing">
              <div class="edit-option" v-if="isLoggedIn">
                <button v-on:click="triggerEditItem" :disabled="itemProcessing" v-bind:class="{ 'subtle': editingItem }">
                  <span v-if="editingItem">Cancel Edits</span>
                  <span v-else>Edit Item</span>
                </button>
                <button
                  v-on:click="editItem"
                  v-show="editingItem"
                  :disabled="itemProcessing"
                >Save Edits</button>
              </div>
              <div class="edit-option" v-else>
                <button v-on:click="triggerNetlifyIdentityAction('login')" :disabled="itemProcessing" class="unauthorized">
                  <span>Edit Item</span>
                </button>
              </div>
            </div>
            <div class="action-group" v-if="!editingItem">
              <transition name="fade">
                <div class="button-group">
                  <transition name="fade" mode="out-in">
                    <div class="removal-option" v-if="isLoggedIn">
                      <div class="original-removal" v-if="confirmRemoval === false" key="hideChoice">
                        <button
                          class="negative"
                          v-on:click="confirmRemoval = true"
                          v-show="!editingItem"
                          :disabled="itemProcessing"
                        >Delete Item</button>
                      </div>
                      <div class="confirm-removal" v-if="confirmRemoval === true" key="showChoice">
                        <span class="confirm-text">Delete?</span>
                        <div class="choice">
                          <button v-on:click="removeItem">Yes</button>
                        </div>
                        <div class="choice">
                          <button class="subtle" v-on:click="confirmRemoval = false">No</button>
                        </div>
                      </div>
                    </div>
                    <div class="removal-option" v-else>
                      <div class="original-removal" v-if="confirmRemoval === false" key="hideChoice">
                        <button
                          class="negative unauthorized"
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
    </v-expand-transition>
  </div>
</template>

<script>

import { mapGetters, mapActions } from "vuex";
import netlifyIdentity from "netlify-identity-widget";

netlifyIdentity.init({
  APIUrl: "https://cocktailogue.netlify.com/.netlify/identity", // Get URL of Netlify site
  logo: false // you can try false and see what happens
});

export default {
  data: function() {
    return {
      carouselScrollMarker: 0,
      confirmRemoval: false,
      editingItem: false,
      itemContent: this.item.content,
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
    isLoggedIn() {
      return this.$store.state.user;
    },
    user() {
      return JSON.parse(this.$store.state.user);
    },
  },
  methods: {
    updateUser(payload) {
      this.$store.dispatch("updateUser", payload);
    },
    triggerNetlifyIdentityAction(action) {
      if (action == "login" || action == "signup") {
        netlifyIdentity.open(action);
        netlifyIdentity.on(action, user => {
          this.currentUser = {
            username: user.user_metadata.full_name,
            email: user.email,
            access_token: user.token.access_token,
            expires_at: user.token.expires_at,
            refresh_token: user.token.refresh_token,
            token_type: user.token.token_type
          };
          this.updateUser({
            currentUser: this.currentUser
          });
          netlifyIdentity.close();
        });
      } else if (action == "logout") {
        this.currentUser = null;
        this.updateUser({
          currentUser: this.currentUser
        });
        netlifyIdentity.logout();
        this.$router.push({ name: "Index" });
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
      this.itemProcessing = true;
      let payload = {
        ID: this.$vnode.key,
        name: this.$refs.itemName.textContent,
        content: this.$refs.itemContent.innerText
      };
      this.editingItem = false;
      this.$refs.itemName.setAttribute("contenteditable", false);
      this.$refs.itemContent.setAttribute("contenteditable", false);
      const editedItem = await this.$store.dispatch("EDIT_ITEM", payload);
      if (editedItem.matchedCount && editedItem.modifiedCount) {
        this.$root.$emit("transmitMessage", "Item successfully edited.");
      }
      this.itemProcessing = false;
    },
    async removeItem() {
      this.itemProcessing = true;
      this.confirmRemoval = false;
      let payload = {
        ID: this.$vnode.key,
        media: this.media
      };
      const deletedItem = await this.$store.dispatch("DELETE_ITEM", payload);
      console.log(deletedItem);
      if (deletedItem) {
        this.$root.$emit("transmitMessage", "Item successfully deleted.");
      }
      this.itemProcessing = false;
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
    }
    /*
      Uncaught TypeError: Cannot read property 'scrollTo' of undefined
      at VueComponent.resize (pages_index.js:504)
    */
    // resize() {
    //   this.$refs.carousel.scrollTo({
    //     left: this.$refs.carousel.scrollLeft - 1,
    //     behavior: "smooth"
    //   });
    // }
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

    this.$refs.itemContent.spellcheck = false;
    this.$refs.itemName.spellcheck = false;

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
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}

.confirm-removal {
  align-items: center;
  display: flex;
  margin-left: 0.5rem;
}
.confirm-text {
  font-size: 80%;
}
.choice {
  margin-left: 0.5rem;
}
.original-removal {
  button {
    display: block;
  }
}

.action-group {
  &--editing {
    display: flex;
    justify-content: space-between;
    width: 100%;
  }
}

.button-group {
  display: flex;
  margin-left: 2rem;
}

.carousel-wrapper {
  position: relative;
}
.carousel-controls {
  position: absolute;
  top: 50%;
  padding: 0 1rem;
  transform: translateY(-100%);
  width: 100%;
}

.node {
  background-color: transparent;
  border: 0;
  border-radius: 0;
  outline: none;
  transition: opacity 400ms;
  &--prev {
    float: left;
  }
  &--next {
    float: right;
    svg {
      transform: rotate(180deg);
    }
  }
  svg {
    display: block;
    height: 40px;
    margin: 0 auto;
    width: 40px;
    path {
      fill: rgba(0, 0, 0, 1);
      stroke: rgba(255, 250, 14, 1);
      stroke-width: 8px;
      transition: fill 400ms;
    }
  }
  &:disabled {
    opacity: 0.25;
    svg {
      path {
        fill: transparent !important;
        stroke: #fff !important;
        stroke-width: 8px !important;
      }
    }
  }
  &:hover {
    box-shadow: none !important;
    svg {
      path {
        fill: rgba(255, 250, 14, 1);
      }
    }
  }
}

.item__actions {
  align-items: flex-start;
  display: flex;
  margin-top: 1rem;
  justify-content: space-between;
  padding: 0 1rem 1rem;
  button {
    display: block;
    white-space: nowrap;
  }
}

.header-wrap {
  position: relative;
}
.item__meta {
  padding: 0 1rem;
}
.item-content {
  padding: 1rem;
}
.item {
  border: 1px solid rgba(255, 255, 255, 1);
  border-top: 0;
  overflow: hidden;
  .item__header {
    position: relative;
  }

  &__contents {
    font-size: 95%;
    padding: 0.5rem;
    position: relative;
  }
  &__content {
    position: relative;
    white-space: pre-line;
    textarea {
      -webkit-appearance: none;
      background: transparent;
      border: 0;
      border-radius: 0;
      color: inherit;
      font-size: inherit;
      line-height: inherit;
      min-height: 20vh;
      padding: 1rem;
      resize: none;
      width: 100%;
    }
  }
  &__media {
    bottom: 0;
    left: 0;
    right: 0;
    top: 0;
    opacity: 0;
    transition: opacity 400ms;
    &.unveil {
      opacity: 1;
    }
    img {
      display: block;
      object-fit: contain;

      width: 100%;
      z-index: -1;
    }
    video {
      width: 100%;
    }
  }
  &:first-child {
    border-top: 1px solid rgba(255, 255, 255, 1);
  }
  &.reveal {
    .item__header {
      display: block;
      position: relative;
    }
    .item__title {
      bottom: 0;
      position: absolute;
    }
    .item__media {
      display: block;
    }
  }
}

.item__header {
  cursor: pointer;
}

.item__title {
  background-color: rgba(0, 0, 0, 0.667);
  bottom: 0;
  font-size: calc(1rem + 1vw);
  padding: 0.5rem;
  position: absolute;
  text-shadow: 0 0 3px black;
  width: 100%;
  @media only all and (min-width: 56em) {
    font-size: 1.5rem;
  }
  .item-name {
    padding: 0.5rem 1rem;
    width: 100%;
  }
  input[type="text"] {
    -webkit-appearance: none;
    background-color: rgba(0, 0, 0, 0.5);
    border: 0;
    border-radius: 0;
    color: inherit;
    font: inherit;
    opacity: 0;
    padding: 0.5rem 1rem;
    pointer-events: none;
    position: absolute;
    width: 100%;
    z-index: -1;
  }
}

.item-name {
  position: relative;
  transition: box-shadow 200ms;
  &:after,
  &:before {
    background-color: rgba(255, 250, 14, 1);
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
  position: relative;
  &:after,
  &:before {
    background-color: rgba(255, 250, 14, 1);
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
    color: rgba(255, 250, 14, 1);
    &:hover {
      text-decoration: none;
    }
  }
}

.item__content {
  margin-bottom: 1rem;
  position: relative;
  &:after,
  &:before {
    background-color: rgba(255, 250, 14, 1);
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
  line-height: 1.6;
  position: relative;
  transition: box-shadow 200ms;
  &:after,
  &:before {
    background-color: rgba(255, 250, 14, 1);
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
      box-shadow: 0 0 1rem rgba(255, 250, 14, 1) inset;
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
      box-shadow: 0 0 1rem rgba(255, 250, 14, 1) inset;
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
