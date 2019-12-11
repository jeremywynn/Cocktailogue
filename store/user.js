import netlifyIdentity from "netlify-identity-widget";

netlifyIdentity.init();

const user = netlifyIdentity.currentUser();

export const state = () => ({
  // User
  user
});

export const mutations = {
  // User
  SET_USER(state, user) {
    state.user = user;
  }
};
