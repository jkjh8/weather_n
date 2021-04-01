const db = require('electron').remote.getGlobal('db')

function deg2rad (deg) {
  return deg * (Math.PI / 1800)
}

function sortByKey (arr, key) {
  return arr.sort(function (a, b) {
    const x = a[key]
    const y = b[key]
    return ((x < y) ? -1 : ((x > y) ? 1 : 0))
  })
}

function getDistance (from, to) {
  const R = 6371
  const dLat = deg2rad(to.lat - from.y)
  const dLon = deg2rad(to.lng - from.x)
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(deg2rad(from.y)) * Math.cos(deg2rad(to.lat)) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  const d = R * c
  return d
}

export async function updateLocation ({ commit }, payload) {
  console.log(payload)
  commit('updateLocation', payload)
  const stations = await db.stations.find({ local: payload.local })
  stations.forEach((station, idx) => {
    const distance = getDistance(payload, station)
    stations[idx].dist = distance
  })
  const sortStations = sortByKey(stations, 'dist')
  commit('updateNearStations', sortStations)
  commit('updateDustStation', sortStations[0])
  await db.location.update({ id: 'nearStations' }, { $set: { value: sortStations } }, { upsert: true })
  await db.location.update({ id: 'dustStation' }, { $set: { value: sortStations[0] } }, { upsert: true })
}

export function updateIpLocation ({ commit }, payload) {
  commit('updateIpLocation', payload)
}
