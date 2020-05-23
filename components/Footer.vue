<template>
  <footer class="footer">
    <div class="footer__content">
      <div class="footer__item">
        <div>
          Last updated: {{ updated }}
        </div>
        <div>
          <a :href="homepage">{{ name }}</a> version: {{ version }}
        </div>
      </div>
      <!-- eslint-disable-next-line vue/no-v-html -->
      <div class="footer__item" v-html="info" />
    </div>
  </footer>
</template>

<script>
import data from '../extra/data.json'
import packageJSON from '../package.json'

export default {
  name: 'Footer',
  data () {
    return {
      info: data.info,
      version: packageJSON.version,
      homepage: packageJSON.homepage,
      updated: new Date(data._updated).toISOString().split('.')[0].split('T').join(' '),
      name: packageJSON.name
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
  display: flex;
  max-width: 75rem;
  margin: 0 auto;
  padding: 3rem 0.25rem;
}

.footer__item {
  flex-grow: 1;
  flex-basis: 0;
  margin: 0.25rem;
}

@media only screen and (max-width: 1024px) {
  .footer__content {
    flex-direction: column-reverse;
  }
}
</style>
