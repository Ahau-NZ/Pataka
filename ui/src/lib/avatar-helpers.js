import tane from '../assets/tane.svg'
import wahine from '../assets/wahine.svg'
import diverse from '../assets/diverse.svg'

import whakapapa from '../assets/whakapapa.svg'

export default {
  defaultImage
}

function defaultImage (type, gender) {
  switch (type) {
    case 'person':
      switch (gender) {
        case 'male': return tane
        case 'female': return wahine
        case 'other':
        case 'unknown':
        default:
          return diverse
      }
    case 'pataka':
    case 'whakapapa':
    default:
      return whakapapa
  }
}
