<template>
  <div>
    <Navbar></Navbar>
    <div class="container">
      <div class="row">
        <div class="col col-9">
          <Messageboard></Messageboard>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import firebase from 'firebase'

import Navbar from './components/Navbar'
import Messageboard from './components/Messageboard'

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
  components: { Navbar, Messageboard }
}
</script>

<style lang="scss">
@import '~bootstrap/scss/bootstrap';
body {
  padding-top: 60px;
  padding-bottom: 20px;
}
</style>
