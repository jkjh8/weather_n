export function updateWeather (state, payload) {
  state.weather = payload
}

export function updateWeatherDetail (state, payload) {
  state.weatherDetail = payload
}

export function updatedAt (state, payload) {
  state.updatedAt = payload
}
