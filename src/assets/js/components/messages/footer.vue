<template>
  <div class="input-group">
    <textarea class="form-control" placeholder="輸入訊息並按 Enter 送出" v-model="message" @keyup.enter="inputHandler"></textarea>
  </div>
</template>

<script>
  import _ from 'lodash'
  import firebase from 'firebase'

  import { mapState } from 'vuex'

  export default {
    data () {
      return {
        message: _.stubString()
      }
    },
    computed: {
      ...mapState([
        'user'
      ])
    },
    methods: {
      inputHandler: function (e) {
        if (e.keyCode === 13 && !e.shiftKey) {
          this.addMessage()
        }
      },
      addMessage: function () {
        if (this.message !== _.stubString()) {
          firebase.database().ref('/messages/').push({
            uid: this.user.uid,
            text: this.message,
            timestamp: Date.now()
          })
        }
        this.message = _.stubString()
      }
    }
  }
</script>

<style>
  .messagesfooter{
    border: 1px solid rgba(0, 0, 0, 0.15);
  }
</style>
