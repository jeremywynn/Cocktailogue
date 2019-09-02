<template>
  <div class="container">
    <div class="communicator">
      <message />
    </div>

    <header class="app-header">
      <form @submit.prevent="searchItems" class="form form--search">
        <fieldset>
          <div class="form-field">
            <input type="text" v-model="searchTerms" id="search-field" placeholder="Search" />
            <button type="submit">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30.239 30.239">
                <path d="M20.194 3.46c-4.613-4.613-12.121-4.613-16.734 0-4.612 4.614-4.612 12.121 0 16.735 4.108 4.107 10.506 4.547 15.116 1.34.097.459.319.897.676 1.254l6.718 6.718a2.498 2.498 0 0 0 3.535 0 2.496 2.496 0 0 0 0-3.535l-6.718-6.72a2.5 2.5 0 0 0-1.253-.674c3.209-4.611 2.769-11.008-1.34-15.118zm-2.121 14.614c-3.444 3.444-9.049 3.444-12.492 0-3.442-3.444-3.442-9.048 0-12.492 3.443-3.443 9.048-3.443 12.492 0 3.444 3.444 3.444 9.048 0 12.492z"/>
              </svg>
            </button>
          </div>
        </fieldset>
      </form>
      <!-- <div class="header-action"> -->
        <button class="app-action" v-on:click="addingItem = !addingItem">
          <span v-if="!addingItem">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 491.86 491.86">
              <path d="M465.167 211.614H280.245V26.691c0-8.424-11.439-26.69-34.316-26.69s-34.316 18.267-34.316 26.69v184.924H26.69C18.267 211.614 0 223.053 0 245.929s18.267 34.316 26.69 34.316h184.924v184.924c0 8.422 11.438 26.69 34.316 26.69s34.316-18.268 34.316-26.69V280.245H465.17c8.422 0 26.69-11.438 26.69-34.316s-18.27-34.315-26.693-34.315z"/>
            </svg>
          </span>
          <span v-if="addingItem">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 47.971 47.971">
              <path d="M28.228 23.986L47.092 5.122a2.998 2.998 0 0 0 0-4.242 2.998 2.998 0 0 0-4.242 0L23.986 19.744 5.121.88a2.998 2.998 0 0 0-4.242 0 2.998 2.998 0 0 0 0 4.242l18.865 18.864L.879 42.85a2.998 2.998 0 1 0 4.242 4.241l18.865-18.864L42.85 47.091c.586.586 1.354.879 2.121.879s1.535-.293 2.121-.879a2.998 2.998 0 0 0 0-4.242L28.228 23.986z"/>
            </svg>
          </span>
        </button>
      <!-- </div> -->
    </header>
    <v-expand-transition>
      <div class="add" v-show="addingItem">
        <div class="add-interior">
          <form @submit.prevent class="form form--add">
            <fieldset>
              <div class="instructions">
                <div class="instructions__content">
                  <p>To add an item, use the file input below to select a JSON file generated from <a href="https://instaloader.github.io/" rel="noreferrer" target="_blank">Instaloader</a>.</p>
                </div>
              </div>
              <v-expand-transition>
                <div class="item-preview" v-show="newItemContent">
                  <div class="item editing">
                    <div class="header-wrap">
                      <div class="item__header">
                        <div class="item__title">
                          <div class="title-interior">
                            <div
                              class="item-name"
                              contenteditable="true"
                              v-html="newItemName"
                              ref="newItemName"
                            ></div>
                          </div>
                        </div>
                        <div class="item__media">
                          <div class="carousel-wrapper" v-if="newItemMedia.length > 1">
                            <div class="carousel snap" ref="carousel">
                              <div class="carousel-item" v-for="media in newItemMedia">
                                <img v-bind:src="media.url" v-if="media.type === 'GraphImage'" alt />
                                <img v-bind:src="media.url" v-else-if="media.type === 'GraphVideo'" alt />
                              </div>
                            </div>
                            <div class="carousel-controls">
                              <button v-on:click="prevSlide" ref="prev" class="node node--prev">Prev</button>
                              <button v-on:click="nextSlide" ref="next" class="node node--next">Next</button>
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
              </v-expand-transition>
              <footer class="add-footer">
                <input type="file" accept="application/json" @change="processFile($event)" ref="jsonFile" />
                <div class="add-actions">
                  <div class="add-action">
                    <button v-on:click="addItem" v-show="newItemContent" :disabled="itemAddProcessing">Add Item</button>
                  </div>
                  <div class="add-action">
                    <button
                    v-on:click="resetAddForm"
                    v-show="newItemContent"
                    :disabled="itemAddProcessing"
                  >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 47.971 47.971">
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
    </v-expand-transition>
    <div class="items" ref="items" id="items">
      <item
        v-for="(item, index) in items"
        :class="{ 'tease': index === 0 }"
        :item="item"
        :key="item._id"
      />
      <div class="items-footer" ref="itemsFooter"></div>
    </div>
    <div class="lower-brow">
      <loading />
    </div>
  </div>
</template>

<script>
import item from "@@/components/item.vue";
import loading from "@@/components/loading.vue";
import message from "@@/components/message.vue";

export default {
  async fetch({ store }) {
    try {
      await store.dispatch("GET_ITEMS");
    } catch (err) {
      console.log(err);
    }
  },
  data: function() {
    return {
      addingItem: false,
      carouselScrollMarker: 0,
      ingredientIncrementer: 0,
      itemIncrementer: 0,
      ingredients: [],
      itemAddProcessing: false,
      jsonData: null,
      moarItemstoLoad: false,
      newItemMedia: [],
      newItemContent: null,
      newItemName: null,
      newItemSourceCategory: null,
      newItemSourceUrl: null,
      searchTerms: null
    };
  },
  methods: {
    async searchItems() {
      if (this.searchTerms) {
        let payload = {
          searchTerms: this.searchTerms
        };
        await this.$store.dispatch("EDIT_SEARCH_TERMS", payload);
        await this.$store.dispatch(
          "SEARCH_ITEMS",
          this.$store.state.searchTerms
        );
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
      // Add item through database
      if (!this.newItemContent || !this.$refs.newItemContent.innerText) {
        return;
      }

      this.saveItems();
    },
    async saveItems() {
      // Local Storage
      // const parsed = JSON.stringify(this.items);
      // localStorage.setItem("items", parsed);

      this.itemAddProcessing = true;

      let payload = {
        name: this.$refs.newItemName.textContent,
        media: this.newItemMedia,
        content: this.$refs.newItemContent.innerText,
        sourceCategory: "Instagram",
        sourceIdentifier: this.newItemSourceIdentifier
      };

      const newItem = await this.$store.dispatch("ADD_ITEM", payload);
      if (newItem) {
        this.resetAddForm();
        this.addingItem = false;
        this.$root.$emit("transmitMessage", "Item successfully added.");
      }
      
      this.itemAddProcessing = false;

    },
    resetAddForm() {
      // Resetting Addition Form Values
      this.newItemName = null;
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
    
    itemScroll() {}
  },
  computed: {
    items() {
      return this.$store.state.items;
    }
  },
  mounted: function() {

    this.observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.intersectionRatio > 0) {
          // Get id of last element in state
          let lastItemId = this.$store.state.items[this.$store.state.items.length - 1]._id;
          // console.log();
          if (this.$store.state.itemsRemaining === false) {
            this.observer.unobserve(this.$refs.itemsFooter);
            console.log('now unobserving!')
          } else {
            this.$store.dispatch(
              "GET_ADDITIONAL_ITEMS",
              lastItemId
            );
          }
        }
      });
    });

    window.setTimeout(() => {
      this.observer.observe(this.$refs.itemsFooter);
    }, 400);
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
          this.$refs.carousel.clientWidth * (this.newItemMedia.length - 1)
        ) {
          this.$refs.next.removeAttribute("disabled");
        } else {
          this.$refs.next.setAttribute("disabled", "");
        }
      }
    }
  },
  components: {
    item,
    loading,
    message
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
textarea {
  display: block;
}

button {
  cursor: pointer;
}

.container {
  margin: 0 auto;
  max-width: 40rem;
  padding-bottom: 2rem;
}

.carousel {
  /* Ensure that the contents flow horizontally */
  // overflow-x: auto;
  overflow: hidden;
  white-space: nowrap;
  display: flex;
}

/* 2018 spec - For Safari 11, Chrome 69+ */
.carousel.snap {
  scroll-snap-type: x mandatory;
  -webkit-overflow-scrolling: touch; /* Needed to work on iOS Safari */
}

.carousel.snap > div {
  scroll-snap-align: start;
}

/* 2015 spec - For Firefox, Edge, IE */
.carousel.snap {
  scroll-snap-type: mandatory;
  -ms-scroll-snap-type: mandatory;
  scroll-snap-points-x: repeat(100%);
  -ms-scroll-snap-points-x: repeat(100%);
}

.carousel {
  position: relative;
  width: 100%;
  height: 100%;
}

.carousel > div {
  min-width: 100%;
  min-height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  color: #fff;
}

.add {
  textarea {
    width: 100%;
  }
  .item__media {
    opacity: 1;
  }
}

.items {
  margin: 0 auto;
}

.lower-brow {
  bottom: 0;
  pointer-events: none;
  position: fixed;
  right: 0;
  z-index: 2;
}

.communicator {
  position: fixed;
  top: 10%;
  z-index: 2;
  left: 50%;
  transform: translateX(-50%);
}

.form {
  fieldset {
    border: 0;
    padding: 0;
  }
  &--search {
    .form-field {
      display: flex;
    }
    input {
      flex: 1 1 auto;
      margin-right: 0.5rem;
      padding: 0.5rem;
    }
    button {
      flex: 0;
      svg {
        display: block;
        // fill: #fff;
        fill: #000;
        height: 20px;
        margin: 0 auto;
        width: 20px;
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
  }
  .item-name {
    min-height: 3rem;
  }
  .item__content {
    margin-bottom: 0;
  }
}

.app-header {
  display: flex;
  margin-bottom: 0.5rem;
  .form--search {
    flex: 1 1 auto;
    .form-field {
      display: grid;
      grid-template-columns: auto 2.5rem;
      grid-column-gap: 0.5rem;
      input[type="text"] {
        width: 100%;
      }
    }
  }
  .app-action {
    flex: 0;
    margin-left: 0.5rem;
    span {
      display: block;
    }
    svg {
      display: block;
      // fill: #fff;
      fill: #000;
      height: 20px;
      margin: 0 auto;
      width: 20px;
    }
  }
}


.instructions {
  padding: 0 0 0.5rem;
  &__content {
    background-color: gray;
    padding: 0.5rem;
  }
}

.add {
  width: 100%;
}

.add-interior {
  padding: 0 0 0.5rem;
}

.item-preview {
  margin-bottom: 0.5rem;
}

.add-footer {
  display: flex;
  input[type="file"] {
    flex: 1;
    width: 100%;
  }
}

.add-actions {
  display: flex;
  flex: 0;
  flex-wrap: nowrap;
}

.add-action {
  margin-left: 0.5rem;
  button {
    white-space: nowrap;
    svg {
      display: block;
      fill: #fff;
      height: 19px;
      margin: 0 auto;
      width: 19px;
    }
  }
}

</style>
