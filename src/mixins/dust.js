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
      if (!station) station = this.station
      try {
        const r = await api.get(`/getdust?uuid=${encodeURIComponent(this.uuid)}&station=${encodeURIComponent(station.name)}`)
        await db.dust.update({ id: 'dust' }, { $set: { value: r.data.dust } }, { upsert: true })
        this.$store.dispatch('dust/updateDust', r.data.dust)
        return r.data.dust
      } catch (err) {
        const code = err.response.status
        if (code === 401 || code === 403) {
          console.log('error')
          this.$q.notify({
            timeout: 2000,
            color: 'negative',
            message: '사용자 계정에 문제가 있습니다.',
            caption: '계정을 새로 등록 하거나 관리자에게 문의하세요.',
            icon: 'report_problem',
            position: 'center',
            actions: [{ icon: 'close', color: 'white' }]
          })
        }
      }
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
