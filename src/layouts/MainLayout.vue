<template>
  <q-layout view="lHh Lpr fff">
    <q-header class="bg-white">
      <q-toolbar class="row justify-center nav">
        <router-link to="/">Home</router-link>
        <span style="color: black;">|</span>
        <router-link to="/setup">Setup</router-link>
      </q-toolbar>
    </q-header>

    <q-dialog v-model="dialog" persistent>
      <Key :mode="mode" @close="dialog=false" />
    </q-dialog>

    <q-page-container>
      <router-view ref="view" />
    </q-page-container>

    <q-footer>
      <q-card flat square>
        <q-card-section class="text-caption text-center text-grey-7">
          본 자료는 한국환경공단(에어코리아)과 기상청에서 제공하는 실시간 관측 자료이며 실제 대기농도 수치와 다를 수 있습니다.
        </q-card-section>
      </q-card>
    </q-footer>
  </q-layout>
</template>

<script>
// import dbFunctions from '../mixins/db'
import { mapState } from 'vuex'
import Key from '../components/Key'
import dustFn from '../mixins/dust'
import weatherFn from '../mixins/weather'
import { ipcRenderer, remote } from 'electron'
import moment from 'moment'
const db = remote.getGlobal('db')

export default {
  name: 'MainLayout',
  mixins: [dustFn, weatherFn],
  components: { Key },
  computed: {
    ...mapState({
      location: state => state.location.location,
      station: state => state.location.dustStation
    })
  },
  data () {
    return {
      dialog: false,
      mode: false
    }
  },
  async created () {
    this.timer()
    ipcRenderer.on('keyPopup', (e) => {
      this.dialog = true
    })
    const keys = await db.keys.find({})
    if (keys.length < 2) {
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
    const updateAt = await db.setup.findOne({ id: 'updateStationsAt' })
    console.log(updateAt)
    if (updateAt) {
      this.$store.commit('stations/updateUpdateAt', updateAt.value)
    } else {
      if (this.$store.state.keys.uuid) {
        this.getAllStations()
      }
    }
    const location = await db.location.findOne({ id: 'location' })
    if (location) {
      this.$store.commit('location/updateLocation', location.value)
      this.getWeatherFromServer(location.value)
    }
    const nearStations = await db.location.findOne({ id: 'nearStations' })
    if (nearStations) {
      this.$store.commit('location/updateNearStations', nearStations.value)
    }
    const dustStation = await db.location.findOne({ id: 'dustStation' })
    if (dustStation) {
      this.$store.commit('location/updateDustStation', dustStation.value)
      const rt = await this.getDustFromDb(dustStation.value)
      this.checkTime(rt.createdAt)
    }
  },
  methods: {
    timer () {
      setInterval(() => {
        const current = moment().format('mm')
        console.log(current)
        switch (current) {
          case '20':
            this.getDustFromDb(this.station)
            console.log('get dust')
            break
          case '45':
            this.getWeatherFromServer(this.location)
            console.log('get weather')
            break
        }
      }, 60000)
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
