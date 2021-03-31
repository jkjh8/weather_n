<template>
  <q-layout view="lHh Lpr lFf">
    <q-header class="bg-white">
      <q-toolbar class="row justify-center nav">
        <router-link to="/">Home</router-link>
        <span style="color: black;">|</span>
        <router-link to="/setup">Setup</router-link>
      </q-toolbar>
    </q-header>

    <q-dialog v-model="dialog" persistent>
      <Key @close="dialog=false" />
    </q-dialog>

    <q-page-container>
      <router-view ref="view" />
    </q-page-container>
  </q-layout>
</template>

<script>
import dbFunctions from '../mixins/db'
import Key from '../components/Key'
import { ipcRenderer, remote } from 'electron'
const db = remote.getGlobal('db')

export default {
  name: 'MainLayout',
  mixins: [dbFunctions],
  components: { Key },
  data () {
    return {
      dialog: false
    }
  },
  async created () {
    ipcRenderer.on('keyPopup', (e) => {
      this.dialog = true
    })

    const keys = db.get('keys').value()
    if (keys.length === 0) this.dialog = true

    keys.forEach(key => {
      switch (key.id) {
        case 'kakao':
          this.$store.dispatch('keys/updateKakao', key.value)
          break
        case 'data':
          this.$store.dispatch('keys/updateData', key.value)
          break
        case 'uuid':
          this.$store.commit('keys/updateUUID', key.value)
          break
      }
    })
    const stations = db.get('stations').find({ id: 'stations' }).value()
    if (stations) {
      this.$store.commit('stations/updateStations', stations.value)
      this.$store.commit('stations/updateUpdateAt', stations.time)
    }
    const location = db.get('location').find({ id: 'location' }).value()
    if (location) {
      this.$store.commit('location/updateLocation', location.value)
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
