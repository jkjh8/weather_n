import { net } from 'electron'
import api from './api'

export const getApi = function (UUID) {
  const result = {}
  const request = net.request(`https://us-central1-weatherpicker.cloudfunctions.net/getApi?uuid=${encodeURIComponent(UUID)}`)
  // const request = net.request(`http://localhost:5001/weatherpicker/us-central1/getApi?uuid=${encodeURIComponent(UUID)}`)
  request.on('response', (response) => {
    result.statusCode = response.statusCode
    response.on('data', (data) => {
      if (result.statusCode === 200) result.data = JSON.parse(data.toString())
      console.log(result)
      api.sendWindow('recvKey', result)
    })
    response.on('end', () => {
      console.log('No more data in response.')
    })
  })
  request.end()
}

export const getStations = function (UUID) {
  const result = {}
  const request = net.request(`https://us-central1-weatherpicker.cloudfunctions.net/getStation?uuid=${encodeURIComponent(UUID)}`)
  // const request = net.request(`http://localhost:5001/weatherpicker/us-central1/getStation?uuid=${encodeURIComponent(UUID)}`)
  request.on('response', (response) => {
    result.statusCode = response.statusCode
    response.on('data', (data) => {
      if (result.statusCode === 200) {
        console.log(JSON.parse(data.toString()))
        // result.data = JSON.parse(data.toString())
        // api.sendWindow('recvStations', result)
      }
    })
    response.on('end', () => {
      console.log('No more data in response.')
    })
  })
  request.end()
}
