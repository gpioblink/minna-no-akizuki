<template>
  <v-app id="inspire">
    <v-layout>
      <v-flex xs12>
        <v-card>
          <v-card-title primary-title class="pb-0">
            <div>
              <h3 class="headline mb-0">カート内容</h3>
            </div>
            <v-flex xs10>
              <v-list two-line class="pb-0">
                <template v-for="product in products">
                  <v-list-tile
                    :key="product.orderCode"
                    avatar
                  >
                    <v-list-tile-avatar tile>
                      <img :src="product.imgUrl">
                    </v-list-tile-avatar>

                    <v-list-tile-content>
                      <v-list-tile-title v-html="product.name" class="caption"></v-list-tile-title>
                      <v-list-tile-sub-title>{{ product.price }}円 x {{ product.amount }}個</v-list-tile-sub-title>
                    </v-list-tile-content>
                  </v-list-tile>
                </template>
              </v-list>
              <p v-if="products == 0">カートに何も入っていません。秋月電子の買い物かごに商品を追加してもう一度お試しください。</p>
            </v-flex>
          </v-card-title>
  
          <v-card-actions>
            <v-container>
              <h3 class="headline mb-0">購入リクエスト</h3>
              <v-layout row wrap>
                <v-flex xs5>
                  <v-text-field
                      v-model="cartName"
                      label="カート名"
                    ></v-text-field>
                </v-flex>
                <v-flex xs1>
                </v-flex>
                <v-flex xs6>
                <v-text-field
                    v-model="cartName"
                    label="送信者名"
                  ></v-text-field>
                </v-flex>
                <v-flex xs10>
                </v-flex>
                <v-flex xs2>
                <v-btn flat color="success" @click="uploadCart">送信</v-btn>
                </v-flex>
              </v-layout>
            </v-container>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-app>
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

body {
  max-width: 415px;
  min-width: 380px;
}
</style>
