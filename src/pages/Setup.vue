<template>
  <q-page>
    <Dust />
    <Keys />
    <Socket />
  </q-page>
</template>

<script>
import { mapState } from 'vuex'
import Dust from '../components/setup/SetupDust'
import Keys from '../components/setup/SetupKey'
import Socket from '../components/setup/SetupSocket'

export default {
  components: { Dust, Keys, Socket },
  computed: {
    ...mapState({
      uuid: state => state.keys.uuid
    })
  }
}
</script>
