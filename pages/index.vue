<template>
  <div class="index" :class="$store.getters.isFiltersActive ? 'index--background' : ''">
    <main class="content">
      <a-alert
        message="Welcome"
        description="You came to the right place if you are looking for a new device that runs LineageOS or one of its forks. This site is not affiliated with the LineageOS Project."
        type="info"
        :show-icon="true"
        class="info-box"
      />
      <a-alert
        message="Beta Version"
        description="This site is still under heavy development."
        type="warning"
        :show-icon="true"
        class="info-box"
      />
      <div class="content__buttons">
        <a-button block @click="openFilters">
          Filters
        </a-button>
        <a-button block @click="openFilters">
          Sort
        </a-button>
      </div>
      <div class="content__main">
        <Filters />
        <div class="content__list">
          <h2 class="content__title">
            {{ filteredDevicesAmount }} {{ devicesPluralOrSingular }} matching
          </h2>
          <List />
          <a-button v-if="moreDevicesAvailableToLoad" block class="content__loadMore" @click="loadMore">
            Load more
          </a-button>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import Filters from '../components/Filters'
import data from '../static/data.json'
import List from '~/components/List.vue'

export default {
  components: {
    Filters,
    List
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
    loadMore () {
      this.$store.dispatch('loadMore')
    }
  }
}
</script>

<style>
.index__title {
  color: white;
  font-weight: bolder;
  margin: 0;
  padding-left: 2rem;
}

.content {
  margin: 0 0.5rem;
}

.info-box {
  margin: 1rem 0;
}

.content__title {
  border-bottom: #47494e solid 1px;
  margin-top: 1.5rem;
}

.content__buttons {
  display: flex;
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
}
</style>
