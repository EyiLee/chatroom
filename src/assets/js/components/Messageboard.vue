<template>
  <div>
    <div v-for="item in messages" :key="item.timestamp">
      <div class="media flex-row my-3">
        <img class="avatar rounded d-flex align-self-end">
        <div class="media-body">
          {{ item.text }}
        </div>
      </div>
    </div>
    <input type="text" v-model="message">
    <button type="button" @click="addMessage">送出</button>
  </div>
</template>

<script>
import _ from 'lodash'
import firebase from 'firebase'

import { mapState } from 'vuex'

export default {
  data () {
    return {
      message: _.stubString(),
      messages: _.stubArray(),
      users: _.stubObject()
    }
  },
  computed: {
    ...mapState([
      'user'
    ])
  },
  created () {
    firebase.database().ref('messages').on('child_added', (snapshot) => {
      this.insertMessage(snapshot.val())
    })
    firebase.database().ref('users').on('value', (snapshot) => {
      _.assign(this.users, snapshot.val())
    })
  },
  methods: {
    addMessage: function () {
      firebase.database().ref('messages').push({
        uid: this.user.uid,
        text: this.message,
        timestamp: Date.now()
      })
    },
    insertMessage: function (message) {
      if (this.messages.length === 0) {
        this.messages.push({
          uid: message.uid,
          text: [message.text],
          timestamp: message.timestamp
        })
      } else if (_.last(this.messages).uid === message.uid) {
        _.last(this.messages).text.push(message.text)
      } else {
        this.messages.push({
          uid: message.uid,
          text: [message.text],
          timestamp: message.timestamp
        })
      }
    }
  }
}
</script>

<style>
  .avatar {
    width: 40px;
    height: 40px;
  }
</style>
