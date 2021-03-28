<template>
  <q-page>
    <Map ref="map" />

    <q-dialog v-model="keyPopup" persistent>
      <Key @close="confirmKey" />
    </q-dialog>
  </q-page>
</template>

<script>
// import { mapState } from 'vuex'
import { remote } from 'electron'
import Key from '../components/Key'
import Map from '../components/Map'

import location from '../mixins/location'

const db = remote.getGlobal('db')

export default {
  name: 'PageIndex',
  mixins: [location],
  components: { Key, Map },
  async beforeCreate () {
    const kakaoKey = await db.findOne({ id: 'kakao' })
    this.$store.dispatch('keys/updateKakao', kakaoKey.key)

    const dataKey = await db.findOne({ id: 'data' })
    this.$store.dispatch('keys/updateData', dataKey.key)
    if (!kakaoKey || !dataKey) {
      this.keyPopup = true
    } else {
      this.initMap()
    }
  },
  // computed: {
  //   ...mapState({
  //     kakao: state => state.keys.kakao,
  //     gData: state => state.keys.data
  //   })
  // },
  data () {
    return {
      keyPopup: false
    }
  },
  async mounted () {
    this.getIpLocation()
  },
  methods: {
    initMap () {
      this.$refs.map.init()
    },
    confirmKey () {
      this.keyPopup = false
      this.initMap()
    }
  }
}
</script>
