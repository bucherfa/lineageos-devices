<template>
  <a-affix v-if="compare.length > 0" :offset-bottom="32" class="comapare__wrapper">
    <div class="compare">
      <a-card>
        <a-card-grid v-for="deviceKey of compare" :key="deviceKey" class="compare__box" :hoverable="false">
          <div class="compare__image-wrapper">
            <img class="compare__image" :src="`devices/${devices[deviceKey].image}`">
          </div>
          <span class="compare__name">{{ cutName(devices[deviceKey].name) }}</span>
          <a-icon class="compare__close" type="close" @click="remove(deviceKey)" />
        </a-card-grid>
        <a-card-grid v-for="n in fillerAmount" :key="n" class="compare__box" :hoverable="false">
          <div class="compare__image-wrapper">
            <a-icon class="compare__image compare__image--empty" type="question" />
          </div>
          <span class="compare__name">Empty</span>
        </a-card-grid>
        <a-card-grid class="compare__box compare__box--actions" style="" :hoverable="false">
          <span class="compare__action-title">Compare by</span>
          <a-button class="compare__action" type="primary" :disabled="disableButtons" @click="openLink(specCompareLink)">
            Specs
          </a-button>
          <a-button class="compare__action" type="primary" :disabled="disableButtons" @click="openLink(sizeCompareLink)">
            Size
          </a-button>
        </a-card-grid>
      </a-card>
    </div>
  </a-affix>
</template>

<script>
import data from '../static/data.json'

export default {
  name: 'Compare',
  data () {
    return {
      devices: data.devices
    }
  },
  computed: {
    compare () {
      return this.$store.getters.compare
    },
    fillerAmount () {
      return 3 - this.compare.length
    },
    disableButtons () {
      return this.compare.length < 2
    },
    phoneArenaIds () {
      const ids = []
      for (const key of this.compare) {
        ids.push(this.devices[key].phonearena)
      }
      return ids
    },
    specCompareLink () {
      return `https://www.phonearena.com/phones/compare/x/phones/${this.phoneArenaIds.join(',')}`
    },
    sizeCompareLink () {
      return `https://www.phonearena.com/phones/size/x/phones/${this.phoneArenaIds.join(',')}`
    }
  },
  methods: {
    remove (deviceKey) {
      this.$store.dispatch('removeFromCompare', deviceKey)
    },
    openLink (link) {
      const a = document.createElement('a')
      a.href = link
      a.setAttribute('target', '_blank')
      a.click()
    },
    cutName (name) {
      if (name.length > 26) {
        return name.slice(0, 22) + '...'
      }
      return name
    }
  }
}
</script>

<style scoped>
.comapare__wrapper > * > * > * {
  box-shadow: 0 0 1px rgba(0,0,0,.15);
  margin-bottom: 1rem;
}

.compare {
  display: block;
  background: orangered;
  margin: 0 auto ;
  width: 35rem;
  z-index: 5;
}

.compare__box {
  padding: 0.5rem;
  position: relative;
  width: 25%;
  text-align: center;
}

.compare__box--actions {
  padding: 0.25rem;
  margin: auto 0;
  box-shadow: 0 0;
}

.compare__image-wrapper {
  width: 100%;
}

.compare__image {
  height: 4rem;
}

.compare__image--empty {
  padding: 1.5rem;
}

.compare__name {
  font-size: 0.5rem;
}

.compare__close {
  cursor: pointer;
  padding: 0.3rem;
  position: absolute;
  top: 0;
  right: 0;
}

.compare__action-title {
  font-size: 0.75rem;
}

.compare__action {
  margin: 0.125rem 0;
}

@media only screen and (max-width: 576px) {
  .compare {
    width: 17rem;
  }

  .compare__box {
    width: 50%;
  }
}
</style>
