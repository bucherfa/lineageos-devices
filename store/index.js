import data from '../static/data.json'

export const state = () => ({
  filtersActive: false,
  filters: data.filters,
  // devices: data.devices,
  filteredDevices: [],
  filteringInProgress: false,
  worker: undefined,
  amountToShow: 5
})

export const mutations = {
  setFiltersActive (state, value) {
    state.filtersActive = value
  },
  setOneFilterSelection (state, { key, selection }) {
    state.filters[key].selected = selection
  },
  setFilteringInProgress (state, value) {
    state.filteringInProgress = value
  },
  setFilteredDevices (state, devices) {
    state.filteredDevices = devices
  },
  setWorker (state, worker) {
    state.worker = worker
  },
  loadMore (state, amount) {
    state.amountToShow = amount
  }
}

export const actions = {
  toggleFiltersActive ({ commit, state }) {
    commit('setFiltersActive', !state.filtersActive)
  },
  updateOneFilterSelectionAndUpdateDeviceList ({ dispatch }, { key, selection }) {
    dispatch('setOneFilterSelection', { key, selection }).then(() => {
      dispatch('updateFilteredDevices')
    })
  },
  setOneFilterSelection ({ commit }, { key, selection }) {
    commit('setOneFilterSelection', { key, selection })
  },
  startFiltering ({ commit }) {
    commit('setFilteringInProgress', true)
  },
  endFiltering ({ commit }) {
    commit('setFilteringInProgress', false)
  },
  updateFilteredDevices ({ dispatch, getters, state }) {
    dispatch('startFiltering')
    dispatch('resetLoadAmount')
    if (state.worker) {
      state.worker.postMessage({ devices: data.devices, filters: getters.filters })
      state.worker.onmessage = function (event) {
        const filtered = event.data
        dispatch('setFilteredDevices', filtered)
        dispatch('endFiltering')
      }
    } else {
      dispatch('endFiltering')
    }
  },
  setFilteredDevices ({ commit }, filtered) {
    commit('setFilteredDevices', filtered)
  },
  setWorker ({ commit }, worker) {
    commit('setWorker', worker)
  },
  loadMore ({ commit, getters }) {
    commit('loadMore', getters.amountToShow + 5)
  },
  resetLoadAmount ({ commit }) {
    commit('loadMore', 5)
  }
}

export const getters = {
  isFiltersActive: state => state.filtersActive,
  filters: state => state.filters,
  filteredDevices: state => state.filteredDevices.slice(0, state.amountToShow),
  filteredDevicesAmount: state => state.filteredDevices.length,
  filteringInProgress: state => state.filteringInProgress,
  // device: state => deviceKey => state.devices[deviceKey]
  amountToShow: state => state.amountToShow
}
