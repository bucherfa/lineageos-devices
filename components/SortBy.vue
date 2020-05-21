<template>
  <div :class="isSortByActive ? 'sort-by--active' : ''" class="sort-by">
    <h2 class="sort-by__headline">
      Sort by
    </h2>
    <template v-for="(option, index) of sortByOptions">
      <div :key="index + 'asc'" class="sort-by__item">
        <a-button type="link" @click="sortBy({ type: option, desc: false })">
          {{ lang[option] }} (ascending)
        </a-button>
      </div>
      <div :key="index + 'desc'" class="sort-by__item">
        <a-button type="link" @click="sortBy({ type: option, desc: true })">
          {{ lang[option] }} (descending)
        </a-button>
      </div>
    </template>
    <a-button type="primary" block class="sort-by__back-button" @click="closeSortBy">
      Back
    </a-button>
  </div>
</template>

<script>
import data from '../static/data.json'
import lang from '../extra/lang.json'

export default {
  name: 'SortBy',
  data () {
    return {
      sortByOptions: data.sortBy.options,
      lang: lang.en
    }
  },
  computed: {
    storeFilters () {
      return this.$store.getters.filters
    },
    isSortByActive () {
      return this.$store.getters.isSortByActive
    }
  },
  created () {
    this.displayedFilters = JSON.parse(JSON.stringify(this.$store.getters.filters))
  },
  methods: {
    capitalizeFirstLetter (string) {
      if (['arm', 'arm64'].includes(string)) {
        return string
      }
      return string.charAt(0).toUpperCase() + string.slice(1)
    },
    updateFilter (key, selection) {
      const newFilters = JSON.parse(JSON.stringify(this.displayedFilters))
      if (newFilters[key].type === 'checkbox') {
        const selectOnNone = newFilters[key].selectOnNone
        if (selection.length < 1) {
          newFilters[key].selected = [selectOnNone]
        } else {
          const addedOne = selection.length - this.storeFilters[key].selected.length > 0
          if (addedOne) {
            const newlyAdded = selection.filter(item => !this.storeFilters[key].selected.includes(item)).pop()
            if (newlyAdded === selectOnNone) {
              newFilters[key].selected = [selectOnNone]
            } else {
              newFilters[key].selected = selection.filter(item => item !== selectOnNone)
            }
          }
          // otherwise stay as is, selection is already in newFilters
        }
      }
      this.displayedFilters = newFilters
      this.$store.dispatch('updateOneFilterSelectionAndUpdateDeviceList', { key, selection: newFilters[key].selected })
    },
    closeSortBy () {
      this.$store.dispatch('toggleSortByActive')
    },
    sortBy (newActive) {
      this.$store.dispatch('setSortBy', newActive)
      this.$store.dispatch('toggleSortByActive')
    }
  }
}
</script>

<style scoped>
.sort-by {
  display: none;
  background: white;
  height: 100%;
  left: 0;
  overflow: auto;
  padding: 0.5rem;
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 100;
}

.sort-by--active {
  display: block;
}

.sort-by__headline {
  margin-top: 4rem;
  border-bottom: #47494e solid 1px;
}

.sort-by__item {
  margin-bottom: 0.5rem;
}

.sort-by__back-button {
  margin-bottom: 1rem;
}
</style>
