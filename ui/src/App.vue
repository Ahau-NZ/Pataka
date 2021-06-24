<template>
  <v-app>
    <Appbar v-if="displayAppbar" />
    <v-main>
      <router-view />
    </v-main>

    <div class='version'>
      <span>version</span> {{version}}
    </div>
  </v-app>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
import Appbar from '@/components/Appbar.vue'
const { version } = require('../../package.json')
const { mapActions: mapAnalyticsActions } = createNamespacedHelpers('analytics')

const MIN = 60e3
let interval

export default {
  name: 'App',
  data () {
    return {
      version
    }
  },
  methods: {
    ...mapAnalyticsActions(['patakaPing'])
  },
  mounted  () {
    if (interval) return

    this.patakaPing()
    interval = setInterval(this.patakaPing, 10 * MIN) // gets throttled in actions
  },
  computed: {
    displayAppbar () {
      if (this.$route.name === 'login') return false
      else return true
    }
  },
  watch: {
    '$route.name': {
      handler (to, from) {
        if (from !== undefined) {
          document.body.classList.remove('page--' + from.toLowerCase())
        }
        document.body.classList.add('page--' + to.toLowerCase())
      },
      immediate: true
    }
  },
  components: {
    Appbar
  }
}
</script>

<style lang="scss">
/* // global styles */
a {
  text-decoration: none;
}

/* //remove default vuetify dark theme background */
.v-application {
  background: none !important;
}

body {
  --primary-background: #303030;

  &.page--login {
    background: url(./assets/niho.svg);
    background-color: var(--primary-background);
    background-repeat: no-repeat;
    background-size: cover;
    background-position-y: -110%;
  }
  &.page--dashboard {
    background: url(./assets/niho.svg);
    background-color: var(--primary-background);
    background-repeat: no-repeat;
    background-size: 100vh;
    background-position: 60vw 15vh;
  }
}

.version {
  color: #999;
  position: fixed;
  bottom: 5px;
  right: 10px;
  font-size: .8rem;
  transition: all .3s ease-in;

  span {
    font-size: .8rem;
    color: rgba(0,0,0,0);
    transition: all .3s ease-in;
  }

  &:hover {
    color: #555;
    font-size: 1.2rem;

    background-color: #fff;
    padding: 0 4px;
    border: 1px solid #444;
    border-radius: 4px;

    span {
      color: #555;
    }
  }
}
</style>
