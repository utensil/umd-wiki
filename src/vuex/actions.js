// const log = debug('actions')

export const increment = ({ dispatch }) => dispatch('INCREMENT')
export const decrement = ({ dispatch }) => dispatch('DECREMENT')

export const incrementIfOdd = ({ dispatch, state }) => {
  if ((state.count + 1) % 2 === 0) {
    dispatch('INCREMENT')
  }
}

export const incrementAsync = ({ dispatch }) => {
  setTimeout(() => {
    dispatch('INCREMENT')
  }, 1000)
}

export const loadConfigAsync = ({ dispatch }) => {
  // console.log('loadConfigAsync')

  // fetch('static/test.xls').then(res => {
  //   res.blob().then(b => {
  //     console.log(b)
  //   })
  // })

  // log('fetch config')
  return fetch('config.json').then(res => {
    return res.json().then(config => {
      dispatch('CONFIG_LOADED', config)
      return config
    })
  })
}

export const changeMdPath = ({dispatch}, newPath) => {
  dispatch('MD_PATH_CHANGED', newPath)
}

export const changeNavContent = ({dispatch}, newNavContent) => {
  dispatch('NAV_CHANGED', newNavContent)
}

export const changeWikiHtml = ({dispatch}, newWikiHtml) => {
  dispatch('WIKI_HTML_CHANGED', newWikiHtml)
}
