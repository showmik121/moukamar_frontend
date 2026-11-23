// মৌখামার — data layer (data.js-এর পরে, app.js-এর আগে load হয়)
//
// Django backend চালু থাকলে API.useBackend = true (নিচে দেখুন)
// চালু না থাকলে localStorage-এ sample data থেকে কাজ চলে।

const STORE_KEY = 'mk-data-v1';
const SESSION_KEY = 'mk-session';

// যেসব তালিকা ব্যবহারকারী বদলাতে পারে — শুধু এগুলোই সংরক্ষণ হয়
function savedLists() {
  const out = {};
  if (typeof FARMS !== 'undefined') out.FARMS = FARMS;
  if (typeof HIVES !== 'undefined') out.HIVES = HIVES;
  if (typeof INSPECTIONS !== 'undefined') out.INSPECTIONS = INSPECTIONS;
  if (typeof HARVESTS !== 'undefined') out.HARVESTS = HARVESTS;
  if (typeof NOTIFICATIONS !== 'undefined') out.NOTIFICATIONS = NOTIFICATIONS;
  return out;
}

const HIVE_EVENTS = {};
const QUEENS = {};
const USERS = [];

const Store = {
  load() {
    let saved = null;
    try { saved = JSON.parse(localStorage.getItem(STORE_KEY)); } catch (e) { saved = null; }
    if (!saved) return;
    Object.entries(savedLists()).forEach(([name, list]) => {
      if (Array.isArray(saved[name])) list.splice(0, list.length, ...saved[name]);
    });
    Object.assign(HIVE_EVENTS, saved.HIVE_EVENTS || {});
    Object.assign(QUEENS, saved.QUEENS || {});
    USERS.splice(0, USERS.length, ...(saved.USERS || []));
  },

  save() {
    let prev = {};
    try { prev = JSON.parse(localStorage.getItem(STORE_KEY)) || {}; } catch (e) { prev = {}; }
    const out = Object.assign(prev, savedLists(), { HIVE_EVENTS, QUEENS, USERS });
    try { localStorage.setItem(STORE_KEY, JSON.stringify(out)); } catch (e) {}
  },

  reset() {
    try { localStorage.removeItem(STORE_KEY); } catch (e) {}
    location.reload();
  },

  nextId(list) {
    return list.reduce((m, x) => Math.max(m, Number(x.id) || 0), 0) + 1;
  },

  addHiveEvent(code, type, color, text) {
    (HIVE_EVENTS[code] = HIVE_EVENTS[code] || []).unshift([todayShort(), type, color, text]);
  }
};

// ---- লগ ইন session ----
const Session = {
  get() {
    try { return JSON.parse(localStorage.getItem(SESSION_KEY)); } catch (e) { return null; }
  },
  set(user) {
    try { localStorage.setItem(SESSION_KEY, JSON.stringify(user)); } catch (e) {}
  },
  clear() {
    try { localStorage.removeItem(SESSION_KEY); } catch (e) {}
  }
};

// demo ব্যবহারকারী (backend না থাকলে)
const DEMO_USERS = [
  { phone: '01712345678', password: 'demo1234', role: 'farmer', name: 'রহিম উদ্দিন', district: 'সিরাজগঞ্জ', upazila: 'উল্লাপাড়া', farm: 'রহিম মৌখামার', exp: 8 },
  { phone: '01812345678', password: 'demo1234', role: 'cropper', name: 'মো. আলমগীর', district: 'সিরাজগঞ্জ', upazila: 'উল্লাপাড়া', crop: 'সরিষা' }
];

function findUser(phone) {
  return USERS.find((u) => u.phone === phone) || DEMO_USERS.find((u) => u.phone === phone);
}

function validPhone(p) {
  return /^01[3-9]\d{8}$/.test(String(p).replace(/[^\d]/g, ''));
}

// ---- আজকের তারিখ বাংলায় ----
const BN_MONTHS = ['জানুয়ারি','ফেব্রুয়ারি','মার্চ','এপ্রিল','মে','জুন','জুলাই','আগস্ট','সেপ্টেম্বর','অক্টোবর','নভেম্বর','ডিসেম্বর'];
const BN_MONTHS_SHORT = ['জানু','ফেব্রু','মার্চ','এপ্রি','মে','জুন','জুলাই','আগ','সেপ্টে','অক্টো','নভে','ডিসে'];
const BN_DAYS = ['রবিবার','সোমবার','মঙ্গলবার','বুধবার','বৃহস্পতিবার','শুক্রবার','শনিবার'];
const toBnDigits = (s) => String(s).replace(/[0-9]/g, (d) => '০১২৩৪৫৬৭৮৯'[d]);

function todayLong(d = new Date()) {
  return `${BN_DAYS[d.getDay()]}, ${toBnDigits(d.getDate())} ${BN_MONTHS[d.getMonth()]} ${toBnDigits(d.getFullYear())}`;
}
function todayShort(d = new Date()) {
  return `${toBnDigits(d.getDate())} ${BN_MONTHS_SHORT[d.getMonth()]} ${toBnDigits(d.getFullYear())}`;
}
function greeting(d = new Date()) {
  const h = d.getHours();
  if (h < 5) return 'শুভ রাত্রি';
  if (h < 12) return 'শুভ সকাল';
  if (h < 16) return 'শুভ দুপুর';
  if (h < 19) return 'শুভ বিকেল';
  return 'শুভ সন্ধ্যা';
}

// ---- Django API ----
// Django backend: http://127.0.0.1:8000
// Electron দিয়ে চালালে MK_BACKEND_URL=http://127.0.0.1:8000 npm start
//
// API Endpoints:
//   POST   /api/auth/login/            { phone, password }  → { user }
//   POST   /api/auth/register/         { name, phone, password, role, ... }
//   POST   /api/auth/logout/
//   GET    /api/auth/me/               → বর্তমান ব্যবহারকারী
//   PATCH  /api/auth/me/               প্রোফাইল আপডেট
//   GET    /api/dashboard/             → সারাংশ তথ্য
//   GET    /api/farms/                 POST /api/farms/
//   GET    /api/hives/?farm=<id>       POST /api/hives/
//   GET    /api/hives/<code>/
//   POST   /api/inspections/           পরিদর্শন যোগ
//   GET    /api/harvests/              POST /api/harvests/
//   GET    /api/notifications/
//   POST   /api/notifications/read-all/
//   POST   /api/spray-alerts/          স্প্রে নোটিশ
//   GET    /api/community/posts/       POST
//   POST   /api/community/posts/<id>/upvote/
//   POST   /api/community/posts/<id>/comments/
//   GET    /api/diseases/   /api/flora/   /api/farmers/

const API = {
  // ডেস্কটপ অ্যাপে backend URL Electron থেকে পাওয়া যায় অথবা ডিফল্ট লোকালহোস্ট
  get useBackend() {
    return true;
  },
  get base() {
    if (window._backendUrl) return window._backendUrl.replace(/\/$/, '') + '/api/';
    if (window.location && window.location.protocol === 'http:') return '/api/';
    return 'http://127.0.0.1:8000/api/';
  },

  csrfToken() {
    const m = document.cookie.match(/(?:^|;\s*)csrftoken=([^;]+)/);
    return m ? decodeURIComponent(m[1]) : '';
  },

  async request(method, path, body) {
    const res = await fetch(this.base + path.replace(/^\//, ''), {
      method,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': this.csrfToken(),
        Accept: 'application/json'
      },
      body: body ? JSON.stringify(body) : undefined
    });
    const data = res.status === 204 ? null : await res.json().catch(() => null);
    if (!res.ok) throw Object.assign(new Error((data && (data.detail || data.error)) || res.statusText), { status: res.status, data });
    return data;
  },
  get(path) { return this.request('GET', path); },
  post(path, body) { return this.request('POST', path, body); },
  patch(path, body) { return this.request('PATCH', path, body); },
  del(path) { return this.request('DELETE', path); }
};

Store.load();
