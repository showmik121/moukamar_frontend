// মৌখামার — Electron preload script
// Page গুলো জানতে পারে তারা Electron-এ চলছে এবং Django backend URL পাচ্ছে।

const { contextBridge } = require('electron');

// Django backend URL (ডিফল্ট http://127.0.0.1:8000)
const BACKEND_URL = process.env.MK_BACKEND_URL || 'http://127.0.0.1:8000';

contextBridge.exposeInMainWorld('desktop', {
  isDesktop: true,
  platform: process.platform,
  backendUrl: BACKEND_URL
});

// window._backendUrl সেট করা (store.js এটি ব্যবহার করে)
window.addEventListener('DOMContentLoaded', () => {
  window._backendUrl = BACKEND_URL;
});
