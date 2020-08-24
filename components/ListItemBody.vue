<template>
  <div>
    <a-row :gutter="16" class="feature__row">
      <a-col :span="6">
        <div class="feature__title">
          Display
        </div>
        <div class="feature__value">
          {{ device.display_size }} in
        </div>
      </a-col>
      <a-col :span="6">
        <div class="feature__title">
          Storage
        </div>
        <div class="feature__value">
          {{ device.storage }} GB
        </div>
      </a-col>
      <a-col :span="6">
        <div class="feature__title">
          Battery
        </div>
        <div class="feature__value">
          {{ device.battery_capacity }} mAh
        </div>
      </a-col>
      <a-col :span="6">
        <div class="feature__title">
          Camera
        </div>
        <div class="feature__value">
          {{ device.camera_main }} MP
        </div>
      </a-col>
    </a-row>
    <a-row :gutter="16" class="feature__row">
      <a-col :span="6">
        <div class="feature__title">
          Pixel density
        </div>
        <div class="feature__value">
          {{ device.screen_ppi }} ppi
        </div>
      </a-col>
      <a-col :span="6">
        <div class="feature__title">
          RAM
        </div>
        <div class="feature__value">
          {{ device.ram }} GB
        </div>
      </a-col>
      <a-col :span="6">
        <div class="feature__title">
          CPU
        </div>
        <div class="feature__value">
          {{ device.cpu_cores }} cores
        </div>
      </a-col>
      <a-col :span="6">
        <div class="feature__title">
          Front camera
        </div>
        <div class="feature__value">
          {{ device.camera_front }} MP
        </div>
      </a-col>
    </a-row>
    <div>
      <a-tag v-for="(p, index) of device.peripherals" :key="index" class="peripheral">
        {{ p }}
      </a-tag>
    </div>
    <div class="body__actions">
      <a :href="`https://wiki.lineageos.org/devices/${device.codename}`" class="action__link" target="_blank" rel="noreferrer">
        <a-icon type="global" style="margin-right: 8px" />
        Wiki
      </a>
      <a v-if="device.phonearena" class="action__link" @click="compare(device.codename)">
        <a-icon type="swap" style="margin-right: 8px" />Compare
      </a>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ListItemBody',
  props: {
    device: {
      type: Object,
      default: () => {}
    }
  },
  methods: {
    compare (key) {
      this.$store.dispatch('addToCompare', key)
    }
  }
}
</script>

<style scoped>
.feature__row {
  margin-bottom: 0.2rem;
}

.feature__title {
  font-size: 0.6rem;
}

.feature__value {
  font-size: 0.875rem;
}

.peripheral {
  margin-bottom: 0.1rem;
}

.body__actions {
  margin: 0.5rem 0 0;
}

.action__link {
  border-left: 1px #7f828b solid;
  padding: 0 0.75rem;
  text-decoration: none;
}

.action__link:first-child {
  border-left: 0;
  padding-left: 0;
}
</style>
