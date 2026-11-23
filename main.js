// মৌখামার — Electron Desktop App (main.js)
// Django backend চালু থাকলে MK_BACKEND_URL=http://127.0.0.1:8000 npm start
// শুধু HTML ফাইল দিয়ে চালাতে: npm start

const { app, BrowserWindow, Menu, shell, session, ipcMain } = require('electron');
const path = require('path');

// .env লোড করা
const fs = require('fs');
const envPath = path.join(__dirname, '.env');
if (fs.existsSync(envPath)) {
  fs.readFileSync(envPath, 'utf8').split(/\r?\n/).forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const idx = trimmed.indexOf('=');
      if (idx !== -1) {
        const key = trimmed.substring(0, idx).trim();
        const val = trimmed.substring(idx + 1).trim();
        if (!process.env[key]) process.env[key] = val;
      }
    }
  });
}

const BACKEND_URL = process.env.MK_BACKEND_URL || '';   // খালি = local HTML ফাইল
const isMac = process.platform === 'darwin';

let mainWindow = null;

// একবারে একটাই app খোলা থাকবে
if (!app.requestSingleInstanceLock()) {
  app.quit();
} else {
  app.on('second-instance', () => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
  });
}

function isAppUrl(url) {
  if (url.startsWith('file://')) return true;
  return BACKEND_URL && url.startsWith(BACKEND_URL);
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1360,
    height: 860,
    minWidth: 980,
    minHeight: 640,
    title: 'মৌখামার',
    icon: path.join(__dirname, 'build', 'icon.png'),
    backgroundColor: '#F5F3EC',
    show: false,
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,         // preload-এ BACKEND_URL পাঠাতে sandbox বন্ধ রাখতে হয়
      spellcheck: false,
      // Django API call-এর জন্য CORS নিরাপত্তা শিথিল
      webSecurity: BACKEND_URL ? false : true
    }
  });

  mainWindow.once('ready-to-show', () => {
    mainWindow.maximize();
    mainWindow.show();
  });

  // বাইরের link সাধারণ ব্রাউজারে খুলবে
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (/^https?:/.test(url)) shell.openExternal(url);
    return { action: 'deny' };
  });
  mainWindow.webContents.on('will-navigate', (event, url) => {
    if (!isAppUrl(url)) {
      event.preventDefault();
      if (/^https?:/.test(url)) shell.openExternal(url);
    }
  });

  if (BACKEND_URL) {
    mainWindow.loadURL(BACKEND_URL + '/');
  } else {
    mainWindow.loadFile(path.join(__dirname, 'index.html'));
  }

  mainWindow.on('closed', () => { mainWindow = null; });
}

function buildMenu() {
  const template = [
    ...(isMac ? [{ role: 'appMenu' }] : []),
    {
      label: 'ফাইল',
      submenu: [
        { label: 'ড্যাশবোর্ড', accelerator: 'CmdOrCtrl+D', click: () => go('dashboard.html') },
        { label: 'অ্যাডমিন ড্যাশবোর্ড', accelerator: 'CmdOrCtrl+A', click: () => go('admin.html') },
        { label: 'লগ ইন', click: () => go('index.html') },
        { type: 'separator' },
        { label: 'বন্ধ করুন', role: isMac ? 'close' : 'quit' }
      ]
    },
    {
      label: 'দেখুন',
      submenu: [
        { label: 'আবার লোড করুন', role: 'reload' },
        { type: 'separator' },
        { label: 'বড় করুন', role: 'zoomIn' },
        { label: 'ছোট করুন', role: 'zoomOut' },
        { label: 'স্বাভাবিক আকার', role: 'resetZoom' },
        { type: 'separator' },
        { label: 'পুরো পর্দা', role: 'togglefullscreen' },
        { label: 'Developer Tools', role: 'toggleDevTools' }
      ]
    },
    {
      label: 'সাহায্য',
      submenu: [
        { label: 'মৌখামার সম্পর্কে', click: () => go('bees.html') }
      ]
    }
  ];
  Menu.setApplicationMenu(Menu.buildFromTemplate(template));
}

function go(page) {
  if (!mainWindow) return;
  if (BACKEND_URL) {
    // Django URL-এ যাওয়া (HTML extension ছাড়া)
    const slug = page.replace('.html', '');
    mainWindow.loadURL(BACKEND_URL + '/' + slug + '/');
  } else {
    mainWindow.loadFile(path.join(__dirname, page));
  }
}

app.whenReady().then(() => {
  app.setAppUserModelId('bd.moukhamar.app');

  // OpenStreetMap-এর tile ও Nominatim header
  session.defaultSession.webRequest.onBeforeSendHeaders(
    { urls: ['https://tile.openstreetmap.org/*', 'https://nominatim.openstreetmap.org/*', 'https://*.tile.opentopomap.org/*'] },
    (details, done) => {
      details.requestHeaders['User-Agent'] = 'Moukhamar/1.0 (beekeeping desktop app)';
      done({ requestHeaders: details.requestHeaders });
    }
  );

  buildMenu();
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (!isMac) app.quit();
});
