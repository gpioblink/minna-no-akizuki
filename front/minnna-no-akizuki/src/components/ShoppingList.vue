<template>
<div>
  <h1>カートリスト</h1>
  <h2>現時点でシェアされてる商品と場所を表示しています</h2>
  <input v-model="message" placeholder="カートId">
  <button>はじめる</button>
</div>
</template>

<script>
import firebase from 'firebase';
export default {
  name: 'HelloWorld',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
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
