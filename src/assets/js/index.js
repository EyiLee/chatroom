import Vue from 'vue'
import store from './store'
import App from './App'

import firebase from 'firebase'
import config from '../config/config'

import Tooltip from 'vue-directive-tooltip'

Vue.use(Tooltip)

firebase.initializeApp(config)

new Vue({
  el: '#app',
  store,
  template: '<App/>',
  components: { App }
})
