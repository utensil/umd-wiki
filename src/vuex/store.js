import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const log = debug('store')
log.log = console.debug.bind(console)

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
  nav: null,
  wikiContent: ''
}

const mutations = {
  INCREMENT (state) {
    log(state)
    state.count++
  },
  DECREMENT (state) {
    log(state)
    state.count--
  },
  CONFIG_LOADED (state, config) {
    log('CONFIG_LOADED', config)
    state.config = config

    try {
      window.$.md.config = config
    } catch (e) {
      log('window.$.md.config error', e)
    }
  },
  MD_PATH_CHANGED (state, newPath) {
    state.currentMdPath = newPath
  },
  NAV_CHANGED (state, newNavContent) {
    log('NAV_CHANGED', newNavContent.menus)
    state.nav = newNavContent
    state.config.title = newNavContent.title
  },
  WIKI_HTML_CHANGED (state, newWikiHtml) {
    log('WIKI_HTML_CHANGED', {
      html: newWikiHtml
    })
    state.wikiContent = newWikiHtml
  }
}

export default new Vuex.Store({
  state,
  mutations
})
