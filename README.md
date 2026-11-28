# মৌখামার — Frontend (Electron desktop app)

মৌচাষ ব্যবস্থাপনা সিস্টেমের frontend — HTML/CSS/JavaScript, Electron-এর নিজের window-এ চলে। সব তথ্য আসে Django backend (MySQL) থেকে; কোনো sample data বা localStorage-এ রাখা হিসাব নেই।

## চালানো

**একবারই লাগবে:** [Node.js](https://nodejs.org) (LTS), আর `moukamar_backend` সেট আপ করা (ওই ফোল্ডারের README দেখুন)।

```powershell
# ১. backend চালু করুন — moukamar_backend ফোল্ডারে
.\run-backend.bat

# ২. app চালু করুন — এই ফোল্ডারে (প্রথমবার আগে npm install)
npm install
npm start
```

app-এর পাতাগুলো backend থেকে খোলে (`http://127.0.0.1:8000/index.html`), তাই পাতা আর API একই origin-এ — লগ ইনের session cookie আর CSRF token দুটোই কাজ করে। backend চালু না থাকলে app একটা "সার্ভারের সাথে সংযোগ হচ্ছে না" পাতা দেখায়, সেখানে "আবার চেষ্টা করুন" আছে।

- backend অন্য ঠিকানায় চললে: `$env:MK_BACKEND_URL="http://..."; npm start` (বা `.env`-এ `MK_BACKEND_URL=`)
- Alt চাপলে উপরে menu আসে (জুম, পুরো পর্দা, Developer Tools)
- ব্রাউজারেও চলে: backend চালু রেখে `http://127.0.0.1:8000/` খুলুন। (`index.html`-এ double-click করে `file://` থেকে খুললে লগ ইন কাজ করবে না।)

> Bangla font (Hind Siliguri) internet থেকে আসে। Internet না থাকলে Windows-এর Nirmala UI font দেখায়। ম্যাপের tile-ও internet থেকে আসে।

**Installer (.exe) বানাতে:** `npm run dist` → `dist/` folder-এ setup ফাইল। installer শুধু app-এর window; backend আলাদা করে চালু থাকতে হয়।

## লগ ইন (demo)

backend-এর `python manage.py seed_demo` এই অ্যাকাউন্টগুলো বানায়:

| কে | মোবাইল / ইমেইল | পাসওয়ার্ড |
|---|---|---|
| খামারি | 01712345678 | demo1234 |
| কৃষক | 01812345678 | demo1234 |
| অ্যাডমিন | admin@moukhamar.com | admin1234 |

লগ ইন page-এ "demo তথ্য বসান" চাপলেও বসে যায়। লগ ইন ছাড়া ভেতরের কোনো page খুললে লগ ইন page-এ পাঠায়, লগ ইনের পর আবার সেই page-এ ফেরে। "নিবন্ধন করুন" দিয়ে নতুন খামারি বা কৃষক বানানো যায় — খামারির প্রথম খামারও তখন তৈরি হয়।

## Page গুলো

| ফাইল | Page | কী দেখায় |
|---|---|---|
| `index.html` | লগ ইন | খামারি/কৃষক মোবাইল দিয়ে, অ্যাডমিন ইমেইল দিয়ে |
| `register.html` | নিবন্ধন | নতুন খামারি/কৃষক; জেলা বাছলে উপজেলা বদলায় |
| `profile.html` | প্রোফাইল | নিজের তথ্য ও পাসওয়ার্ড বদলানো; `?farmer=<id>` দিলে অন্য খামারির প্রোফাইল |
| `dashboard.html` | ড্যাশবোর্ড | সারাংশ, মাসভিত্তিক মধু, সতর্কতা, খামারের তালিকা |
| `map.html` | খামার ম্যাপ | সব খামারির অবস্থান; খামারি নিজের খামারের জায়গা ম্যাপে বসাতে পারেন |
| `community.html` | কমিউনিটি ও সম্পদ | ফুলের খবর, প্রশ্ন-উত্তর, পরামর্শ, যন্ত্রপাতি; upvote ও মন্তব্য |
| `hives.html` | খামার ও বাক্স | খামার অনুযায়ী বাক্সের তালিকা, নতুন খামার ও নতুন বাক্স যোগ |
| `hive.html` | বাক্সের বিস্তারিত | `?code=MK-001` — রানী, পরিদর্শন, মধু সংগ্রহ, অন্য খামারে সরানো, ইতিহাস |
| `inspections.html` | পরিদর্শন | নতুন পরিদর্শন, তালিকা, বাকি পরিদর্শন, পাওয়া রোগ |
| `harvests.html` | মধু সংগ্রহ | নতুন সংগ্রহ, তালিকা, সেরা বাক্স |
| `diseases.html` | রোগ ও শত্রু | নাম বা লক্ষণ দিয়ে খোঁজা; ৮টা রোগ/শত্রুর কারণ, লক্ষণ, চিকিৎসা, প্রতিরোধ; এলাকার রোগের খবর |
| `bees.html` | মৌমাছি পরিচিতি | বাংলাদেশের মধু মৌমাছি, কলোনির সদস্য, জীবনচক্র |
| `calendar.html` | ফুলের ক্যালেন্ডার | সারা বছরের ফুল, এই মাসে কোথায় ফুল |
| `directory.html` | খামারি তালিকা | জেলা/উপজেলা/ফুল দিয়ে filter |
| `alerts.html` | সতর্কতা | স্প্রে ও রোগের সতর্কতা; কৃষকের স্প্রে-র খবর দেওয়ার form |
| `admin.html` | অ্যাডমিন ড্যাশবোর্ড | সব ব্যবহারকারী ও খামারির সারাংশ (শুধু অ্যাডমিন) |

## যা চেষ্টা করে দেখাবেন

- **স্প্রে সতর্কতা:** কৃষক হিসেবে সতর্কতা page-এ "খবর পাঠান" → ওই উপজেলার খামারিদের সতর্কতা MySQL trigger বানায়
- **মধু সংগ্রহ:** আর্দ্রতা ৩০%-এর বেশি বা ভবিষ্যতের তারিখ দিলে stored procedure বাংলা বার্তা দিয়ে আটকায়
- **বাক্স সরানো:** বাক্সের page-এ "অন্য খামারে সরান" (stored procedure + transaction, ইতিহাসে লেখা হয়)
- **লক্ষণ দিয়ে রোগ খোঁজা:** লক্ষণ বাছলে/বাদ দিলে ফলাফল সাথে সাথে বদলায়
- **upvote:** একজন একবারই দিতে পারেন; আবার চাপলে তুলে নেওয়া হয়

## Folder

```
moukamar_frontend/
├── main.js                    # desktop app (Electron) — window, menu, backend-এর ঠিকানা
├── preload.js                 # page আর desktop-এর মাঝের নিরাপদ সংযোগ
├── package.json               # npm start / npm run dist
├── build/icon.png             # app-এর icon
├── *.html                     # ১৬টা page
├── css/style.css              # সব design (রং, layout)
└── js/
    ├── bd-locations.js        # ৬৪ জেলা ও উপজেলার তালিকা (form-এর select)
    ├── data.js                # global তালিকাগুলোর ঘোষণা (FARMS, HIVES …) — ভরে store.js
    ├── store.js               # Django API (cookie + CSRF), MK.start(): লগ ইন যাচাই ও তথ্য আনা
    └── app.js                 # sidebar, বাংলা সংখ্যা, escapeHtml, ছোট বার্তা

প্রতিটা page-এ script-এর ক্রম: data.js → store.js → app.js → page-এর নিজের script
```

প্রতিটা ভেতরের page শুরু হয় `MK.start([...], render)` দিয়ে — আগে `/api/auth/me/` দিয়ে লগ ইন যাচাই, তারপর দরকারি তালিকা API থেকে এনে page আঁকা। ব্যবহারকারীর লেখা (নাম, পোস্ট, মন্তব্য) পাতায় বসানোর আগে `escapeHtml()` দিয়ে যায়, যাতে কেউ লেখার ভেতরে কোড ঢুকিয়ে অন্যের পর্দায় চালাতে না পারে।
