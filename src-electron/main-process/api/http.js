import { net } from 'electron'
import api from './api'

/* global mainWindow */
export const getApi = function (UUID) {
  const result = {}
  const request = net.request(`https://us-central1-weatherpicker.cloudfunctions.net/getApi?uuid=${UUID}`)
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
