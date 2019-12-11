<template>
  <div>
    <nuxt />
  </div>
</template>

<style lang="postcss">
:root {
  --black: rgba(0, 0, 0, 1);
  --gray: rgba(149, 150, 145, 1);
  --red: rgba(216, 33, 55, 1);
  --white: rgba(255, 255, 255, 1);
  --yellow: rgba(255, 250, 14, 1);
}

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
  border: 1px solid var(--yellow);
  outline-color: var(--yellow);
}

button {
  background-color: var(--yellow);
  border: 1px solid var(--yellow);
  color: #000;
  font-family: "Roboto", sans-serif;
  font-weight: 500;
  padding: 0.25rem 0.5rem;
  transition: box-shadow 400ms;
  &.negative {
    background-color: var(--red);
    border-color: var(--red);
    &:hover,
    &:focus,
    &:active {
      box-shadow: 0 0 8px var(--red);
    }
  }
  &.subtle {
    background-color: var(--gray);
    border-color: var(--gray);
    &:hover,
    &:focus,
    &:active {
      box-shadow: 0 0 8px var(--gray);
    }
    &:disabled {
      svg {
        fill: var(--gray) !important;
      }
    }
  }
  &:hover,
  &:focus,
  &:active {
    box-shadow: 0 0 8px var(--yellow);
  }
  &:disabled,
  &.unauthorized {
    background-color: transparent !important;
    /* border: 1px solid var(--gray) !important; */
    border-color: var(--gray) !important;
    color: var(--gray) !important;
    opacity: 0.5 !important;
    &:hover,
    &:focus,
    &:active {
      box-shadow: none !important;
    }
  }
}
</style>
