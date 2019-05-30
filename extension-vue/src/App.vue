<template>
<div>
<h1>Minnna No Akizuki By Gpioblink</h1>
<h3>現在カートの中にある商品</h3>
<ul>
  <li v-for="(product, index) in products" :key='index'>
    {{ product.name }} ( {{ product.price }}円 x {{ product.amount }}個 )
  </li>
</ul>
<div class="inputWithIcon"><input v-model="cartName" placeholder="カート名"></div>
{{cart}}
<div class="inputWithIcon"><input v-model="userName" placeholder="送信者名"></div>
{{user}}
<button @click="uploadCart" id="save">送信</button>
</div> 
</template>

<script>
import firebase from 'firebase';
export default {
  name: 'app',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App',
      products: [],
      cartName: '',
      userName: ''
    }
  },
  methods: {
    uploadCart: function() {
      console.log(this.cartName, this.userName);
      const db = firebase.firestore();
      db.collection('rooms').doc(this.cartName).collection('carts').add({user: this.userName, cart:this.products}).then((docRef) => {
          console.log("Document written with ID: ", docRef.id);
      });
    },
    parseBlob: function(blob) {
      return new Promise(resolve => {
          const reader = new FileReader();
          reader.onload = () => { resolve(reader.result) };
          reader.readAsText(blob, 'shift-jis');
      });
    },
    checkStatus: function(res) {
      if (res.status >= 200 && res.status < 300) {
        return res
      } else {
        const error = new Error(res.statusText);
        error.response = res;
        throw error
      }
    },
    parseHTML: function(text) {
      return new DOMParser().parseFromString(text, 'text/html');
    },
    showReturned: function(response) {
      console.log(response);
    },
    parseCartData: function(dom) {
      const productList = [];
      const productsTableXML = dom.querySelectorAll('form > .cart_table tr');
      productsTableXML.forEach((products) => {
        // そのテーブルの列が、商品のものか判定
        if(products.querySelectorAll('a').length > 0){
          const product = {
            orderCode: products.querySelector('.cart_tdl > a').textContent,
            name: products.querySelectorAll('.cart_tdl > a')[2].textContent,
            price: Number(products.querySelector('.cart_tdcb > span').textContent.replace(/[^0-9^\.]/g, ''), 10),
            amount: Number(products.querySelector('.cart_tdc > input').value.replace(/[^0-9^\.]/g, ''), 10),
            imgUrl: `http://akizukidenshi.com${products.querySelector('img').getAttribute('src')}`,
            detailUrl: `http://akizukidenshi.com/catalog/g/g${products.querySelector('.cart_tdl > a').textContent}`
          }
          productList.push(product);
        }
      });
      return productList;
    }
  },
  mounted() {
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
    const cartUrl = 'http://akizukidenshi.com/catalog/cart/cart.aspx';
    fetch(cartUrl)
    .then(this.checkStatus)
    .then((res) => res.blob())
    .then(this.parseBlob)
    .then(this.parseHTML)
    //.then(this.showReturned)
    .then(this.parseCartData)
    //.then(this.showReturned)
    .then((array) => this.products = array)
    .catch((error) => {
      console.log('request failed', error)
    });
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

h1, h2 {
  font-weight: normal;
}

a {
  color: #42b983;
}

ul {
  padding: 0;
  position: relative;
}

ul li {
  color: #2d8fdd;
  border-left: solid 6px #2d8fdd;/*左側の線*/
  background: #f1f8ff;/*背景色*/
  margin-bottom: 3px;/*下のバーとの余白*/
   line-height: 1.5;
  padding: 0.5em;
  list-style-type: none!important;/*ポチ消す*/
}

input[type="text"] {
  width: 100%;
  border: 2px solid #aaa;
  border-radius: 4px;
  margin: 8px 0;
  outline: none;
  padding: 8px;
  box-sizing: border-box;
  transition: 0.3s;
}

input[type="text"]:focus {
  border-color: dodgerBlue;
  box-shadow: 0 0 8px 0 dodgerBlue;
}

.inputWithIcon input[type="text"] {
  padding-left: 40px;
}

.inputWithIcon {
  position: relative;
}

.inputWithIcon i {
  position: absolute;
  left: 0;
  top: 8px;
  padding: 9px 8px;
  color: #aaa;
  transition: 0.3s;
}

.inputWithIcon input[type="text"]:focus + i {
  color: dodgerBlue;
}

.inputWithIcon.inputIconBg i {
  background-color: #aaa;
  color: #fff;
  padding: 9px 4px;
  border-radius: 4px 0 0 4px;
}

.inputWithIcon.inputIconBg input[type="text"]:focus + i {
  color: #fff;
  background-color: dodgerBlue;
}

body {
  max-width: 415px;
  min-width: 380px;
}
</style>
