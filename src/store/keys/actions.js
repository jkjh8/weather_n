import Crypto from 'crypto-js'

function decode (data) {
  return Crypto.AES.decrypt(data, 'password').toString(Crypto.enc.Utf8)
}

export function updateData ({ commit }, payload) {
  const key = decode(payload.key)
  commit('updateData', key)
}

export function updateKakao ({ commit }, payload) {
  const kakao = { rest: '', js: '' }
  kakao.rest = decode(payload.rest)
  kakao.js = decode(payload.js)
  commit('updateKakao', kakao)
}
