<template>
<v-content>
<v-layout column align-center>
  <v-container>
  <v-card class="pa-4">
    <v-card-title class="font-weight-bold">ログイン</v-card-title>
    <v-card-text><p>カートIDを入力してください。そのIDが存在しなければ新規作成します。</p>
    <v-form
      ref="form"
      v-model="valid"
    >
      <v-text-field
        class="mt-0"
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
    </v-card-text>


    </v-card>
  </v-container>
</v-layout>
</v-content>
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
