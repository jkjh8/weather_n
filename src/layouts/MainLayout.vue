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
      <Key @close="dialog=false" @init="init" />
    </q-dialog>

    <q-page-container>
      <router-view ref="view" />
    </q-page-container>
  </q-layout>
</template>

<script>
// import dbFunctions from '../mixins/db'
import Key from '../components/Key'
import { ipcRenderer, remote } from 'electron'
const db = remote.getGlobal('db')

export default {
  name: 'MainLayout',
  // mixins: [dbFunctions],
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
    const keys = await db.keys.find({})
    if (keys.length === 0) {
      this.dialog = true
    }

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
    const stations = await db.stations.find({})
    const updateAt = await db.setup.findOne({ id: 'updateStationsAt' })
    if (stations.length > 0) {
      this.$store.commit('stations/updateStations', stations.value)
    }
    if (updateAt) {
      this.$store.commit('stations/updateUpdateAt', updateAt.value)
    }
    const location = await db.location.findOne({ id: 'location' })
    if (location) {
      this.$store.commit('location/updateLocation', location.value)
    }
    const nearStations = await db.location.findOne({ id: 'nearStations' })
    if (nearStations) {
      console.log(nearStations)
      this.$store.commit('location/updateNearStations', nearStations.value)
    }
    const dustStation = await db.location.findOne({ id: 'dustStation' })
    if (dustStation) {
      this.$store.commit('location/updateDustStation', dustStation.value)
    }
  },
  methods: {
    init () {
      this.$refs.view.initMap()
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
