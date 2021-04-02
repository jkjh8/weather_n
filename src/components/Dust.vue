<template>
  <q-card flat>
    <q-card-section class="q-ml-sm row items-center">
        <q-icon size="sm" name="cloud"></q-icon>
        <span class="text-h6 q-mx-md">Dust</span>
        <span v-if="dustStation&&dust" class="q-mx-md row items-center">
          <span class="q-ml-md q-pl-md">발표 시간: {{ dust.dataTime }}</span>
          <span class="q-ml-md">
            <q-icon v-if="dust.khaiGrade === '1'" name="looks_one" color="green"></q-icon>
            <q-icon v-if="dust.khaiGrade === '2'" name="looks_two" color="teal" size="sm"></q-icon>
            <q-icon v-if="dust.khaiGrade === '3'" name="looks_3" color="orange"></q-icon>
            <q-icon v-if="dust.khaiGrade === '4'" name="looks_4" color="red"></q-icon>
          </span>
          <span class="q-mr-md">
            대기종합지수: {{ this.grade(dust.khaiGrade) }}
          </span>
          <div>
            <q-icon></q-icon>
          </div>
          <span>
            <q-btn flat @click="dialog = true">
              <span><q-icon name="insert_chart_outlined"></q-icon></span>
              <span class="q-mx-sm">관측소: {{ dustStation.name }}</span>
              <q-tooltip anchor="top middle" :offset="[0, 25]">관측소 선택</q-tooltip>
            </q-btn>
          </span>
          <!-- <span class="q-mx-sm">
            PM10: {{ dust.pm10Value }}
          </span>
          <span class="q-mx-sm">
            PM2.5: {{ dust.pm25Value }}
          </span> -->
        </span>

        <q-space />

        <q-btn
          flat
          round
          icon="lens_blur"
          @click="detail=true"
        >
          <q-tooltip anchor="top middle" :offset="[0, 25]">상세 정보</q-tooltip>
        </q-btn>
        <q-btn
          flat
          round
          icon="sync"
          @click="getDust"
        >
          <q-tooltip anchor="top middle" :offset="[0, 25]">새로 고침</q-tooltip>
        </q-btn>
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
import { mapState } from 'vuex'
import SelectStation from './SelectStation'
import DustDetail from './DustDetail'
import dustFn from '../mixins/dust'

export default {
  mixins: [dustFn],
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
      dialog: false,
      detail: false,
      selected: null
    }
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
      this.getDustFromDb(this.dustStation)
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
