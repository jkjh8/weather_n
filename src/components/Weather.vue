<template>
  <q-card>
    <q-card-section class="q-mx-md q-py-none row items-center">
        <q-icon size="sm" name="cloud"></q-icon>
        <span class="text-h6 q-mx-md">Weather</span>
        <!-- <span class="text-bold q-mx-md">{{ location.address }}</span> -->
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
          icon="fas fa-sync"
          @click="getWeather"
        />
      </q-card-section>
  </q-card>
</template>

<script>
import { mapState } from 'vuex'
import moment from 'moment'

export default {
  computed: {
    ...mapState({
      dataKey: state => state.keys.data,
      location: state => state.location.location
    })
  },
  data () {
    return {
      url: 'http://apis.data.go.kr/1360000/VilageFcstInfoService/getUltraSrtNcst'
    }
  },
  methods: {
    getWeather () {
      const time = this.getTime()
      const query = `ServiceKey=${this.dataKey}&pageNo=1&numOfRows=10&dataType=json&base_date=${time.date}&base_time=${time.time}&nx=${this.location.xy.x}&ny=${this.location.xy.y}`
      this.$axios.get(`${this.url}?${query}`).then(res => {
        console.log(res)
      })
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
