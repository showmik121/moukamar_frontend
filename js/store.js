// মৌখামার — data layer
//
// সব তথ্য Django backend থেকে আসে (একই origin: http://127.0.0.1:8000)।
// আগে বেশিরভাগ পাতা data.js-এর নমুনা তথ্য আর localStorage দিয়ে চলত —
// এখন MK.start() প্রথমে লগ ইন যাচাই করে, তারপর পাতার দরকারি তথ্য API
// থেকে এনে পুরনো global তালিকাগুলোতে (FARMS, HIVES …) একই আকারে বসায়।

const SESSION_KEY = 'mk-session';

// ---- লগ ইন session ----
// শুধু sidebar-এ নাম দেখানোর জন্য cache; আসল লগ ইন Django session cookie-তে।
// পাসওয়ার্ড কখনো এখানে রাখা হয় না।
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
// API-তে পাঠানোর তারিখ: 2026-11-28 (স্থানীয় সময়ে)
function isoDate(d = new Date()) {
  const p = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
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
// সব endpoint-এর তালিকা backend-এর README-তে। পাতা আর API একই origin-এ,
// তাই session cookie আপনা থেকে যায়, আর CSRF token cookie থেকে পড়া যায়।
const API = {
  get base() {
    if (window.location.protocol === 'http:' || window.location.protocol === 'https:') return '/api/';
    // file:// থেকে খুললে (backend ছাড়া) — লগ ইন কাজ করবে না, তবু পথটা দেখানো
    return (window._backendUrl || 'http://127.0.0.1:8000').replace(/\/$/, '') + '/api/';
  },

  csrfToken() {
    const m = document.cookie.match(/(?:^|;\s*)csrftoken=([^;]+)/);
    return m ? decodeURIComponent(m[1]) : '';
  },

  async request(method, path, body) {
    let res;
    try {
      res = await fetch(this.base + path.replace(/^\//, ''), {
        method,
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': this.csrfToken(),
          Accept: 'application/json'
        },
        body: body ? JSON.stringify(body) : undefined
      });
    } catch (e) {
      throw Object.assign(new Error('সার্ভারের সাথে সংযোগ হচ্ছে না — backend চালু আছে কিনা দেখুন'), { status: 0 });
    }
    const data = res.status === 204 ? null : await res.json().catch(() => null);
    if (!res.ok) throw Object.assign(new Error(API.message(data) || res.statusText), { status: res.status, data });
    return data;
  },

  // DRF-এর ভুলের উত্তর থেকে পড়ার মতো প্রথম বার্তা
  message(data) {
    if (!data) return '';
    if (typeof data === 'string') return data;
    if (data.detail) return data.detail;
    for (const v of Object.values(data)) {
      if (Array.isArray(v) && v.length) return typeof v[0] === 'string' ? v[0] : API.message(v[0]);
      if (typeof v === 'string') return v;
    }
    return '';
  },

  get(path) { return this.request('GET', path); },
  post(path, body) { return this.request('POST', path, body || {}); },
  patch(path, body) { return this.request('PATCH', path, body || {}); },
  del(path) { return this.request('DELETE', path); }
};

// ---- backend থেকে আসা সারি → পাতাগুলো যে আকার চেনে ----
const num = (v) => (v === null || v === undefined || v === '' ? null : Number(v));

const MK = {
  // relative সময়: "৩ ঘণ্টা আগে"
  ago(iso) {
    if (!iso) return '';
    const d = new Date(iso);
    const s = Math.max(0, (Date.now() - d.getTime()) / 1000);
    if (s < 60) return 'এইমাত্র';
    if (s < 3600) return toBnDigits(Math.floor(s / 60)) + ' মিনিট আগে';
    if (s < 86400) return toBnDigits(Math.floor(s / 3600)) + ' ঘণ্টা আগে';
    if (s < 86400 * 30) return toBnDigits(Math.floor(s / 86400)) + ' দিন আগে';
    return todayShort(d);
  },
  // '2026-11-20' → '২০ নভে ২০২৬'
  date(iso) {
    if (!iso) return '—';
    const [y, m, d] = String(iso).slice(0, 10).split('-').map(Number);
    return todayShort(new Date(y, m - 1, d));
  },

  map: {
    farm: (r) => ({
      id: r.id, name: r.name, upazila: r.upazila_name || '', district: r.district || '',
      flora: (r.flora || []).join(', ') || '—', floraList: r.flora || [],
      status: r.status, since: r.since, established: r.established_on,
      type: r.farm_type, lat: num(r.lat), lng: num(r.lng),
      hiveCount: r.hive_count, queenless: r.queenless_count
    }),
    // /api/hives/status/ — v_hive_status ভিউ থেকে
    hive: (r) => ({
      id: r.id, code: r.code, farm: r.farm, farmName: r.farm_name, species: r.species,
      frames: r.frames, filled: r.filled, state: r.state,
      queen: r.queen, queenAge: r.queenAge, queenSource: r.queen_source, queenColor: r.queen_color,
      last: r.last, overdue: r.overdue, lastInspection: r.last_inspection,
      honeyKg: num(r.honey_kg) || 0, lastHarvest: r.last_harvest
    }),
    inspection: (r) => ({
      id: r.id, hive: r.hive_code, hiveId: r.hive, date: r.date,
      framesFilled: r.frames_filled, state: r.state,
      queenSeen: r.queen_seen, eggsSeen: r.eggs_seen, notes: r.notes || '',
      inspector: r.inspector_name || '', diseases: r.diseases || []
    }),
    harvest: (r) => ({
      id: r.id, hive: r.hive_code, hiveId: r.hive, date: r.date,
      kg: num(r.kg) || 0, moisture: num(r.moisture), flora: r.flora_name || '', floraId: r.flora,
      notes: r.notes || '', harvester: r.harvester_name || ''
    }),
    notification: (r) => ({
      id: r.id, kind: r.kind, unread: r.unread, title: r.title, body: r.body,
      refTable: r.ref_table, refId: r.ref_id, createdAt: r.created_at, when: MK.ago(r.created_at)
    })
  },

  // পাতার দরকারি তথ্য এনে global তালিকায় বসানো। নাম দিলে সেটাই আনে:
  //   await MK.load('farms', 'hives', 'notifications')
  loaders: {
    farms: async () => fill(FARMS, (await API.get('farms/')).map(MK.map.farm)),
    hives: async () => fill(HIVES, (await API.get('hives/status/')).map(MK.map.hive)),
    notifications: async () => fill(NOTIFICATIONS, (await API.get('notifications/')).map(MK.map.notification)),
    farmers: async () => fill(FARMERS, await API.get('farmers/')),
    inspections: async () => fill(INSPECTIONS, (await API.get('inspections/')).map(MK.map.inspection)),
    harvests: async () => fill(HARVESTS, (await API.get('harvests/')).map(MK.map.harvest)),
    outbreaks: async () => fill(OUTBREAKS, await API.get('outbreaks/')),
    flora: async () => fill(FLORA, await API.get('flora/')),
    diseases: async () => {
      const [list, symptoms] = await Promise.all([API.get('diseases/'), API.get('symptoms/')]);
      fill(DISEASES, list);
      Object.keys(SYMPTOMS).forEach((k) => delete SYMPTOMS[k]);
      Object.assign(SYMPTOMS, symptoms);
    }
  },

  async load(...names) {
    await Promise.all(names.map((n) => {
      if (!MK.loaders[n]) throw new Error('অচেনা loader: ' + n);
      return MK.loaders[n]();
    }));
  },

  // প্রতিটা ভেতরের পাতার শুরু:
  //   MK.start(['farms', 'hives'], () => { ...render... })
  // লগ ইন না থাকলে লগ ইন পাতায় পাঠায়; options.admin দিলে শুধু অ্যাডমিন।
  async start(names, render, options = {}) {
    let me;
    try {
      me = await API.get('auth/me/');
    } catch (e) {
      if (e.status === 401 || e.status === 403) {
        Session.clear();
        const here = location.pathname.split('/').pop() + location.search;
        location.replace('index.html?next=' + encodeURIComponent(here));
        return;
      }
      MK.fail(e);
      return;
    }
    Session.set(me);
    MK.me = me;
    if (options.admin && !MK.isAdmin(me)) {
      location.replace('dashboard.html');
      return;
    }
    try {
      await MK.load(...new Set([...(names || []), 'notifications']));
    } catch (e) {
      MK.fail(e);
      return;
    }
    MK.unread = NOTIFICATIONS.filter((n) => n.unread).length;
    if (typeof renderSidebar === 'function') renderSidebar();
    try {
      await render(me);
    } catch (e) {
      console.error(e);
      MK.fail(e);
    }
  },

  isAdmin(u) {
    return !!u && (u.role === 'admin' || u.is_staff || u.is_superuser);
  },

  // ভুল হলে পাতার উপরে একটা বার্তা
  fail(e) {
    const msg = (e && e.message) || 'কিছু একটা ভুল হয়েছে';
    if (typeof toast === 'function') toast(msg);
    const main = document.querySelector('main') || document.body;
    if (main && !document.getElementById('mk-error')) {
      const div = document.createElement('div');
      div.id = 'mk-error';
      div.className = 'err';
      div.setAttribute('role', 'alert');
      div.style.cssText = 'margin:12px 0;padding:12px 16px;border-radius:10px;background:#FBE9E7;color:#8C2A12';
      div.textContent = msg;
      main.prepend(div);
    }
  }
};

// global তালিকার ভেতরের জিনিস বদলানো (তালিকাটা const, তাই নতুন করে বসানো যায় না)
function fill(list, rows) {
  list.splice(0, list.length, ...(rows || []));
  return list;
}
