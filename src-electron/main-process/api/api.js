import { BrowserWindow } from 'electron'

export default {
  sendWindow: function (addr, data) {
    const windows = BrowserWindow.getAllWindows()
    windows.forEach(win => {
      if (win) {
        win.webContents.send(addr, data)
      }
    })
  }
}
