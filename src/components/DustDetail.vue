<template>
  <q-card style="width: 400px;">
    <q-card-section>
      <div class="text-h6">미세먼지 상세 정보</div>
      <div v-if="dust&&dustStation" class="text-caption">
        <span class="q-mx-sm">{{ dustStation.name }}</span>
        <span class="q-mx-sm">{{ dust.dataTime }}</span>
      </div>
    </q-card-section>
    <q-separator />
    <q-card-section>
      <q-list v-if="dust">
        <q-item>
          <q-item-section>대기환경종합지수</q-item-section>
          <q-item-section>{{ this.grade(dust.khaiGrade) }}</q-item-section>
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
