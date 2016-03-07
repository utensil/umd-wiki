import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const defaultConfig = {
  title: '',
  lineBreaks: 'gfm',
  additionalFooterText: '',
  anchorCharacter: '&para;',
  useSideMenu: true,
  parseHeader: false,
  showSearch: false,
  baseUrl: 'static/'
}

const state = {
  config: defaultConfig,
  count: 123
}

const mutations = {
  INCREMENT (state) {
    console.log(state)
    state.count++
  },
  DECREMENT (state) {
    console.log(state)
    state.count--
  },
  CONFIG_LOADED (state, config) {
    console.log(state, config)
    state.config = config
  }
}

export default new Vuex.Store({
  state,
  mutations
})
