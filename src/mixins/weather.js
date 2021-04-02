import moment from 'moment'
import { mapState } from 'vuex'
import { apiData } from '../boot/axios'

export default {
  computed: {
    ...mapState({
      dataKey: state => state.keys.data
    })
  },
  data () {
    return {
      url: '/1360000/VilageFcstInfoService/getUltraSrtNcst'
    }
  },
  methods: {
    getWeatherFromServer (location) {
      const time = this.getTime()
      const query = `ServiceKey=${this.dataKey}&pageNo=1&numOfRows=10&dataType=json&base_date=${time.date}&base_time=${time.time}&nx=${location.xy.x}&ny=${location.xy.y}`
      apiData.get(`${this.url}?${query}`).then(res => {
        if (res.data.response.header.resultCode === '00') {
          const data = res.data.response.body.items.item
          this.$store.dispatch('weather/updateWeather', data)
        }
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
