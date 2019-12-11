<template>
  <div class="carousel-wrapper">
    <div class="carousel snap flex relative h-full overflow-hidden w-full whitespace-no-wrap" ref="carousel">
      <div class="carousel-item flex items-center justify-center min-h-full min-w-full text-center" v-for="(media, index) in itemMedia" :key="'media-' + index">
        <img v-bind:src="media.url" v-if="media.type === 'GraphImage'" alt />
        <img v-bind:src="media.url" v-else-if="media.type === 'GraphVideo'" alt />
      </div>
    </div>
    <div class="carousel-controls absolute px-4 w-full">
      <button @click.stop="prevSlide" ref="prev" class="node node--prev float-left" disabled>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 492 492">
          <path d="M198.608 246.104L382.664 62.04c5.068-5.056 7.856-11.816 7.856-19.024 0-7.212-2.788-13.968-7.856-19.032l-16.128-16.12C361.476 2.792 354.712 0 347.504 0s-13.964 2.792-19.028 7.864L109.328 227.008c-5.084 5.08-7.868 11.868-7.848 19.084-.02 7.248 2.76 14.028 7.848 19.112l218.944 218.932c5.064 5.072 11.82 7.864 19.032 7.864 7.208 0 13.964-2.792 19.032-7.864l16.124-16.12c10.492-10.492 10.492-27.572 0-38.06L198.608 246.104z"/>
        </svg>
      </button>
      <button @click.stop="nextSlide" ref="next" class="node node--next float-right">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 492 492">
          <path d="M198.608 246.104L382.664 62.04c5.068-5.056 7.856-11.816 7.856-19.024 0-7.212-2.788-13.968-7.856-19.032l-16.128-16.12C361.476 2.792 354.712 0 347.504 0s-13.964 2.792-19.028 7.864L109.328 227.008c-5.084 5.08-7.868 11.868-7.848 19.084-.02 7.248 2.76 14.028 7.848 19.112l218.944 218.932c5.064 5.072 11.82 7.864 19.032 7.864 7.208 0 13.964-2.792 19.032-7.864l16.124-16.12c10.492-10.492 10.492-27.572 0-38.06L198.608 246.104z"/>
        </svg>
      </button>
    </div>
  </div>
</template>

<script>
  export default {
    data: function() {
      return {
        carouselScrollMarker: 0,
      };
    },
    mounted: function () {
      if (this.$refs.prev && this.$refs.carousel.scrollLeft === 0) {
        this.$refs.prev.setAttribute("disabled", "");
      }
    },
    methods: {
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
            this.$refs.carousel.clientWidth * (this.itemMedia.length - 1)
          ) {
            this.$refs.next.removeAttribute("disabled");
          } else {
            this.$refs.next.setAttribute("disabled", "");
          }
        }
      },
    },
    props: ["itemMedia"]
  }
</script>

<style lang="postcss" scoped>
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

.carousel > div {
  color: var(--white);
}

.carousel-controls {
  top: 50%;
  transform: translateY(-100%);
}
.node {
  background-color: transparent;
  border: 0;
  border-radius: 0;
  outline: none;
  position: relative;
  transition: opacity 400ms;
  z-index: 2;
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
</style>