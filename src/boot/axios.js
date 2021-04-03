import Vue from 'vue'
import axios from 'axios'

Vue.prototype.$axios = axios

const api = axios.create({
  baseURL: 'https://us-central1-weatherpicker.cloudfunctions.net'
})
// http://localhost:5001/weatherpicker/us-central1
// 'https://us-central1-weatherpicker.cloudfunctions.net'
const apiData = axios.create({
  baseURL: process.env.DEV ? '' : 'http://apis.data.go.kr'
})

export { axios, api, apiData }
