import { api, apiData } from '../boot/axios'
import moment from 'moment'
import { mapState } from 'vuex'
const db = require('electron').remote.getGlobal('db')

export default {
  computed: {
    ...mapState({
      uuid: state => state.keys.uuid,
      station: state => state.location.dustStation,
      dataKey: state => state.keys.data
    })
  },
  data () {
    return {
      url: '/B552584/ArpltnInforInqireSvc/getCtprvnRltmMesureDnsty'
    }
  },
  methods: {
    async getAllStations () {
      try {
        const r = await api.get(`/getStation?uuid=${encodeURIComponent(this.uuid)}`)
        const now = moment().format()
        const stations = r.data.stations
        const stationsArr = Object.values(stations)
        this.$store.commit('stations/updateUpdateAt', now)

        db.setup.update({ id: 'updateStationsAt' }, { $set: { value: now } }, { upsert: true })
        await db.stations.remove({}, { multi: true })
        await db.stations.insert(stationsArr)
      } catch (error) {
        console.log('getAllStations', error)
      }
    },
    async getDustFromDb (station) {
      const r = await api.get(`/getdust?uuid=${encodeURIComponent(this.uuid)}&station=${encodeURIComponent('3공단')}`)
      console.log('r', r)
      const result = await db.dust.findOne({ stationName: station.name })
      this.$store.commit('dust/updateDust', result)
      return result
    },
    async getAllDustData () {
      const query = `ServiceKey=${this.dataKey}&returnType=json&pageNo=1&numOfRows=1000&sidoName=전국&ver=1.0`
      console.log(query)
      const r = await apiData.get(`${this.url}?${query}`)
      if (r.status === 200) {
        const result = r.data.response
        console.log(result)
        if (result.header.resultCode === '00') {
          await db.dust.remove({}, { multi: true })
          const rt = await db.dust.insert(result.body.items)
          console.log(rt)
        }
      }
    },
    checkTime (currentTime) {
      const t1 = moment(currentTime)
      const t2 = moment()
      const timeDiff = moment.duration(t2.diff(t1)).asHours()
      if (timeDiff > 1.5) {
        this.getAllDustData()
      }
    }
  }
}
