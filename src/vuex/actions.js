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
  console.log('loadConfigAsync')

  window.fetch('static/test.xls').then(res => {
    res.blob().then(b => {
      console.log(b)
    })
  })

  window.fetch('static/test.md').then(res => {
    res.text().then(t => {
      console.log(t)
    })
  })

  window.fetch('config.json').then(res => {
    res.json().then(config => {
      dispatch('CONFIG_LOADED', config)
    })
  })
}
