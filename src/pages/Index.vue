<template>
  <q-page>
    <Map :kakao="kakao" />

    <q-dialog v-model="keyPopup" persistent>
      <Key />
    </q-dialog>
  </q-page>
</template>

<script>
import { mapState } from 'vuex'
import Key from '../components/Key'
import Map from '../components/Map'

export default {
  name: 'PageIndex',
  components: { Key, Map },
  computed: {
    ...mapState({
      naver: state => state.keys.naverId,
      kakao: state => state.keys.kakaoKey,
      gData: state => state.keys.dataKey
    })
  },
  data () {
    return {
      keyPopup: false
    }
  },
  created () {
    if (!this.naver || !this.kakao || !this.gData) {
      this.keyPopup = true
    }
  }
}
</script>
