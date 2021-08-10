import Vue from 'vue'
import VueApollo from 'vue-apollo'
import { ApolloClient, InMemoryCache } from '@apollo/client'
import { createUploadLink } from 'apollo-upload-client' // partners with graphql-upload
import { IntrospectionFragmentMatcher } from 'apollo-cache-inmemory'

import possibleTypes from './possibleTypes.json'

const env = require('ahau-env')()

const fragmentMatcher = new IntrospectionFragmentMatcher({
  introspectionQueryResultData: possibleTypes
})

// Install the vue plugin
Vue.use(VueApollo)

// Name of the localStorage item
const AUTH_TOKEN = 'apollo-pataka-token'

const host = window.location.origin.split(':')[1] // assumes no port

// Http endpoint
const httpEndpoint =
  process.env.VUE_APP_GRAPHQL_HTTP || `${host}:${env.pataka.graphql.port}/graphql`

// Call this in the Vue app file
export function createProvider (options = {}) {
  // Create apollo client
  const apolloClient = new ApolloClient({
    ...options,
    ssrMode: typeof window === 'undefined',
    cache: new InMemoryCache({
      fragmentMatcher
    }),
    link: createUploadLink({ uri: httpEndpoint })
  })

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
