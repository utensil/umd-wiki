
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
import {init} from './init'

// Vue.use(VueResource)
Vue.use(VueRouter)

const log = debug('main')

/* eslint-disable no-new */
// new Vue({
//   el: 'body',
//   // provide the store using the "store" option.
//   // this will inject the store instance to all child components.
//   store,
//   components: { App }
// })

Vue.config.debug = process.env['NODE_ENV'] !== 'production'

init()

require('./vendor/jquery.tocible/jquery.tocible.css')
require('script!./vendor/jquery.tocible/jquery.tocible.min.js')
require('script!./plugins/gimmick.title.js')
require('script!./plugins/gimmick.linkfixer.js')
require('script!./plugins/gimmick.tocible.js')
require('./plugins/gimmick.xlspreview.js')
require('./css/wiki.css')

log('Vue.config', Vue.config)

var router = new VueRouter()

router.map({
  '*path': {
    component: UwPrototype
  }
})

router.redirect({
  '*': 'index.md'
})

router.start(App, 'app')
