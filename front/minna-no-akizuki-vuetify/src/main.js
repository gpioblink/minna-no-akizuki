import Vue from 'vue'
import './plugins/vuetify'
import App from './App.vue'
import router from './router'
import store from './store'
import './registerServiceWorker'
import firebase from 'firebase'

Vue.config.productionTip = false

const firebaseConfig = {
  apiKey: 'AIzaSyD2eNVsaaaYwBeFBlMGblbFqc8jZRnbRl8',
  authDomain: 'fir-vue-chat-8092e.firebaseapp.com',
  databaseURL: 'https://fir-vue-chat-8092e.firebaseio.com',
  projectId: 'fir-vue-chat-8092e',
  storageBucket: 'fir-vue-chat-8092e.appspot.com',
  messagingSenderId: '373785443513',
  appId: '1:373785443513:web:97f43272560046e4'
}
firebase.initializeApp(firebaseConfig)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
