<template>
  <q-card>
    <q-card-section class="fit row no-wrap">
      <q-list class="full-width">
        <q-item>
          <q-item-section>
            <q-item-label>ID</q-item-label>
            <q-item-label caption>사용자 api key</q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-btn @click="update">Update</q-btn>
          </q-item-section>
        </q-item>
      </q-list>
    </q-card-section>
    <q-dialog v-model="dialog">
      <Keys :mode="mode" @close="dialog=false" />
    </q-dialog>
  </q-card>
</template>

<script>
import { mapState } from 'vuex'
import Keys from '../Key.vue'

export default {
  components: { Keys },
  computed: {
    ...mapState({
      uuid: state => state.keys.uuid
    })
  },
  data () {
    return {
      dialog: false,
      mode: true
    }
  },
  methods: {
    update () {
      this.dialog = true
    }
  }
}
</script>

<style>

</style>
