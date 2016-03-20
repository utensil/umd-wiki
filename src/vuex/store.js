import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const defaultConfig = {
  title: 'Dummy Title',
  lineBreaks: 'gfm',
  additionalFooterText: '',
  anchorCharacter: '&para;',
  useSideMenu: true,
  parseHeader: false,
  showSearch: false,
  baseUrl: ''
}

const state = {
  config: defaultConfig,
  count: 123,
  currentMdPath: 'index.md',
  nav: null
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
    console.log(config)
    state.config = config
  },
  MD_PATH_CHANGED (state, newPath) {
    state.currentMdPath = newPath
  },
  NAV_CHANGED (state, newNavContent) {
    console.log(JSON.stringify(newNavContent.menus, null, 2))
    state.nav = newNavContent
    state.config.title = newNavContent.title
  }
}

export default new Vuex.Store({
  state,
  mutations
})
