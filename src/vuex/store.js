import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const state = {
  showSearch: false,
  title: 'Ultra Markdown Wiki',
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
  }
}

export default new Vuex.Store({
  state,
  mutations
})
