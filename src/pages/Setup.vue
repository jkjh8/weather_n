<template>
  <q-page>
    <GetStations />
  </q-page>
</template>

<script>
import { mapState } from 'vuex'
import GetStations from '../components/GetStation'

export default {
  components: { GetStations },
  computed: {
    ...mapState({
      uuid: state => state.keys.uuid
    })
  },
  methods: {
    getStation () {
      this.$axios.get(`https://us-central1-weatherpicker.cloudfunctions.net/getStation?uuid=${encodeURIComponent(this.uuid)}`).then(res => {
        console.log(res)
      })
    }
  }
}
</script>
