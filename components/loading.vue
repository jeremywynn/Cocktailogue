<template>
  <div class="loading-indicator">
    <canvas ref="loading" height="100" width="100"></canvas>
  </div>
</template>

<style lang="postcss">
.loading-indicator {
  canvas {
    display: block;
    opacity: 0;
    transition: opacity 400ms;
    &.active {
      opacity: 1;
    }
  }
}
</style>

<script>
import { mapState } from "vuex";
export default {
  data() {
    return {
      animationRequest: null,
      animationStart: null,
      canvas: null,
      ctx: null,
      duration: 666.667,
      durationRadiance: 2000,
      radius: 18,

      timeoutID: null
    };
  },
  computed: {
    ...mapState({
      loading: state => state.loading.loading
    })
  },
  watch: {
    loading(newValue, oldValue) {
      if (newValue === true) {
        this.timeoutID = null;
        this.canvas.classList.add("active");
        this.animationRequest = window.requestAnimationFrame(this.drawEvolve);
      } else {
        this.canvas.classList.remove("active");
        this.timeoutID = window.setTimeout(this.stopEvolve, 400);
      }
    }
  },
  mounted() {
    this.canvas = this.$refs.loading;
    this.ctx = this.canvas.getContext("2d");
  },
  methods: {
    start() {
      this.timeoutID = null;
      this.canvas.classList.add("active");
      this.animationRequest = window.requestAnimationFrame(this.drawEvolve);
    },
    finish() {
      this.canvas.classList.remove("active");
      this.timeoutID = window.setTimeout(this.stopEvolve, 400);
    },
    stopEvolve() {
      window.cancelAnimationFrame(this.animationRequest);
      this.ctx.setTransform(1, 0, 0, 1, 0, 0);
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    drawEvolve(timestamp) {
      // Timing Setup
      if (!this.animationStart) {
        this.animationStart = timestamp;
      }
      const canvas = this.canvas;
      const ctx = this.ctx;
      const duration = this.duration;
      const durationRadiance = this.durationRadiance;
      const radius = this.radius;
      const remainder = (timestamp - this.animationStart) % duration;
      const startAngle = Math.PI * (remainder / duration) * 2;
      const endAngle = startAngle + Math.PI;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.translate(canvas.width / 2, canvas.height / 2);
      // Drawing the main arc
      ctx.lineWidth = 5;
      ctx.strokeStyle = "rgba(255, 250, 14, 1)";
      ctx.beginPath();
      ctx.arc(0, 0, radius, startAngle, endAngle);
      ctx.stroke();
      ctx.closePath();
      // Drawing the gradient arcs
      ctx.globalCompositeOperation = "destination-out";
      let gradientLength = 0.5;
      const gradientIncrementer = 0.05;
      const startingLength = 0.5;
      /* Is there a better way to write this while loop? */
      // eslint-disable-next-line no-loops/no-loops
      while (gradientLength - gradientIncrementer > -gradientIncrementer) {
        const arcOpacity = 1 - gradientLength / startingLength;
        ctx.strokeStyle = "rgba(255, 255, 255, " + arcOpacity + ")";
        ctx.beginPath();
        ctx.arc(
          0,
          0,
          radius,
          startAngle + gradientLength,
          startAngle + (gradientLength + gradientIncrementer)
        );
        ctx.stroke();
        ctx.closePath();
        gradientLength = gradientLength - gradientIncrementer;
      }
      // Drawing the outer arcs
      const arcWidth = 2;
      const oRemainder = (timestamp - this.animationStart) % durationRadiance;
      const oRemainderPercentage = oRemainder / durationRadiance;
      const firstArcTriggerPoint = 0.66;
      const secondArcTriggerPoint = 0.83;
      ctx.globalCompositeOperation = "source-over";
      if (oRemainderPercentage >= firstArcTriggerPoint) {
        const deltaTotal = secondArcTriggerPoint - firstArcTriggerPoint;
        const deltaChange = oRemainderPercentage - firstArcTriggerPoint;
        const deltaProgress = deltaChange / deltaTotal;
        const arcRadius = radius + deltaProgress * 19;
        const arcAlpha = secondArcTriggerPoint - deltaProgress;
        ctx.lineWidth = arcWidth;
        ctx.strokeStyle = "rgba(255, 250, 14, " + arcAlpha + ")";
        ctx.beginPath();
        ctx.arc(0, 0, arcRadius, 0, Math.PI * 2);
        ctx.stroke();
      }
      if (oRemainderPercentage >= secondArcTriggerPoint) {
        const deltaTotal = 1 - secondArcTriggerPoint;
        const deltaChange = oRemainderPercentage - secondArcTriggerPoint;
        const deltaProgress = deltaChange / deltaTotal;
        const arcRadius = radius + deltaProgress * 19;
        const arcAlpha = 1 - deltaProgress;
        ctx.lineWidth = arcWidth;
        ctx.strokeStyle = "rgba(255, 250, 14, " + arcAlpha + ")";
        ctx.beginPath();
        ctx.arc(0, 0, arcRadius, 0, Math.PI * 2);
        ctx.stroke();
      }
      this.animationRequest = window.requestAnimationFrame(this.drawEvolve);
    }
  }
};
</script>
