<template>
  <header class="header" :class="isFiltersActive || isSortByActive ? 'header--foreground' : ''">
    <h2 class="header__title">
      Devices for LineageOS
    </h2>
    <a-icon v-if="isFiltersActive || isSortByActive" class="header__close" type="close" @click="close" />
  </header>
</template>

<script>
export default {
  name: 'Header',
  computed: {
    isFiltersActive () {
      return this.$store.getters.isFiltersActive
    },
    isSortByActive () {
      return this.$store.getters.isSortByActive
    }
  },
  methods: {
    close () {
      this.$store.dispatch('closeFromHeader')
    }
  }
}
</script>

<style scoped>
.header {
  background: #167c80;
  color: white;
  display: flex;
  justify-content: space-between;
  font-weight: bolder;
  padding: 0.75rem;
}

.header--foreground {
  top: 0;
  position: fixed;
  width: 100%;
  z-index: 200;
}

.header__title {
  color: white;
  font-weight: bolder;
  margin: 0;
  padding-left: 0;
}

.header__close {
  cursor: pointer;
  font-size: 1.75rem;
  font-weight: bolder;
  padding-left: 2rem;
}

@media only screen and (min-width: 1024px) {
  .header__title {
    padding-left: 2rem;
  }
}
</style>
