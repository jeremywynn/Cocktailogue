<template>
  <div class="container">
    <div class="form-field">
      <label for>Search</label>
      <input type="text" v-model="searchTerms" />
      <button v-on:click="searchItems">Search</button>
    </div>

    <!-- <div class="add">
      <form action>
      <fieldset>
      
      <div class="form-field">
        <label for="a1">Name</label>
        <input type="text" v-model="newItemName" />
      </div>
      
      <div class="form-field">
        <label for>Search</label>
        <input type="text" v-model="searchTerms" />
        <button v-on:click="searchItems">Search</button>
      </div>
      <div class="form-field">
        <label for="a2">Media</label>
        <div class="carousel-wrapper" v-if="newItemMedia.length > 1">
          <div class="carousel snap" ref="carousel">
            <div class="carousel-item" v-for="media in newItemMedia">
              <img v-bind:src="media.url" v-if="media.type === 'GraphImage'" alt />
              <video
                controls
                v-bind:src="media.video_url"
                v-bind:poster="media.url"
                v-if="media.type === 'GraphVideo'"
                type="video/mp4"
              ></video>
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
          <div v-if="media.type === 'GraphVideo'">
            <video
              controls
              playsinline
              v-bind:src="media.video_url"
              v-bind:poster="media.url"
              type="video/mp4"
            ></video>
          </div>
        </div>
        
        <FilePond
          accepted-file-types="image/png, image/jpeg, image/gif"
          allowDrop="false"
          stylePanelLayout="integrated"
          instantUpload="false"
          :server="{ process }"
          ref="pondNew"
          labelIdle="<span class='filepond--label-action'>Add Image</span>"
        />
        
        <input type="text" v-model="newItemImage" />
      </div>
      
      <div class="form-field">
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
      </div>
      
      <div class="form-field">
        <label for="a4">Instructions</label>
        <textarea name id cols="30" rows="10" v-model="newItemContent"></textarea>
      </div>
      <input type="file" accept="application/json" @change="processFile($event)" ref="jsonFile" />

      <button v-on:click="addItem">Add Item</button>
      <</fieldset>
      </form>
    </div>-->
    <div class="items" ref="items" id="items">
      <item
        v-for="(item, index) in items"
        :class="{ 'tease': index === 0 }"
        :item="item"
        :key="item._id"
        v-on:remove-item="removeItem(item)"
      />
    </div>
  </div>
</template>

<script>
import ingredient from "@@/components/ingredient.vue";
import item from "@@/components/item.vue";

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
      ingredientIncrementer: 0,
      itemIncrementer: 0,
      ingredients: [],
      // ingredientsTextarea: null,
      jsonData: null,
      newItemMedia: [],
      newItemContent: null,
      newItemName: null,
      newItemSourceCategory: null,
      newItemSourceUrl: null,

      carouselScrollMarker: 0,

      searchTerms: null
    };
  },
  methods: {
    async searchItems() {
      if (this.searchTerms) {
        let payload = {
          searchTerms: this.searchTerms
        };
        await this.$store.dispatch("SEARCH_ITEMS", payload);
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
      if (!this.newItemContent) {
        return;
      }
      this.saveItems();
    },
    /*
    removeIngredient(ingredient) {
      const ingredientIndex = this.ingredients.indexOf(ingredient);
      this.ingredients.splice(ingredientIndex, 1);
    },
    */
    async removeItem(item) {
      let payload = {
        ID: item._id,
        media: item.media
      };

      await this.$store.dispatch("DELETE_ITEM", payload);
    },
    async saveItems() {
      // Local Storage
      // const parsed = JSON.stringify(this.items);
      // localStorage.setItem("items", parsed);

      let payload = {
        name: this.newItemName,
        media: this.newItemMedia,
        content: this.newItemContent,
        sourceCategory: "Instagram",
        sourceIdentifier: this.newItemSourceIdentifier
      };
      // console.log(payload);
      await this.$store.dispatch("ADD_ITEM", payload);

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
    // ingredient,
    item
  }
};
</script>

<style lang="scss">
html {
  background-color: #000;
  color: #fff;
  // padding: calc(1rem + 2vw);
}
img {
  max-width: 100%;
}
textarea {
  display: block;
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
  max-width: 40rem;
}
</style>
