<template>
  <div class="index" :class="isFiltersActive || isSortByActive ? 'index--background' : ''">
    <main class="content">
      <a-alert
        message="Welcome"
        description="You came to the right place if you are looking for a new device that runs LineageOS or one of its forks. Some of the devices listed below have different variants. Shown is only the variant with highest specifications."
        type="success"
        :show-icon="true"
        class="info-box"
        closable
      />
      <a-alert
        description="This site is not affiliated with the LineageOS Project."
        type="info"
        :show-icon="true"
        class="info-box"
        closable
      />
      <div class="content__buttons">
        <a-button block class="content__button" @click="openFilters">
          Filters
        </a-button>
        <a-button block class="content__button" @click="openSortBy">
          Sort
        </a-button>
      </div>
      <div class="content__main">
        <sort-by />
        <Filters />
        <div class="content__list">
          <div class="content__title-wrapper">
            <h2 class="content__title">
              {{ filteredDevicesAmount }} {{ devicesPluralOrSingular }} matching
            </h2>
            <div class="content__desktop-sort-by">
              <div>
                <span>Sort by </span>
                <a-select v-model="sortByActive" class="content__desktop-sort-by-dropdown" @change="handleSortByChange">
                  <template v-for="(option, index) of sortByOptions">
                    <a-select-option :key="'asc-'+index" :value="option + ',asc'">
                      {{ lang[option] }} (ascending)
                    </a-select-option>
                    <a-select-option :key="'desc-'+index" :value="option + ',desc'">
                      {{ lang[option] }} (descending)
                    </a-select-option>
                  </template>
                </a-select>
              </div>
            </div>
          </div>
          <List />
          <a-button v-if="moreDevicesAvailableToLoad" block class="content__loadMore" @click="loadMore">
            Load more
          </a-button>
          <Compare></Compare>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import Compare from '../components/Compare'
import Filters from '../components/Filters'
import data from '../extra/data.json'
import lang from '../extra/lang.json'
import SortBy from '../components/SortBy'
import List from '~/components/List.vue'

export default {
  components: {
    SortBy,
    Filters,
    List,
    Compare
  },
  data () {
    const sortBy = data.sortBy
    const sortByActiveType = sortBy.active.type
    const sortByActiveDesc = sortBy.active.desc ? ',desc' : ',asc'
    const sortByActive = sortByActiveType + sortByActiveDesc
    return {
      sortByActive,
      sortByOptions: sortBy.options,
      lang: lang.en
    }
  },
  computed: {
    filteredDevicesAmount () {
      return this.$store.getters.filteredDevicesAmount
    },
    amountToShow () {
      return this.$store.getters.amountToShow
    },
    devicesPluralOrSingular () {
      return this.$store.getters.filteredDevicesAmount === 1 ? 'Device' : 'Devices'
    },
    moreDevicesAvailableToLoad () {
      return this.filteredDevicesAmount - this.amountToShow > 0
    },
    isFiltersActive () {
      return this.$store.getters.isFiltersActive
    },
    isSortByActive () {
      return this.$store.getters.isSortByActive
    }
  },
  beforeCreate () {
    if (process.browser) {
      // eslint-disable-next-line nuxt/no-globals-in-created
      window.DEVICES = data.devices
      const newWorker = this.$worker.createWorker()
      this.$store.dispatch('setWorker', newWorker).then(() => {
        this.$store.dispatch('updateFilteredDevices')
      })
    }
  },
  methods: {
    openFilters () {
      this.$store.dispatch('toggleFiltersActive')
    },
    openSortBy () {
      this.$store.dispatch('toggleSortByActive')
    },
    loadMore () {
      this.$store.dispatch('loadMore')
    },
    handleSortByChange (event) {
      const array = event.split(',')
      const newActive = {
        type: array[0],
        desc: false
      }
      if (array[1] === 'desc') {
        newActive.desc = true
      }
      this.$store.dispatch('setSortBy', newActive)
    }
  }
}
</script>

<style>
.content {
  margin: 0 0.5rem;
}

.info-box {
  margin: 1rem 0;
}

.content__title-wrapper {
  border-bottom: #47494e solid 1px;
  display: flex;
  justify-content: space-between;
}

.content__title {
  margin-top: 1.5rem;
  margin-bottom: 0;
}

.content__desktop-sort-by {
  display: none;
  margin: auto 0 0.25rem 0;
}

.content__desktop-sort-by-dropdown {
  width: 15rem;
}

.content__buttons {
  display: flex;
  margin-top: 1rem;
}

.content__button {
  margin-right: 0.25rem;
  margin-left: 0.25rem;
}

.content__button:first-child {
  margin-left: 0;
}

.content__button:last-child {
  margin-right: 0;
}

.content__loadMore {
  margin: 0.5rem 0;
}

@media only screen and (min-width: 1024px) {
  .content {
    max-width: 75rem;
    padding: 0 0.5rem;
    margin: 0 auto;
  }

  .content__list {
    flex-grow: 1;
  }

  .content__buttons {
    display: none;
  }

  .content__main {
    display: flex
  }

  .content__desktop-sort-by {
    display: block;
  }
}
</style>
