const Config = require('ssb-config/defaults')
const fs = require('fs')
const path = require('path')
const env = require('ahau-env')()
const crypto = require('crypto')
const envPaths = require('env-paths')
const merge = require('lodash.merge')

const appPath = envPaths(process.env.APP_NAME || env.pataka.appName, { suffix: '' }).data
const configPath = path.join(appPath, 'config')

const { PATAKA_LOG, PATAKA_HOST } = process.env
// PATAKA_WEB_PORT

const core = {
  path: appPath,
  port: Number(process.env.PORT) || env.pataka.port, // ssb port
  pataka: {
    host: PATAKA_HOST || 'localhost',
    // webRegistration: {
    //   port: Number(PATAKA_WEB_PORT) || 3000,
    // }
    log: Boolean(PATAKA_LOG)
  },
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
  graphql: {
    port: Number(process.env.GRAPHQL_PORT) || env.pataka.graphql.port
  },
  recpsGuard: {
    allowedTypes: [
      'contact', // needed for ssb-invite
      'profile/pataka'
    ]
  }
}

let config = null

module.exports = function () {
  if (config) return config

  let persisted = loadPersisted(configPath) || {}
  persisted = tidyPersisted(persisted)
  if (!persisted.mixpanelId) {
    persisted.mixpanelId = generateId()

    // write a copy of customConfig to configPath so that:
    // - we can persist our unique mixpanel ID for anonymous analytics
    fs.mkdirSync(appPath, { recursive: true })
    fs.writeFileSync(
      configPath,
      JSON.stringify(persisted, null, 2),
      (err) => {
        if (err) throw err
      }
    )
  }

  config = Config(env.pataka.appName, merge({}, core, persisted))

  return config
}

function loadPersisted (configPath) {
  try {
    const persisted = fs.readFileSync(configPath, 'utf8')
    return JSON.parse(persisted)
  } catch (err) {
    if (err.message.match(/no such file/)) return

    console.log('Invalid JSON in', configPath)
    throw err
  }
}

function generateId () {
  return crypto.randomBytes(32).toString('base64')
}

function tidyPersisted (config) {
  // NOTE a previous iteration of the app persisted way too much to config
  // this seemed to cause problems.
  // This is designed to prune back those old cases, while still allowing people to
  // add their own config (assumption: they will not add config.keys!)
  return config.keys
    ? { mixpanelId: config.mixpanelId }
    : config
}
