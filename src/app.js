(function () {
  'use strict'

  const electron = require('electron')
  const app = electron.app
  const BrowserWindow = electron.BrowserWindow
  const client = require('electron-connect').client

  const express = require('express')
  const path = require('path')
  const logger = require('morgan')
  const cookieParser = require('cookie-parser')
  const bodyParser = require('body-parser')
  const skipMap = require('skip-map')
  const expressApp = express()
  const debug = require('debug')('express-test:server')
  const http = require('http')
  const port = process.env.PORT || '3000'
  let server

  function onListening () {
    let addr = server.address()
    let bind = typeof addr === 'string'
          ? 'pipe ' + addr
          : 'port ' + addr.port
    debug('Listening on ' + bind)

    mainWindow.loadURL('http://127.0.0.1:3000')

        // Use Electron Connect when developing for live reloading, and show the devtools
    if (process.env.NODE_ENV === 'development') {
      mainWindow.toggleDevTools()
      client.create(mainWindow)
    };
  }

  let mainWindow = null

  app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
      app.quit()
    }
  })

  const Menu = electron.Menu;

  let pluginName
  switch (process.platform) {
    case 'win32':
      pluginName = 'pepflashplayer.dll'
      break
    case 'darwin':
      pluginName = 'PepperFlashPlayer.plugin'
      break
    case 'linux':
      pluginName = 'libpepflashplayer.so'
      break
  }

  app.commandLine.appendSwitch('ppapi-flash-path', path.join(__dirname, pluginName));

  app.on('ready', function () {
    mainWindow = new BrowserWindow({
      autoHideMenuBar: true,
      webPreferences: {
        nodeIntegration: true,
        plugins: true
      },
      width: 1200,
      height: 900
    })

    mainWindow.loadURL('http://www.adobe.com/software/flash/about/');

    expressApp.use(skipMap())
    expressApp.use(express.static(path.join(__dirname, 'www')))
    expressApp.use(express.static(path.join(__dirname, 'node_modules')))
    expressApp.use(logger('dev'))
    expressApp.use(bodyParser.json())
    expressApp.use(bodyParser.urlencoded({ extended: false }))
    expressApp.use(cookieParser())
    expressApp.set('port', port)
    expressApp.get('/', function (req, res) {
      res.sendFile(path.join(path.join(__dirname, '/index.html')))
    })

    server = http.createServer(expressApp)
    server.listen(port)
    server.on('listening', onListening)

    mainWindow.on('closed', function () {
      mainWindow = null
      server.close()
    })
    let template = [{
      label: "Application",
      submenu: [
        { label: "About Application", selector: "orderFrontStandardAboutPanel:" },
        { type: "separator" },
        { label: "Quit", accelerator: "Command+Q", click: function() { app.quit(); }}
      ]}, {
      label: "Edit",
      submenu: [
        { label: "Undo", accelerator: "CmdOrCtrl+Z", selector: "undo:" },
        { label: "Redo", accelerator: "Shift+CmdOrCtrl+Z", selector: "redo:" },
        { type: "separator" },
        { label: "Cut", accelerator: "CmdOrCtrl+X", selector: "cut:" },
        { label: "Copy", accelerator: "CmdOrCtrl+C", selector: "copy:" },
        { label: "Paste", accelerator: "CmdOrCtrl+V", selector: "paste:" },
        { label: "Select All", accelerator: "CmdOrCtrl+A", selector: "selectAll:" }
      ]}
    ];

    Menu.setApplicationMenu(Menu.buildFromTemplate(template));
  })
}())
// # sourceMappingURL=app.js.map
