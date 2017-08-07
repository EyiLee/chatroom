<template>
  <nav class="navbar navbar-inverse bg-inverse fixed-top">
    <div class="container">
      <div class="navbar-header">
        <div v-if="user">{{ user.displayName }}</div>
        <button v-if="user" type="button" class="btn btn-outline-secondary float-right" @click="signOut()">SignOut</button>        
        <button v-else type="button" class="btn btn-outline-secondary float-right" @click="signInWithGithub()">SignIn</button>
      </div>
    </div>
  </nav>
</template>

<script>
  import firebase from 'firebase'

  import { mapState, mapMutations } from 'vuex'

  export default {
    computed: {
      ...mapState([
        'user'
      ])
    },
    methods: {
      ...mapMutations([
        'updateUser'
      ]),

      signInWithGithub: function () {
        let provider = new firebase.auth.GithubAuthProvider()
        firebase.auth().signInWithPopup(provider).then((auth) => {
          this.updateUser(auth.user)
          firebase.database().ref('/users/' + auth.user.uid).update({
            displayName: auth.user.displayName,
            email: auth.user.email,
            photoURL: auth.user.photoURL
          })
        })
      },

      signOut: function () {
        firebase.auth().signOut()
        document.location.reload(true)
      }
    }
  }
</script>

<style>
  nav {
    height: 60px
  }
</style>
