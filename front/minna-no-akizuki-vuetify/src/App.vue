<template>
  <div id="app">
    <header class="header">
      <div class="header__inner">
        <template v-if="isSignedIn && userName && userPic">
          <div class="header__user-image"><img :src='userPic'></div>
          <p class="header__user-name">{{ userName }}</p>
        </template>
        <button class="header__auth-button" @click="authFunction">
          {{ authButtonText }}
        </button>
      </div>
    </header>

    <router-view
      :isSignedIn="isSignedIn"
      :userName="userName"
      :userPic="userPic"
    >
    </router-view>

  </div>
</template>

<script>
import firebase from 'firebase'
export default {
  name: 'App',
  data () {
    return {
      userName: null,
      userPic: null,
      isSignedIn: null,
      authButtonText: null,
      authFunction: function () {}
    }
  },
  created () {
    this.onAuthStateChanged()
  },
  methods: {
    onAuthStateChanged () {
      firebase.auth().onAuthStateChanged(user => {
        this.userName = user ? this.getUserName() : null
        this.userPic = user ? this.getProfilePicUrl() : null
        this.authButtonText = user ? 'Sign-out' : 'Sign-in with Google'
        this.authFunction = user ? this.signOut : this.signIn
        this.isSignedIn = user
      })
    },
    signIn () {
      const provider = new firebase.auth.GoogleAuthProvider()
      firebase.auth().signInWithPopup(provider)
    },
    signOut () {
      firebase.auth().signOut()
    },
    isUserSignedIn () {
      return !!firebase.auth().currentUser || false
    },
    getProfilePicUrl () {
      return firebase.auth().currentUser.photoURL || '/static/images/profile_placeholder.png'
    },
    getUserName () {
      return firebase.auth().currentUser.displayName
    }
  }
}
</script>

<style lang="scss">
  body {
    background-color: #ECEFF1;
  }
  .header {
    background-color: #009CE5;
    &__inner {
      width: 90%;
      height: 70px;
      margin: 0 auto;
      display: flex;
      align-items: center;
    }
    &__user-image {
      position: relative;
      width: 50px;
      height: 50px;
      overflow: hidden;
      border-radius: 50%;
      img {
        width: 100%;
        height: auto;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translateX(-50%) translateY(-50%);
      }
    }
    &__user-name {
      margin: 0 15px;
      color: #FFF;
    }
    &__auth-button {
      background: #FFF;
      border: none;
      border-radius: 50px;
      padding: 5px 10px;
      color: #009CE5;
    }
  }
</style>
