const ahoy = require('ssb-ahoy')
const env = require('ahau-env')()
const { join } = require('path')
const chalk = require('chalk')
const boxen = require('boxen')
const { autoUpdater } = require('electron-updater')

const Config = require('./ssb.config')
const karakia = require('./karakia')

const plugins = [
  'ssb-db',
  'ssb-master',
  'ssb-unix-socket',
  'ssb-no-auth',

  'ssb-conn',
  'ssb-lan',
  'ssb-replicate',
  'ssb-friends',

  'ssb-blobs',
  'ssb-serve-blobs',
  'ssb-hyper-blobs',

  'ssb-query',
  'ssb-backlinks',

  'ssb-settings',
  'ssb-profile',
  // 'ssb-story',
  // 'ssb-artefact',
  // 'ssb-whakapapa',

  'ssb-invite',
  'ssb-tribes', // TODO disable attempting decryption
  'ssb-pataka',
  'ssb-recps-guard'
]

const appURL = env.isDevelopment
  ? 'http://localhost:8081' // dev-server
  : `file://${join(__dirname, '/dist/index.html')}` // production build

ahoy({
  title: 'Pātaka',
  config: Config(),
  plugins,
  appURL,
  // appDir: '../../AHAU/pataka', // only use this when ssb-ahoy symlinked
  onReady: ({ config }) => {
    // this config has updated manifest added

    /* Karakia tūwhera */
    karakia()

    printConfig(config)

    if (env.isProduction) {
      autoUpdater.checkForUpdatesAndNotify()
    }
  }
})

function printConfig (config) {
  const envName = env.isProduction ? '' : ` ${env.name.toUpperCase()} `

  const configTxt = chalk`{green PATAKA} {white.bgRed ${envName}}

{bold feedId}  ${config.keys.id}
{bold path}    ${config.path}
{bold network}
  ├── host  ${config.host}
  ├── port  ${config.port}
  └── api   http://localhost:${config.graphql.port}/graphql
`

  console.log(boxen(configTxt, {
    padding: 1,
    margin: 1,
    borderStyle: 'round',
    borderColor: 'green'
  }))
}
