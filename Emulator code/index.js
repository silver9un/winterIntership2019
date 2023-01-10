const {app, BrowserWindow} = require('electron');

fs = require('fs');

let win

function createWindow () {

  app.server = require(__dirname + '/server.js')

  win = new BrowserWindow({
    width: 600,
    height: 800,
    resizable: false,
    show: false
  });
  win.loadURL('http://localhost:8080/bridge');
  win.once('ready-to-show', () => {
    win.show();
  });

  win.focus();

  win.on('closed', () => {
    win = null
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
})

app.on('activate', () => {
  if (win === null) {
    createWindow();
  }
})