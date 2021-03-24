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
export default {
  name: 'Map',
  computed: {
    ...mapState({
      mapId: state => state.keys.naverId
    })
  },
  data () {
    return {
      map: null,
      marker: null,
      infoWindow: null
    }
  },
  mounted () {
    window.naver && window.naver.maps ? this.initMap() : this.addScript()
  },
  methods: {
    /* global naver */
    addScript () {
      const script = document.createElement('script')
      script.onload = () => this.initMap()
      script.src = `https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${this.mapId}`
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
          '<div class="iw_inner">',
          '   <h3>서울특별시청</h3>',
          '   <p>서울특별시 중구 태평로1가 31 | 서울특별시 중구 세종대로 110 서울특별시청<br />',
          '       02-120 | 공공,사회기관 &gt; 특별,광역시청<br />',
          '       <a href="http://www.seoul.go.kr" target="_blank">www.seoul.go.kr/</a>',
          '   </p>',
          '</div>'
        ].join('')
      })
      naver.maps.Event.addListener(this.marker, 'click', this.clickMarker)
    },
    clickEvent (e) {
      if (this.marker) {
        this.marker.setPosition(e.coord)
      } else {
        this.addMarker(e.coord)
      }
    },
    clickMarker (e) {
      if (this.infoWindow.getMap()) {
        this.infoWindow.close()
      } else {
        this.infoWindow.open(this.map, this.marker)
      }
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
