import Vue from 'vue'
import './plugins/vuetify'
import App from './App.vue'
import router from './router'
import store from './store'
import './registerServiceWorker'
import firebase from 'firebase'

Vue.config.productionTip = false

const firebaseConfig = {
  apiKey: "AIzaSyDSfeHSw9cl9_9UbOCOqrTo_PPEowARQm0",
  authDomain: "minna-no-akizuki.firebaseapp.com",
  databaseURL: "https://minna-no-akizuki.firebaseio.com",
  projectId: "minna-no-akizuki",
  storageBucket: "minna-no-akizuki.appspot.com",
  messagingSenderId: "847366748629",
  appId: "1:847366748629:web:8e69891d9add9086"
};
firebase.initializeApp(firebaseConfig)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
