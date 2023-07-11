import Vue from 'vue'
import VueApollo from 'vue-apollo'
import Client from 'ahau-graphql-client'

import possibleTypes from './possibleTypes.json'

const env = require('ahau-env')()
// Name of the localStorage item
const AUTH_TOKEN = 'apollo-pataka-token'

// Install the vue plugin
Vue.use(VueApollo)

// Call this in the Vue app file
export function createProvider (opts = {}) {
  const httpEndpoint = (
    process.env.VUE_APP_GRAPHQL_HTTP ||
    `http://localhost:${env.pataka.graphql.port}/graphql`
  )
  // TODO 2023-07-12 (mix) this may need tweaking again *carefully* for pataka-cli
  // const httpEndpoint = new URL(window.location.origin)
  // httpEndpoint.port = env.pataka.graphql.port
  // httpEndpoint.pathname = '/graphql'

  const apolloClient = new Client(httpEndpoint.href, { possibleTypes, ...opts })

  // Create vue apollo provider
  const apolloProvider = new VueApollo({
    defaultClient: apolloClient,
    defaultOptions: {
      $query: {
        // fetchPolicy: 'cache-and-network',
      }
    },
    errorHandler (error) {
      // eslint-disable-next-line no-console
      console.log(
        '%cError',
        'background: red; color: white; padding: 2px 4px; border-radius: 3px; font-weight: bold;',
        error.message
      )
    }
  })

  return apolloProvider
}

// currently we just use this so we don't instantiate heaps of providers
export const apolloProvider = createProvider()

// Manually call this when user log in
export async function onLogin (apolloClient, token) {
  if (typeof localStorage !== 'undefined' && token) {
    localStorage.setItem(AUTH_TOKEN, token) // eslint-disable-line
  }
  try {
    await apolloClient.resetStore()
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log('%cError on cache reset (login)', 'color: orange;', e.message)
  }
}

// Manually call this when user log out
export async function onLogout (apolloClient) {
  if (typeof localStorage !== 'undefined') {
    localStorage.removeItem(AUTH_TOKEN) // eslint-disable-line
  }
  try {
    await apolloClient.resetStore()
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log('%cError on cache reset (logout)', 'color: orange;', e.message)
  }
}
