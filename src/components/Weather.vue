<template>
  <q-card flat>
    <q-card-section class="q-ml-sm q-py-none row items-center">
        <q-icon size="sm" name="cloud"></q-icon>
        <span class="text-h6 q-mx-md">Weather</span>
        <span class="q-mx-md">발표 시간: {{ weather.time }}</span>
        <q-space />
        <!-- <q-btn
          flat
          round
          icon="fas fa-map-marked-alt"
          @click="clickIpLocationBtn"
        /> -->
        <q-btn
          flat
          round
          icon="sync"
          @click="getWeather"
        />
      </q-card-section>
  </q-card>
</template>

<script>
import { ipcRenderer } from 'electron'
import { mapState } from 'vuex'
import moment from 'moment'

export default {
  computed: {
    ...mapState({
      dataKey: state => state.keys.data,
      location: state => state.location.location,
      weather: state => state.weather.weather
    })
  },
  data () {
    return {
      url: 'http://apis.data.go.kr/1360000/VilageFcstInfoService/getUltraSrtNcst'
    }
  },
  mounted () {
    ipcRenderer.on('weather', (e, d) => {
      if (d.header.resultCode === '00') {
        const data = d.body.items.item
        this.$store.dispatch('weather/updateWeather', data)
      }
    })
  },
  methods: {
    getWeather () {
      if (!this.location) {
        return this.$q.notify({
          timeout: 1000,
          color: 'negative',
          message: '지역선택이 되지 않았습니다.',
          icon: 'report_problem',
          position: 'center',
          actions: [{ icon: 'close', color: 'white' }]
        })
      }
      const time = this.getTime()
      const query = `ServiceKey=${this.dataKey}&pageNo=1&numOfRows=10&dataType=json&base_date=${time.date}&base_time=${time.time}&nx=${this.location.xy.x}&ny=${this.location.xy.y}`
      ipcRenderer.send('weather', `${this.url}?${query}`)
      // this.$axios.get(`${this.url}?${query}`).then(res => {
      //   console.log(res)
      // })
    },
    getTime () {
      const now = moment()
      const date = moment(now).format('YYYYMMDD')
      let time = moment(now).format('HH00')
      const min = moment(now).format('mm')
      if (min < 40) {
        if (time === '0000') {
          return { date: String(date - 1), time: '2300' }
        } else {
          time = String(time - 100)
          time = time.length >= 4 ? time : new Array(4 - time.length + 1).join('0') + time
          return { date: date, time: time }
        }
      } else {
        return { date: date, time: time }
      }
    }
  }
}
</script>

<style>

</style>
