export function updateData (state, payload) {
  console.log(payload.key)
  state.dataKey = payload
}

export function updateNaver (state, payload) {
  state.naverId = payload.id
}

export function updateKakao (state, payload) {
  state.kakaoKey = payload
}
