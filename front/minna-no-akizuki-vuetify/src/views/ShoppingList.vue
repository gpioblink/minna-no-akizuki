<template>
<v-content>
  <h1>カートリスト</h1>
  <h2>現時点でシェアされてる商品と場所を表示しています</h2>
  <h3>表示中のカート: {{cartId}}</h3>

  <v-data-table
      :headers="orderHeader"
      :items="orderList"
      select-all
      class="elevation-1"
    >
    <template v-slot:items="order">
    <tr :active="order.selected" @click="order.selected = !order.selected">
      <td>
        <v-checkbox
          :input-value="props.selected"
          primary
          hide-details
        ></v-checkbox>
      </td>
      <td>{{order.item.id}}</td>
      <td>{{order.item.name}}</td>
      <td>{{order.item.price.value}} {{order.item.price.currency}}</td>
      <td>{{order.item.stores[1].place}}</td>
      <td>{{order.item.order.amount}}</td>
    </tr>
    </template>
  </v-data-table>

  <h1>購入者リスト</h1>
  <h2>どの商品を誰が要望したか表示します</h2>
  <div v-for="person in originalList" :key="person.user">
    <h3>{{person.user}} さんの買い物かご</h3>
    <table>
        <thead>
            <tr>
              <th>通販コード</th>
              <th>商品名</th>
              <th>単価</th>
              <th>陳列場所</th>
              <th>購入個数</th>
            </tr>
        </thead>

        <tbody>
            <tr v-for="cart in person.cart" :key="cart.orderCode">
                <td>{{cart.orderCode}}</td>
                <td>{{cart.name}}</td>
                <td>{{cart.price}}</td>
                <td>{{cart.amount}}</td>
            </tr>
        </tbody>
    </table>
  </div>
  </v-content>
</template>

<script>
import firebase from 'firebase';
export default {
  props: ['cartId'],
  name: 'HelloWorld',
  data () {
    return {
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
        { text: '陳列場所', value: 'place' },
        { text: '購入個数', value: 'amount' },
      ],
      orderList: [
      ],
      dammyOrderList: [
        {id: "dammy", name: "usuleff", price: { value: "12", currency:"100"}}
      ],
      originalList: []
    }
  },
  mounted() {
    this.fetchCartsInfo();
  },
  methods: {
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
        cartsData.push(doc.data());
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
        console.log(cart);
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
