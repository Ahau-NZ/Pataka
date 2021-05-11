// copied from whakapapa-ora
export const DECEASED_COLOUR = '#bfbfbf'
export const ALIVE_COLOUR = '#427979'

export default {
  theme: {
    dark: true,
    themes: {
      dark: {
        primary: '#383838',
        secondary: '#A80000',
        accent: '#A70000',
        error: '#ff0000',
        alive: ALIVE_COLOUR,
        deceased: DECEASED_COLOUR
      }
    },
    options: {
      customProperties: true
    }
  },
  icons: {
    iconfont: 'mdi'
  }
}
