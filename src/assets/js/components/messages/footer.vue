<template>
  <div class="messagesfooter">
    <textarea v-if="login" class="border-0 px-3 py-2" placeholder="輸入訊息並按 Enter 送出" v-model="message" @keypress.enter="inputHandler"></textarea>
    <div v-else class="border-0 px-3 py-2">
      <button type="button" class="btn btn-lg btn-block btn-secondary" @click="signIn()">登入並加入聊天室發言</button>
    </div>
  </div>
</template>

<script>
  import firebase from 'firebase'

  import { mapState, mapGetters, mapActions } from 'vuex'

  export default {
    data () {
      return {
        message: _.stubString()
      }
    },
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
        'signIn'
      ]),
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
