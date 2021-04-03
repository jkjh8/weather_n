import moment from 'moment'
const db = require('electron').remote.getGlobal('db')

export function updateWeather ({ commit }, payload) {
  const weather = {
    time: moment(payload[0].baseDate).format('YYYY-MM-DD ') + payload[0].baseTime.substr(0, 2) + ':00',
    nx: payload[0].nx,
    ny: payload[0].ny
  }
  payload.forEach(item => {
    weather[item.category] = item.obsrValue
  })
  commit('updateWeather', weather)
  let detail
  switch (weather.PTY) {
    case '0':
      detail = { time: weather.time, temp: weather.T1H, name: '맑음', icon: 'las la-sun', color: 'red' }
      break
    case '1':
      detail = { time: weather.time, temp: weather.T1H, name: '비', icon: 'las la-umbrella', color: 'blue' }
      break
    case '2':
      detail = { time: weather.time, temp: weather.T1H, name: '비/눈', icon: 'las la-cloud-rain', color: 'teal' }
      break
    case '3':
      detail = { time: weather.time, temp: weather.T1H, name: '눈', icon: 'las la-snowflake', color: 'black' }
      break
    case '4':
      detail = { time: weather.time, temp: weather.T1H, name: '소나기', icon: 'las la-cloud-showers-heavy', color: 'blue' }
      break
    case '5':
      detail = { time: weather.time, temp: weather.T1H, name: '빗방울', icon: 'las la-cloud-rain', color: 'blue' }
      break
    case '6':
      detail = { time: weather.time, temp: weather.T1H, name: '빗방울/눈날림', icon: 'las la-snowflake', color: 'black' }
      break
    case '7':
      detail = { time: weather.time, temp: weather.T1H, name: '눈날림', icon: 'las la-snowflake', color: 'teal' }
      break
  }
  commit('updateWeatherDetail', detail)
  const now = moment().format('YYYY-MM-DD hh:mm:ss a')
  commit('updatedAt', now)
  db.weather.update({ id: 'weather' }, { $set: { value: payload } }, { upsert: true })
  db.weather.update({ id: 'weatherSumm' }, { $set: { value: weather } }, { upsert: true })
  db.weather.update({ id: 'weatherDetail' }, { $set: { value: detail } }, { upsert: true })
}
