<template>
  <q-card style="width: 400px;">
    <q-card-section>
      <div class="text-h6">관측소 선택</div>
    </q-card-section>
    <q-separator />
    <q-card-section style="max-height: 250px; overflow-y: auto;">
      <q-list v-if="nearStations">
        <q-item
          v-for="(item, idx) in nearStations"
          :key="idx"
          clickable
          v-ripple
          :active="selected === idx"
          @click="selected = idx"
          active-class="clicked"
        >
          <q-item-section>
            <div>{{ item.name }}</div>
            <div class="text-caption">{{ item.address }}</div>
          </q-item-section>
        </q-item>
      </q-list>
    </q-card-section>
    <q-separator />
    <q-card-actions align="right">
      <q-btn flat v-close-popup>Cancel</q-btn>
      <q-btn flat @click="selectStation" v-close-popup>OK</q-btn>
    </q-card-actions>
  </q-card>
</template>

<script>
import { mapState } from 'vuex'
const db = require('electron').remote.getGlobal('db')

export default {
  computed: {
    ...mapState({
      dustStation: state => state.location.dustStation,
      nearStations: state => state.location.nearStations
    })
  },
  mounted () {
    this.seleted = null
  },
  data () {
    return {
      selected: null
    }
  },
  methods: {
    async selectStation () {
      this.$store.commit('location/updateDustStation', this.nearStations[this.selected])
      const result = await db.dust.findOne({ stationName: this.nearStations[this.selected].name })
      this.$store.commit('dust/updateDust', result)
    }
  }
}
</script>

<style lang="sass">
.clicked
  color: white
  background: gray
</style>
