export default `const { app, BrowserWindow } = require('electron')

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
  })
  if (process.env.REACT_APP_ENV === 'dev') {
    win.webContents.openDevTools();
    win.loadURL('{{&local}}');
  } else {
    win.loadFile('{{&buildName}}/index.html')
  }
}

app.whenReady().then(() => {
  createWindow()
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
`;
