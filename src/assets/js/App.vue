<template>
  <main>
    <navbar></navbar>
    <div class="container-fluid">
      <div class="row justify-content-md-center">
        <div class="col col-md-10 col-lg-8 col-xl-6 p-0">
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

  import { mapActions } from 'vuex'

  export default {
    created () {
      firebase.auth().onAuthStateChanged((user) => {
        this.update(user)
      })
    },
    methods: {
      ...mapActions([
        'update'
      ])
    },
    components: { navbar, messages }
  }
</script>

<style lang="scss">
  @import '~bootstrap/scss/bootstrap';
  @import "~vue-directive-tooltip/src/css/index.scss";

  body {
    background-color: #e9ebee;
  }
  main {
    padding-top: 4rem;
  }
</style>
