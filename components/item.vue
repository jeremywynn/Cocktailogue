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
            <!-- <div class="carousel snap" ref="carousel" v-on:resize="resize"> -->
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
        <button v-on:click="prevSlide" ref="prev" class="node node--prev">Prev</button>
        <button v-on:click="nextSlide" ref="next" class="node node--next">Next</button>
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
              <button v-on:click="triggerEditItem" :disabled="itemProcessing">
                <span v-if="editingItem">Cancel Edits</span>
                <span v-else>Edit Item</span>
              </button>
              <button
                v-on:click="editItem"
                v-show="editingItem"
                :disabled="itemProcessing"
              >Save Edits</button>
            </div>
            <div class="action-group" v-if="!editingItem">
              <transition name="fade">
                <div class="button-group">
                  <transition name="fade" mode="out-in">
                    <div class="original-removal" v-if="confirmRemoval === false" key="hideChoice">
                      <button
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
                        <button v-on:click="confirmRemoval = false">No</button>
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
// import Vuetify from 'vuetify/lib'

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
  methods: {
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
      /*
      document.addEventListener("keydown", function(e) {
        console.log(e);
        if (e.key == "Escape") {
          console.log("escape");
          this.disableEditMode();
          document.removeEventListener("keypress");
        }
      });
      */
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
      if (deletedItem) { // Check _id here?
        this.$root.$emit("transmitMessage", "Item successfully deleted.");
      }
      this.itemProcessing = false;
    },
    // removeItem(item) {
    //   this.$emit("remove-item", item);
    // },
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
  computed: {},
  created: function() {
    // console.log("true"); // Does this each time
  },
  mounted: function() {
    // if (this.$refs.carousel) {
    //   window.addEventListener("resize", this.resize); // Eventually use resizeObserver here
    // }

    this.observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.intersectionRatio > 0) {
          // console.log("in the view");
          entry.target.classList.add("unveil");
          this.observer.unobserve(entry.target);
        } else {
          // console.log("out of view");
        }
      });
    });

    // itemImageObserver.observe(this.$el);
    // console.log(this.$refs.mediaItem);

    this.observer.observe(this.$el);

    // console.log(this);
    // console.log(this.$el);
    // console.log(this.$refs.mediaItem);

    this.$el.querySelectorAll(".item__media").forEach(item => {
      this.observer.observe(item);
    });

    // this.$refs.mediaItem.forEach(mediaItem => {
    //   itemMediaObserver.observe(mediaItem);
    // });

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
  display: flex;
  margin-left: 0.5rem;
}
.confirm-text {
  font-size: 80%;
  margin-right: 0.5rem;
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
  top: 45%;
  padding: 0 1rem;
  width: 100%;
}

.node {
  &--prev {
    float: left;
  }
  &--next {
    float: right;
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
.media-item {
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
  border: 2px solid;
  border-top: 0;
  overflow: hidden;
  .item__header {
    position: relative;
  }

  &__contents {
    // display: none;
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
      // overflow: hidden;
      padding: 1rem;
      resize: none;
      // resize: vertical;
      width: 100%;

      // min-height: 100%;
      // position: absolute;
      // top: 0;
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
    border-top: 2px solid;
  }
  &.tease {
    .item__header {
    }
    .item__title {
      bottom: 0;
      // position: absolute;
      text-shadow: 0 0 3px black;
    }
    .item__media {
      opacity: 1;
    }
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
    .item__contents {
      // display: block;
    }
  }
  &.intersected {
    color: red;
  }
  &.detected {
    color: yellow !important;
  }
}

.item__header {
  cursor: pointer;
}

.item__title {
  background-color: rgba(0, 0, 0, 0.667);
  bottom: 0;
  font-size: 1.5rem;
  // font-weight: 700;
  padding: 0.5rem;
  position: absolute;
  text-shadow: 0 0 3px black;
  width: 100%;
  .item-name {
    // font: inherit;
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
    // text-shadow: inherit;
    width: 100%;
    z-index: -1;
  }
}

.item-name {
  position: relative;
  transition: box-shadow 200ms;
  &:after,
  &:before {
    background-color: white;
    content: "";
    display: block;
    opacity: 0;
    position: absolute;
    transition: opacity 400ms;
  }
  &:after {
    bottom: 0;
    height: 2px;
    left: 2px;
    transform-origin: left;
    width: calc(100% - 4px);
  }
  &:before {
    height: calc(100% - 1px);
    right: 0;
    top: 1px;
    transform-origin: top;
    width: 2px;
  }
}

.title-interior {
  position: relative;
  &:after,
  &:before {
    background-color: white;
    content: "";
    display: block;
    opacity: 0;
    position: absolute;
    transition: opacity 400ms;
  }
  &:after {
    // animation: editIndicatorTopLtR 150ms linear reverse;
    height: 2px;
    top: 0;
    transform-origin: left;
    width: 100%;
  }
  &:before {
    height: calc(100% - 2px);
    left: 0;
    top: 2px;
    transform-origin: top;
    width: 2px;
  }
  // &:focus {
  //   &:after,
  //   &:before {
  //     background-color: yellow;
  //   }
  // }
}

.item__source-url {
  a {
    color: yellow;
  }
}

.item__content {
  // font-size: calc(0.825rem + 0.375vw);
  // line-height: 1.4;
  margin-bottom: 1rem;
  position: relative;
  &:after,
  &:before {
    background-color: white;
    content: "";
    display: block;
    opacity: 0;
    position: absolute;
    transition: opacity 400ms;
  }
  &:after {
    height: 2px;
    top: 0;
    transform-origin: left;
    width: 100%;
  }
  &:before {
    height: calc(100% - 2px);
    left: 0;
    top: 2px;
    transform-origin: top;
    width: 2px;
  }
  @media only all and (min-width: 40em) {
    // font-size: 1.05rem;
  }
}

.item-content {
  // font-size: 90%;
  line-height: 1.6;
  position: relative;
  transition: box-shadow 200ms;
  &:after,
  &:before {
    background-color: white;
    content: "";
    display: block;
    opacity: 0;
    position: absolute;
    transition: opacity 400ms;
  }
  &:after {
    bottom: 0;
    height: 2px;
    left: 2px;
    transform-origin: left;
    width: calc(100% - 4px);
  }
  &:before {
    height: calc(100% - 2px);
    right: 0;
    top: 2px;
    transform-origin: top;
    width: 2px;
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
  .item__title {
    // position: relative;
    // z-index: 2;
  }
  .item-name {
    cursor: text;
    // outline: 1px solid;
    // opacity: 0;
    // position: absolute;
    // z-index: -1;
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
      box-shadow: 0 0 1rem yellow inset;
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
      box-shadow: 0 0 1rem yellow inset;
    }
  }
  /*
  input[type="text"] {
    opacity: 1;
    pointer-events: auto;
    position: static;
    z-index: 1;
  }
  */
  .item-content {
    // border: 1px solid;
    // outline: 1px solid;
    // opacity: 0;
    // pointer-events: none;
    // z-index: -1;
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
