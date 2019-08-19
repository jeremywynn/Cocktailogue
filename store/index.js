export const state = () => ({
  items: []
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
    var item = state.items.find(item => item._id === payload._id);
    state.items.splice(state.items.indexOf(item), 1);
  }
};

export const actions = {
  async GET_ITEMS({ commit }) {
    try {
      let items = await fetch("/.netlify/functions/all-items").then(res =>
        res.json()
      );
      commit("SET_ITEMS", items);
    } catch (err) {
      console.log(err);
    }
  },
  async SEARCH_ITEMS({ commit }, payload) {
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
  },
  async ADD_ITEM({ commit }, payload) {
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
  },
  async DELETE_ITEM({ commit }, payload) {
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

    /*
    // IMPORTANT: Query for the deleted item to ensure that it was truly deleted before removing it from the state store (doing the commit)
    client.query(q.Delete(q.Ref(q.Class("Items"), this.$vnode.key))).then((ret) => {
      client.query(q.Get(q.Ref(q.Class("Items"), this.$vnode.key))).then((ret) => console.log(ret)).catch((ret) => {
        // Do the deletion on the front-end
        this.show = false
      })
    })
    */

    // commit("deleteItem", deletedItem);
  }
};
