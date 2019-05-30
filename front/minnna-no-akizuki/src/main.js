// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import firebase from 'firebase'

Vue.config.productionTip = false

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDSfeHSw9cl9_9UbOCOqrTo_PPEowARQm0",
  authDomain: "minna-no-akizuki.firebaseapp.com",
  databaseURL: "https://minna-no-akizuki.firebaseio.com",
  projectId: "minna-no-akizuki",
  storageBucket: "minna-no-akizuki.appspot.com",
  messagingSenderId: "847366748629",
  appId: "1:847366748629:web:8e69891d9add9086"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);


/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
