<template>
  <q-card style="min-width: 400px">
    <q-card-section class="text-h6">
      <q-icon class="q-mx-sm" color="green-10" name="fas fa-key"></q-icon>
      <span>ID를 입력하여 KEY를 받아오세요</span>
    </q-card-section>

    <q-card-section class="text-h6">
      <q-input v-model="uuid" outlined dense></q-input>
    </q-card-section>

    <q-card-actions align="right">
      <q-btn v-if="!loading" class="q-px-md" flat color="green-10" @click="getApiKeys">Send</q-btn>
      <q-spinner-clock v-else class="q-mx-lg" color="green-10" size="1.5em"></q-spinner-clock>
    </q-card-actions>
  </q-card>
</template>

<script>
import { mapState } from 'vuex'
import { ipcRenderer } from 'electron'
export default {
  name: 'GetKey',
  computed: {
    ...mapState({
      naver: state => state.keys.naverId,
      kakao: state => state.keys.kakaoKey,
      gData: state => state.keys.dataKey
    })
  },
  data () {
    return {
      uuid: '',
      loading: false
    }
  },
  mounted () {
    ipcRenderer.on('recvKey', (e, data) => {
      this.loading = false
      switch (data.statusCode) {
        case 200: {
          const keyArray = data.data.keys
          keyArray.forEach(key => {
            if (key.id === 'kakao') this.$store.commit('keys/updateKakao', key.key)
            else if (key.id === 'naver') this.$store.commit('keys/updateNaver', key.key)
            else if (key.id === 'data') this.$store.commit('keys/updateData', key.key)
          })
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
      if (this.naver && this.kakao && this.gData) {
        this.$emit('close')
      }
    })
  },
  methods: {
    getApiKeys () {
      this.loading = true
      ipcRenderer.send('getApiKeys', this.uuid)
    }
  }
}
</script>
