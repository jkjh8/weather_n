<template>
  <q-page>
    <Map ref="map" :kakao="kakao" />

    <q-dialog v-model="keyPopup" persistent>
      <Key @close="confirmKey" />
    </q-dialog>
  </q-page>
</template>

<script>
import { mapState } from 'vuex'
import { remote } from 'electron'
import Key from '../components/Key'
import Map from '../components/Map'

const db = remote.getGlobal('db')

export default {
  name: 'PageIndex',
  components: { Key, Map },
  async beforeCreate () {
    const kakao = await db.findOne({ id: 'kakao' })
    this.$store.dispatch('keys/updateKakao', kakao.key)

    const data = await db.findOne({ id: 'data' })
    this.$store.dispatch('keys/updateData', data.key)
    if (!kakao || !data) {
      this.keyPopup = true
    } else {
      this.initMap()
    }
  },
  computed: {
    ...mapState({
      kakao: state => state.keys.kakao,
      gData: state => state.keys.data
    })
  },
  data () {
    return {
      keyPopup: false
    }
  },
  methods: {
    initMap () {
      this.$refs.map.init()
    }
  },
  confirmKey () {
    this.keyPopup = false
    this.initMap()
  }
}
</script>
