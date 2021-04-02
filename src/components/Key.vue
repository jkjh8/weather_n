<template>
  <q-card style="min-width: 400px">
    <q-card-section class="text-h6">
      <q-icon class="q-mx-sm" color="green-10" name="fas fa-key"></q-icon>
      <span>ID를 입력하여 KEY를 받아오세요</span>
    </q-card-section>

    <q-card-section class="text-h6">
      <q-input v-model="uuid" outlined dense></q-input>
    </q-card-section>

    <q-card-section align="right">
      <router-link style="text-decoration: none; color: black;" to="/extkey">외부 API키 등록</router-link>
      <q-btn class="q-ml-sm" flat @click="openServer">사이트 가입</q-btn>
    </q-card-section>

    <q-card-actions align="right">
      <q-btn class="q-px-md" flat color="green-10" @click="getApiKeys">Send</q-btn>
    </q-card-actions>
  </q-card>
</template>

<script>
import { mapState } from 'vuex'
import { remote, shell } from 'electron'
import { api } from '../boot/axios'
import loading from '../mixins/loads'
const db = remote.getGlobal('db')

export default {
  name: 'GetKey',
  mixins: [loading],
  computed: {
    ...mapState({
      kakao: state => state.keys.kakao,
      gData: state => state.keys.data
    })
  },
  data () {
    return {
      uuid: ''
    }
  },
  methods: {
    async getApiKeys () {
      this.showLoading()
      this.updateUUID()
      const result = await api.get(`/getApi?uuid=${this.uuid}`)
      this.updateKeys(result)
    },
    updateKeys (data) {
      switch (data.status) {
        case 200: {
          const keyArray = data.data.keys
          keyArray.forEach(async (key) => {
            if (key.id === 'kakao') {
              this.$store.dispatch('keys/updateKakao', key.key.js)
              await db.keys.update({ id: 'kakao' }, { $set: { value: key.key.js } }, { upsert: true })
            } else if (key.id === 'data') {
              this.$store.dispatch('keys/updateData', key.key.key)
              await db.keys.update({ id: 'data' }, { $set: { value: key.key.key } }, { upsert: true })
            }
          })
          this.$emit('close')
          break
        }
        case 400:
          this.$q.notify({
            color: 'negative',
            message: '일치하는 ID가 없습니다.',
            icon: 'report_problem'
          })
          break
        case 500:
          this.$q.notify({
            color: 'negative',
            message: '네트워크 장애 발생. 잠시후에 다시 시도해주세요.',
            icon: 'report_problem'
          })
          break
        default:
          this.$q.notify({
            color: 'negative',
            message: '알 수 없는 에러가 발생하였습니다.',
            icon: 'report_problem'
          })
      }
      this.hideLoading()
      // this.$emit()
    },
    async updateUUID () {
      this.$store.commit('keys/updateUUID', this.uuid)
      await db.keys.update({ id: 'uuid' }, { $set: { value: this.uuid } }, { upsert: true })
    },
    openServer () {
      shell.openExternal('https://weatherpicker.web.app/')
    }
  }
}
</script>
