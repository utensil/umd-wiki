import Vue from 'vue'
// import VueResource from 'vue-resource'
import VueRouter from 'vue-router'
// import { modal } from 'vueboot'

import App from './App'
import UwPrototype from './components/UwPrototype'

// Vue.use(VueResource)
Vue.use(VueRouter)

/* eslint-disable no-new */
// new Vue({
//   el: 'body',
//   // provide the store using the "store" option.
//   // this will inject the store instance to all child components.
//   store,
//   components: { App }
// })

var router = new VueRouter()

router.map({
  '*path': {
    component: UwPrototype
  }
})

router.start(App, 'body')
