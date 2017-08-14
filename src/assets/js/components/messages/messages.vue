<template>
  <div class="d-flex flex-column">
    <messagesheader></messagesheader>
    <div class="body p-3" ref="body" @scroll="loadMessage">
      <div v-for="(item, index) in messages" :key="index" v-if="users[item.uid]">
        <div :class="[isCurrentUser(item.uid) ? 'user' : 'others']">
          <img class="avatar rounded align-self-end" data-toggle="tooltip" data-container=".body" :src="users[item.uid].photoURL" :data-original-title="users[item.uid].email">
          <div class="mx-3 my-1">
            <span class="title">{{ users[item.uid].email }}</span>
            <p class="rounded mb-1" v-for="(text, index) in item.text" :key="index">
              <messagestext :text="text"></messagestext>
            </p>
          </div>
        </div>
      </div>
    </div>
    <messagesfooter></messagesfooter>
  </div>
</template>

<script>
  import firebase from 'firebase'
  import autolinker from 'autolinker'
  import messagesheader from './header'
  import messagestext from './text'
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
      this.$refs.body.scrollTop = this.$refs.body.scrollHeight - this.scrollBottom
      $('[data-toggle="tooltip"]').tooltip()
    },
    methods: {
      insertMessage: function (message) {
        if (_.size(this.messages) === 0 || _.last(this.messages).uid !== message.uid) {
          this.messages.push({
            uid: message.uid,
            text: [autolinker.link(message.text)],
            timestamp: [message.timestamp]
          })
        } else {
          _.last(this.messages).text.push(autolinker.link(message.text))
          _.last(this.messages).timestamp.push(message.timestamp)
        }
        this.$refs.body.scrollTop = this.$refs.body.scrollHeight
      },
      loadMessage: function () {
        this.scrollBottom = this.$refs.body.scrollHeight - this.$refs.body.scrollTop
        if (this.$refs.body.scrollTop === 0) {
          let head = _.head(_.head(this.messages).timestamp) - 1
          firebase.database().ref('/messages/').orderByChild('timestamp').endAt(head).limitToLast(30).once('value').then((snapshot) => {
            _.forEachRight(_.assign(snapshot.val()), (message) => {
              if (_.size(this.messages) === 0 || _.head(this.messages).uid !== message.uid) {
                this.messages.unshift({
                  uid: message.uid,
                  text: [autolinker.link(message.text)],
                  timestamp: [message.timestamp]
                })
              } else {
                _.head(this.messages).text.unshift(autolinker.link(message.text))
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
    components: { messagesheader, messagestext, messagesfooter }
  }
</script>

<style lang="scss">
  .avatar {
    width: 40px !important;
    height: 40px !important;
    flex: 0 0 40px;
  }
  .body {
    flex: 0 0 auto;
    height: calc(100vh - 8rem);
    padding: 1rem !important;
    background-color: white;
    overflow-y: auto;
  }
  .body .title {
    display: flex;
    width: fit-content;
    font-size: 0.8rem;
    color: rgba(0, 0, 0, 0.5);
  }
  .body p {
    width: fit-content;
    min-width: 2rem;
    max-width: 24rem;
    text-align: left;
    white-space: pre-wrap;
    word-break: break-all;
    margin-top: 0;
    margin-bottom: 0.25rem;
    padding: 0.25rem 0.5rem;
  }
  .body p:last-child {
    margin-bottom: 0;
  }
  .user {
    display: flex;
    flex-direction: row-reverse;
    justify-content: flex-start;
    margin: 1rem 0 1rem 0;
    .title {
      margin-left: auto;
    }
    p {
      margin-left: auto;
      color: white;
      background-color: #3e9bff;
      a {
        color: white;
        text-decoration-line: underline;
      }
      a:hover {
        background-color: rgba(255, 255, 255, 0.15);
      }
    }
  }
  .others {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    margin: 1rem 0 1rem 0;
    .title {
      margin-right: auto;
    }
    p {
      margin-right: auto;
      color: rgba(0, 0, 0, 0.6);
      background-color: #e8e8e8;
      a {
        color: #3f55ff;
      }
    }
  }
</style>
