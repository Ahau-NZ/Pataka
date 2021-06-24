import mixpanel from './mixpanel'

const version = require('../../../../package.json').version

const state = {}
const getters = {}
const mutations = {}

const actions = {
  patakaPing ({ state, commit }) {
    mixpanel.throttledTrack('pataka-ping', { version })
    // NOTE thottled means means we can call this action as much as we want and
    // mixpanel will only be hit e.g. once an hour (for this particular event)
    //
    // returns undefined if it was throttled, or an object if it went through
    //
    // NOTE the returned object only guarentees the event was queued for sending
    // not that it actually sent
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
