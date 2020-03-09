export const state = () => ({
	items: [],
	itemCount: null,
	itemsRemaining: true
})

export const mutations = {
	ADD_ITEM(state, item) {
		state.items.push(item)
	},
	ADD_NEW_ITEM(state, item) {
		state.items.unshift(item)
	},
	ADJUST_ITEMS_REMAINING(state, count) {
		state.itemsRemaining = count
	},
	CLEAR_ITEMS(state) {
		state.items = []
	},
	DELETE_ITEM(state, payload) {
		const item = state.items.find(item => item._id === payload._id)
		state.items.splice(state.items.indexOf(item), 1)
	},
	EDIT_ITEM(state, payload) {
		const item = state.items.find(item => item._id === payload._id)
		state.items.splice(state.items.indexOf(item), 1, payload)
	},
	SET_ITEMS(state, items) {
		state.items = items
	},
	SET_ITEMS_COUNT(state, itemCount) {
		state.itemCount = itemCount
	}
}

export const actions = {
	clearItems({ commit }) {
		commit('CLEAR_ITEMS')
	},
	async addItem({ commit, dispatch, state }, payload) {
		dispatch('loading/triggerBusyState', null, { root: true })
		try {
			const data = {
				name: payload.name,
				media: payload.media,
				content: payload.content,
				sourceCategory: payload.sourceCategory,
				sourceIdentifier: payload.sourceIdentifier
			}
			const newItem = await fetch('/.netlify/functions/add-item', {
				method: 'POST',
				body: JSON.stringify(data)
			}).then(res => res.json())
			commit('ADD_NEW_ITEM', newItem)
			dispatch('loading/stopBusyState', null, { root: true })
			return newItem
		} catch (err) {
			console.log(err)
		}
		dispatch('loading/stopBusyState', null, { root: true })
	},
	async deleteItem({ commit, dispatch }, payload) {
		dispatch('loading/triggerBusyState', null, { root: true })
		try {
			// const data = {
			// 	ID: payload.ID,
			// 	media: payload.media
			// }
			const deletedItem = await this.$axios.$post(
				'/.netlify/functions/delete-item',
				{
					ID: payload.ID,
					media: payload.media
				}
			)
			commit('DELETE_ITEM', deletedItem)
			dispatch('loading/stopBusyState', null, { root: true })
			return deletedItem
		} catch (err) {
			console.log(err)
		}
		dispatch('loading/stopBusyState', null, { root: true })
	},
	async editItem({ commit, dispatch, state }, payload) {
		dispatch('loading/triggerBusyState', null, { root: true })
		try {
			const data = {
				ID: payload.ID,
				name: payload.name,
				content: payload.content
			}
			const editedItem = await fetch('/.netlify/functions/edit-item', {
				method: 'POST',
				body: JSON.stringify(data)
			}).then(res => res.json())
			dispatch('loading/stopBusyState', null, { root: true })
			// Redo this, edit Item in State
			return editedItem
		} catch (err) {
			console.log(err)
		}
		dispatch('loading/stopBusyState', null, { root: true })
	},
	async getItems({ commit, dispatch }, payload) {
		dispatch('loading/triggerBusyState', null, { root: true })
		try {
			const response = await this.$axios.$post(
				'/.netlify/functions/all-items',
				payload
			)
			// commit('SET_ITEMS', response[0])
			const items = response[0]
			if (items.length > 0) {
				items.forEach(item => {
					commit('ADD_ITEM', item)
				})
			} else {
				commit('ADJUST_ITEMS_REMAINING', false)
			}
			commit('SET_ITEMS_COUNT', response[1])
			if (response[0].length < 1) {
				commit('ADJUST_ITEMS_REMAINING', false)
			}
		} catch (err) {
			console.log(err)
		}
		dispatch('loading/stopBusyState', null, { root: true })
	},
	async findItem({ commit }, id) {
		try {
			const requestedItem = await fetch('/.netlify/functions/find-item', {
				method: 'POST',
				body: JSON.stringify(id)
			}).then(res => res.json())
			// Either rename this or make this more distinguishable from editItem action
			commit('EDIT_ITEM', requestedItem)
		} catch (err) {
			console.log(err)
		}
	},
	async searchItems({ commit, dispatch }, payload) {
		dispatch('loading/triggerBusyState', null, { root: true })
		try {
			const items = await this.$axios.$post(
				'/.netlify/functions/find-items',
				{
					searchTerms: payload
				}
			)
			commit('SET_ITEMS', items)
		} catch (err) {
			console.log(err)
		}
		dispatch('loading/stopBusyState', null, { root: true })
	}
}
