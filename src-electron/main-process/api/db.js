import { app } from 'electron'
import Datastore from 'nedb-promises'

function dbInit (file) {
  return new Datastore({
    filename: `${app.getPath('userData')}/.db/${file}`,
    timestampData: true,
    autoload: true
  })
}

export default {
  setup: dbInit('setup.db'),
  dust: dbInit('dust.db'),
  weather: dbInit('weather.db'),
  stations: dbInit('stations.db'),
  location: dbInit('location.db'),
  keys: dbInit('auth.db')
}
