<template>
  <q-card flat square>
    <q-card-section class="fit row no-wrap q-py-sm">
      <q-list class="full-width">
        <q-item>
          <q-item-section>
            <q-item-label>미세먼지 측정소</q-item-label>
            <q-item-label caption>{{ timeFormat(updateAt) }}</q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-btn @click="update">Update</q-btn>
          </q-item-section>
        </q-item>
        <!-- <q-item>
          <q-item-section>
            <q-item-label>미세먼지 수치 갱신</q-item-label>
            <q-item-label v-if="dust" caption>{{ timeFormat(dust.updatedAt) }}</q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-btn @click="getAllDustData">Update</q-btn>
          </q-item-section>
        </q-item> -->
      </q-list>
    </q-card-section>
  </q-card>
</template>

<script>
import { mapState } from 'vuex'
import moment from 'moment'

import dustFn from '../../mixins/dust'
import loading from '../../mixins/loads'

export default {
  mixins: [loading, dustFn],
  computed: {
    ...mapState({
      updateAt: state => state.stations.updateAt,
      dust: state => state.dust.dust
    })
  },
  methods: {
    async update () {
      this.showLoading()
      this.getAllStations()
      this.hideLoading()
    },
    timeFormat (time) {
      return moment(time).format('YYYY-MM-DD hh:mm:ss')
    }
  }
}
</script>

<style>

</style>
