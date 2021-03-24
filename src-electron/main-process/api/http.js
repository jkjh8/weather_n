import { net } from 'electron'

export const getApi = function (UUID) {
  let result
  const request = net.request(`https://us-central1-weatherpicker.cloudfunctions.net/getApi?uuid=${UUID}`)
  request.on('response', (response) => {
    response.on('data', (data) => {
      return data
    })
    response.on('end', () => {
      console.log('No more data in response.')
    })
  })
  request.end()
}
