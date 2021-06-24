import Vue from 'vue'
import Vuex from 'vuex'
import analytics from './modules/analytics'

Vue.use(Vuex)

const rootModule = {
  state: {},
  getters: {},
  mutations: {},
  actions: {}
}

export default new Vuex.Store({
  ...rootModule,
  modules: {
    analytics
  }
})
