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
      uuid: '',
      url: 'https://us-central1-weatherpicker.cloudfunctions.net'
    }
  },
  methods: {
    async getApiKeys () {
      this.showLoading()
      this.updateUUID()
      const result = await this.$axios.get(`${this.url}/getApi?uuid=${encodeURIComponent(this.uuid)}`)
      console.log(result)
      this.updateKeys(result)
    },
    updateKeys (data) {
      switch (data.status) {
        case 200: {
          const keyArray = data.data.keys
          keyArray.forEach(async (key) => {
            if (key.id === 'kakao') {
              this.$store.dispatch('keys/updateKakao', key.key)
              if (db.get('keys').find({ id: 'kakao' }).value()) {
                db.get('keys').find({ id: 'kakao' }).assign({ value: key.key.js }).write()
              } else {
                db.get('keys').push({ id: 'kakao', value: key.key.js }).write()
              }
            } else if (key.id === 'data') {
              this.$store.dispatch('keys/updateData', key.key)
              if (db.get('keys').find({ id: 'data' }).value()) {
                db.get('keys').find({ id: 'data' }).assign({ value: key.key.key }).write()
              } else {
                db.get('keys').push({ id: 'data', value: key.key.key }).write()
              }
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
    },
    async updateUUID () {
      this.$store.commit('keys/updateUUID', this.uuid)
      // await db.get('keys').upsert({ id: 'uuid', value: this.uuid })
      if (db.get('keys').find({ id: 'uuid' }).value()) {
        db.get('keys').find({ id: 'uuid' }).assign({ value: this.uuid }).write()
      } else {
        db.get('keys').push({ id: 'uuid', value: this.uuid }).write()
      }
    },
    openServer () {
      shell.openExternal('https://weatherpicker.web.app/')
    }
  }
}
</script>
