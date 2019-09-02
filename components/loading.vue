<template>
  <div class="loading-indicator">
    <canvas height="100" width="100" ref="loading"></canvas>
  </div>
</template>

<style lang="scss">
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
  data: function() {
    return {
      // loadingState: this.$store.state.loading
      animationRequest: null,
      canvas: null,
      ctx: null,
      duration: 666.667,
      durationRadiance: 2000,
      radius: 18,
      start: null,
      timeoutID: null
    };
  },
  computed: {
    ...mapState({
      loading: state => state.loading
    })
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
      if (!this.start) {
        this.start = timestamp;
      }

      let canvas = this.canvas;
      let ctx = this.ctx;

      let duration = this.duration;
      let durationRadiance = this.durationRadiance;
      let radius = this.radius;

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.translate(canvas.width / 2, canvas.height / 2);

      var remainder = (timestamp - this.start) % duration;
      var startAngle = Math.PI * (remainder / duration) * 2;
      var endAngle = startAngle + Math.PI;
      // var degrees = (360 * remainder) / duration;

      // Drawing the main arc

      ctx.lineWidth = 5;
      ctx.strokeStyle = "rgba(255, 250, 14, 1)";
      ctx.beginPath();
      ctx.arc(0, 0, radius, startAngle, endAngle);
      ctx.stroke();
      ctx.closePath();

      // Drawing the gradient arcs
      ctx.globalCompositeOperation = "destination-out";

      var gradientCounter = null;
      var startingLength = 0.5;
      var gradientLength = 0.5;
      var gradientIncrementer = 0.05;

      while (gradientLength - gradientIncrementer > -gradientIncrementer) {
        var arcOpacity = 1 - gradientLength / startingLength;

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

      ctx.globalCompositeOperation = "source-over";

      var arcWidth = 2;
      var oRemainder = (timestamp - this.start) % durationRadiance;
      var oRemainderPercentage = oRemainder / durationRadiance;
      var firstArcTriggerPoint = 0.66;
      var secondArcTriggerPoint = 0.83;

      if (oRemainderPercentage >= firstArcTriggerPoint) {
        var deltaTotal = secondArcTriggerPoint - firstArcTriggerPoint;
        var deltaChange = oRemainderPercentage - firstArcTriggerPoint;
        var deltaProgress = deltaChange / deltaTotal;

        var arcRadius = radius + deltaProgress * 19;
        var arcAlpha = secondArcTriggerPoint - deltaProgress;

        ctx.lineWidth = arcWidth;
        ctx.strokeStyle = "rgba(255, 250, 14, " + arcAlpha + ")";
        ctx.beginPath();
        ctx.arc(0, 0, arcRadius, 0, Math.PI * 2);
        ctx.stroke();
      }

      if (oRemainderPercentage >= secondArcTriggerPoint) {
        var deltaTotal = 1 - secondArcTriggerPoint;
        var deltaChange = oRemainderPercentage - secondArcTriggerPoint;
        var deltaProgress = deltaChange / deltaTotal;

        var arcRadius = radius + deltaProgress * 19;
        var arcAlpha = 1 - deltaProgress;

        ctx.lineWidth = arcWidth;
        ctx.strokeStyle = "rgba(255, 250, 14, " + arcAlpha + ")";
        ctx.beginPath();
        ctx.arc(0, 0, arcRadius, 0, Math.PI * 2);
        ctx.stroke();
      }
      this.animationRequest = window.requestAnimationFrame(this.drawEvolve);
    }
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
  mounted: function() {
    this.canvas = this.$refs.loading;
    this.ctx = this.canvas.getContext("2d");
  }
};
</script>