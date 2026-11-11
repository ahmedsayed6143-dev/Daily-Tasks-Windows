const { app, BrowserWindow, shell, Tray, Menu } = require('electron');
const path = require('path');

let mainWindow = null;
let tray = null;
let isQuitting = false;

function showMainWindow() {
  if (!mainWindow || mainWindow.isDestroyed()) {
    createWindow();
    return;
  }
  if (mainWindow.isMinimized()) mainWindow.restore();
  mainWindow.show();
  mainWindow.focus();
}

function createTray() {
  if (tray) return;

  tray = new Tray(path.join(__dirname, 'build', 'icon.ico'));
  tray.setToolTip('Daily Tasks');
  tray.setContextMenu(Menu.buildFromTemplate([
    { label: 'Open Daily Tasks', click: showMainWindow },
    { type: 'separator' },
    { label: 'Exit', click: () => {
      isQuitting = true;
      app.quit();
    } }
  ]));
  tray.on('double-click', showMainWindow);
}

function createWindow() {
  const win = new BrowserWindow({
    width: 1440,
    height: 920,
    minWidth: 980,
    minHeight: 680,
    show: false,
    autoHideMenuBar: true,
    backgroundColor: '#0b0b12',
    title: 'Daily Tasks',
    icon: path.join(__dirname, 'build', 'icon.ico'),
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true
    }
  });
  mainWindow = win;
  win.loadFile(path.join(__dirname, 'index.html'));
  win.once('ready-to-show', () => win.show());
  win.on('close', (event) => {
    if (!isQuitting) {
      event.preventDefault();
      win.hide();
    }
  });
  win.on('closed', () => {
    if (mainWindow === win) mainWindow = null;
  });
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('https://') || url.startsWith('http://')) shell.openExternal(url);
    return { action: 'deny' };
  });
}

app.whenReady().then(() => {
  app.setAppUserModelId('com.dailytasks.desktop');
  createTray();
  createWindow();
  app.on('activate', showMainWindow);
});

app.on('before-quit', () => {
  isQuitting = true;
});

app.on('window-all-closed', () => {
  // Keep the process alive so the app remains available from the system tray.
});
