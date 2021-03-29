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
const db = remote.getGlobal('db')

export default {
  computed: {
    ...mapState({
      updateAt: state => state.stations.updateAt,
      uuid: state => state.keys.uuid
    })
  },
  mounted () {
    moment.locale('kr')
  },
  data () {
    return {
      url: 'https://us-central1-weatherpicker.cloudfunctions.net/'
    }
  },
  methods: {
    async update () {
      try {
        const r = await this.$axios.get(`${this.url}/getStation?uuid=${encodeURIComponent(this.uuid)}`)
        console.log(r)
        if (r) {
          const now = moment()
          const stations = r.data.stations
          this.$store.commit('stations/updateStations', stations)
          this.$store.commit('stations/updateUpdateAt', now)

        }
      } catch (error) {
        console.log(error)
      }
    },
    timeFormat (time) {
      return moment(time).format()
    }
  }
}
</script>

<style>

</style>
