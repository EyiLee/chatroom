import Vue from 'vue'
import store from './store'
import App from './App'

import firebase from 'firebase'
import config from '../config/config'

import 'bootstrap'

firebase.initializeApp(config)

new Vue({
  el: '#app',
  store,
  template: '<App/>',
  components: { App }
})
