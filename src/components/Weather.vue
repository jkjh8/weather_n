<template>
  <q-card flat>
    <q-card-section class="q-ml-sm row items-center">
        <q-icon size="sm" name="cloud"></q-icon>
        <span class="text-h6 q-mx-md">Weather</span>
        <span  v-if="weatherDetail&&weather" class="q-mx-md row items-center">
          <span>발표 시간: {{ weatherDetail.time }}</span>
          <span class="q-ml-sm">
            <q-icon class="q-mr-xs" size="sm" :name="weatherDetail.icon" :color="weatherDetail.color"></q-icon>
            <span>{{ weatherDetail.name }}</span>
            <span class="q-ml-md">기온: {{ weatherDetail.temp }} {{ "&#8451;" }}</span>
            <q-tooltip anchor="top middle" :offset="[0, 30]" content-class="_tooltip">갱신 시간:{{updatedAt}}</q-tooltip>
          </span>
        </span>
        <q-space />
        <q-btn
          flat
          round
          icon="lens_blur"
          @click="dialog=true"
        >
          <q-tooltip anchor="top middle" :offset="[0, 25]" content-class="_tooltip">상세 정보</q-tooltip>
        </q-btn>
        <q-btn
          flat
          round
          icon="sync"
          @click="getWeather"
        >
          <q-tooltip anchor="top middle" :offset="[0, 25]" content-class="_tooltip">새로 고침</q-tooltip>
        </q-btn>
      </q-card-section>

      <q-dialog v-model="dialog">
        <Detail />
      </q-dialog>
  </q-card>
</template>

<script>
import { ipcRenderer } from 'electron'
import { mapState } from 'vuex'

import Detail from './WeatherDetail'

import weatherFn from '../mixins/weather'

export default {
  mixins: [weatherFn],
  components: { Detail },
  computed: {
    ...mapState({
      dataKey: state => state.keys.data,
      location: state => state.location.location,
      weather: state => state.weather.weather,
      weatherDetail: state => state.weather.weatherDetail,
      updatedAt: state => state.weather.updatedAt
    })
  },
  data () {
    return {
      dialog: false
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
      this.getWeatherFromServer(this.location)
    }
  }
}
</script>

<style>
._tooltip {
  opacity: 0.7;
  color: #343434;
  background: #F0F0F0;
}
</style>
