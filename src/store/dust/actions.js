import moment from 'moment'

export function updateDust ({ commit }, payload) {
  const now = moment().format('YYYY-MM-DD hh:mm:ss a')
  commit('updateDust', payload)
  commit('updatedAt', now)
}
