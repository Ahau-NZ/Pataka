const path = require('path')
const buildIcons = require('ahau-icons')

buildIcons({
  // TODO: replace with svg, using this for now as the icon
  // on mac comes out pixelated with the .svg
  icon: path.join(__dirname, 'icon.png'),
  setupImage: path.join(__dirname, 'setup-icon.svg')
})
