
require('bootstrap/dist/css/bootstrap.css')
require('tether/dist/css/tether.min.css')
require('markdown-core/dist/markdown-core.min.css')
require('script!jquery/dist/jquery.min.js')
require('script!tether/dist/js/tether.min.js')
require('script!bootstrap/dist/js/bootstrap.min.js')
require('script!markdown-core/dist/markdown-core.min.js')

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

Vue.config.debug = process.env['NODE_ENV'] !== 'production'

console.log(Vue.config)

var router = new VueRouter()

router.map({
  '*path': {
    component: UwPrototype
  }
})

router.start(App, 'app')
