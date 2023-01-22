<template>
  <div>
    <a-list
      item-layout="vertical"
      size="large"
      :pagination="pagination"
      :data-source="deviceKeys"
      :loading="filteringInProgress"
      class="list"
    >
      <a-list-item slot="renderItem" key="devices[key].title" slot-scope="key">
        <div
          slot="extra"
          class="image-wrapper"
        >
          <img
            alt="logo"
            :src="`devices/${devices[key].image}`"
          >
        </div>
        <a-list-item-meta :title="devices[key].name">
          <div slot="description">
            <a-tooltip placement="top" title="Release">
              <a-tag color="green">
                <a-icon type="calendar" /> {{ devices[key].release }}
              </a-tag>
            </a-tooltip>
            <a-tooltip placement="top" title="Version">
              <a-tag color="cyan">
                <a-icon type="tag" /> {{ devices[key].version }}
              </a-tag>
            </a-tooltip>
            <a-tooltip placement="top" title="Popularity">
              <a-tag color="orange">
                <a-icon type="pie-chart" /> {{ Math.round(devices[key].popularity * 100) / 100 }}%
              </a-tag>
            </a-tooltip>
            <a-tooltip placement="top" title="Maintainers">
              <a-tag color="purple">
                <a-icon type="team" /> {{ devices[key].maintainers }}
              </a-tag>
            </a-tooltip>
          </div>
        </a-list-item-meta>
        <ListItemBody :device="devices[key]" />
      </a-list-item>
    </a-list>
    <div class="list__footer">
      <a-button v-if="showNextPageButton" @click="nextPage">
        next page
      </a-button>
    </div>
  </div>
</template>

<script>
import data from '../temp/data.json'
import ListItemBody from './ListItemBody'

export default {
  name: 'List',
  components: { ListItemBody },
  data () {
    return {
      devices: data.devices,
      actions: [
        { type: 'global', text: 'Wiki' },
        { type: 'swap', text: 'Compare' }
      ],
      pagination: {
        position: 'top',
        pageSize: 5,
        current: 1,
        onChange: this.handelPaginationChange
      },
      showNextPageButton: false
    }
  },
  computed: {
    deviceKeys () {
      return this.$store.getters.filteredDevices
    },
    filteringInProgress () {
      return this.$store.getters.filteringInProgress
    }
  },
  watch: {
    deviceKeys () {
      this.pagination.current = 1
      this.setNextPageButtonVisibility()
    }
  },
  created () {},
  methods: {
    nextPage () {
      window.document.querySelector('.content__title').scrollIntoView({ behavior: 'smooth' })
      this.setPaginationCurrent(this.pagination.current + 1)
      this.setNextPageButtonVisibility()
    },
    handelPaginationChange (page) {
      this.setPaginationCurrent(page)
      this.setNextPageButtonVisibility()
    },
    setPaginationCurrent (page) {
      this.$store.dispatch('startFiltering')
      // eslint-disable-next-line promise/param-names
      new Promise((res) => {
        this.pagination.current = page
        res()
      }).then(() => {
        this.$store.dispatch('endFiltering')
      })
    },
    setNextPageButtonVisibility () {
      this.showNextPageButton = this.deviceKeys.length !== 0 && this.pagination.current !== Math.ceil(this.deviceKeys.length / this.pagination.pageSize)
    }
  }
}
</script>

<style scoped>
.list {
  min-height: 4rem;
}

.image-wrapper {
  align-items: center;
  display: flex;
  height: 170px;
  justify-content: center;
  width: 200px;
}

.list__footer {
  text-align: center;
  padding: 1rem;
}

@media only screen and (max-width: 500px) {
  .image-wrapper {
    width: 300px;
  }
}
</style>
