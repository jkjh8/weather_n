import { api } from '../../boot/axios'
const db = require('electron').remote.getGlobal('db')

// const instance = axios.create({
//   baseURL: 'https://us-central1-weatherpicker.cloudfunctions.net'
// })

export async function updateStations ({ commit }) {
  try {
    const uuid = await db.keys.findOne({ id: 'uuid' })
    const r = await api.get(`/getStations?uuid=${uuid.value}`)
    if (r) {
      console.log('r', r)
    }
  } catch (error) {
    console.log('station update error', error)
  }
}
