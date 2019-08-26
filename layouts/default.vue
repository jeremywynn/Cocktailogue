<template>
  <div>
    <nuxt />
  </div>
</template>

<style>
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
}

textarea,
input[type="text"] {
  /* background-color: white; */
  border: 2px solid white;
}

button {
  border: 1px solid yellow;
  padding: 0.25rem 0.5rem;
  &:hover,
  &:focus,
  &:active {
  }
}
</style>
