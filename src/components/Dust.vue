<template>
  <q-card flat>
    <q-card-section class="q-ml-sm row items-center">
        <q-icon size="sm" name="cloud"></q-icon>
        <span class="text-h6 q-mx-md">Dust</span>
        <span v-if="dustStation&&dust" class="q-mx-md row items-center">
          <span>발표 시간: {{ dust.dataTime }}</span>
          <span class="q-ml-md">
            관측소: {{ dustStation.name }}
          </span>
          <span>
            <q-btn flat round icon="apps" @click="dialog = true"></q-btn>
          </span>
          <span class="q-mx-sm">
            대기종합지수: {{ this.grade(dust.khaiGrade) }}
          </span>
          <span class="q-mx-sm">
            PM10: {{ dust.pm10Value }}
          </span>
          <span class="q-mx-sm">
            PM2.5: {{ dust.pm25Value }}
          </span>
        </span>
        <q-btn
          flat
          round
          icon="lens_blur"
          @click="detail=true"
        />
        <q-space />
        <q-btn
          flat
          round
          icon="sync"
          @click="getDust"
        />
        <q-btn
          flat
          round
          icon="sync"
          @click="getAllDust"
        />
      </q-card-section>

      <q-dialog v-model="dialog">
        <SelectStation />
      </q-dialog>

      <q-dialog v-model="detail">
        <DustDetail />
      </q-dialog>
  </q-card>
</template>

<script>
import { ipcRenderer, remote } from 'electron'
import { mapState } from 'vuex'
import SelectStation from './SelectStation'
import DustDetail from './DustDetail'

const db = remote.getGlobal('db')

export default {
  components: { SelectStation, DustDetail },
  computed: {
    ...mapState({
      dataKey: state => state.keys.data,
      location: state => state.location.location,
      dustStation: state => state.location.dustStation,
      nearStations: state => state.location.nearStations,
      dust: state => state.dust.dust,
      dustAll: state => state.dust.dustAll
    })
  },
  data () {
    return {
      url: '/B552584/ArpltnInforInqireSvc/getCtprvnRltmMesureDnsty',
      dialog: false,
      detail: false,
      selected: null
    }
  },
  mounted () {
    ipcRenderer.on('dust', (e, d) => {
      if (d.header.resultCode === '00') {
        const data = d.body.items.item
        // this.$store.dispatch('weather/updateWeather', data)
        console.log(data)
      }
    })
  },
  methods: {
    async getDust () {
      if (!this.dustStation) {
        return this.$q.notify({
          timeout: 1000,
          color: 'negative',
          message: '관측소를 선택 해주세요.',
          icon: 'report_problem',
          position: 'center',
          actions: [{ icon: 'close', color: 'white' }]
        })
      }
      const result = await db.dust.findOne({ stationName: this.dustStation.name })
      this.$store.commit('dust/updateDust', result)
    },
    getAllDust () {
      const query = `ServiceKey=${this.dataKey}&pageNo=1&numOfRows=1000&returnType=json&sidoName=전국&ver=1.0`
      this.$axios.get(`${this.url}?${query}`).then(async (res) => {
        if (res.status === 200) {
          const result = res.data.response
          if (result.header.resultCode === '00') {
            await db.dust.remove({}, { multi: true })
            const r = await db.dust.insert(result.body.items)
            console.log(r)
          }
        }
      })
    },
    grade (id) {
      switch (id) {
        case '1':
          return '좋음'
        case '2':
          return '보통'
        case '3':
          return '나쁨'
        case '4':
          return '매우 나쁨'
      }
    }
  }
}
</script>
