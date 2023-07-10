const ahoy = require('ssb-ahoy')
const env = require('ahau-env')()
const chalk = require('chalk')
const boxen = require('boxen')
const path = require('path')
const { autoUpdater } = require('electron-updater')

const Config = require('./ssb.config')
const karakia = require('./karakia')
const { version } = require('./package.json')

ahoy(
  env.isDevelopment
    ? 'http://localhost:8081' // dev-server
    : `file://${__dirname}/dist/index.html`, // production build,
  {
    title: 'Pātaka',
    config: Config(),
    plugins: [
      require('ssb-db'),
      // require('ssb-master'),
      // require('ssb-unix-socket'),
      // require('ssb-no-auth'),
      require('ssb-conn'),
      require('ssb-lan'),
      require('ssb-replicate'),
      require('ssb-friends'),

      require('ssb-blobs'),
      require('ssb-serve-blobs'),
      require('ssb-hyper-blobs'),

      require('ssb-query'),
      require('ssb-backlinks'),

      require('ssb-tribes'), // TODO disable attempting decryption
      // require('ssb-tribes-registration'),

      require('ssb-profile'),
      require('ssb-story'),
      require('ssb-artefact'),
      require('ssb-whakapapa'),
      require('ssb-submissions'),
      require('ssb-settings'),

      require('ssb-invite'),
      require('ssb-recps-guard'),
      require('ssb-pataka'),
    ]
  },
  (err, ssb) => {
    if (err) throw err
    // this config has updated manifest added

    /* Karakia tūwhera */
    karakia()

    printConfig(ssb.config)

    if (env.isProduction) {
      autoUpdater.checkForUpdatesAndNotify()
    }
  }
)

function printConfig (config) {
  const envName = env.isProduction ? '' : ` ${env.name.toUpperCase()} `

  const configTxt = chalk`{green PATAKA} {white.bgRed ${envName}} v${version}

{bold feedId}  ${config.keys.id}
{bold network}
    ├── host  ${config.host}
    ├── port  ${config.port}
    └── api   http://localhost:${config.graphql.port}/graphql

{bold config}  ${path.join(config.path, 'config')}`

  console.log(boxen(configTxt, {
    padding: 1,
    margin: 1,
    borderStyle: 'round',
    borderColor: 'green'
  }))
}
