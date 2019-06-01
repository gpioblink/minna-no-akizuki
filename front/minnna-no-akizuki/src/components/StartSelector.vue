<template>
<div>
  <h1>ログイン</h1>
  <h2>カートIDを入力してください。そのIDが存在しなければ新規作成します。</h2>
  <input v-model="id" placeholder="カートID">
  <button v-on:click="changePage">はじめる</button>
</div>
</template>

<script>
import router from '@/router/index'
export default {
  name: 'HelloWorld',
  data () {
    return {
      id: ""
    }
  },
  methods: {
    changePage: function() {
      router.push({ name: 'ShoppingList', params: { cartId: this.id }});
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
