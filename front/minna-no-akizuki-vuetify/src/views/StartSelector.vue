<template>
<v-app id="inspire">
<v-layout column align-center>
  <h1 display-4>ログイン</h1>
  <h2>カートIDを入力してください。そのIDが存在しなければ新規作成します。</h2>
    
  <v-form
    ref="form"
    v-model="valid"
    :lazy-validation="lazy"
  >
    <v-text-field
      v-model="id"
      :counter="10"
      label="カートID"
      required
    ></v-text-field>

    <v-btn
      :disabled="!valid"
      color="success"
      class="mr-3"
      @click="changePage"
    >
    はじめる
    </v-btn>

  </v-form>
</v-layout>
</v-app>
</template>

<script>
//import router from 'vue-router'
export default {
  name: 'HelloWorld',
  data () {
    return {
      id: ""
    }
  },
  methods: {
    changePage: function() {
      this.$router.push({ name: 'ShoppingList', params: { cartId: this.id }});
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
