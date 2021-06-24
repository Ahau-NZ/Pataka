const Config = require('ssb-config/inject')
const fs = require('fs')
const path = require('path')
const env = require('ahau-env')
const crypto = require('crypto')

const customConfig = (mixpanelId) => ({
  port: env.pataka.port,
  allowPrivate: true, // used for making local invite codes
  // HACK: There is a problem with ssb-invite where it look for a public incoming connection in the config which does not exist
  // and then throws an error.
  // When allowPrivate:true it settles on a private/local address,
  // then invite.create({external}) overwrites the ip address of that address :(
  // Possible solution would be to pass host and port to ssb-invite and have it skip getAddress
  caps: env.pataka.caps,
  // caps = capabilities, only apps with:
  // - the same shs ("secret handshake") key can connect to each other
  // - thas same sign can verify (+replicatie) messages with each other
  friends: { hops: 2 },
  lan: {
    legacy: false
    // disables legacy UDP announce (which doesn't respect caps.shs!)
  },
  serveBlobs: {
    port: env.pataka.serveBlobs.port,
    cors: true,
    csp: ''
  },
  hyperBlobs: {
    pataka: true,
    port: env.pataka.hyperBlobs.port
  },
  recpsGuard: {
    allowedTypes: [
      'contact' // needed for ssb-invite
    ]
  },
  mixpanelId // unique string to be added
})

let config = null

module.exports = function () {
  if (config) return config

  config = Config(env.pataka.appName, customConfig())
  // NOTE this pulls in config from ~/.{appName}>/config as the base then merges customConfig

  if (!env.isProduction) {
    console.log(`\x1b[37m\x1b[41m NODE_ENV \x1b[31m\x1b[47m ${env.name} \x1b[0m`)
  }

  if (!config.mixpanelId) config.mixpanelId = generateId()

  // write a copy of customConfig to ~/.{appName}/config so that:
  // - ssb-ahoy + ssb-client can load up the right config to be able to connect to the server
  // - we can persist our unique mixpanel ID for anonymous analytics
  fs.writeFileSync(
    path.join(config.path, 'config'),
    JSON.stringify(customConfig(config.mixpanelId), null, 2),
    (err) => {
      if (err) throw err
    }
  )

  return config
}

function generateId () {
  return crypto.randomBytes(32).toString('base64')
}
