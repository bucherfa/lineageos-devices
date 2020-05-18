<template>
  <footer class="footer">
    <div class="footer__content">
      <div v-html="info" />
    </div>
  </footer>
</template>

<script>
import data from '../static/data.json'

export default {
  name: 'Footer',
  data () {
    return {
      info: data.info
    }
  },
  computed: {},
  methods: {}
}
</script>

<style scoped>
.footer {
  background: #FAFAFA;
}

.footer__content {
  max-width: 75rem;
  margin: 0 auto;
  padding: 3rem 0.5rem;
}
</style>
