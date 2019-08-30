export const state = () => ({
  items: [],
  itemsRemaining: true,
  loading: false,
  searchTerms: null
});

export const mutations = {
  SET_ITEMS(state, items) {
    state.items = items;
  },
  SEARCH_ITEMS(state, items) {
    state.items = items;
  },
  addItem(state, item) {
    state.items.push(item);
  },
  deleteItem(state, payload) {
    const item = state.items.find(item => item._id === payload._id);
    state.items.splice(state.items.indexOf(item), 1);
  },
  editItem(state, payload) {
    const item = state.items.find(item => item._id === payload._id);
    state.items.splice(state.items.indexOf(item), 1, payload);
  },
  startBusyState(state) {
    state.loading = true;
  },
  endBusyState(state) {
    state.loading = false;
  },
  adjustItemsRemaining(state, count) {
    state.itemsRemaining = count;
  },
  setSearchTerms(state, payload) {
    state.searchTerms = payload;
  }
};

export const actions = {
  triggerBusyState({ commit }) {
    commit("startBusyState");
  },
  stopBusyState({ commit }) {
    commit("endBusyState");
  },
  EDIT_SEARCH_TERMS({ commit }, payload) {
    let searchTerms = payload.searchTerms;
    commit("setSearchTerms", searchTerms);
  },
  async GET_ITEMS({ commit, dispatch }, payload) {
    dispatch("triggerBusyState");
    let data = {
      skip: payload
    };
    try {
      let items = await fetch("/.netlify/functions/all-items", {
        method: "POST",
        body: JSON.stringify(data)
      }).then(res => res.json());
      if (items.length > 0) {
        commit("SET_ITEMS", items);
      } else {
        commit("adjustItemsRemaining", false);
      }
    } catch (err) {
      console.log(err);
    }
    dispatch("stopBusyState");
  },
  async GET_ADDITIONAL_ITEMS({ commit, dispatch }, payload) {
    dispatch("triggerBusyState");
    let data = {
      skip: payload
    };
    try {
      let items = await fetch("/.netlify/functions/all-items", {
        method: "POST",
        body: JSON.stringify(data)
      }).then(res => res.json());
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
      commit("SEARCH_ITEMS", items);
    } catch (err) {
      console.log(err);
    }
    dispatch("stopBusyState");
  },
  async ADD_ITEM({ commit, dispatch }, payload) {
    dispatch("triggerBusyState");
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
      commit("addItem", newItem);
      dispatch("stopBusyState");
      return newItem;
    } catch (err) {
      console.log(err);
    }
    dispatch("stopBusyState");
  },
  async DELETE_ITEM({ commit, dispatch }, payload) {
    dispatch("triggerBusyState");
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
    dispatch("stopBusyState");
  },
  async EDIT_ITEM({ commit, dispatch }, payload) {
    dispatch("triggerBusyState");
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
        // Compose error message
      }
      commit("endBusyState");
      return editedItem;
    } catch (err) {
      console.log(err);
    }
    commit("endBusyState");
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
  }
};
