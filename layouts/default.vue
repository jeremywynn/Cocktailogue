<template>
  <div>
    <nuxt />
  </div>
</template>

<style lang="scss">
html {
  font-family: "Open Sans", -apple-system, BlinkMacSystemFont, "Segoe UI",
    "Helvetica Neue", Arial, sans-serif;
  font-size: 16px;
  word-spacing: 1px;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
}

*,
*:before,
*:after {
  box-sizing: border-box;
  margin: 0;
}

h1,
h2,
h3,
h4,
h5,
h6,
.item-name {
  font-family: "Roboto", sans-serif;
  font-weight: 500;
}

textarea,
input[type="text"] {
  border: 1px solid rgba(255, 255, 255, 1);
  outline-color: rgba(255, 250, 14, 1);
}

button {
  background-color: rgba(255, 250, 14, 1);
  border: 1px solid rgba(255, 250, 14, 1);
  color: #000;
  font-family: "Roboto", sans-serif;
  font-weight: 500;
  padding: 0.25rem 0.5rem;
  transition: box-shadow 400ms;
  &.negative {
    background-color: rgba(216, 33, 55, 1);
    border-color: rgba(216, 33, 55, 1);
    &:hover,
    &:focus,
    &:active {
      box-shadow: 0 0 8px rgba(216, 33, 55, 1);
    }
  }
  &.subtle {
    background-color: rgba(149, 150, 145, 1);
    border-color: rgba(149, 150, 145, 1);
    &:hover,
    &:focus,
    &:active {
      box-shadow: 0 0 8px rgba(149, 150, 145, 1);
    }
    &:disabled {
      svg {
        fill: rgba(149, 150, 145, 1) !important;
      }
    }
  }
  &:hover,
  &:focus,
  &:active {
    box-shadow: 0 0 8px rgba(255, 250, 14, 1);
  }
  &:disabled, &.unauthorized {
    background-color: transparent !important;
    border: 1px solid rgba(149, 150, 145, 1) !important;
    border-color: rgba(149, 150, 145, 1) !important;
    color: rgba(149, 150, 145, 1) !important;
    opacity: 0.5 !important;
    &:hover, &:focus, &:active {
      box-shadow: none !important;
    }
  }
}
</style>
