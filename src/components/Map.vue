<template>
  <q-card>
    <q-card-section>MAP</q-card-section>
    <q-card-section>
      <div id="map"></div>
    </q-card-section>
  </q-card>
</template>

<script>
import { mapState } from 'vuex'
// import geoRs from '../api/convertXY'

export default {
  name: 'Map',
  computed: {
    ...mapState({
      kakaoKey: state => state.keys.kakao
    })
  },
  data () {
    return {
      mapContainer: null,
      map: null,
      marker: null,
      infoWindow: null
    }
  },
  mounted () {
    this.mapContainer = document.getElementById('map')
    // console.log(this.mapId)
    // window.naver && window.naver.maps ? this.initMap() : this.addScript()
  },
  methods: {
    /* global kakao */
    init () {
      window.kakao && window.kakao.maps ? this.addMap() : this.addScript()
    },
    addScript () {
      const script = document.createElement('script')
      script.onload = () => kakao.maps.load(this.addMap)
      script.src = `http://dapi.kakao.com/v2/maps/sdk.js?autoload=false&appkey=${this.kakaoKey.js}&libraries=services`
      document.head.appendChild(script)
    },
    addMap () {
      this.map = new kakao.maps.Map(this.mapContainer, ({
        level: 3,
        center: new kakao.maps.LatLng(37.5642135, 127.0016985)
      }))
    }
  }
}
</script>

<style>
#map {
  width: 100%;
  height: 350px;
  background: gray;
}
</style>
