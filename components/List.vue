<template>
  <a-list
    item-layout="vertical"
    size="large"
    :pagination="pagination"
    :data-source="deviceKeys"
    :loading="filteringInProgress"
    class="list"
  >
    <a-list-item slot="renderItem" key="devices[key].title" slot-scope="key">
      <template v-for="{ type, text } in actions" slot="actions">
        <a :key="type" :href="`https://wiki.lineageos.org/devices/${key}`" class="action__link" target="_blank">
          <a-icon :type="type" style="margin-right: 8px" />
          {{ text }}
        </a>
      </template>
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
              <a-icon type="pie-chart" /> 0.2%
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
</template>

<script>
import data from '../static/data.json'
import ListItemBody from './ListItemBody'

export default {
  name: 'List',
  components: { ListItemBody },
  data () {
    return {
      devices: data.devices,
      actions: [
        { type: 'global', text: 'Wiki' }
      ],
      pagination: false
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
  watch: {},
  created () {},
  methods: {}
}
</script>

<style scoped>
.list {
  min-height: 4rem;
}

.action__link {
  text-decoration: none;
}

.image-wrapper {
  align-items: center;
  display: flex;
  height: 170px;
  justify-content: center;
  width: 200px;
}

@media only screen and (max-width: 500px) {
  .image-wrapper {
    width: 300px;
  }
}
</style>
