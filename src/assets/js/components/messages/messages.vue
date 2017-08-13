<template>
  <div class="d-flex flex-column">
    <messagesheader></messagesheader>
    <div class="messages p-3" ref="messages" @scroll="loadMessage">
      <div v-for="(item, index) in messages" :key="index">
        <div class="d-flex justify-content-start my-3" :class="[isCurrentUser(item.uid) ? 'flex-row-reverse' : 'flex-row']">
          <img class="avatar rounded align-self-end" ref="avatar" data-toggle="tooltip" data-placement="top" v-if="users[item.uid]" :src="users[item.uid].photoURL" :title="users[item.uid].email">
          <div class="mx-3 my-1">
            <p class="rounded" :class="[isCurrentUser(item.uid) ? 'user' : 'others']" v-for="(text, index) in item.text" :key="index">{{ text }}</p>
          </div>
        </div>
      </div>
    </div>
    <messagesfooter></messagesfooter>
  </div>
</template>

<script>
  import firebase from 'firebase'

  import messagesheader from './header'
  import messagesfooter from './footer'

  import { mapState, mapGetters } from 'vuex'

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
      ]),
      ...mapGetters([
        'login'
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
      $('.avatar').tooltip()
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
        if (this.$refs.messages.scrollTop === 0) {
          let head = _.head(_.head(this.messages).timestamp) - 1
          firebase.database().ref('/messages/').orderByChild('timestamp').endAt(head).limitToLast(20).once('value').then((snapshot) => {
            _.forEachRight(_.assign(snapshot.val()), (message) => {
              if (_.size(this.messages) === 0 || _.head(this.messages).uid !== message.uid) {
                this.messages.unshift({
                  uid: message.uid,
                  text: [message.text],
                  timestamp: [message.timestamp]
                })
              } else {
                _.head(this.messages).text.unshift(message.text)
                _.head(this.messages).timestamp.unshift(message.timestamp)
              }
            })
          })
        }
      },
      isCurrentUser: function (uid) {
        return this.login ? this.user.uid === uid : false
      }
    },
    components: { messagesheader, messagesfooter }
  }
</script>

<style>
  .avatar {
    width: 40px;
    height: 40px;
  }
  .messages {
    height: calc(100vh - 8rem);
    overflow-y: auto;
    background-color: white;
  }
  .messages .user {
    margin-left: auto;
    color: white;
    background-color: #3e9bff;
  }
  .messages .others {
    margin-right: auto;    
    background-color: #e8e8e8;
  }
  .messages p {
    width: fit-content;
    min-width: 2rem;
    max-width: 24rem;
    text-align: left;
    white-space: pre-wrap;
    word-break: break-all;
    color: rgba(0,0,0,0.6);
    margin-top: 0rem !important;
    margin-bottom: 0.5rem !important;
    padding: 0.25rem 0.5rem !important;
  }
  .messages p:last-child {
    margin-top: 0 !important;
    margin-bottom: 0 !important;
  }
</style>
