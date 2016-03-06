import Vue from 'vue'
// import VueResource from 'vue-resource'
// import VueRouter from 'vue-router'
import App from './App'
import store from './vuex/store'
// import { modal } from 'vueboot'

// Vue.use(VueResource)
// Vue.use(VueRouter)

/* eslint-disable no-new */
new Vue({
  el: 'body',
  // provide the store using the "store" option.
  // this will inject the store instance to all child components.
  store,
  components: { App }
})
