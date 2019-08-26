<template>
  <div class="container">
    <!-- <div class="communicator">
      <div class="message">
        <div class="message__body">Item has been successfully edited.</div>
        <div class="message__status">
          <canvas height="32" width="32" ref="lifespan"></canvas>
        </div>
      </div>
    </div>-->

    <form @submit.prevent="searchItems" class="form form--search">
      <fieldset>
        <div class="form-field">
          <input type="text" v-model="searchTerms" id="search-field" />
          <button type="submit">Search</button>
        </div>
      </fieldset>
    </form>

    <form @submit.prevent class="form form--add">
      <fieldset>
        <v-expand-transition>
          <div class="item-preview" v-show="newItemContent">
            <div class="item editing">
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
                      <button v-on:click="prevSlide" ref="prev">Prev</button>
                      <button v-on:click="nextSlide" ref="next">Next</button>
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
        <!-- <div class="form-field">
            <label for="a3">Ingredients</label>
            <textarea name id="a3" cols="30" rows="10" v-model="ingredientsTextarea"></textarea>
            <button v-on:click="addIngredient">+</button>
            <ingredient
              v-for="(ingredient) in ingredients"
              v-on:remove-ingredient="removeIngredient"
              v-on:add-ingredient-here="addIngredientHere"
              v-on:update:content="ingredient.content = $event"
              v-bind:content.sync="ingredient.content"
              :ingredient="ingredient"
              :key="ingredient.id"
            />
        </div>-->

        <input type="file" accept="application/json" @change="processFile($event)" ref="jsonFile" />

        <button v-on:click="addItem" v-show="newItemContent" :disabled="itemAddProcessing">Add Item</button>
        <button
          v-on:click="resetAddForm"
          v-show="newItemContent"
          :disabled="itemAddProcessing"
        >Cancel</button>
      </fieldset>
    </form>

    <div class="add"></div>
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
import ingredient from "@@/components/ingredient.vue";
import item from "@@/components/item.vue";
import loading from "@@/components/loading.vue";

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
      carouselScrollMarker: 0,
      ingredientIncrementer: 0,
      itemIncrementer: 0,
      ingredients: [],
      itemAddProcessing: false,
      // itemsLimit: 20,
      // itemsLoaded: 0,
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
        // console.log(this.$store.state.searchTerms);

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
    /*
    updateIngredient(ingredient) {
      // console.log(ingredient);
      // console.log(JSON.stringify(ingredient));
      // const ingredientIndex = this.ingredients.indexOf(ingredient);
      // this.ingredients[ingredientIndex].content = ingredientContent;
      // this.ingredient.content = ingredient;
    },
    addIngredient() {
      this.ingredients.push({
        // content: "test"
        id: this.ingredientIncrementer,
        content: null
      });
      this.ingredientIncrementer++;
    },
    addIngredientHere(ingredient) {
      // console.log("why is this not this working?");
      const ingredientIndex = this.ingredients.indexOf(ingredient);
      // console.log(ingredientIndex);
      const newIngredient = {
        id: this.ingredientIncrementer,
        content: null
        // content: "new"
      };
      this.ingredients.splice(ingredientIndex + 1, 0, newIngredient);
      // console.log(this.ingredients.length);
      // const ingredientIndex = this.ingredients.indexOf(ingredient);
      this.ingredientIncrementer++;
    },
    */
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

      await this.$store.dispatch("ADD_ITEM", payload);

      this.resetAddForm();

      this.itemAddProcessing = true;
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
          if (this.$store.state.itemsRemaining === false) {
            this.observer.unobserve(this.$refs.itemsFooter);
          } else {
            this.$store.dispatch(
              "GET_ADDITIONAL_ITEMS",
              this.$store.state.items.length
            );
          }
        }
      });
    });

    window.setTimeout(() => {
      // this.observer.observe(this.$refs.itemsFooter);
    }, 400);

    // console.log(items.length);

    // window.addEventListener("load", () => {
    //   console.log("triggering observer");

    // });

    // itemImageObserver.observe(this.$el);
    // console.log(this.$refs.mediaItem);

    // this.observer.observe(this.$el);

    // console.log(this);
    // console.log(this.$el);
    // console.log(this.$refs.mediaItem);

    /*
    let options = {
      // root: document.querySelector("#items"),
      rootMargin: "0px 0px 0px 0px",
      threshold: 1.0
      // threshold: buildThresholdList()
    };

    let callback = (entries, observer) => {
      entries.forEach(entry => {
        if (entry.intersectionRatio > 0) {
          // entry.target.classList.add("intersected");
          console.log(entry);
        } else {
          // console.log(entry);
        }
      });
    };

    let itemObserver = new IntersectionObserver(callback, options);

    // Set height of first teased item
    let teasedItem = document.querySelector(".tease");
    // Get height of teased item image
    let itemMedia = teasedItem.querySelector(".media-item");
    let measuredMedia = itemMedia.querySelector("img");

    measuredMedia.onload = function() {
      let teasedHeader = teasedItem.querySelector(".item__header");
      teasedHeader.style.height = getComputedStyle(measuredMedia).height;

      // Set rootMargin of options object
      options.rootMargin =
        "0px 0px -" + getComputedStyle(measuredMedia).height + " 0px";

      // console.log(options.rootMargin);

      let nextElement = teasedItem.nextSibling;
      // let nextElementImageHeight =
      // const itemObserver = new IntersectionObserver(callback, options);
      // // itemObserver.observe(nextElement);

      // document.querySelectorAll(".item").forEach(item => {
      //   itemObserver.observe(item);
      // });

      itemObserver.observe(teasedItem);

      // document.querySelectorAll(".item").forEach(item => {
      //   itemObserver.observe(item);
      // });
    };

    // Get next element
    // console.log(teasedItem.nextSibling);

    // Get height of viewport
    // console.log(window.innerHeight);

    // Get height of first element

    */
    /*
    // IntersectionObserver
    let options = {
      // root: document.querySelector("#items"),
      rootMargin: "0px 0px 0px 0px",
      threshold: 1.0
      // threshold: buildThresholdList()
    };
    */
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
    loading
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
  max-width: 30rem;
  textarea {
    width: 100%;
  }
  img {
    max-width: 10rem;
  }
}

.items {
  margin: 0 auto;
  // max-width: 40rem;
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

.message {
  align-items: center;
  background-color: tan;
  color: #111;
  display: grid;
  grid-column-gap: 1rem;
  grid-template-columns: auto 32px;
  // color: white;
  // display: inline-block;
  // font-size: 70%;
  line-height: 1;
  padding: 0.5rem;
  // padding: 0.25rem;
  &__body {
  }
  &__status {
  }
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
    }
    button {
      flex: 0;
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
</style>
