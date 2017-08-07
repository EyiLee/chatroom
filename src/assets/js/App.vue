<template>
  <main>
    <navbar></navbar>
    <div class="container">
      <div class="row">
        <div class="col col-9">
          <messages></messages>
        </div>
      </div>
    </div>
  </main>
</template>

<script>
  import firebase from 'firebase'

  import navbar from './components/navbar'
  import messages from './components/messages/messages'

  import { mapMutations } from 'vuex'

  export default {
    created () {
      firebase.auth().onAuthStateChanged((user) => {
        if (user) {
          this.updateUser(user)
        }
      })
    },
    methods: {
      ...mapMutations([
        'updateUser'
      ])
    },
    components: { navbar, messages }
  }
</script>

<style lang="scss">
  @import '~bootstrap/scss/bootstrap';

  html, body {
    max-width: 100vw;
    max-height: 100vh;
  }
  body {
    padding-top: 60px;
    padding-bottom: 20px;
  }
</style>
