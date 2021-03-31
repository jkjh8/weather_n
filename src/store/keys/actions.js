import Crypto from 'crypto-js'

function decode (data) {
  return Crypto.AES.decrypt(data, 'password').toString(Crypto.enc.Utf8)
}

export function updateData ({ commit }, payload) {
  commit('updateData', decode(payload))
}

export function updateKakao ({ commit }, payload) {
  commit('updateKakao', decode(payload))
}
