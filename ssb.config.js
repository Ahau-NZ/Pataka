const Config = require('ssb-config/defaults')
const fs = require('fs')
const path = require('path')
const env = require('ahau-env')()
const crypto = require('crypto')
const envPaths = require('env-paths')
const merge = require('lodash.merge')

const appPath = envPaths(env.pataka.appName, { suffix: '' }).data
const configPath = path.join(appPath, 'config')

const core = {
  path: appPath,
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
  }
}

let config = null

module.exports = function () {
  if (config) return config

  const persisted = loadPersisted(configPath)
  if (!persisted.mixpanelId) persisted.mixpanelId = generateId()

  config = Config(env.pataka.appName, merge({}, persisted, core))

  // write a copy of customConfig to configPath so that:
  // - ssb-ahoy + ssb-client can load up the right config to be able to connect to the server
  // - we can persist our unique mixpanel ID for anonymous analytics
  fs.writeFileSync(
    configPath,
    JSON.stringify(config, null, 2),
    (err) => {
      if (err) throw err
    }
  )

  if (!env.isProduction) {
    console.log(`\x1b[37m\x1b[41m NODE_ENV \x1b[31m\x1b[47m ${env.name} \x1b[0m`)
  }

  return config
}

function loadPersisted (configPath) {
  try {
    const persistedConfig = fs.readFileSync(configPath, 'utf8')
    return JSON.parse(persistedConfig) || {}
  } catch (err) {
    return {}
  }
}

function generateId () {
  return crypto.randomBytes(32).toString('base64')
}
