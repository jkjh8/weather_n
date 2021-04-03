<template>
  <q-card style="width: 400px;">
    <q-card-section>
      <div class="text-h6">미세먼지 상세 정보</div>
      <div v-if="dust&&dustStation" class="text-caption">
        <span class="q-mx-sm">{{ dustStation.name }}</span>
        <span class="q-mx-sm">{{ dust.dataTime }} 발표</span>
      </div>
    </q-card-section>
    <q-separator />
    <q-card-section>
      <q-list v-if="dust">
        <q-item>
          <q-item-section>대기환경종합지수</q-item-section>
          <q-item-section>{{ this.grade(dust.khaiGrade) }}</q-item-section>
        </q-item>
        <q-item>
          <q-item-section>대기환경종합수치</q-item-section>
          <q-item-section>{{ dust.khaiValue }}</q-item-section>
        </q-item>
        <q-item>
          <q-item-section>미세먼지(PM10) 지수</q-item-section>
          <q-item-section>{{ this.grade(dust.pm10Grade) }}</q-item-section>
        </q-item>
        <q-item>
          <q-item-section>미세먼지(PM10) 수치</q-item-section>
          <q-item-section>{{ dust.pm10Value }}&#181;g/&#13221;</q-item-section>
        </q-item>
        <q-item>
          <q-item-section>미세먼지(PM2.5) 지수</q-item-section>
          <q-item-section>{{ this.grade(dust.pm25Grade) }}</q-item-section>
        </q-item>
        <q-item>
          <q-item-section>미세먼지(PM2.5) 수치</q-item-section>
          <q-item-section>{{ dust.pm25Value }}&#181;g/&#13221;</q-item-section>
        </q-item>
        <q-item>
          <q-item-section>이산화질소 농도</q-item-section>
          <q-item-section>{{ dust.no2Value }}ppm</q-item-section>
        </q-item>
        <q-item>
          <q-item-section>일산화탄소 농도</q-item-section>
          <q-item-section>{{ dust.coValue }}ppm</q-item-section>
        </q-item>
        <q-item>
          <q-item-section>오존 농도</q-item-section>
          <q-item-section>{{ dust.o3Value }}ppm</q-item-section>
        </q-item>
        <q-item>
          <q-item-section>아황산가스 농도</q-item-section>
          <q-item-section>{{ dust.so2Value }}ppm</q-item-section>
        </q-item>
      </q-list>
    </q-card-section>
    <q-separator />
    <q-card-actions align="right">
      <q-btn flat v-close-popup>Close</q-btn>
    </q-card-actions>
  </q-card>
</template>

<script>
import { mapState } from 'vuex'

export default {
  computed: {
    ...mapState({
      dust: state => state.dust.dust,
      dustStation: state => state.location.dustStation
    })
  },
  methods: {
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

<style>

</style>
