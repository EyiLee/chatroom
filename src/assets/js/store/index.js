import Vue from 'vue'
import Vuex from 'vuex'

import firebase from 'firebase'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: _.stubObject()
  },
  getters: {
    login: function (state) {
      return _.has(state.user, 'uid')
    }
  },
  mutations: {
    update: function (state, user) {
      state.user = user
    }
  },
  actions: {
    update: function ({commit}, user) {
      commit('update', user)
    },
    signIn: function ({commit}) {
      let provider = new firebase.auth.GithubAuthProvider()
      firebase.auth().signInWithPopup(provider).then((auth) => {
        firebase.database().ref('/users/' + auth.user.uid).update({
          displayName: auth.user.displayName,
          email: auth.user.email,
          photoURL: auth.user.photoURL
        })
      })
    },
    signOut: function ({commit}) {
      firebase.auth().signOut().then(() => {
      })
    }
  }
})
