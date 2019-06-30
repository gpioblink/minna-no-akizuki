<template>
<v-layout column align-center>
  <v-content>

    <v-card class="pa-4">
      <h1>購入者別リスト</h1>
      <h2>どの商品を誰が要望したか表示します</h2>
      <v-card-actions>
      <v-btn
        color="warning"
        class="mr-3"
        @click="changePage"
      >
      買い足しリストへ
      </v-btn>
      </v-card-actions>
    </v-card>
      
    <div v-for="person in originalList" :key="person.id">
      <v-card class="pa-4">
        <v-card-title class="font-weight-bold">{{person.user}} さんの買い物かご</v-card-title>
        <v-card-text>
          <v-data-table
            :headers="originalHeader"
            :items="person.cart"
            v-bind="pagination"
            hide-actions
            class="elevation-1"
          >
            <template v-slot:items="cart">
              <td>{{cart.item.orderCode}}</td>
              <td>{{cart.item.name}}</td>
              <td>{{cart.item.price}}</td>
              <td>{{cart.item.amount}}</td>
            </template>
          </v-data-table>
          
          <v-btn
            v-if="person.payDate"
            disabled
            color="success"
          >
          {{person.payDate.toString()}} に支払い済み
          </v-btn>
          <v-btn
            v-else
            color="success"
            @click="addPaymentFlag(person.id)"
          >
          支払い済みにする
          </v-btn>

          <v-btn
            v-if="person.collectDate"
            disabled
            color="warning"
          >
          {{person.collectDate.toString()}} に受け取り済み
          </v-btn>
          <v-btn
            v-else
            color="warning"
            @click="addCollectedFlag(person.id)"
          >
          受け取り済みにする
          </v-btn>
          <p>支払金額は、{{calcSumMoneyByPerson(person)}}円 です。</p>
        </v-card-text>
      </v-card>
    </div>
  </v-content>
</v-layout>
</template>

<script>
import firebase from 'firebase';
export default {
  props: ['cartId'],
  name: 'HelloWorld',
  data () {
    return {
      pagination: {
        rowsPerPage: -1,
        sortBy: 'price'
      },
      orderHeader: [
        { text: '通販コード', value: 'orderCode' },
        {
          text: '商品名',
          align: 'left',
          sortable: false,
          value: 'name'
        },
        { text: '単価', value: 'price' },
        { text: '陳列場所', value: 'place' },
        { text: '購入個数', value: 'amount' },
      ],
      originalHeader: [
        { text: '通販コード', value: 'orderCode' },
        {
          text: '商品名',
          align: 'left',
          sortable: false,
          value: 'name'
        },
        { text: '単価', value: 'price' },
        { text: '購入個数', value: 'amount' },
      ],
      orderList: [
      ],
      originalList: []
    }
  },
  mounted() {
    this.fetchCartsInfo();
  },
  methods: {
    changePage: function() {
      this.$router.push({ name: 'ShoppingList', params: { cartId: this.cartId }});
    },
    addPaymentFlag: function(personId) {
      const date = new Date().toLocaleString('ja-JP', {era:'long'});
      console.log(personId, date);

      const db = firebase.firestore();
      const docRef = db.collection("rooms").doc(this.cartId).collection("carts").doc(personId);

      docRef.update({payDate: date});
    },
    addCollectedFlag: function(personId) {
      const date = new Date().toLocaleString('ja-JP', {era:'long'});
      console.log(personId, date);

      const db = firebase.firestore();
      const docRef = db.collection("rooms").doc(this.cartId).collection("carts").doc(personId);

      docRef.update({collectDate: date});
    },
    fetchCartsInfo: function() {
      console.log(this.cartId);
      const db = firebase.firestore();
      const docRef = db.collection("rooms").doc(this.cartId).collection("carts");
      
      docRef.onSnapshot(this.updateCartsInfo);
    },
    updateCartsInfo: function(doc) {
      this.extractCartsArrayFromSnapshot(doc)
      .then(cartsArray => this.originalList = cartsArray)
      .then(this.makeLinearOrderArrayFromCartsArray)
      .then(this.combineSamePartsInLinearList)
      .then(this.storeDetailInformationForOrderMap)
      .then(orderList => {this.orderList = orderList; console.log(orderList);})
      .catch(this.printError);
    },
    extractCartsArrayFromSnapshot: function(querySnapshot) {
      let cartsData = [];
      console.log(querySnapshot);
      querySnapshot.forEach(function(doc) {
        const data = doc.data();
        data.id = doc.id;
        cartsData.push(data);
      });
      console.log("取得直後カート中身",cartsData);
      return new Promise((resolve, reject) => {
        if(cartsData.length > 0) {
            resolve(cartsData);
        } else {
            reject("Your cart is empty.");
        }
      });
    },
    makeLinearOrderArrayFromCartsArray: function(cartsArray) {
      let productsArray = [];
      for(const cart of cartsArray) {
        console.log("cart", cart);
        cart.cart.forEach(function(part) {
          productsArray.push(part);
        });
      }
      return productsArray;
    },
    combineSamePartsInLinearList: function(linearOrderArray) {
      let map = new Map(linearOrderArray.map(o => [o.orderCode, Object.assign({}, o)]));
      
      // Mapで商品の重複を避けると、商品個数の数がおかしくなるので一度初期化してから追加し直す
      for(let [key, product] of map){
        product["amount"] = 0;
      }

      for(const product of linearOrderArray){
        // TODO: mapをgetして、値変更してsetするなんてコスト悪すぎるからなんとかしたい
        let qmap = map.get(product["orderCode"]);
        qmap["amount"] += product["amount"];
        map.set(product["orderCode"], qmap)
      }
      return map;
    },
    storeDetailInformationForOrderMap: function(orderMap) {
      let orderList = [];
      for(let [key, product] of orderMap){
        fetch(`https://akizuki-api.appspot.com/component/${product["orderCode"]}.json`)
        .then(response => response.json())
        .then(json => {
          json["order"] = product;
          orderList.push(json);
        });
      }
      return orderList;
    },
    printError: function(error) {
      console.log("Error getting document:", error);
    },
    calcSumMoneyByPerson:function(originalPersonArray) {
      let price = 0;
      originalPersonArray.cart.forEach((order) => {
        price += Number(order.price) * Number(order.amount);
      });
      return price;
    }
  }
}
</script>

<style>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
