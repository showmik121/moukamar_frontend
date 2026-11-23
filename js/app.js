// মৌখামার — সব page-এ ব্যবহৃত সাধারণ JavaScript
// পরে Django-তে sidebar টা base.html template-এ চলে যাবে।

const BN_DIGITS = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];

// ইংরেজি সংখ্যাকে বাংলা সংখ্যায় রূপান্তর: bn(1240) -> "১,২৪০"
function bn(value) {
  const text = typeof value === 'number' ? value.toLocaleString('en-IN') : String(value);
  return text.replace(/[0-9]/g, (d) => BN_DIGITS[Number(d)]);
}

const ICONS = {
  dashboard: '<path d="M3 13h8V3H3zM13 21h8V11h-8zM3 21h8v-6H3zM13 3v6h8V3z"/>',
  map: '<path d="M1 6v16l7-4 8 4 7-4V2l-7 4-8-4-7 4z"/><path d="M8 2v16M16 6v16"/>',
  community: '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/><path d="M8 9h8M8 13h5"/>',
  hives: '<path d="M12 2 21 7v10l-9 5-9-5V7z"/><path d="M3 7l9 5 9-5M12 12v10"/>',
  diseases: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M12 8v4M12 16h.01"/>',
  calendar: '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
  directory: '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>',
  alerts: '<path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>',
  admin: '<rect width="18" height="18" x="3" y="3" rx="2"/><path d="M7 8h10M7 12h10M7 16h6"/>'
};

const NAV = [
  { id: 'dashboard', label: 'ড্যাশবোর্ড', href: 'dashboard.html' },
  { id: 'map', label: 'খামার ম্যাপ', href: 'map.html' },
  { id: 'community', label: 'কমিউনিটি ও সম্পদ', href: 'community.html' },
  { id: 'hives', label: 'খামার ও বাক্স', href: 'hives.html' },
  { id: 'diseases', label: 'রোগ ও লক্ষণ', href: 'diseases.html' },
  { id: 'calendar', label: 'ফুলের ক্যালেন্ডার', href: 'calendar.html' },
  { id: 'directory', label: 'খামারি তালিকা', href: 'directory.html' },
  { id: 'alerts', label: 'সতর্কতা', href: 'alerts.html', count: 3 },
  { id: 'admin', label: 'অ্যাডমিন ড্যাশবোর্ড', href: 'admin.html' }
];

function icon(name, size = 20) {
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[name]}</svg>`;
}

const LOGO = '<svg width="34" height="34" viewBox="0 0 34 34" aria-hidden="true"><path d="M17 2 30 9.5v15L17 32 4 24.5v-15z" fill="#F2B632"/><path d="M17 10 23.5 13.75v7.5L17 25l-6.5-3.75v-7.5z" fill="#1F1B16"/></svg>';

async function handleLogout(e) {
  if (e) e.preventDefault();
  try {
    if (typeof API !== 'undefined' && API.useBackend) {
      await API.post('auth/logout/').catch(() => {});
    }
  } catch (err) {}
  if (typeof Session !== 'undefined') {
    Session.clear();
  } else {
    try { localStorage.removeItem('mk-session'); } catch (err) {}
  }
  window.location.href = 'index.html';
}

function renderSidebar() {
  const side = document.querySelector('.sidebar');
  if (!side) return;
  const active = side.dataset.active;
  const currentUser = (typeof Session !== 'undefined' && Session.get()) ? Session.get() : null;
  const isAdmin = currentUser && (currentUser.role === 'admin' || currentUser.is_staff || currentUser.is_superuser);

  const filteredNav = NAV.filter(n => {
    if (n.id === 'admin') return isAdmin;
    return true;
  });

  const links = filteredNav.map((n) => `
    <a href="${n.href}" class="${n.id === active ? 'active' : ''}" ${n.id === active ? 'aria-current="page"' : ''}>
      ${icon(n.id)}<span>${n.label}</span>${n.count ? `<span class="count">${bn(n.count)}</span>` : ''}
    </a>`).join('');
  
  const userName = currentUser ? currentUser.name : 'রহিম উদ্দিন';
  let userRole = 'খামারি';
  if (currentUser) {
    if (isAdmin) userRole = 'সুপার অ্যাডমিন';
    else if (currentUser.role === 'cropper') userRole = 'কৃষক';
  }
  const userLoc = currentUser && currentUser.district ? ` · ${currentUser.district}` : (currentUser && currentUser.email ? ` · ${currentUser.email}` : ' · সিরাজগঞ্জ');

  side.innerHTML = `
    <a class="brand" href="${isAdmin ? 'admin.html' : 'dashboard.html'}">${LOGO}<span>মৌখামার</span></a>
    <nav class="nav" aria-label="প্রধান মেনু">${links}</nav>
    <div class="me">
      <b>${userName}</b>
      <span>${userRole}${userLoc}</span><br>
      <a href="index.html" id="logoutBtn" style="cursor:pointer;display:inline-block;margin-top:4px">লগ আউট</a>
    </div>`;

  const logoutBtn = side.querySelector('#logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', handleLogout);
  }
}

// নিচে ছোট বার্তা দেখানো (যেমন "সংরক্ষণ হয়েছে")
function toast(message) {
  let el = document.querySelector('.toast');
  if (!el) {
    el = document.createElement('div');
    el.className = 'toast';
    el.setAttribute('role', 'status');
    document.body.appendChild(el);
  }
  el.textContent = message;
  el.classList.add('show');
  clearTimeout(el._timer);
  el._timer = setTimeout(() => el.classList.remove('show'), 2400);
}

// কিছু page পুরনো নাম showToast() ব্যবহার করে
function showToast(message) { toast(message); }

// একটা দলের মধ্যে একটাই বোতাম বাছাই করা যায় (হ্যাঁ/না ধরনের)
function setupSegments() {
  document.querySelectorAll('.seg').forEach((group) => {
    group.addEventListener('click', (e) => {
      const btn = e.target.closest('button');
      if (!btn) return;
      group.querySelectorAll('button').forEach((b) => b.setAttribute('aria-pressed', 'false'));
      btn.setAttribute('aria-pressed', 'true');
    });
  });
}

// data-toast="..." থাকা যেকোনো বোতাম চাপলে বার্তা দেখাবে (backend আসার আগ পর্যন্ত)
// (পরে তৈরি হওয়া বোতামেও কাজ করে, কারণ পুরো document-এ একবার শোনা হয়)
function setupDemoButtons() {
  if (setupDemoButtons.done) return;
  setupDemoButtons.done = true;
  document.addEventListener('click', (e) => {
    const el = e.target.closest('[data-toast]');
    if (!el) return;
    e.preventDefault();
    toast(el.dataset.toast);
  });
}

// script গুলো body-র শেষে আছে, তাই এখনই চালানো যায়
renderSidebar();
setupSegments();
setupDemoButtons();
