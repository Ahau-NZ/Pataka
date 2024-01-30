const clone = require('lodash.clone')
const fs = require('fs')
const path = require('path')

const desktopPkg = require('../ahau/desktop/package.json')
const patakaPkg = require('./package.json')

const newPatakaPkg = clone(patakaPkg)

const ignore = new Set([
  'ssb-ahau',
  'ssb-tribes',
  'ssb-tribes-registration'
])

Object.entries(desktopPkg.dependencies)
  .filter(([key, value]) => {
    if (ignore.has(key))
    if (key === 'secret-stack') return true
    if (key.startsWith('ssb') && !ignore.has(key)) return true
    if (key.startsWith('ahau')) return true

    console.log(' ✗', key)
    return false
  })
  .forEach(([key, value]) => {
    log(key, newPatakaPkg.dependencies[key], value)
    newPatakaPkg.dependencies[key] = value
  })

fs.writeFileSync(
  path.join(__dirname, 'package.json'),
  JSON.stringify(newPatakaPkg, null, 2)
)

console.log(' DONE')
console.log(' Remember to npm install')

function log (key, oldValue, newValue) {
  if (oldValue === newValue) console.log(green(' ✓'), key)
  else console.log(green(' ✓'), key, oldValue, '⇒', green(newValue))
}

function green (string) {
  return `\x1b[32m${string}\x1b[0m`
}
