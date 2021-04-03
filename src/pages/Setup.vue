<template>
  <q-page>
    <Dust />
    <Keys />
  </q-page>
</template>

<script>
import { mapState } from 'vuex'
import Dust from '../components/setup/SetupDust'
import Keys from '../components/setup/SetupKey'

export default {
  components: { Dust, Keys },
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
