<template>
  <div class="app" id="top">
    <div class="container">
      <div class="apex flex p-2 justify-between">
        <div class="item-count">
          <div class="search-count" v-if="searchQuery">{{ items.length }} <span v-if="items.length > 1">items</span><span v-else>item</span> found</div>
          <div class="grand-count" v-else>
            {{ grandTotal }} <span v-if="grandTotal > 1">items</span><span v-else>item</span> found
          </div>
        </div>
        <div class="login-area">
          <div class="cursor-pointer hover:underline" v-if="isLoggedIn" v-on:click="triggerNetlifyIdentityAction('logout')">Logout</div>
          <div class="cursor-pointer hover:underline" v-else v-on:click="triggerNetlifyIdentityAction('login')">Login</div>
        </div>
      </div>
    </div>
    
    <a href="#top" class="top-link fixed no-underline opacity-0 p-2 pointer-events-none" id="top-link" v-on:click="scrollToTop">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 492 492" class="block mx-auto">
        <path d="M198.608 246.104L382.664 62.04c5.068-5.056 7.856-11.816 7.856-19.024 0-7.212-2.788-13.968-7.856-19.032l-16.128-16.12C361.476 2.792 354.712 0 347.504 0s-13.964 2.792-19.028 7.864L109.328 227.008c-5.084 5.08-7.868 11.868-7.848 19.084-.02 7.248 2.76 14.028 7.848 19.112l218.944 218.932c5.064 5.072 11.82 7.864 19.032 7.864 7.208 0 13.964-2.792 19.032-7.864l16.124-16.12c10.492-10.492 10.492-27.572 0-38.06L198.608 246.104z"/>
      </svg>
    </a>
    <div class="container">
      <div class="communicator fixed text-center w-full z-10">
        <message />
      </div>
      <main class="px-2">
        <header class="app-header flex mb-2" id="app-header">
          <nuxt-link to="/" v-if="searchQuery" class="backlink flex flex-none items-center mr-2 no-underline px-2 py-1">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="block mx-auto">
              <path d="M491.318 235.318H20.682C9.26 235.318 0 244.578 0 256c0 11.423 9.26 20.682 20.682 20.682h470.636c11.423 0 20.682-9.259 20.682-20.682 0-11.422-9.259-20.682-20.682-20.682z"/>
              <path d="M49.932 256L211.795 94.136c8.077-8.077 8.077-21.172 0-29.249-8.077-8.076-21.172-8.076-29.249 0L6.058 241.375c-8.077 8.077-8.077 21.172 0 29.249l176.488 176.488a20.616 20.616 0 0 0 14.625 6.058 20.616 20.616 0 0 0 14.625-6.058c8.077-8.077 8.077-21.172 0-29.249L49.932 256z"/>
            </svg>
          </nuxt-link>
          <form @submit.prevent="searchItems" class="form form--search flex-auto" id="form--search" role="search" aria-label="Search">
            <fieldset>
              <div class="form-field flex">
                <input class="p-2 w-full flex-auto rounded-none bg-transparent" type="text" id="search-field" v-model="searchTerms" placeholder="Search" />
              </div>
            </fieldset>
          </form>
          <button class="app-action flex-none ml-2" v-on:click="addingItem = !addingItem" v-bind:class="{ 'subtle': addingItem }" data-entity="open-add-item-menu">
            <span v-if="!addingItem" class="block">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 491.86 491.86" class="block mx-auto">
                <path d="M465.167 211.614H280.245V26.691c0-8.424-11.439-26.69-34.316-26.69s-34.316 18.267-34.316 26.69v184.924H26.69C18.267 211.614 0 223.053 0 245.929s18.267 34.316 26.69 34.316h184.924v184.924c0 8.422 11.438 26.69 34.316 26.69s34.316-18.268 34.316-26.69V280.245H465.17c8.422 0 26.69-11.438 26.69-34.316s-18.27-34.315-26.693-34.315z"/>
              </svg>
            </span>
            <span v-if="addingItem" class="block">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 47.971 47.971" class="block mx-auto">
                <path d="M28.228 23.986L47.092 5.122a2.998 2.998 0 0 0 0-4.242 2.998 2.998 0 0 0-4.242 0L23.986 19.744 5.121.88a2.998 2.998 0 0 0-4.242 0 2.998 2.998 0 0 0 0 4.242l18.865 18.864L.879 42.85a2.998 2.998 0 1 0 4.242 4.241l18.865-18.864L42.85 47.091c.586.586 1.354.879 2.121.879s1.535-.293 2.121-.879a2.998 2.998 0 0 0 0-4.242L28.228 23.986z"/>
              </svg>
            </span>
          </button>
        </header>
        <transition-expand>
          <div class="add w-full" v-show="addingItem" data-entity="add-item-menu">
            <div class="add-interior pb-2">
              <form @submit.prevent class="form form--add">
                <fieldset>
                  <div class="instructions leading-normal pb-2">
                    <div class="instructions__content px-2 py-3">
                      <p>To add an item, use the file input below to select a JSON file generated from <a class="underline hover:no-underline" href="https://instaloader.github.io/" rel="noreferrer" target="_blank">Instaloader</a>.</p>
                    </div>
                  </div>
                  <transition-expand>
                    <div class="item-preview mb-2" v-show="newItemContent" data-entity="item-preview">
                      <div class="item editing">
                        <div class="header-wrap">
                          <div class="item__header">
                            <div class="item__title">
                              <label>Title</label>
                              <div class="title-interior">
                                <div
                                  class="item-name"
                                  contenteditable="true"
                                  v-html="newItemName"
                                  ref="newItemName"
                                  @paste="stripMarkup"
                                ></div>
                              </div>
                            </div>
                            <div class="item__media">
                              <div class="carousel-wrapper" v-if="newItemMedia.length > 1">
                                <div class="carousel snap flex relative h-full overflow-hidden w-full whitespace-no-wrap" ref="carousel">
                                  <div class="carousel-item flex items-center justify-center min-h-full min-w-full text-center" v-for="media in newItemMedia">
                                    <img v-bind:src="media.url" v-if="media.type === 'GraphImage'" alt />
                                    <img v-bind:src="media.url" v-else-if="media.type === 'GraphVideo'" alt />
                                  </div>
                                </div>
                                <div class="carousel-controls">
                                  <button v-on:click="prevSlide" ref="prev" class="node node--prev" disabled>
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
                              <div v-for="media in newItemMedia" v-if="newItemMedia.length < 2">
                                <img v-bind:src="media.url" v-if="media.type === 'GraphImage'" alt />
                                <img v-bind:src="media.url" v-else-if="media.type === 'GraphVideo'" alt />
                              </div>
                              <div class="media-item" v-if="newItemMedia.length === 0">
                                <img src="~/assets/drunk-uncle-720x720-recipe.jpg" alt />
                              </div>
                            </div>
                          </div>
                        </div>
                        <div class="item__contents">
                          <div class="item__content">
                            <div
                              class="item-content"
                              contenteditable="true"
                              v-html="newItemContent"
                              ref="newItemContent"
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </transition-expand>
                  <footer class="add-footer flex flex-auto">
                    <input class="w-full" type="file" accept="application/json" @change="processFile($event)" ref="jsonFile" data-entity="choose-json-file" />
                    <div class="add-actions flex flex-none flex-no-wrap">
                      <div class="add-action ml-2 whitespace-no-wrap" v-if="isLoggedIn" data-entity="add-item-action">
                        <button v-on:click="addItem" v-show="newItemContent" :disabled="itemAddProcessing">Add Item</button>
                      </div>
                      <div class="add-action ml-2 whitespace-no-wrap" v-else data-entity="add-item-action">
                        <button v-on:click="triggerNetlifyIdentityAction('login')" v-show="newItemContent" :disabled="itemAddProcessing" class="unauthorized">Add Item</button>
                      </div>
                      <div class="add-action ml-2 whitespace-no-wrap">
                        <button class="subtle"
                        v-on:click="resetAddForm"
                        v-show="newItemContent"
                        :disabled="itemAddProcessing"
                        data-entity="cancel-add-item"
                      >
                          <svg class="block mx-auto" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 47.971 47.971">
                            <path d="M28.228 23.986L47.092 5.122a2.998 2.998 0 0 0 0-4.242 2.998 2.998 0 0 0-4.242 0L23.986 19.744 5.121.88a2.998 2.998 0 0 0-4.242 0 2.998 2.998 0 0 0 0 4.242l18.865 18.864L.879 42.85a2.998 2.998 0 1 0 4.242 4.241l18.865-18.864L42.85 47.091c.586.586 1.354.879 2.121.879s1.535-.293 2.121-.879a2.998 2.998 0 0 0 0-4.242L28.228 23.986z"/>
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
        <div class="items pb-8" ref="items" id="items" v-if="items.length">
          <item
            v-for="(item, index) in items"
            :class="{ 'tease': index === 0 }"
            :item="item"
            :key="item._id"
          />
          <div class="items-footer" ref="itemsFooter"></div>
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
import item from "@@/components/item.vue";
import loading from "@@/components/loading.vue";
import message from "@@/components/message.vue";
import TransitionExpand from '@@/components/TransitionExpand.vue'

import { mapActions, mapMutations, mapState } from "vuex";
import netlifyIdentity from "netlify-identity-widget";

netlifyIdentity.init({
  logo: false
});

export default {
  watchQuery: ['search'],
  async fetch({ store, query }) {
    try {
      if (query.search) {
        await store.dispatch('items/searchItems', query.search);
      }
      else {
        await store.dispatch('items/getItems');
      }
    } catch (err) {
      console.log(err);
    }
  },
  data: function() {
    return {
      addingItem: false,
      currentUser: null,
      carouselScrollMarker: 0,
      itemIncrementer: 0,
      itemAddProcessing: false,
      jsonData: null,
      newItemMedia: [],
      newItemContent: null,
      newItemName: null,
      newItemSourceCategory: null,
      newItemSourceUrl: null,
      searchTerms: this.$route.query.search
    };
  },
  methods: {
    ...mapActions({
      addItemAction: 'items/addItem',
      getAdditionalItems: 'items/getAdditionalItems'
    }),
    ...mapMutations({
      setAuth: 'user/SET_USER'
    }),
    async searchItems() {
      if (this.searchTerms) {
        this.addingItem = false;
        this.resetAddForm();
        this.$router.push({
          name: 'index',
          query: {
            search: this.searchTerms
          }
        });
      }
      else {
        return false;
      }
    },
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
    processFile(event) {
      let reader = new FileReader();
      reader.readAsText(event.target.files[0]);
      reader.addEventListener(
        "load",
        function(evt) {
          this.newItemName = null;
          this.newItemMedia = [];
          this.newItemContent = null;
          this.jsonData = JSON.parse(evt.target.result);
          this.newItemId = this.jsonData.node.id;
          let instaNode = this.jsonData.node;
          if (instaNode.hasOwnProperty("edge_sidecar_to_children")) {
            let sidecars = this.jsonData.node.edge_sidecar_to_children.edges;
            sidecars.forEach(function(sidecar) {
              let sidecarToPush = {};
              sidecarToPush["type"] = sidecar.node.__typename;
              sidecarToPush["id"] = sidecar.node.id; // For file name
              sidecarToPush["url"] = sidecar.node.display_url;
              this.newItemMedia.push(sidecarToPush);
            }, this);
          } else {
            let newMediaToPush = {};
            newMediaToPush["type"] = this.jsonData.node.__typename;
            newMediaToPush["id"] = this.jsonData.node.id; // For file name
            newMediaToPush["url"] = this.jsonData.node.display_url;
            if (newMediaToPush["type"] === "GraphVideo") {
              newMediaToPush["video_url"] = this.jsonData.node.video_url;
            }
            this.newItemMedia.push(newMediaToPush);
          }
          this.newItemContent = this.jsonData.node.edge_media_to_caption.edges[0].node.text;
          this.newItemSourceIdentifier = this.jsonData.node.shortcode;
        }.bind(this),
        false
      );
    },
    addItem() {
      if (!this.newItemContent || !this.$refs.newItemContent.innerText) {
        return;
      }
      this.saveItems();
    },
    async saveItems() {
      if (netlifyIdentity.currentUser()) {
        this.itemAddProcessing = true;
        let payload = {
          name: this.$refs.newItemName.textContent,
          media: this.newItemMedia,
          content: this.$refs.newItemContent.innerText,
          sourceCategory: "Instagram",
          sourceIdentifier: this.newItemSourceIdentifier
        };
        const newItem = await this.addItemAction(payload);
        if (newItem) {
          this.resetAddForm();
          this.addingItem = false;
          this.scrollToTop();
          this.$root.$emit("transmitMessage", "Item successfully added.");
        }
        this.itemAddProcessing = false;
      }
    },
    resetAddForm() {
      // Resetting Addition Form Values
      this.newItemName = null;
      this.$refs.newItemName.textContent = '';
      this.newItemMedia = [];
      this.newItemContent = null;
      this.$refs.jsonFile.value = "";
      this.newItemSourceCategory = null;
      this.newItemSourceIdentifier = null;
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
    prepareForRouteChange() {
      this.addingItem = false;
      this.resetAddForm();
      this.configureInfiniteFooter();
    },
    configureInfiniteFooter() {
      if (this.observer) {
        this.observer.unobserve(this.$refs.itemsFooter);
      }
      // Strengthen this logic
      this.observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.intersectionRatio > 0) {
            if (this.$store.state.itemsRemaining === false) {
              this.observer.unobserve(this.$refs.itemsFooter);
            } else {
              // Get id of last element in state
              let lastItemId = this.items[this.items.length - 1]._id;
              if (this.loading === false && !this.$route.query.search) {
                console.log('performing lookup');
                this.getAdditionalItems(lastItemId);
              }
            }
          }
        });
      });

      if (!this.$route.query.search && this.$refs.itemsFooter) {
        // Find a better way to do this
        window.setTimeout(() => {
          this.observer.observe(this.$refs.itemsFooter);
        }, 400);
      }
    },
    scrollToTop() {
      if (event) {
        event.preventDefault();
      }
      window.scrollTo(0, 0);
    },
    stripMarkup(event) {
      event.preventDefault();
      let paste = (event.clipboardData || window.clipboardData).getData('text');
      event.target.textContent = paste;
    }
  },
  computed: {
    ...mapState({
      grandTotal: state => state.items.itemCount,
      loading: state => state.loading.loading,
      isLoggedIn: state => state.user.user,
      items: state => state.items.items
    }),
    searchQuery() {
      return this.$route.query.search;
    },
  },
  mounted: function() {

    if (this.$refs.itemsFooter) {
      this.configureInfiniteFooter();
    }

    let appHeader = document.getElementById('app-header');
    let topLink = document.getElementById('top-link');
    
    let options = {
      root: null,
      rootMargin: '0px',
      threshold: 1.0
    }

    let callback = (entries, observer) => { 
      entries.forEach(entry => {
        if (entry.intersectionRatio != 1) {
          topLink.classList.add('active');
        }
        else {
          topLink.classList.remove('active');
        }
      });
    };

    let observer = new IntersectionObserver(callback, options);
    observer.observe(appHeader);
    
  },
  watch: {
    '$route': 'prepareForRouteChange',
    carouselScrollMarker: function() {
      if (this.$refs.carousel) {
        if (this.carouselScrollMarker < this.$refs.carousel.clientWidth) {
          this.$refs.prev.setAttribute("disabled", "");
        } else {
          this.$refs.prev.removeAttribute("disabled");
        }
        if (
          this.carouselScrollMarker <
          this.$refs.carousel.clientWidth * (this.newItemMedia.length - 1)
        ) {
          this.$refs.next.removeAttribute("disabled");
        } else {
          this.$refs.next.setAttribute("disabled", "");
        }
      }
    },
  },
  components: {
    item,
    loading,
    message,
    TransitionExpand
  }
};
</script>

<style lang="scss">
html {
  background-color: #000;
  color: #fff;
}
img {
  max-width: 100%;
}

.container {
  margin: 0 auto;
  max-width: 40rem;
}

/* 2018 spec - For Safari 11, Chrome 69+ */
.carousel.snap {
  scroll-snap-type: x mandatory;
  -webkit-overflow-scrolling: touch; /* Needed to work on iOS Safari */
}

.carousel.snap > div {
  scroll-snap-align: start;
}

.carousel.snap {
  scroll-snap-type: mandatory;
  -ms-scroll-snap-type: mandatory;
  scroll-snap-points-x: repeat(100%);
  -ms-scroll-snap-points-x: repeat(100%);
}

.backlink {
  background-color: rgba(255, 250, 14, 1);
  font-size: 2rem;
  line-height: 0;
  transition: box-shadow 400ms;
  svg {
    height: 20px;
    width: 20px;
    fill {
      color: #fff;
    }
  }
  &:hover, &:focus, &:active {
    box-shadow: 0 0 8px rgba(255, 250, 14, 1);
  }
}

.carousel > div {
  color: #fff;
  // display: flex;
}

.add {
  .item__media {
    opacity: 1;
  }
}

.lower-brow {
  z-index: 2;
}

.communicator {
  left: 50%;
  max-width: 80%;
  top: 10%;
  transform: translateX(-50%);
}

.form {
  &--search {
    input {
      color: rgba(255, 255, 255, 1);
      &:hover, &:focus, &:active {
        border-color: rgba(255, 250, 14, 1);
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
    fill: #000;
    height: 20px;
    width: 20px;
  }
}

.disclaimer {
  border-top: 2px solid rgba(255, 250, 14, 1);
}

.instructions {
  border-top: 2px solid rgba(255, 250, 14, 1);
  &__content {
    a {
      color: rgba(255, 250, 14, 1);
    }
  }
}

.add-action {
  button {
    svg {
      fill: #fff;
      height: 18px;
      width: 18px;
    }
  }
  .subtle {
    svg {
      fill: #000;
    }
  }
}

.top-link {
  background-color:rgba(255, 250, 14, 1);
  right: 0.5rem;
  transition: opacity 400ms;
  top: 0.5rem;
  z-index: -1;
  svg {
    height: 20px;
    transform: rotate(90deg);
    width: 20px;
    path {
      fill: rgba(0, 0, 0, 1);
      stroke: rgba(255, 250, 14, 1);
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
  color: rgba(255, 250, 14, 1);
}

</style>
