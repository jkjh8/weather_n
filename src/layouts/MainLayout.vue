<template>
  <q-layout view="lHh Lpr lFf">
    <q-header class="bg-white">
      <q-toolbar class="row justify-center nav">
        <router-link to="/">Home</router-link>
        <span style="color: black;">|</span>
        <router-link to="/setup">Setup</router-link>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { api } from '../boot/axios'
export default {
  name: 'MainLayout',
  data () {
    return {
      //
    }
  },
  methods: {
    loadKeys () {
      if (this.$store.state.keys.uuid) {
        api.get(`/getApi?uuid=${this.$store.state.keys.uuid}`).then((res) => {
          console.log(res)
        })
      } else {
        alert('UUID가 없습니다.')
      }
    }
  }
}
</script>

<style>
.nav a {
  font-weight: bold;
  color: #2c3e50;
  text-decoration: none;
  padding: 10px;
}

.nav a.router-link-exact-active {
  color: #42b983;
}
</style>
