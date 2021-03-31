<template>
  <q-card flat>
    <q-card-section class="q-ml-sd q-py-none row items-center">
        <q-icon size="sm" name="location_on"></q-icon>
        <span class="text-h6 q-mx-md">Location</span>
        <span class="text-bold q-mx-md">{{ location.address_name }}</span>
        <q-space />
        <!-- <q-btn
          flat
          round
          icon="fas fa-map-marked-alt"
          @click="clickIpLocationBtn"
        /> -->
        <q-btn
          flat
          round
          icon="search"
          @click="dialog=true"
        />
      </q-card-section>
    <q-card-section class="q-py-none">
      <div id="map"></div>
    </q-card-section>

    <q-dialog v-model="dialog">
      <SearchPlace />
    </q-dialog>
  </q-card>
</template>

<script>
import { mapState } from 'vuex'
import location from '../mixins/location'
import SearchPlace from './SearchPlace'

export default {
  name: 'Map',
  mixins: [location],
  components: { SearchPlace },
  computed: {
    ...mapState({
      kakaoKey: state => state.keys.kakao,
      location: state => state.location.location
    })
  },
  data () {
    return {
      dialog: false,
      mapContainer: null,
      map: null,
      marker: null,
      infoWindow: null,
      geocoder: null,
      ps: null
    }
  },
  mounted () {
    console.log(this.location)
    if (!this.map && this.kakaoKey) {
      this.init()
    }
  },
  watch: {
    location: function (newVal) {
      this.moveMarkerLatLng(newVal.y, newVal.x)
    }
  },
  methods: {
    /* global kakao */
    init () {
      window.kakao && window.kakao.maps ? this.addMap() : this.addScript()
    },
    addScript () {
      const script = document.createElement('script')
      script.onload = () => kakao.maps.load(this.addMap)
      script.src = `http://dapi.kakao.com/v2/maps/sdk.js?autoload=false&appkey=${this.kakaoKey}&libraries=services`
      document.head.appendChild(script)
    },
    addMap () {
      this.mapContainer = document.getElementById('map')
      let position
      if (this.location) {
        position = new kakao.maps.LatLng(this.location.y, this.location.x)
      } else {
        position = new kakao.maps.LatLng(37.566829, 126.978655)
      }

      this.map = new kakao.maps.Map(this.mapContainer, ({
        level: 3,
        center: position
      }))

      this.geocoder = new kakao.maps.services.Geocoder()
      this.ps = new kakao.maps.services.Places()

      this.moveMarker(position)
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
    },
    moveMarkerLatLng (y, x) {
      const position = new kakao.maps.LatLng(y, x)
      if (this.marker) {
        this.marker.setPosition(position)
      } else {
        this.marker = new kakao.maps.Marker({
          map: this.map,
          position: position
        })
      }
      this.map.setCenter(position)
    },
    async clickIpLocationBtn () {
      const result = await this.$axios.get('http://extreme-ip-lookup.com/json')
      console.log(result)
      this.$store.commit('location/updateIpLocation', { lat: result.data.lat, lng: result.data.lon })
      this.moveMarkerLatLng({ lat: result.data.lat, lng: result.data.lon })
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
