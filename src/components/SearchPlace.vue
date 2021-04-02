<template>
  <q-card style="min-width: 600px">
    <q-card-section class="q-pb-xs">
      <div class="text-h6">주소검색</div>
      <div class="text-subtitle2">주소를 겁색하거나 지도에 위치를 클륵하세요</div>
      <div class="row">
        <div
          class="q-mx-md"
          style="width: 100%"
        >
          <q-input
            square
            oulined
            v-model="search"
            @keyup.enter="searchPlace"
            label="찾을 주소를 입력하세요"
          >
            <template v-slot:append>
              <q-btn
                round
                dense
                flat
                size="sm"
                icon="fas fa-search"
                @click="searchPlace"
              />
            </template>
          </q-input>
        </div>
      </div>
    </q-card-section>
    <q-card-section class="q-pt-xs" style="max-height: 120px; overflow-y: auto;">
      <q-list>
        <q-item
          v-for="(item, idx) in places"
          :key="idx"
          class="q-my-sm"
          clickable
          v-ripple
          @click="clickList(idx)"
        >

          <q-item-section>
            <q-item-label>{{ item.place_name }}</q-item-label>
            <q-item-label caption lines="1">{{ item.address_name }}</q-item-label>
          </q-item-section>

        </q-item>
      </q-list>
    </q-card-section>
    <q-card-section>
      <div id="mapDialog" style="width: 100%; height: 300px;position: relative;">
        <!-- <div
          v-if="location && location.address_name"
          class="q-ma-md q-pa-sm text-bold text-white bg-black"
          style="position: absolute; z-index: 2; opacity: 0.5"
        >
          {{ location.address_name }}
        </div> -->
      </div>
    </q-card-section>
    <q-card-actions align="right" class="text-primary">
      <q-btn flat label="Cancel" v-close-popup />
      <q-btn v-if="!loading" flat label="Add address" @click="submit" v-close-popup />
      <q-btn v-else flat class="q-mx-md">
        <q-spinner-orbit
          color="primary"
          size="1em"
        />
      </q-btn>
    </q-card-actions>
  </q-card>
</template>

<script>
import loading from '../mixins/loads'
import { mapState } from 'vuex'
import convertXY from '../api/convertXY'
import { remote } from 'electron'
const db = remote.getGlobal('db')

export default {
  name: 'PageIndex',
  mixins: [loading],
  computed: {
    ...mapState({
      location: state => state.location.location
    })
  },
  data () {
    return {
      mapContainer: null,
      map: null,
      marker: null,
      infoWindow: null,
      geocoder: null,
      ps: null,
      search: '',
      place: null,
      places: [],
      loading: false
    }
  },
  async mounted () {
    await this.addMap()
    this.addMapClickEvent()
    this.place = null
  },
  methods: {
    /* global kakao */
    addMap () {
      this.mapContainer = document.getElementById('mapDialog')

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
      if (this.location) {
        this.moveMarker(position)
      }
      // this.moveMarker(position)
      this.map.setCenter(position)
    },

    // marker
    moveMarker (position) {
      if (this.marker) {
        this.marker.setPosition(position)
      } else {
        this.marker = new kakao.maps.Marker({
          map: this.map,
          position: position
        })
      }
    },
    moveMarkerLatLng (x, y) {
      const position = new kakao.maps.LatLng(y, x)
      if (this.marker) {
        this.marker.setPosition(position)
      } else {
        this.marker = new kakao.maps.Marker({
          map: this.map,
          position: position
        })
      }
    },

    // click event
    addMapClickEvent () {
      kakao.maps.event.addListener(this.map, 'click', (mouseEvent) => {
        this.moveMarker(mouseEvent.latLng)
        this.searchAddrFromCoords(mouseEvent.latLng)
      })
    },
    searchAddrFromCoords (coords) {
      this.geocoder.coord2RegionCode(coords.getLng(), coords.getLat(), (data, status) => {
        if (status === kakao.maps.services.Status.OK) {
          this.place = {
            address_name: data[0].address_name,
            local: this.localName(data[0].region_1depth_name),
            x: data[0].x,
            y: data[0].y
          }
          this.search = this.place.address_name
        }
      })
    },

    localName (name) {
      switch (name) {
        case '서울특별시':
          return '서울'
        case '인천광역시':
          return '인천'
        case '대전광역시':
          return '대전'
        case '대구광역시':
          return '대구'
        case '부산광역시':
          return '부산'
        case '광주광역시':
          return '광주'
        case '경기도':
          return '경기'
        case '강원도':
          return '강원'
        case '충청북도':
          return '충북'
        case '충청남도':
          return '충남'
        case '전라북도':
          return '전북'
        case '전라남도':
          return '전남'
        case '경상북도':
          return '경북'
        case '경상남도':
          return '경남'
        case '제주특별자치도':
          return '제주'
      }
    },

    // place search
    searchPlace () {
      this.ps.keywordSearch(this.search, (data, status) => {
        if (status === kakao.maps.services.Status.OK) {
          this.places = data
        }
      })
    },
    clickList (idx) {
      const item = this.places[idx]
      const position = new kakao.maps.LatLng(item.y, item.x)
      this.marker.setPosition(position)
      this.map.setCenter(position)
      this.place = {
        address_name: item.address_name,
        local: item.address_name.substring(0, 2),
        x: item.x,
        y: item.y
      }
    },
    submit () {
      if (this.place) {
        this.place.xy = convertXY(this.place.y, this.place.x)
        this.$store.dispatch('location/updateLocation', this.place)
        db.location.update({ id: 'location' }, { $set: { value: this.place } }, { upsert: true })
      }
    }
  }
}
</script>
