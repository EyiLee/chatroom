<template>
  <div class="messagesfooter">
    <textarea class="border-0 px-3 py-2" placeholder="輸入訊息並按 Enter 送出" v-model="message" @keypress.enter="inputHandler"></textarea>
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
  .messagesfooter {
    position: relative;
    width: 100%;
    height: 4rem;
  }
  .messagesfooter::before {
    content: "";
    display: block;
    position: absolute;
    top: 0;
    width: 100%;
    border: 1px solid rgba(0, 0, 0, 0.15);
  }
  .messagesfooter textarea {
    display: block;
    width: 100%;
    height: 100%;
    resize: none;
  }
  .messagesfooter textarea:focus {
    outline-style: none;
  }
</style>
