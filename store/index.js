const cookieparser = process.server ? require('cookieparser') : undefined

export const state = () => ({
  // Items
  items: [],
  itemCount: null,
  itemsRemaining: true,
  // Loading
  loading: false,
  // User
  // user: null,
  // user: window.localStorage.getItem('user'),
  auth: null
});

export const getters = {
  getUserStatus: state => !!state.user,
  getUser: state => JSON.parse(state.user)
};

export const mutations = {
  // Items
  addItem(state, item) {
    state.items.push(item);
  },
  addNewItem(state, item) {
    state.items.unshift(item);
  },
  adjustItemsRemaining(state, count) {
    state.itemsRemaining = count;
  },
  deleteItem(state, payload) {
    const item = state.items.find(item => item._id === payload._id);
    state.items.splice(state.items.indexOf(item), 1);
  },
  editItem(state, payload) {
    const item = state.items.find(item => item._id === payload._id);
    state.items.splice(state.items.indexOf(item), 1, payload);
  },
  setItems(state, items) {
    state.items = items;
  },
  setItemsCount(state, itemCount) {
    state.itemCount = itemCount;
  },
  searchItems(state, items) {
    state.items = items;
  },
  // Loading
  endBusyState(state) {
    state.loading = false;
  },
  startBusyState(state) {
    state.loading = true;
  },
  // User
  // setUser: (state, currentUser) => {
  //   if (!currentUser) {
  //     console.log('!currentUser in setUser');
  //     state.user = null;
  //     window.localStorage.removeItem('user');
  //     return;
  //   }
  //   console.log('setUser not returned!');
  //   let theUser = JSON.stringify(currentUser);
  //   state.user = theUser;
  //   window.localStorage.setItem('user', theUser);
  // },
  setAuth(state, auth) {
    state.auth = auth;
  }
};

export const actions = {
  // Items
  async ADD_ITEM({ commit, dispatch, state }, payload) {
    dispatch("triggerBusyState");
    if (state.auth) {
      try {
        let data = {
          name: payload.name,
          media: payload.media,
          content: payload.content,
          sourceCategory: payload.sourceCategory,
          sourceIdentifier: payload.sourceIdentifier
        };
        const newItem = await fetch("/.netlify/functions/add-item", {
          method: "POST",
          body: JSON.stringify(data)
        }).then(res => res.json());
        commit("addNewItem", newItem);
        dispatch("stopBusyState");
        return newItem;
      } catch (err) {
        console.log(err);
      }
    }
    dispatch("stopBusyState");
  },
  async DELETE_ITEM({ commit, dispatch, state }, payload) {
    dispatch("triggerBusyState");
    if (state.auth) {
      try {
        let data = {
          ID: payload.ID,
          media: payload.media
        };
        const deletedItem = await fetch("/.netlify/functions/delete-item", {
          method: "PUT",
          body: JSON.stringify(data)
        }).then(res => res.json());
        commit("deleteItem", deletedItem);
        dispatch("stopBusyState");
        return deletedItem;
      } catch (err) {
        console.log(err);
      }
    }
    dispatch("stopBusyState");
  },
  async EDIT_ITEM({ commit, dispatch, state }, payload) {
    dispatch("triggerBusyState");
    if (state.auth) {
      try {
        let data = {
          ID: payload.ID,
          name: payload.name,
          content: payload.content
        };
        const editedItem = await fetch("/.netlify/functions/edit-item", {
          method: "POST",
          body: JSON.stringify(data)
        }).then(res => res.json());
        if (editedItem.matchedCount && editedItem.modifiedCount) {
          dispatch("REFRESH_ITEM", payload.ID);
        } else {
          // Error
        }
        commit("endBusyState");
        return editedItem;
      } catch (err) {
        console.log(err);
      }
    }
    commit("endBusyState");
  },
  async GET_ADDITIONAL_ITEMS({ commit, dispatch }, payload) {
    dispatch("triggerBusyState");
    let data = {
      skip: payload
    };
    try {
      const response = await fetch("/.netlify/functions/all-items", {
        method: "POST",
        body: JSON.stringify(data)
      }).then(res => res.json());
      const items = response[0];
      if (items.length > 0) {
        items.forEach(item => {
          commit("addItem", item);
        });
      } else {
        commit("adjustItemsRemaining", false);
      }
    } catch (err) {
      console.log(err);
    }
    dispatch("stopBusyState");
  },
  async GET_ITEMS({ commit, dispatch }, payload) {
    dispatch("triggerBusyState");
    let data = {
      skip: payload
    };
    try {
      const response = await fetch("/.netlify/functions/all-items", {
        method: "POST",
        body: JSON.stringify(data)
      }).then(res => res.json());
      commit("setItems", response[0]);
      commit("setItemsCount", response[1]);
      if (response[0].length < 1) {
        commit("adjustItemsRemaining", false);
      }
    } catch (err) {
      console.log(err);
    }
    dispatch("stopBusyState");
  },
  async REFRESH_ITEM({ commit }, id) {
    try {
      const refreshedItem = await fetch("/.netlify/functions/refresh-item", {
        method: "POST",
        body: JSON.stringify(id)
      }).then(res => res.json());
      commit("editItem", refreshedItem);
    } catch (err) {
      console.log(err);
    }
  },
  async SEARCH_ITEMS({ commit, dispatch }, payload) {
    dispatch("triggerBusyState");
    try {
      let data = {
        searchTerms: payload
      };
      let items = await fetch("/.netlify/functions/find-items", {
        method: "POST",
        body: JSON.stringify(data)
      }).then(res => res.json());
      commit("searchItems", items);
    } catch (err) {
      console.log(err);
    }
    dispatch("stopBusyState");
  },
  // Loading
  stopBusyState({ commit }) {
    commit("endBusyState");
  },
  triggerBusyState({ commit }) {
    commit("startBusyState");
  },
  // User
  nuxtServerInit({ commit }, { req }) {
    let auth = null;
    if (req.headers.cookie) {
      const parsed = cookieparser.parse(req.headers.cookie);
      try {
        auth = JSON.parse(parsed.auth);
      } catch (err) {
        // No valid cookie found
        console.log(err);
      }
    }
    commit('setAuth', auth);
  }
};
