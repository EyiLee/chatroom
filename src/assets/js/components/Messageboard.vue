<template>
  <div>
    <div v-for="item in messages" :key="item.timestamp">
      <div class="media flex-row my-3">
        <img class="avatar rounded d-flex align-self-end mr-3" v-if="users[item.uid]" :src="users[item.uid].photoURL">
        <div class="media-body">
          <p v-for="(text, index) in item.text" :key="index">{{ text }}</p>
        </div>
      </div>
    </div>
    <input type="text" v-model="message" @keyup.enter="addMessage">
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
  created: function () {
    firebase.database().ref('/messages/').on('child_added', (snapshot) => {
      this.insertMessage(snapshot.val())
    })
    firebase.database().ref('/users/').once('value').then((snapshot) => {
      this.users = _.assign(snapshot.val())
    })
  },
  methods: {
    addMessage: function () {
      if (this.message !== _.stubString()) {
        firebase.database().ref('/messages/').push({
          uid: this.user.uid,
          text: this.message,
          timestamp: Date.now()
        })
      }
      this.message = _.stubString()
    },

    insertMessage: function (message) {
      if (_.size(this.messages) === 0 || _.last(this.messages).uid !== message.uid) {
        this.messages.push({
          uid: message.uid,
          text: [message.text],
          timestamp: message.timestamp
        })
      } else {
        _.last(this.messages).text.push(message.text)
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
