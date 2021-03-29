<template>
  <q-page>
    <Map ref="map" />

    <q-dialog v-model="dialog" persistent>
      <Key @close="confirmKey" />
    </q-dialog>
  </q-page>
</template>

<script>
import { mapState } from 'vuex'
import Key from '../components/Key'
import Map from '../components/Map'
import location from '../mixins/location'

export default {
  name: 'PageIndex',
  mixins: [location],
  components: { Key, Map },
  async mounted () {
    this.getIpLocation()
  },
  computed: {
    ...mapState({
      kakaoKey: state => state.keys.kakao,
      dataKey: state => state.keys.data,
      uuid: state => state.keys.uuid
    })
  },
  data () {
    return {
      dialog: false
    }
  },
  methods: {
    initMap () {
      this.$refs.map.init()
    },
    keyPopup (value) {
      if (value) {
        this.dialog = true
      } else {
        this.dialog = false
        this.initMap()
      }
    },
    confirmKey () {
      this.dialog = false
      this.initMap()
    }
  }
}
</script>
