// মৌখামার — Electron Desktop App (main.js)
// অ্যাপের পাতাগুলো Django backend থেকে খোলে (একই origin), তাই আগে backend চালু করুন।
// অন্য ঠিকানায় backend থাকলে: $env:MK_BACKEND_URL="http://..."; npm start

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

// file:// থেকে খুললে ব্রাউজার session cookie রাখে না আর CSRF Origin 'null' হয় —
// তাই পাতাগুলো সবসময় backend-এর ঠিকানা থেকে খোলা হয়
const BACKEND_URL = (process.env.MK_BACKEND_URL || 'http://127.0.0.1:8000').replace(/\/$/, '');
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
  return url.startsWith(BACKEND_URL + '/') || url.startsWith('data:');
}

// backend চালু না থাকলে খালি সাদা পর্দার বদলে এই বার্তা
function offlinePage() {
  const html = `<!doctype html><html lang="bn"><meta charset="utf-8"><title>মৌখামার</title>
  <body style="font-family:'Nirmala UI',sans-serif;background:#F5F3EC;color:#1F1B16;display:grid;place-items:center;height:100vh;margin:0">
  <div style="max-width:460px;text-align:center">
    <h2>সার্ভারের সাথে সংযোগ হচ্ছে না</h2>
    <p>মৌখামারের backend (${BACKEND_URL}) চালু নেই। <b>moukamar_backend</b> ফোল্ডারে
    <code>run-backend.bat</code> চালিয়ে আবার চেষ্টা করুন।</p>
    <p><a href="${BACKEND_URL}/index.html" style="display:inline-block;padding:10px 18px;border-radius:10px;background:#F2B632;color:#1F1B16;text-decoration:none;font-weight:600">আবার চেষ্টা করুন</a></p>
  </div></body></html>`;
  return 'data:text/html;charset=utf-8,' + encodeURIComponent(html);
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
      spellcheck: false
      // webSecurity চালু থাকে — পাতা আর API একই origin-এ, তাই CORS শিথিল করার দরকার নেই
    }
  });

  mainWindow.webContents.on('did-fail-load', (event, code, desc, url, isMainFrame) => {
    if (isMainFrame && url.startsWith(BACKEND_URL)) mainWindow.loadURL(offlinePage());
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

  mainWindow.loadURL(BACKEND_URL + '/index.html');

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
  mainWindow.loadURL(BACKEND_URL + '/' + page);
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
