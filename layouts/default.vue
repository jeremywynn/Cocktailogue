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
  /* background-color: white; */
  /* border: 2px solid white; */
  /* border: 1px solid rgba(226, 166, 16, 1); */
  border: 1px solid rgba(255, 255, 255, 1);
  outline-color: rgba(255, 250, 14, 1);
  &:focus, &:active {
    // box-shadow: 0 0 1rem #fffa0e inset;
  }
}

button {
  /* border: 1px solid rgba(226, 166, 16, 1); */
  background-color: rgba(255, 250, 14, 1);
  color: #000;
  font-family: "Roboto", sans-serif;
  font-weight: 500;
  padding: 0.25rem 0.5rem;
  &.negative {
    background-color: rgba(216, 33, 55, 1);
  }
  &.subtle {
    background-color: rgba(149, 150, 145, 1);
  }
  &:hover,
  &:focus,
  &:active {
  }
}
</style>
