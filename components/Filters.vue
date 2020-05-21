<template>
  <div :class="isFiltersActive ? 'filters--active' : ''" class="filters">
    <div class="content content--filter">
      <h2 class="filter__headline">
        Filters
      </h2>
      <div v-for="(filter, key) of displayedFilters" :key="key" class="filter__item">
        <h3 class="filter__title">
          {{ filter.title }}
        </h3>
        <div v-if="filter.type.startsWith('checkbox')">
          <a-checkbox-group v-model="filter.selected" class="filter__input" @change="updateFilter(key, $event)">
            <a-row>
              <a-col v-for="option of filter.options" :key="option" :span="key === 'vendor' && option !== 'all' ? 12 : 24">
                <a-checkbox :value="option">
                  {{ capitalizeFirstLetter(option) }}
                </a-checkbox>
              </a-col>
            </a-row>
          </a-checkbox-group>
        </div>
        <div v-if="filter.type.startsWith('range')">
          <div class="filter__input">
            <a-input-group compact style="text-align: right">
              <a-input-number
                v-model="filter.selected[0]"
                size="small"
                style="width: 4rem"
                placeholder="Min"
                :min="filter.min"
                :max="filter.selected[1]"
                :step="filter.step"
                @blur="updateFilter(key, $event)"
              />
              <a-input
                size="small"
                style="width: 30px; border-left: 0; pointer-events: none; background-color: #fff"
                placeholder="-"
                disabled
              />
              <a-input-number
                v-model="filter.selected[1]"
                size="small"
                style="border-left: 0; width: 4rem"
                placeholder="Max"
                :min="filter.selected[0]"
                :max="filter.max"
                :step="filter.step"
                @blur="updateFilter(key, $event)"
              />
              <a-input
                :style="`width: 3.2rem; pointer-events: none; backgroundColor: #fafafa; text-align:center`"
                :placeholder="filter.unit"
                disabled
                size="small"
              />
            </a-input-group>
            <a-slider
              v-model="filter.selected"
              range
              :min="filter.min"
              :max="filter.max"
              :step="filter.step"
              :tip-formatter="null"
              @afterChange="updateFilter(key, $event)"
            />
          </div>
        </div>
      </div>
      <a-button type="primary" block class="filter__back-button" @click="closeFilters">
        Back
      </a-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Filters',
  data () {
    return {
      displayedFilters: {}
    }
  },
  computed: {
    storeFilters () {
      return this.$store.getters.filters
    },
    isFiltersActive () {
      return this.$store.getters.isFiltersActive
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
    closeFilters () {
      this.$store.dispatch('toggleFiltersActive')
    }
  }
}
</script>

<style scoped>
.filters {
  display: none;
  background: white;
  height: 100%;
  left: 0;
  overflow: auto;
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 100;
}

.filters--active {
  display: block;
}

.filter__close {
  cursor: pointer;
  font-size: 1rem;
  position: absolute;
  top: 0;
  right: 0;
  padding: 0.7rem 0.7rem 0.7rem 2rem;
}

.content--filter {
  margin-top: 4.5rem;
}

.filter__headline {
  margin-top: 1.5rem;
  border-bottom: #47494e solid 1px;
}

.filter__item {
  border-bottom: #d9d9d9 solid 1px;
  margin-bottom: 0.5rem;
}

.filter__input {
  margin: 0 1.5rem;
}

.filter__input-group {
  display: flex;
  flex-flow: column;
}

.filter__back-button {
  margin-bottom: 1rem;
}

@media only screen and (min-width: 1024px) {
  .filters {
    display: block;
    background: unset;
    height: unset;
    left: unset;
    overflow: unset;
    position: unset;
    top: unset;
    z-index: unset;
    width: 25rem;
    flex: 0 0 20rem;
    margin-right: 2rem;
  }

  .header--filter {
    display: none;
  }

  .content--filter {
    margin: 0;
    padding: 0;
  }

  .filter__back-button {
    display: none;
  }
}
</style>
