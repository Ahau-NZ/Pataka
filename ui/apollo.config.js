const path = require('path')

// Load .env files
// copied from:
// const { loadEnv } = require('vue-cli-plugin-apollo/utils/load-env')

const fs = require('fs')

const loadEnv = (paths) => paths.reduce((res, file) => {
  if (fs.existsSync(file)) {
    Object.assign(res, parse(fs.readFileSync(file, 'utf-8')))
  }
  return res
}, {})

function parse (src) {
  const res = {}
  src.split('\n').forEach(line => {
    // matching "KEY' and 'VAL' in 'KEY=VAL'
    const keyValueArr = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/)
    // matched?
    if (keyValueArr != null) {
      const key = keyValueArr[1]
      let value = keyValueArr[2] || ''

      // expand newlines in quoted values
      const len = value ? value.length : 0
      if (len > 0 && value.charAt(0) === '"' && value.charAt(len - 1) === '"') {
        value = value.replace(/\\n/gm, '\n')
      }

      // remove any surrounding quotes and extra spaces
      value = value.replace(/(^['"]|['"]$)/g, '').trim()

      res[key] = value
    }
  })
  return res
}
const env = loadEnv([
  path.resolve(__dirname, '.env'),
  path.resolve(__dirname, '.env.local')
])

module.exports = {
  client: {
    service: env.VUE_APP_APOLLO_ENGINE_SERVICE,
    includes: ['src/**/*.{js,jsx,ts,tsx,vue,gql}']
  },
  service: {
    name: env.VUE_APP_APOLLO_ENGINE_SERVICE,
    localSchemaFile: path.resolve(__dirname, './node_modules/.temp/graphql/schema.json')
  },
  engine: {
    endpoint: process.env.APOLLO_ENGINE_API_ENDPOINT,
    apiKey: env.VUE_APP_APOLLO_ENGINE_KEY
  }
}
