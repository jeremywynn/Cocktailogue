<template>
  <div class="item" ref="item">
    <div class="item__header" ref="itemHeader">
      <div class="item__title">
        <h2>Item Title</h2>
      </div>
      <div class="item__media">
        <div class="carousel-wrapper" v-if="item.media.length > 1">
          <div class="carousel snap" ref="carousel" v-on:resize="resize">
            <div class="media-item" v-for="media in item.media">
              <img
                v-bind:src="'https://ik.imagekit.io/94ka2dfnz' + media.path"
                v-if="media.path"
                loading="lazy"
                alt
              />
            </div>
          </div>
          <div class="carousel-controls">
            <button v-on:click="prevSlide" ref="prev">Prev</button>
            <button v-on:click="nextSlide" ref="next">Next</button>
          </div>
        </div>
        <div class="media-item" v-if="item.media.length === 1" v-for="media in item.media">
          <img
            v-bind:src="'https://ik.imagekit.io/94ka2dfnz' + media.path"
            v-if="media.path"
            loading="lazy"
            alt
          />
          <img v-bind:src="media.url" v-else loading="lazy" alt />
        </div>
      </div>
    </div>

    <div class="item__contents" ref="itemContents">
      <div class="item__content">{{ item.content }}</div>
      <div class="item__source-category">{{ item.sourceCategory }}</div>
      <div class="item__source-url">
        <a :href="reconstructedUrl">{{ reconstructedUrl }}</a>
      </div>
      <div class="item__actions">
        <button v-on:click="showEdit = !showEdit">Edit item</button>
        <button v-on:click="removeItem">Remove Item</button>
      </div>
      <div class="item__edit" v-if="showEdit">Editing Item</div>
    </div>
  </div>
</template>

<script>
export default {
  data: function() {
    return {
      carouselScrollMarker: 0,
      mediaCount: this.item.media.length,
      mediaUrl: null,
      reconstructedUrl:
        "https://www.instagram.com/p/" + this.item.sourceIdentifier,
      showEdit: false
    };
  },
  methods: {
    editItem(item) {},
    removeItem(item) {
      this.$emit("remove-item", item);
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
    /*
    scrollToItem(itemPosition, numItems, scroller) {
      scroller.scrollTo({
        scrollLeft: Math.floor(
          scroller.scrollWidth * (itemPosition / numItems)
        ),
        behavior: "smooth"
      });
    },
    */
    resize() {
      this.$refs.carousel.scrollTo({
        left: this.$refs.carousel.scrollLeft - 1,
        behavior: "smooth"
      });
    }
  },
  computed: {},
  created: function() {
    // console.log("true"); // Does this each time
  },
  mounted: function() {
    if (this.$refs.carousel) {
      window.addEventListener("resize", this.resize); // Eventually use resizeObserver here
    }
    if (this.$refs.prev && this.$refs.carousel.scrollLeft === 0) {
      this.$refs.prev.setAttribute("disabled", "");
    }
    let itemHeader = this.$refs.itemHeader;
    itemHeader.addEventListener("click", event => {
      // console.log(event);
      let focusedItem = this.$refs.item;
      focusedItem.classList.toggle("reveal");
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
.item {
  border: 1px solid;
  border-top: 0;
  // padding: 0.5rem;
  // margin: 0 0 2rem;
  // max-width: 40rem;
  // max-width: 1080px;
  overflow: hidden;
  &__header {
    position: relative;
  }
  &__title {
    bottom: 0;
    position: absolute;
    text-shadow: 0 0 3px black;
    // transition: 10000ms color;
  }
  &__contents {
    display: none;
  }
  &__content {
    white-space: pre-line;
  }
  &__media {
    bottom: 0;
    left: 0;
    // position: absolute;
    right: 0;
    top: 0;
    // z-index: -1;

    // opacity: 0;
    img {
      display: block;
      // height: 100%;
      // position: absolute;
      object-fit: contain;

      width: 100%;
      z-index: -1;
    }
    video {
      width: 100%;
    }
  }
  &:first-child {
    border-top: 1px solid;
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
      display: block;
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
  // background: yellow;
  padding: 0.5rem;

  width: 100%;
}

.item__contents {
  padding: 1rem 0.5rem;
}

.item__content {
  line-height: 1.4;
  margin-bottom: 1rem;
}
</style>
