<template>
  <q-card flat square>
    <q-card-section class="fit row no-wrap q-py-sm">
      <q-list class="full-width">
        <q-item>
          <q-item-section>
            <q-item-label>TCP Server</q-item-label>
            <q-item-label caption>listening {{port}}</q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-input
              style="width: 100px;"
              v-model="cport"
              outlined
              dense
            >
            </q-input>
          </q-item-section>
          <q-item-section side>
            <q-btn @click="updateTcp">Update</q-btn>
          </q-item-section>
        </q-item>
        <q-item>
          <q-item-section>
            <q-item-label>Serial Port</q-item-label>
            <q-item-label caption>listening {{comm}}</q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-select
              style="width: 100px;"
              dense
              outlined
              popup-content-style="height: 150px;"
              v-model="comm"
              :options="commOptions"
              label="COM" />
          </q-item-section>
          <q-item-section side>
            <q-select
              style="width: 100px;"
              dense
              outlined
              popup-content-style="height: 150px;"
              v-model="baud"
              :options="baudOptions"
              label="Baud"
            />
          </q-item-section>
          <q-item-section side>
            <q-btn @click="updateSerial">update</q-btn>
          </q-item-section>
        </q-item>
      </q-list>
    </q-card-section>
  </q-card>
</template>

<script>
import { mapState } from 'vuex'
const db = require('electron').remote.getGlobal('db')

export default {
  computed: {
    ...mapState({
      updateAt: state => state.stations.updateAt,
      dust: state => state.dust.dust
    })
  },
  data () {
    return {
      port: null,
      cport: null,
      dialog: false,
      comm: null,
      commOptions: ['com1', 'com2', 'com3', 'com4', 'com5', 'com6', 'com7', 'com8', 'com9'],
      baud: null,
      baudOptions: [9600, 14400, 19200, 28800, 38400, 57600, 115200]
    }
  },
  async mounted () {
    const r = await db.setup.findOne({ id: 'socketport' })
    if (r) this.port = r.value; this.cport = r.value
    const rs = await db.setup.findOne({ id: 'serial' })
    if (rs) this.comm = rs.port; this.baud = rs.baud
  },
  methods: {
    updateTcp () {
      db.setup.update({ id: 'socketport' }, { $set: { value: this.cport } }, { upsert: true })
      this.$q.notify({
        type: 'info',
        message: '변경된 포트는 다음 실행시 부터 적용됩니다.',
        position: 'center',
        actions: [{ icon: 'close', color: 'white' }]
      })
    },
    updateSerial () {
      db.setup.update({ id: 'serial' }, { $set: { port: this.comm, baud: this.baud } }, { upsert: true })
      this.$q.notify({
        type: 'info',
        message: '변경된 사항은 다음 실행시 부터 적용됩니다.',
        position: 'center',
        actions: [{ icon: 'close', color: 'white' }]
      })
    }
  }
}
</script>

<style>

</style>
