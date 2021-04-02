
import { mapState } from 'vuex'
export default {
  computed: {
    ...mapState({
      uuid: state => state.keys.uuid
    })
  },
  methods: {
    //
  }
}
