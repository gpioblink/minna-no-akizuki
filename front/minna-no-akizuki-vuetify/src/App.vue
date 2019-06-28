<template>
<div>
  <v-app id="inspire">
    <v-toolbar color="indigo" dark fixed app>
      <v-toolbar-title @click="changePage">みんなの秋月</v-toolbar-title>
    </v-toolbar>
    <router-view/>
  </v-app>
  <v-footer height="auto" color="indigo" dark>
    <v-layout justify-center row wrap>
      <v-flex color="indigo" dark py-3 text-xs-center white--text xs12>
        &copy;2018 — <strong>みんなの秋月</strong> 
      </v-flex>
      <v-flex color="indigo" dark py-3 text-xs-center white--text xs12>
        このアプリは秋月電子と一切関係ありません
      </v-flex>
    </v-layout>
  </v-footer>
</div>
</template>

<script>
export default {
  name: 'App',
  methods: {
    changePage: function() {
      this.$router.push({ name: 'StartSelector'});
    }
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
</style>