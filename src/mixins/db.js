import { remote } from 'electron'
const db = remote.getGlobal('db')

export default {
  methods: {
    async loadApiKeys () {
      try {
        const kakaoKey = await db.findOne({ id: 'kakao' })
        const dataKey = await db.findOne({ id: 'data' })
        const uuid = await db.findOne({ id: 'uuid' })

        if (kakaoKey) {
          this.$store.dispatch('keys/updateKakao', kakaoKey.key)
        }
        if (dataKey) {
          this.$store.dispatch('keys/updateData', dataKey.key)
        }
        if (uuid) {
          this.$store.commit('keys/updateUUID', uuid.value)
          console.log('update')
        }
      } catch (error) {
        console.log(error)
      }
    },
    async loadStations () {
      try {
        const stations = await db.findOne({ id: 'stations' })
        const updateAt = await db.findOne({ id: 'stationsUpdateTime' })

        if (stations) {
          this.$store.commit('stations/updateStations', stations.value)
        }

        if (updateAt) {
          this.$store.commit('stations/updateUpdateAt', updateAt.value)
        }
      } catch (error) {
        console.log(error)
      }
    }
  }
}
