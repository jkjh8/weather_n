import { app } from 'electron'
import Datastore from 'nedb-promises'

function dbInit (file) {
  return new Datastore({
    filename: `${app.getPath('userData')}/.db/${file}`,
    timestampData: true,
    autoload: true
  })
}

export default dbInit('setup.db')
