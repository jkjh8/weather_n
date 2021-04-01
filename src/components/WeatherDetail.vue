<template>
  <q-card style="width: 400px;">
    <q-card-section>
      <div class="text-h6">상세 날씨</div>
      <div v-if="weather&&weatherDetail" class="text-caption">{{weather.time}} 발표</div>
    </q-card-section>
    <q-separator />
    <q-card-section>
      <q-list v-if="weather&&weatherDetail">
        <q-item>
          <q-item-section>날씨</q-item-section>
          <q-item-section>{{ weatherDetail.name }}</q-item-section>
        </q-item>
        <q-item>
          <q-item-section>기온</q-item-section>
          <q-item-section>{{ weatherDetail.temp }} {{ "&#8451;" }}</q-item-section>
        </q-item>
        <q-item>
          <q-item-section>강수량</q-item-section>
          <q-item-section>{{ weather.RN1 }} mm</q-item-section>
        </q-item>
        <q-item>
          <q-item-section>습도</q-item-section>
          <q-item-section>{{ weather.REH }} %</q-item-section>
        </q-item>
        <q-item>
          <q-item-section>풍향</q-item-section>
          <q-item-section>{{ weather.VEC }}도</q-item-section>
        </q-item>
        <q-item>
          <q-item-section>풍속</q-item-section>
          <q-item-section>{{ weather.WSD }} %</q-item-section>
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
      weather: state => state.weather.weather,
      weatherDetail: state => state.weather.weatherDetail
    })
  }
}
</script>

<style>

</style>
