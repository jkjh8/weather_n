<template>
  <q-card>
    <q-card-section class="q-mx-md q-py-none row items-center">
        <q-icon size="sm" name="fas fa-map"></q-icon>
        <span class="text-h6 q-mx-md">Location</span>
        <!-- <span class="text-bold q-mx-md">{{ location.address }}</span> -->
        <q-space />
        <q-btn
          flat
          round
          icon="fas fa-map-marked-alt"
        />
        <q-btn
          flat
          round
          icon="fas fa-search-location"
        />
      </q-card-section>
    <q-card-section class="q-py-none">
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
      infoWindow: null,
      geocoder: null,
      ps: null
    }
  },
  mounted () {
    if (!this.map && this.kakaoKey) {
      this.init()
    }
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
      this.mapContainer = document.getElementById('map')
      this.map = new kakao.maps.Map(this.mapContainer, ({
        level: 3,
        center: new kakao.maps.LatLng(37.566829, 126.978655)
      }))
      this.geocoder = new kakao.maps.services.Geocoder()
      this.ps = new kakao.maps.services.Places()

      this.moveMarker(new kakao.maps.LatLng(37.566829, 126.978655))
    },
    moveMarker (position) {
      if (this.marker) {
        this.marker.setPosition(position)
      } else {
        this.marker = new kakao.maps.Marker({
          map: this.map,
          position: position
        })
      }
      this.map.setCenter(position)
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
