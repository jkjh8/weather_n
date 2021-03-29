<template>
  <q-card>
    <q-card-section class="fit row no-wrap">
      <div>
        <div class="text-subtitle1">Get Stations</div>
        <div class="text-caption">{{ timeFormat(updateAt) }}</div>
      </div>
      <q-space />
      <q-btn @click="update">Update</q-btn>
    </q-card-section>
  </q-card>
</template>

<script>
import { mapState } from 'vuex'
import moment from 'moment'
import { remote } from 'electron'
import loading from '../mixins/loads'

const db = remote.getGlobal('db')

export default {
  mixins: [loading],
  computed: {
    ...mapState({
      updateAt: state => state.stations.updateAt,
      uuid: state => state.keys.uuid
    })
  },
  data () {
    return {
      url: 'https://us-central1-weatherpicker.cloudfunctions.net/'
    }
  },
  methods: {
    async update () {
      this.showLoading()
      try {
        const r = await this.$axios.get(`${this.url}/getStation?uuid=${encodeURIComponent(this.uuid)}`)
        console.log(r)
        if (r) {
          const now = moment()
          const stations = r.data.stations
          this.$store.commit('stations/updateStations', stations)
          this.$store.commit('stations/updateUpdateAt', now)
          await db.update({ id: 'stations' }, { $set: { value: stations } }, { upsert: true })
          await db.update({ id: 'stationsUpdateTime' }, { $set: { value: now } }, { upsert: true })
        }
      } catch (error) {
        console.log(error)
      }
      this.hideLoading()
    },
    timeFormat (time) {
      return moment(time).format('YYYY-MM-DD hh:mm:ss')
    }
  }
}
</script>

<style>

</style>
