export const state = () => ({
	// Loading
	loading: false
})

export const mutations = {
	// Loading
	END_BUSY_STATE(state) {
		state.loading = false
	},
	START_BUSY_STATE(state) {
		state.loading = true
	}
}

export const actions = {
	// Loading
	stopBusyState({ commit }) {
		commit('END_BUSY_STATE')
	},
	triggerBusyState({ commit }) {
		commit('START_BUSY_STATE')
	}
}
