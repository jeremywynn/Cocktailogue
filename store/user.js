export const state = () => ({
  // User
  user: window.localStorage.getItem('user')
});

export const mutations = {
  // User
  setUser: (state, currentUser) => {
    if (!currentUser) {
      state.user = null;
      window.localStorage.removeItem('user');
      return;
    }
    let theUser = JSON.stringify(currentUser);
    state.user = theUser;
    window.localStorage.setItem('user', theUser);
  },
};

export const actions = {
  // User
  updateUser: ({ commit }, payload) => {
    commit('setUser', payload.currentUser)
  },
};