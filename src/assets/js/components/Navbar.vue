<template>
  <nav class="navbar navbar-dark bg-dark fixed-top">
    <div class="container-fluid">
      <div class="navbar-header">
        <button v-if="login" type="button" class="btn btn-outline-secondary" @click="signOut()">SignOut</button>        
        <button v-else type="button" class="btn btn-outline-secondary" @click="signIn()">SignIn</button>
      </div>
    </div>
  </nav>
</template>

<script>
  import { mapState, mapGetters, mapActions } from 'vuex'

  export default {
    computed: {
      ...mapState([
        'user'
      ]),
      ...mapGetters([
        'login'
      ])
    },
    methods: {
      ...mapActions([
        'update',
        'signIn',
        'signOut'
      ])
    }
  }
</script>

<style>
  nav {
    height: 4rem;
  }
</style>
