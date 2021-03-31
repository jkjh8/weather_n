import { app, BrowserWindow, ipcMain, net, nativeTheme } from 'electron'
import path from 'path'
// const http = require('./api/http')
// import db from './api/db'

// global.db = db

import low from 'lowdb'
import FileAsync from 'lowdb/adapters/FileAsync'
let db

async function dbInit () {
  const adapter = new FileAsync(path.join(app.getPath('userData'), '/.db/db.json'))
  db = await low(adapter)
  db.defaults({ stations: [], keys: [], location: [], setup: [] }).write()
  global.db = db
}

dbInit()

try {
  if (process.platform === 'win32' && nativeTheme.shouldUseDarkColors === true) {
    require('fs').unlinkSync(require('path').join(app.getPath('userData'), 'DevTools Extensions'))
  }
} catch (_) { }

/**
 * Set `__statics` path to static files in production;
 * The reason we are setting it here is that the path needs to be evaluated at runtime
 */
if (process.env.PROD) {
  global.__statics = __dirname
}

let mainWindow
global.mainWindow = mainWindow

function createWindow () {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 600,
    useContentSize: true,
    webPreferences: {
      // Change from /quasar.conf.js > electron > nodeIntegration;
      // More info: https://quasar.dev/quasar-cli/developing-electron-apps/node-integration
      nodeIntegration: process.env.QUASAR_NODE_INTEGRATION,
      nodeIntegrationInWorker: process.env.QUASAR_NODE_INTEGRATION

      // More info: /quasar-cli/developing-electron-apps/electron-preload-script
      // preload: path.resolve(__dirname, 'electron-preload.js')
    }
  })

  mainWindow.loadURL(process.env.APP_URL)

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

app.on('ready', () => {
  createWindow()
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

ipcMain.on('weather', (e, query) => {
  const req = net.request(query)
  req.on('response', (response) => {
    response.on('data', (chunk) => {
      mainWindow.webContents.send('weather', JSON.parse(chunk.toString()))
    })
  })
  req.end()
})
