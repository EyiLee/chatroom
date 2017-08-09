<template>
  <div>
    <div class="messages rounded my-2 px-3 py-3" ref="messages" @scroll="loadMessage">
      <div v-for="(item, index) in messages" :key="index">
        <div class="d-flex mb-3 justify-content-start" :class="[isUser(item.uid) ? 'flex-row-reverse' : 'flex-row']">
          <img class="avatar rounded align-self-end" v-if="users[item.uid]" :src="users[item.uid].photoURL">
          <div class="mx-3 my-1">
            <p class="text-muted rounded" :class="[isUser(item.uid) ? 'user' : 'others']" v-for="(text, index) in item.text" :key="index">{{ text }}</p>
          </div>
        </div>
      </div>
    </div>
    <messagesfooter></messagesfooter>
  </div>
</template>

<script>
  import _ from 'lodash'
  import firebase from 'firebase'

  import messagesfooter from './footer'

  import { mapState } from 'vuex'

  export default {
    data () {
      return {
        messages: _.stubArray(),
        users: _.stubObject(),
        scrollBottom: 0
      }
    },
    computed: {
      ...mapState([
        'user'
      ])
    },
    created: function () {
      firebase.database().ref('/messages/').limitToLast(30).on('child_added', (snapshot) => {
        this.insertMessage(snapshot.val())
      })
      firebase.database().ref('/users/').on('value', (snapshot) => {
        this.users = _.assign(snapshot.val())
      })
    },
    updated: function () {
      this.$refs.messages.scrollTop = this.$refs.messages.scrollHeight - this.scrollBottom
    },
    methods: {
      insertMessage: function (message) {
        if (_.size(this.messages) === 0 || _.last(this.messages).uid !== message.uid) {
          this.messages.push({
            uid: message.uid,
            text: [message.text],
            timestamp: [message.timestamp]
          })
        } else {
          _.last(this.messages).text.push(message.text)
          _.last(this.messages).timestamp.push(message.timestamp)
        }
        this.$refs.messages.scrollTop = this.$refs.messages.scrollHeight
      },
      loadMessage: function () {
        this.scrollBottom = this.$refs.messages.scrollHeight - this.$refs.messages.scrollTop
        let head = _.head(_.head(this.messages).timestamp) - 1
        if (this.$refs.messages.scrollTop === 0) {
          firebase.database().ref('/messages/').orderByChild('timestamp').endAt(head).limitToLast(20).once('value').then((snapshot) => {
            _.forEachRight(snapshot.val(), (value) => {
              if (_.size(this.messages) === 0 || _.head(this.messages).uid !== value.uid) {
                this.messages.unshift({
                  uid: value.uid,
                  text: [value.text],
                  timestamp: [value.timestamp]
                })
              } else {
                _.head(this.messages).text.unshift(value.text)
                _.head(this.messages).timestamp.unshift(value.timestamp)
              }
            })
          })
        }
      },
      isUser: function (uid) {
        return uid === this.user.uid
      }
    },
    components: { messagesfooter }
  }
</script>

<style>
  .avatar {
    width: 40px;
    height: 40px;
  }
  .messages {
    max-height: calc(100vh - 180px);
    border: 1px solid rgba(0, 0, 0, 0.15);
    overflow-y: auto
  }
  .messages .user {
    margin-left: auto;
    background-color: lavender;
  }
  .messages .others {
    margin-right: auto;    
    background-color: lightgray;
  }
  .messages p {
    width: fit-content;
    min-width: 2rem;
    text-align: left;
    white-space: pre-wrap;
    word-break: break-word;
    margin-top: 0rem !important;
    margin-bottom: 0.5rem !important;
    padding: 0.25rem 0.5rem !important;
  }
  .messages p:last-child {
    margin-top: 0 !important;
    margin-bottom: 0 !important;
  }
</style>
