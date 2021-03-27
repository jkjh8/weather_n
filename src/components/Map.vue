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
import geoRs from '../api/convertXY'

export default {
  name: 'Map',
  props: ['kakao'],
  computed: {
    ...mapState({
      mapId: state => state.keys.kakao.js
    })
  },
  watch: {
    kakao: function (newVal, oldVal) {
      console.log(newVal)
    }
  },
  data () {
    return {
      map: null,
      marker: null,
      infoWindow: null
    }
  },
  mounted () {
    console.log(this.mapId)
    // window.naver && window.naver.maps ? this.initMap() : this.addScript()
  },
  methods: {
    /* global naver */
    init () {
      console.log('start')
    },
    addScript () {
      const script = document.createElement('script')
      script.onload = () => this.initMap()
      script.src = `https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${this.mapId}&submodules=geocoder`
      document.head.appendChild(script)
    },
    initMap () {
      this.map = new naver.maps.Map('map')
      naver.maps.Event.addListener(this.map, 'click', this.clickEvent)
    },
    addMarker (coord) {
      this.marker = new naver.maps.Marker({ position: coord, map: this.map })
      this.infoWindow = new naver.maps.InfoWindow({
        content: [
          '<div class="iw_inner" style="background: rgba(255, 255, 255, 0.7)">',
          '   <div class="text-h5 q-mx-lg">서울특별시청</div>',
          '   <p>서울특별시 중구 태평로1가 31 | 서울특별시 중구 세종대로 110 서울특별시청<br />',
          '       02-120 | 공공,사회기관 &gt; 특별,광역시청<br />',
          '       <a href="http://www.seoul.go.kr" target="_blank">www.seoul.go.kr/</a>',
          '   </p>',
          '</div>'
        ].join(''),
        backgroundColor: 'transparent',
        borderWidth: 0
      })
      naver.maps.Event.addListener(this.marker, 'click', this.clickMarker)
    },
    clickEvent (e) {
      if (this.marker) {
        this.marker.setPosition(e.coord)
      } else {
        this.addMarker(e.coord)
      }
      console.log(e.coord)
      this.geoNaverTo(e.coord)
      this.searchCoordToAddr(e.coord)
    },
    clickMarker (e) {
      if (this.infoWindow.getMap()) {
        this.infoWindow.close()
      } else {
        this.infoWindow.open(this.map, this.marker)
      }
    },
    geoNaverTo (coord) {
      const EPSG3857 = naver.maps.TransCoord.fromLatLngToEPSG3857(coord)
      const TM128 = naver.maps.TransCoord.fromLatLngToTM128(coord)
      const UTMK = naver.maps.TransCoord.fromLatLngToUTMK(coord)
      const rs = geoRs(coord._lat, coord._lng)
      const result = { LatLng: { lat: coord._lat, lng: coord._lng }, TM128: TM128, UTMK: UTMK, EPSG3857: EPSG3857, rs: rs }
      console.log(result)
      return result
    },
    searchCoordToAddr (latlng) {
      naver.maps.Service.reverseGeocode({
        coords: latlng,
        orders: [naver.maps.Service.OrderType.ADDR, naver.maps.Service.OrderType.ROAD_ADDR].join(',')
      }, function (status, response) {
        console.log(status, response)
      })
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
