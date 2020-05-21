<template>
  <footer class="footer">
    <div class="footer__content">
      <!-- eslint-disable-next-line vue/no-v-html -->
      <div v-html="info" />
    </div>
  </footer>
</template>

<script>
import data from '../static/data.json'
// eslint-disable-next-line no-console
console.log()
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
