<template>
  <div class="message items-center px-4 py-2 text-left" v-if="message">
    <div class="message__body">{{ message }}</div>
    <div class="message__status">
      <canvas class="block mx-auto overflow-visible" height="24" width="24" ref="lifespan"></canvas>
    </div>
  </div>
</template>

<script>

export default {
  data: function() {
    return {
      animationRequest: null,
      canvas: null,
      circum: Math.PI * 2,
      ctx: null,
      duration: 2500,
      indicatorDuration: 2300,
      message: null,
      radius: 9,
      start: null,
      startAngle: Math.PI / 2
    };
  },
  methods: {
    setupMessageTimer() {
      let endAngle = Math.PI * 1.5;
      this.canvas = this.$refs.lifespan;
      this.ctx = this.canvas.getContext("2d");
      this.ctx.lineWidth = 5;
      this.ctx.strokeStyle = getComputedStyle(document.documentElement)
    .getPropertyValue('--yellow');
      this.ctx.beginPath();
      this.ctx.arc(this.canvas.width / 2, this.canvas.height / 2, this.radius, -(this.startAngle), endAngle, true);
      this.ctx.stroke();
      this.ctx.closePath();
    },
    drawMessageTimer(timestamp) {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      if (!this.start) {
        this.start = timestamp;
      }
      let remainder = (timestamp - this.start) / this.indicatorDuration;
      if (remainder > 1) {
        remainder = 0;
      }
      if (timestamp - this.start <= this.duration) {
        this.ctx.beginPath();
        this.ctx.arc(this.canvas.width / 2, this.canvas.height / 2, this.radius, -(this.startAngle), ((this.circum) * remainder) - this.startAngle, true);
        this.ctx.stroke();
        this.ctx.closePath();
        this.animationRequest = window.requestAnimationFrame(this.drawMessageTimer);
      }
      else {
        this.ctx.beginPath();
        this.ctx.arc(this.canvas.width / 2, this.canvas.height / 2, this.radius, -(this.startAngle), -(this.startAngle), true);
        this.ctx.stroke();
        this.ctx.closePath();
        window.cancelAnimationFrame(this.animationRequest);
        this.clearMessageTimer();
      }
    },
    clearMessageTimer() {
      this.ctx.setTransform(1, 0, 0, 1, 0, 0);
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.start = null;
    },
    transmitMessage(message) {
      this.message = message;
      window.setTimeout(() => {
        this.message = null;
      }, this.duration);
    }
  },
  mounted: function() {
    this.$root.$on("transmitMessage", (message) => {
      this.transmitMessage(message);
    });
  },
  updated: function() {
    if (this.message) {
      this.setupMessageTimer();
      this.drawMessageTimer(performance.now());
    }
  }
};
</script>

<style lang="scss">
  .message {
    background-color: var(--black);
    border-top: 2px solid var(--yellow);
    box-shadow: 0 0 5px rgba(255, 250, 14, 0.25);
    color: var(--white);
    display: inline-grid;
    grid-column-gap: 1rem;
    grid-template-columns: auto 32px;
    line-height: 1.2;
  }
</style>
