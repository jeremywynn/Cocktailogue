export const state = () => ({
  // User
  auth: null
});

export const mutations = {
  // User
  SET_AUTH(state, auth) {
    state.auth = auth;
  }
};