export const state = () => ({
	// Items
	items: [],
	itemCount: null,
	itemsRemaining: true
})

export const mutations = {
	// Items
	ADD_ITEM(state, item) {
		state.items.push(item)
	},
	ADD_NEW_ITEM(state, item) {
		state.items.unshift(item)
	},
	ADJUST_ITEMS_REMAINING(state, count) {
		state.itemsRemaining = count
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
	// Items
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
	async deleteItem({ commit, dispatch, state }, payload) {
		dispatch('loading/triggerBusyState', null, { root: true })
		try {
			const data = {
				ID: payload.ID,
				media: payload.media
			}
			const deletedItem = await fetch('/.netlify/functions/delete-item', {
				method: 'PUT',
				body: JSON.stringify(data)
			}).then(res => res.json())
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
			if (editedItem.matchedCount && editedItem.modifiedCount) {
				dispatch('refreshItem', payload.ID)
			} else {
				// Error
			}
			dispatch('loading/stopBusyState', null, { root: true })
			return editedItem
		} catch (err) {
			console.log(err)
		}
		dispatch('loading/stopBusyState', null, { root: true })
	},
	async getAdditionalItems({ commit, dispatch }, payload) {
		dispatch('loading/triggerBusyState', null, { root: true })
		const data = {
			skip: payload
		}
		try {
			const response = await fetch('/.netlify/functions/all-items', {
				method: 'POST',
				body: JSON.stringify(data)
			}).then(res => res.json())
			const items = response[0]
			if (items.length > 0) {
				items.forEach(item => {
					commit('ADD_ITEM', item)
				})
			} else {
				commit('ADJUST_ITEMS_REMAINING', false)
			}
		} catch (err) {
			console.log(err)
		}
		dispatch('loading/stopBusyState', null, { root: true })
	},
	async getItems({ commit, dispatch }, payload) {
		dispatch('loading/triggerBusyState', null, { root: true })
		// const data = {
		// 	skip: payload
		// }
		try {
			// const response = await this.$axios
			// 	.$get('/.netlify/functions/all-items', {
			// 		method: 'POST',
			// 		body: JSON.stringify(data)
			// 	})
			// 	.then(res => res.json())
			const response = await this.$axios.$post(
				'/.netlify/functions/all-items',
				{
					skip: payload
				}
			)
			// .then(res => res.json())
			// console.log(response)
			commit('SET_ITEMS', response[0])
			commit('SET_ITEMS_COUNT', response[1])
			if (response[0].length < 1) {
				commit('ADJUST_ITEMS_REMAINING', false)
			}
		} catch (err) {
			console.log(err)
		}
		dispatch('loading/stopBusyState', null, { root: true })
	},
	async refreshItem({ commit }, id) {
		try {
			const refreshedItem = await fetch(
				'/.netlify/functions/refresh-item',
				{
					method: 'POST',
					body: JSON.stringify(id)
				}
			).then(res => res.json())
			commit('EDIT_ITEM', refreshedItem)
		} catch (err) {
			console.log(err)
		}
	},
	async searchItems({ commit, dispatch }, payload) {
		dispatch('loading/triggerBusyState', null, { root: true })
		try {
			const data = {
				searchTerms: payload
			}
			const items = await fetch('/.netlify/functions/find-items', {
				method: 'POST',
				body: JSON.stringify(data)
			}).then(res => res.json())
			commit('SET_ITEMS', items)
		} catch (err) {
			console.log(err)
		}
		dispatch('loading/stopBusyState', null, { root: true })
	}
}
