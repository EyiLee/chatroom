<template>
  <div>
    <div class="messages rounded my-2 px-3 py-3" >
      <div v-for="item in messages" :key="item.timestamp">
        <div class="d-flex mb-3" :class="[isUser(item.uid) ? 'flex-row-reverse' : 'flex-row']">
          <img class="avatar rounded align-self-end" v-if="users[item.uid]" :src="users[item.uid].photoURL">
          <div class="mx-3 my-1">
            <p class="text-muted rounded" :class="[isUser(item.uid) ? 'user' : 'others']" v-for="(text, index) in item.text" :key="index">
              {{ text }}
            </p>
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
      firebase.database().ref('/users/').on('value', (snapshot) => {
        this.users = _.assign(snapshot.val())
      })
    },
    methods: {
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
    margin-top: 0rem !important;
    margin-bottom: 0.5rem !important;
    padding: 0.25rem 0.5rem !important;
  }
  .messages p:last-child {
    margin-top: 0 !important;
    margin-bottom: 0 !important;
  }
</style>
