import Vue from 'vue'
import App from './App'

import firebase from 'firebase'
import config from '../config/config'

import store from './store'

firebase.initializeApp(config)

new Vue({
  el: '#app',
  store,
  template: '<App/>',
  components: { App }
})
