export const state = () => ({
  items: [],
  loading: false
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
  }
};

export const actions = {
  triggerBusyState({ commit }) {
    commit("startBusyState");
  },
  stopBusyState({ commit }) {
    commit("endBusyState");
  },
  async GET_ITEMS({ commit, dispatch }) {
    dispatch("triggerBusyState");
    try {
      let items = await fetch("/.netlify/functions/all-items").then(res =>
        res.json()
      );
      commit("SET_ITEMS", items);
    } catch (err) {
      console.log(err);
    }
    dispatch("stopBusyState");
  },
  async SEARCH_ITEMS({ commit, dispatch }, payload) {
    dispatch("triggerBusyState");
    try {
      let data = {
        searchTerms: payload.searchTerms
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
      // console.log(editedItem);
      // commit("editItem", editedItem);
      if (editedItem.matchedCount && editedItem.modifiedCount) {
        dispatch("REFRESH_ITEM", payload.ID);
      } else {
        // Compose error message
      }
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
