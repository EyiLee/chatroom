<template>
  <div class="input-group">
    <textarea class="message form-control" placeholder="輸入訊息並按 Enter 送出" v-model="message" @keypress.enter="inputHandler"></textarea>
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
          e.preventDefault()
          this.addMessage()
          this.message = _.stubString()
        }
      },
      addMessage: function () {
        if (this.message.replace(/\s/g, '').length > 0) {
          firebase.database().ref('/messages/').push({
            uid: this.user.uid,
            text: this.message,
            timestamp: Date.now()
          })
        }
      }
    }
  }
</script>

<style>
  message {
    resize: none;
  }
</style>
