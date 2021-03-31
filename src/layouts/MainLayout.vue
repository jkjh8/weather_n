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
import { remote } from 'electron'
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
    // const kakaoKey = db.get('keys').find({ id: 'kakao' }).value()
    // if (kakaoKey) {
    //   this.$store.dispatch('keys/updateKakao', kakaoKey.value)
    // } else {
    //   this.$store.dispatch('keys/updateKakao', null)
    //   this.dialog = true
    // }
    const keys = db.get('keys').value()
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
    // // kakao api key
    // db.findOne({ id: 'kakao' }).then(res => {
    //   if (res.key) {
    //     this.$store.dispatch('keys/updateKakao', res.key)
    //     this.$refs.view.initMap()
    //   } else {
    //     return this.$refs.view.keyPopup(true)
    //   }
    // })
    // // data.go.kr api key
    // db.findOne({ id: 'data' }).then(res => {
    //   if (res.key) {
    //     this.$store.dispatch('keys/updateData', res.key)
    //   } else {
    //     return this.$refs.view.keyPopup(true)
    //   }
    // })
    // // uuid
    // db.findOne({ id: 'uuid' }).then(res => {
    //   if (res.value) {
    //     this.$store.commit('keys/updateUUID', res.value)
    //   } else {
    //     return this.$refs.view.keyPopup(true)
    //   }
    // })
    // // air korea stations
    // db.findOne({ id: 'stations' }).then(res => {
    //   this.$store.commit('stations/updateStations', res.value)
    // }).catch(err => {
    //   console.log('stations: ', err)
    // })
    // // stations list update time
    // db.findOne({ id: 'stationsUpdateTime' }).then(res => {
    //   this.$store.commit('stations/updateUpdateAt', res.value)
    // }).catch(err => {
    //   console.log('stations: ', err)
    // })
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
