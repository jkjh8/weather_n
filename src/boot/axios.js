import Vue from 'vue'
import axios from 'axios'

Vue.prototype.$axios = axios

const api = axios.create({
  baseURL: 'https://us-central1-weatherpicker.cloudfunctions.net'
})

export { axios, api }
