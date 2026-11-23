# মৌখামার — Frontend (demo)

মৌচাষ ব্যবস্থাপনা সিস্টেমের frontend। এখন sample data দিয়ে চলে; backend (Django + MySQL) যুক্ত হলে একই page গুলো database থেকে data দেখাবে।

## Desktop app হিসেবে চালানো (Electron)

মৌখামার এখন একটা desktop app — নিজের window-এ চলে, browser লাগে না। ভেতরের frontend একই HTML/CSS/JavaScript।

**একবারই লাগবে:** [Node.js](https://nodejs.org) (LTS) install করুন।

এই folder-এ PowerShell খুলে:
```
npm install
npm start
```
`npm install` প্রথমবার Electron download করে (কয়েক মিনিট লাগতে পারে)। এরপর থেকে শুধু `npm start`।

**Installer (.exe) বানাতে:**
```
npm run dist
```
`dist/` folder-এ `Moukhamar Setup 1.0.0.exe` তৈরি হবে — এটা যেকোনো Windows computer-এ install করা যায়, desktop-এ shortcut আসে।

- Alt চাপলে উপরে menu আসে (জুম, পুরো পর্দা, Developer Tools)
- যোগ করা data app-এর নিজের জায়গায় থাকে, app বন্ধ করলেও মোছে না
- Django backend চালু হলে: `$env:MK_BACKEND_URL="http://127.0.0.1:8000"; npm start` দিয়ে চালালে app সরাসরি Django server-এর page খুলবে

## Browser-এ চালানো

**সবচেয়ে সহজ:** folder-এর `index.html` ফাইলে double-click করুন — ব্রাউজারে খুলে যাবে।

**VS Code থেকে (পরামর্শ):**
1. VS Code-এ এই folder খুলুন
2. "Live Server" extension install করুন
3. `index.html`-এ right-click → **Open with Live Server**

**অথবা terminal থেকে:**
```
python -m http.server 8000
```
তারপর ব্রাউজারে `http://localhost:8000` খুলুন।

> Bangla font (Hind Siliguri) internet থেকে আসে। Internet না থাকলেও চলবে, তখন Windows-এর Nirmala UI font দেখাবে।

## লগ ইন (demo)

| কে | মোবাইল | পাসওয়ার্ড |
|---|---|---|
| খামারি | 01712345678 | demo1234 |
| কৃষক | 01812345678 | demo1234 |

লগ ইন page-এ "demo তথ্য বসান" চাপলেও বসে যায়। লগ ইন ছাড়া ভেতরের কোনো page খুললে লগ ইন page-এ ফিরিয়ে দেয়। "নিবন্ধন করুন" দিয়ে নতুন খামারি বা কৃষকও বানানো যায়।

## Page গুলো

| ফাইল | Page | কী দেখায় |
|---|---|---|
| `index.html` | লগ ইন | খামারি বা কৃষক হিসেবে ঢোকা; মোবাইল নম্বর যাচাই |
| `register.html` | নিবন্ধন | নতুন খামারি/কৃষক; জেলা বাছলে উপজেলা বদলায় |
| `profile.html` | প্রোফাইল | নিজের তথ্য ও পাসওয়ার্ড বদলানো; `?farmer=নাম` দিলে অন্য খামারির প্রোফাইল |
| `dashboard.html` | ড্যাশবোর্ড | সারাংশ, মাসভিত্তিক মধু, সতর্কতা, খামারের তালিকা |
| `hives.html` | খামার ও বাক্স | খামার অনুযায়ী বাক্সের তালিকা, নতুন খামার ও নতুন বাক্স যোগ |
| `hive.html` | বাক্সের বিস্তারিত | রানী (নতুন রানী বসানো/বদল), বাক্সে মধু, পরিদর্শন, মধু সংগ্রহ, বাক্স সরানো, ইতিহাস |
| `inspections.html` | পরিদর্শন | নতুন পরিদর্শন, সব পরিদর্শনের তালিকা, বাকি পরিদর্শন, পাওয়া রোগ |
| `harvests.html` | মধু সংগ্রহ | নতুন সংগ্রহ, মৌসুম অনুযায়ী তালিকা, সেরা বাক্স |
| `diseases.html` | রোগ ও শত্রু | নাম বা লক্ষণ লিখে রোগ খোঁজা; ১২টা রোগ/শত্রুর কারণ, ছড়ানো, লক্ষণ, ধাপে ধাপে চিকিৎসা, প্রতিরোধ; এলাকার রোগের খবর |
| `bees.html` | মৌমাছি পরিচিতি | বাংলাদেশের ৪ প্রকার মধু মৌমাছি, কলোনির ৩ সদস্য, জীবনচক্র, কর্মীর কাজ |
| `calendar.html` | ফুলের ক্যালেন্ডার | সারা বছরের ফুল, এই মাসে কোথায় ফুল |
| `directory.html` | খামারি তালিকা | জেলা/উপজেলা/ফুল দিয়ে filter |
| `alerts.html` | সতর্কতা | স্প্রে ও রোগের সতর্কতা, কৃষকের স্প্রে-র খবর দেওয়ার form |

## Menu-র ভাগ

- **সারাংশ:** ড্যাশবোর্ড
- **খামার ব্যবস্থাপনা:** খামার ও বাক্স, পরিদর্শন, মধু সংগ্রহ
- **তথ্য ও সহায়তা:** রোগ ও লক্ষণ, ফুলের ক্যালেন্ডার
- **খামারি নেটওয়ার্ক:** খামারি তালিকা, সতর্কতা

Sidebar নিজের জায়গায় স্থির থাকে, শুধু ডান দিকের অংশ scroll হয়। উপরের বাম কোণের তীর বোতাম দিয়ে sidebar ছোট (শুধু icon) করা যায়। উপরের খোঁজার ঘরে বাক্সের code (যেমন MK-014) লিখে Enter দিলে সেই বাক্সে চলে যায়; `/` চাপলে খোঁজার ঘরে যায়।

## Demo-তে যা চেষ্টা করে দেখাবেন

- **লক্ষণ দিয়ে রোগ খোঁজা:** রোগ ও লক্ষণ page-এ লক্ষণ বাছলে/বাদ দিলে ফলাফল সাথে সাথে বদলায়
- **স্প্রে সতর্কতা:** সতর্কতা page-এ কৃষকের form পূরণ করে "খবর পাঠান" — নতুন সতর্কতা তালিকায় যোগ হয় (backend-এ এটা MySQL trigger করবে)
- **মধু সংগ্রহ:** বাক্সের page-এ আর্দ্রতা ৩০%-এর বেশি দিলে আটকে দেয় (backend-এ CHECK constraint)
- **বাক্স সরানো:** বাক্সের page-এ "অন্য খামারে সরান" (backend-এ stored procedure + transaction)
- **নতুন বাক্স:** খামার ও বাক্স page-এ "+ নতুন বাক্স"
- **খামারি filter:** জেলা বাছলে উপজেলার তালিকা বদলায়

যোগ করা data ব্রাউজারে (localStorage) সংরক্ষণ হয়, তাই page রিলোড করলেও থাকে। আবার শুরুর sample data-য় ফিরতে: উপরের ডান কোণে নাম → **demo data আগের মতো করুন**।

## Folder

```
moukhamar-frontend/
├── main.js                    # desktop app (Electron) — window, menu
├── preload.js                 # page আর desktop-এর মাঝের নিরাপদ সংযোগ
├── package.json               # npm start / npm run dist
├── build/icon.png             # app-এর icon
├── index.html … profile.html  # ১৩টা page
├── css/style.css              # সব design (রং, layout)
└── js/
    ├── data.js                # sample data (পরে MySQL থেকে আসবে)
    ├── store.js               # data সংরক্ষণ, লগ ইন session, Django API-র সংযোগ
    └── app.js                 # sidebar, উপরের bar, বাংলা সংখ্যা, ছোট বার্তা

প্রতিটা page-এ script-এর ক্রম: data.js → store.js → app.js → page-এর নিজের script
```

## Backend-এ যাওয়ার সময়

- প্রতিটা `.html` একটা Django template হবে; sidebar যাবে `base.html`-এ
- `css/` আর `js/app.js` যাবে Django-র `static/` folder-এ
- `data.js`-এর প্রতিটা অংশের উপরে লেখা আছে কোন table থেকে data আসবে
- `store.js`-এ যে API endpoint গুলো বানাতে হবে তার পুরো তালিকা আছে (login, register, farms, hives, inspections, harvests, spray-alerts …)
- Django তৈরি হলে `store.js`-এ `API.useBackend = true` করুন — লগ ইন, নিবন্ধন আর প্রোফাইল form তখন সরাসরি Django-তে যাবে; CSRF token নিজে থেকে পাঠানো হয়
