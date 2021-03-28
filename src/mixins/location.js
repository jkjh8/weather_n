export default {
  methods: {
    getIpLocation () {
      this.$axios.get('http://extreme-ip-lookup.com/json').then(res => {
        console.log(res)
        this.$store.commit('location/updateIpLocation', {
          lat: res.data.lat,
          lng: res.data.lng
        })
      })
    }
  }
}
