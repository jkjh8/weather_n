import moment from 'moment'

export function updateWeather ({ commit }, payload) {
  const detail = {
    time: moment(payload[0].baseDate).format('YYYY/MM/DD ') + payload[0].baseTime.substr(0, 2) + ':00',
    nx: payload[0].nx,
    ny: payload[0].ny
  }
  payload.forEach(item => {
    detail[item.category] = item.obsrValue
  })
  commit('updateWeather', detail)
}
