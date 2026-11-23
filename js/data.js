// মৌখামার — demo-র জন্য sample data
// কালকে backend হলে এগুলো MySQL থেকে আসবে; প্রতিটা অংশের পাশে কোন table থেকে আসবে তা লেখা আছে।

// apiaries table
const FARMS = [
  { id: 1, name: 'চর ঘাটিনা খামার', upazila: 'উল্লাপাড়া', district: 'সিরাজগঞ্জ', flora: 'সরিষা', status: 'সক্রিয়', since: '১৮ অক্টোবর ২০২৬' },
  { id: 2, name: 'বেলকুচি খামার', upazila: 'বেলকুচি', district: 'সিরাজগঞ্জ', flora: 'সরিষা', status: 'সক্রিয়', since: '২০ অক্টোবর ২০২৬' },
  { id: 3, name: 'বাড়ির খামার', upazila: 'সদর', district: 'সিরাজগঞ্জ', flora: 'মিশ্র ফুল', status: 'বিশ্রামে', since: 'স্থায়ী' }
];

// hives + queens + শেষ inspection
const HIVES = [
  { code: 'MK-001', farm: 1, species: 'Apis mellifera', frames: 10, filled: 7, state: 'সবল', queen: 'আছে', queenAge: 1, last: 3 },
  { code: 'MK-002', farm: 1, species: 'Apis mellifera', frames: 10, filled: 5, state: 'সবল', queen: 'আছে', queenAge: 1, last: 3 },
  { code: 'MK-003', farm: 1, species: 'Apis mellifera', frames: 8, filled: 2, state: 'দুর্বল', queen: 'আছে', queenAge: 2, last: 16 },
  { code: 'MK-005', farm: 1, species: 'Apis cerana', frames: 8, filled: 4, state: 'সবল', queen: 'আছে', queenAge: 1, last: 4 },
  { code: 'MK-009', farm: 1, species: 'Apis mellifera', frames: 10, filled: 0, state: 'রানীহীন', queen: 'নেই', queenAge: 0, last: 2 },
  { code: 'MK-014', farm: 2, species: 'Apis mellifera', frames: 10, filled: 6, state: 'সবল', queen: 'আছে', queenAge: 3, last: 5 },
  { code: 'MK-015', farm: 2, species: 'Apis mellifera', frames: 10, filled: 8, state: 'সবল', queen: 'আছে', queenAge: 1, last: 5 },
  { code: 'MK-016', farm: 2, species: 'Apis mellifera', frames: 10, filled: 3, state: 'দুর্বল', queen: 'আছে', queenAge: 2, last: 19 },
  { code: 'MK-021', farm: 2, species: 'Apis mellifera', frames: 10, filled: 0, state: 'রানীহীন', queen: 'নেই', queenAge: 0, last: 6 },
  { code: 'MK-030', farm: 3, species: 'Apis cerana', frames: 8, filled: 2, state: 'সবল', queen: 'আছে', queenAge: 1, last: 21 },
  { code: 'MK-031', farm: 3, species: 'Apis cerana', frames: 8, filled: 1, state: 'দুর্বল', queen: 'আছে', queenAge: 2, last: 21 },
  { code: 'MK-032', farm: 3, species: 'Apis mellifera', frames: 10, filled: 0, state: 'রানীহীন', queen: 'নেই', queenAge: 0, last: 25 }
];

// symptoms table
const SYMPTOMS = {
  s1: 'ডানা কোঁকড়ানো', s2: 'গায়ে লাল ফোঁটা', s3: 'কলোনি দুর্বল', s4: 'লার্ভা কালো',
  s5: 'মোমে সুতার জাল', s6: 'বাক্সের সামনে মরা মৌমাছি', s7: 'লার্ভা থলের মতো', s8: 'বাজে গন্ধ',
  s9: 'ফ্রেমে সুড়ঙ্গ', s10: 'বাক্সের মুখে পোকার ভিড়'
};

// diseases + disease_symptoms (M:N)
const DISEASES = [
  { id: 'varroa', name: 'ভ্যারোয়া মাইট', kind: 'পরজীবী মাইট', risk: 'high', symptoms: ['s1', 's2', 's3'],
    signs: ['মৌমাছির ডানা কোঁকড়ানো বা বিকৃত', 'গায়ে লালচে-বাদামি ছোট মাইট', 'কলোনি ধীরে ধীরে দুর্বল'],
    prevent: ['নিয়মিত মাইট গণনা', 'দুর্বল কলোনি একত্র করা', 'পুরনো ফ্রেম বদলানো'],
    treat: ['অনুমোদিত মাইটনাশক', 'মধু মৌসুমের বাইরে প্রয়োগ', 'চিকিৎসার তারিখ রেকর্ড রাখা'] },
  { id: 'tropi', name: 'ট্রপিলেল্যাপস মাইট', kind: 'পরজীবী মাইট', risk: 'high', symptoms: ['s1', 's3', 's6'],
    signs: ['বিকৃত ডানার মৌমাছি', 'বাক্সের সামনে হামাগুড়ি দেওয়া মৌমাছি', 'ব্রুড এলোমেলো'],
    prevent: ['ব্রুড বিরতি দেওয়া', 'নিয়মিত পরিদর্শন'], treat: ['অনুমোদিত মাইটনাশক', 'কৃষি কর্মকর্তার পরামর্শ'] },
  { id: 'waxmoth', name: 'মোম মথ', kind: 'পোকা', risk: 'mid', symptoms: ['s5', 's9', 's3'],
    signs: ['মোমের উপর সুতার মতো জাল', 'ফ্রেমে সুড়ঙ্গ', 'দুর্বল কলোনিতে বেশি'],
    prevent: ['কলোনি সবল রাখা', 'খালি ফ্রেম সংরক্ষণে সাবধানতা'], treat: ['আক্রান্ত ফ্রেম সরানো', 'বাক্স পরিষ্কার'] },
  { id: 'sacbrood', name: 'স্যাকব্রুড', kind: 'ব্রুড রোগ', risk: 'mid', symptoms: ['s7', 's4', 's3'],
    signs: ['লার্ভা থলের মতো ফুলে যায়', 'পরে কালচে হয়', 'কলোনি দুর্বল'],
    prevent: ['সবল রানী', 'পর্যাপ্ত খাবার'], treat: ['রানী বদল', 'আক্রান্ত ফ্রেম সরানো'] },
  { id: 'foulbrood', name: 'ফাউলব্রুড', kind: 'ব্রুড রোগ', risk: 'high', symptoms: ['s4', 's8', 's3'],
    signs: ['লার্ভা বাদামি-কালো', 'বাজে গন্ধ', 'ব্রুড ছোপ ছোপ'],
    prevent: ['যন্ত্রপাতি জীবাণুমুক্ত রাখা', 'অন্যের বাক্স থেকে ফ্রেম না নেওয়া'], treat: ['দ্রুত কৃষি কর্মকর্তাকে জানানো', 'আক্রান্ত বাক্স আলাদা রাখা'] },
  { id: 'hornet', name: 'ভীমরুল', kind: 'শত্রু', risk: 'mid', symptoms: ['s6', 's10'],
    signs: ['বাক্সের মুখে ভীমরুল ঘুরছে', 'মরা মৌমাছি'], prevent: ['বাক্সের মুখ ছোট রাখা', 'ভীমরুলের বাসা খোঁজা'], treat: ['ফাঁদ ব্যবহার'] },
  { id: 'ant', name: 'পিঁপড়া', kind: 'শত্রু', risk: 'low', symptoms: ['s10'],
    signs: ['বাক্সের পায়ে পিঁপড়ার সারি'], prevent: ['স্ট্যান্ডের পা পানিতে রাখা'], treat: ['স্ট্যান্ড পরিষ্কার'] },
  { id: 'bird', name: 'সুইচোরা পাখি', kind: 'শত্রু', risk: 'low', symptoms: ['s3'],
    signs: ['খামারের আশেপাশে পাখির ঝাঁক'], prevent: ['খামারের জায়গা বদল'], treat: ['—'] }
];

// inspection_diseases + apiaries + upazilas, গত ৩০ দিন
const OUTBREAKS = [
  { disease: 'ভ্যারোয়া মাইট', where: 'শাহজাদপুর, উল্লাপাড়া', farms: 7, alert: true },
  { disease: 'মোম মথ', where: 'বেলকুচি', farms: 4, alert: true },
  { disease: 'ভীমরুল', where: 'কামারখন্দ', farms: 2, alert: false },
  { disease: 'স্যাকব্রুড', where: 'তাড়াশ', farms: 1, alert: false }
];

// flora + flora_blooms (M:N)
const FLORA = [
  { name: 'সরিষা', where: 'সিরাজগঞ্জ, পাবনা, টাঙ্গাইল', months: [12, 1, 2] },
  { name: 'কালোজিরা', where: 'ফরিদপুর, মাদারীপুর', months: [1, 2, 3] },
  { name: 'ধনিয়া', where: 'ফরিদপুর, রাজবাড়ী', months: [1, 2] },
  { name: 'লিচু', where: 'দিনাজপুর, পাবনা, নাটোর', months: [3, 4] },
  { name: 'সুন্দরবনের ফুল', where: 'সাতক্ষীরা, খুলনা', months: [4, 5, 6] },
  { name: 'তিল', where: 'ফরিদপুর, পটুয়াখালী', months: [5, 6] },
  { name: 'বর্ষা — ফুল কম', where: 'সারা দেশ', months: [6, 7, 8, 9], dearth: true }
];

// users + profiles + apiaries (খামারি ও ম্যাপের তথ্য)
const DEFAULT_FARMERS = [
  { id: 1, name: 'আব্দুল করিম', phone: '01711-234567', farm: 'মধুকুঞ্জ মৌখামার', district: 'সিরাজগঞ্জ', upazila: 'উল্লাপাড়া', lat: 24.3187, lng: 89.5694, type: 'ভ্রাম্যমাণ', hives: 120, flora: ['সরিষা', 'লিচু', 'কালোজিরা'], exp: 12, honeyProduced: 1450, activeBoxes: 115, rating: 4.9, regDate: '১৫ জানুয়ারি ২০২৫' },
  { id: 2, name: 'সেলিনা বেগম', phone: '01812-345678', farm: 'সোনালী মৌচাক', district: 'সিরাজগঞ্জ', upazila: 'উল্লাপাড়া', lat: 24.3250, lng: 89.5800, type: 'স্থায়ী', hives: 40, flora: ['সরিষা'], exp: 5, honeyProduced: 480, activeBoxes: 38, rating: 4.7, regDate: '১০ মার্চ ২০২৫' },
  { id: 3, name: 'রহিম উদ্দিন', phone: '01712-345678', farm: 'চর ঘাটিনা খামার', district: 'সিরাজগঞ্জ', upazila: 'উল্লাপাড়া', lat: 24.3110, lng: 89.5550, type: 'ভ্রাম্যমাণ', hives: 86, flora: ['সরিষা', 'লিচু'], exp: 8, honeyProduced: 1020, activeBoxes: 82, rating: 4.8, regDate: '১৮ অক্টোবর ২০২৪' },
  { id: 4, name: 'মোস্তফা কামাল', phone: '01913-456789', farm: 'বেলকুচি মধুঘর', district: 'সিরাজগঞ্জ', upazila: 'বেলকুচি', lat: 24.2963, lng: 89.7042, type: 'ভ্রাম্যমাণ', hives: 65, flora: ['সরিষা', 'সুন্দরবনের ফুল'], exp: 10, honeyProduced: 780, activeBoxes: 61, rating: 4.8, regDate: '২০ অক্টোবর ২০২৪' },
  { id: 5, name: 'নাসরিন আক্তার', phone: '01714-567890', farm: 'সুজানগর মৌবাগান', district: 'পাবনা', upazila: 'সুজানগর', lat: 23.9167, lng: 89.4333, type: 'স্থায়ী', hives: 30, flora: ['সরিষা', 'কালোজিরা'], exp: 4, honeyProduced: 360, activeBoxes: 29, rating: 4.6, regDate: '০৫ ফেব্রুয়ারি ২০২৫' },
  { id: 6, name: 'হাবিবুর রহমান', phone: '01815-678901', farm: 'পদ্মা মৌখামার', district: 'পাবনা', upazila: 'সুজানগর', lat: 23.9250, lng: 89.4500, type: 'ভ্রাম্যমাণ', hives: 150, flora: ['সরিষা', 'লিচু', 'কালোজিরা'], exp: 15, honeyProduced: 1850, activeBoxes: 145, rating: 5.0, regDate: '১২ ডিসেম্বর ২০২৩' },
  { id: 7, name: 'জাহিদ হাসান', phone: '01616-789012', farm: 'লিচুতলা খামার', district: 'দিনাজপুর', upazila: 'বিরল', lat: 25.6267, lng: 88.5350, type: 'স্থায়ী', hives: 55, flora: ['লিচু'], exp: 6, honeyProduced: 710, activeBoxes: 53, rating: 4.7, regDate: '২২ মে ২০২৪' },
  { id: 8, name: 'ফারুক আহমেদ', phone: '01717-890123', farm: 'উত্তরের মধু', district: 'দিনাজপুর', upazila: 'সদর', lat: 25.6217, lng: 88.6355, type: 'ভ্রাম্যমাণ', hives: 90, flora: ['লিচু', 'সরিষা'], exp: 9, honeyProduced: 1100, activeBoxes: 87, rating: 4.8, regDate: '০৮ সেপ্টেম্বর ২০২৪' },
  { id: 9, name: 'ইব্রাহিম খলিল', phone: '01918-901234', farm: 'সুন্দরবন মধুবন', district: 'সাতক্ষীরা', upazila: 'শ্যামনগর', lat: 22.3308, lng: 89.1028, type: 'ভ্রাম্যমাণ', hives: 110, flora: ['সুন্দরবনের ফুল', 'সরিষা'], exp: 14, honeyProduced: 1390, activeBoxes: 104, rating: 4.9, regDate: '১৭ এপ্রিল ২০২৩' },
  { id: 10, name: 'রুবিনা খাতুন', phone: '01719-012345', farm: 'মাদার মৌঘর', district: 'মাদারীপুর', upazila: 'সদর', lat: 23.1641, lng: 90.1897, type: 'স্থায়ী', hives: 25, flora: ['কালোজিরা', 'ধনিয়া'], exp: 3, honeyProduced: 290, activeBoxes: 24, rating: 4.5, regDate: '১৪ জুন ২০২৫' },
  { id: 11, name: 'শাহ আলম', phone: '01820-123456', farm: 'মধুপুর বনমধু', district: 'টাঙ্গাইল', upazila: 'মধুপুর', lat: 24.6167, lng: 90.0333, type: 'ভ্রাম্যমাণ', hives: 95, flora: ['সরিষা', 'লিচু', 'মিশ্র ফুল'], exp: 11, honeyProduced: 1180, activeBoxes: 91, rating: 4.8, regDate: '০২ নভেম্বর ২০২৪' },
  { id: 12, name: 'মোজাম্মেল হক', phone: '01621-234567', farm: 'চলনবিল মৌপল্লী', district: 'নাটোর', upazila: 'সিংড়া', lat: 24.5000, lng: 89.1500, type: 'ভ্রাম্যমাণ', hives: 130, flora: ['সরিষা', 'কালোজিরা'], exp: 13, honeyProduced: 1600, activeBoxes: 126, rating: 4.9, regDate: '১৯ জানুয়ারি ২০২৪' },
  { id: 13, name: 'আনিসুর রহমান', phone: '01722-345678', farm: 'ফরিদপুর মধুর হাট', district: 'ফরিদপুর', upazila: 'ভাঙ্গা', lat: 23.3889, lng: 89.9833, type: 'স্থায়ী', hives: 48, flora: ['কালোজিরা', 'ধনিয়া', 'তিল'], exp: 7, honeyProduced: 580, activeBoxes: 46, rating: 4.6, regDate: '২৭ মার্চ ২০২৪' },
  { id: 14, name: 'তন্ময় চৌধুরী', phone: '01923-456789', farm: 'হিমালয় পাদদেশ মধু', district: 'পঞ্চগড়', upazila: 'তেঁতুলিয়া', lat: 26.4833, lng: 88.3500, type: 'স্থায়ী', hives: 35, flora: ['মিশ্র ফুল', 'সরিষা'], exp: 4, honeyProduced: 410, activeBoxes: 33, rating: 4.7, regDate: '০৯ আগস্ট ২০২৫' },
  { id: 15, name: 'মিজানুর রহমান', phone: '01824-567890', farm: 'ভাওয়াল মৌকুঞ্জ', district: 'গাজীপুর', upazila: 'শ্রীপুর', lat: 24.2000, lng: 90.4667, type: 'স্থায়ী', hives: 50, flora: ['লিচু', 'মিশ্র ফুল'], exp: 6, honeyProduced: 620, activeBoxes: 48, rating: 4.7, regDate: '১১ নভেম্বর ২০২৪' },
  { id: 16, name: 'নুরুল ইসলাম', phone: '01725-678901', farm: 'পাহাড়িকা মৌপল্লী', district: 'চট্টগ্রাম', upazila: 'ফটিকছড়ি', lat: 22.6833, lng: 91.7833, type: 'ভ্রাম্যমাণ', hives: 75, flora: ['মিশ্র ফুল', 'লিচু'], exp: 8, honeyProduced: 890, activeBoxes: 72, rating: 4.8, regDate: '০৪ জানুয়ারি ২০২৫' }
];

// District / Upazila Coordinate resolver for new registrations
const DISTRICT_COORDS = {
  'সিরাজগঞ্জ': { lat: 24.4533, lng: 89.7006, upazilas: { 'উল্লাপাড়া': [24.3187, 89.5694], 'বেলকুচি': [24.2963, 89.7042], 'সদর': [24.4533, 89.7006], 'কামারখন্দ': [24.3667, 89.6500], 'তাড়াশ': [24.4333, 89.3667], 'শাহজাদপুর': [24.1833, 89.6000] } },
  'পাবনা': { lat: 24.0064, lng: 89.2372, upazilas: { 'সুজানগর': [23.9167, 89.4333], 'ঈশ্বরদী': [24.1292, 89.0667], 'সদর': [24.0064, 89.2372], 'চাটমোহর': [24.2167, 89.2833] } },
  'দিনাজপুর': { lat: 25.6217, lng: 88.6355, upazilas: { 'বিরল': [25.6267, 88.5350], 'সদর': [25.6217, 88.6355], 'বীরগঞ্জ': [25.8500, 88.6667], 'চিরিরবন্দর': [25.6500, 88.7833] } },
  'সাতক্ষীরা': { lat: 22.7185, lng: 89.0705, upazilas: { 'শ্যামনগর': [22.3308, 89.1028], 'সদর': [22.7185, 89.0705], 'কালিগঞ্জ': [22.4500, 89.0417], 'আশাশুনি': [22.5500, 89.1667] } },
  'মাদারীপুর': { lat: 23.1641, lng: 90.1897, upazilas: { 'সদর': [23.1641, 90.1897], 'শিবচর': [23.3500, 90.1667], 'কালকিনি': [23.0667, 90.2333], 'রাজৈর': [23.2000, 89.9333] } },
  'টাঙ্গাইল': { lat: 24.2513, lng: 89.9167, upazilas: { 'মধুপুর': [24.6167, 90.0333], 'মির্জাপুর': [24.1000, 90.1000], 'সদর': [24.2513, 89.9167], 'ঘাটাইল': [24.5000, 90.0000] } },
  'নাটোর': { lat: 24.4102, lng: 88.9796, upazilas: { 'সিংড়া': [24.5000, 89.1500], 'সদর': [24.4102, 88.9796], 'গুরুদাসপুর': [24.3667, 89.1500], 'বড়াইগ্রাম': [24.3000, 89.1667] } },
  'ফরিদপুর': { lat: 23.6071, lng: 89.8429, upazilas: { 'ভাঙ্গা': [23.3889, 89.9833], 'সদর': [23.6071, 89.8429], 'বোয়ালমারী': [23.3833, 89.6833], 'মধুখালী': [23.5333, 89.6500] } },
  'পঞ্চগড়': { lat: 26.3333, lng: 88.5500, upazilas: { 'তেঁতুলিয়া': [26.4833, 88.3500], 'সদর': [26.3333, 88.5500], 'বোদা': [26.2000, 88.6000] } },
  'গাজীপুর': { lat: 24.0023, lng: 90.4264, upazilas: { 'শ্রীপুর': [24.2000, 90.4667], 'সদর': [24.0023, 90.4264], 'কালিয়াকৈর': [24.0667, 90.2167], 'কাপাসিয়া': [24.1000, 90.5667] } },
  'চট্টগ্রাম': { lat: 22.3569, lng: 91.7832, upazilas: { 'ফটিকছড়ি': [22.6833, 91.7833], 'সদর': [22.3569, 91.7832], 'হাটহাজারী': [22.5000, 91.8000], 'রাঙ্গুনিয়া': [22.4500, 92.0500] } },
  'রংপুর': { lat: 25.7439, lng: 89.2752, upazilas: { 'মিঠাপুকুর': [25.5786, 89.2889], 'সদর': [25.7439, 89.2752], 'পীরগঞ্জ': [25.4167, 89.3167] } },
  'খুলনা': { lat: 22.8456, lng: 89.5403, upazilas: { 'কয়রা': [22.3417, 89.3000], 'ডুমুরিয়া': [22.8083, 89.4250], 'সদর': [22.8456, 89.5403] } }
};

// localStorage integration helper
function getStoredFarmers() {
  try {
    const raw = localStorage.getItem('moukhamar_registered_farmers');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length) return parsed;
    }
  } catch (e) {}
  return DEFAULT_FARMERS;
}

function saveRegisteredFarmer(farmer) {
  const list = getStoredFarmers();
  const nextId = list.reduce((m, f) => Math.max(m, f.id || 0), 0) + 1;
  const newEntry = { ...farmer, id: nextId };
  list.unshift(newEntry);
  try {
    localStorage.setItem('moukhamar_registered_farmers', JSON.stringify(list));
  } catch (e) {}
  return newEntry;
}

// Global active farmers reference
let FARMERS = getStoredFarmers();

// notifications (trigger দিয়ে তৈরি)
const NOTIFICATIONS = [
  { kind: 'spray', unread: true, title: 'কীটনাশক স্প্রে — উল্লাপাড়া', body: '৫ নভেম্বর সকাল ৮টায় সরিষা খেতে স্প্রে হবে (কৃষক: মো. আলমগীর)। চর ঘাটিনা খামারের বাক্স ঢেকে রাখুন বা সরান।', when: 'আজ, সন্ধ্যা ৬:১০' },
  { kind: 'disease', unread: true, title: 'রোগের সতর্কতা — উল্লাপাড়া', body: 'গত ৩০ দিনে ৭টা খামারে ভ্যারোয়া মাইট পাওয়া গেছে। আপনার বাক্সগুলো পরীক্ষা করুন।', when: 'আজ, দুপুর ২:৩০' },
  { kind: 'disease', unread: true, title: 'রোগের সতর্কতা — বেলকুচি', body: 'গত ৩০ দিনে ৪টা খামারে মোম মথ পাওয়া গেছে।', when: 'গতকাল' },
  { kind: 'spray', unread: false, title: 'কীটনাশক স্প্রে — বেলকুচি', body: '২৮ অক্টোবর বিকেলে আলু খেতে স্প্রে হয়েছিল।', when: '২৭ অক্টোবর' }
];

// community_posts table (কমিউনিটি আলোচনা, তথ্য ও সম্পদ বিনিময়)
const DEFAULT_COMMUNITY_POSTS = [
  {
    id: 1,
    author: 'হাবিবুর রহমান',
    farm: 'পদ্মা মৌখামার',
    district: 'পাবনা',
    upazila: 'সুজানগর',
    farmerId: 6,
    category: 'flora',
    categoryLabel: 'ফুলের খবর',
    title: 'সুজানগর ও ঈশ্বরদী চরে সরিষা ফুলের কুঁড়ি আসা শুরু হয়েছে',
    body: 'যাঁরা এই মৌসুমে পদ্মা পাড়ে বাক্স বসাতে চান, তাঁদের জ্ঞাতার্থে জানাচ্ছি—চরে এবার আগাম তোষা ও বারি-১৪ সরিষা বোনা হয়েছিল। আর ১০-১২ দিনের মধ্যে হলুদ ফুল ফুটে যাবে। খামার বসানোর ভালো উঁচু ও শুকনো জায়গা এখনো খালি আছে। যাতায়াত বা কৃষকদের সাথে যোগাযোগের যেকোনো তথ্যে সহায়তা লাগলে বলতে পারেন।',
    time: '২ ঘণ্টা আগে',
    upvotes: 21,
    upvoted: false,
    resourceType: null,
    phone: '01815-678901',
    tags: ['সরিষা ২০২৬', 'পদ্মার চর', 'স্থান নির্বাচন'],
    comments: [
      { author: 'আব্দুল করিম', time: '১ ঘণ্টা আগে', text: 'খুবই সময়োপযোগী খবর হাবিব ভাই! চরের দিকে যাতায়াতের ট্রলারের সুবিধা কেমন?' },
      { author: 'হাবিবুর রহমান', time: '৪০ মিনিট আগে', text: 'ঘাটে প্রতিদিন ট্রলার থাকে করিম ভাই, একসাথে ১০০ বাক্সও নিরাপদে পার করা সম্ভব।' }
    ]
  },
  {
    id: 2,
    author: 'মোস্তফা কামাল',
    farm: 'বেলকুচি মধুঘর',
    district: 'সিরাজগঞ্জ',
    upazila: 'বেলকুচি',
    farmerId: 4,
    category: 'resource',
    categoryLabel: 'যন্ত্রপাতি ও সম্পদ',
    title: '৪ ফ্রেমের স্টেইনলেস স্টিল মধু নিষ্কাশন মেশিন (Honey Extractor) ভাড়ায় বা সুলভে হস্তান্তর',
    body: 'আমাদের খামারে নতুন মোটরচালিত বড় মেশিন সংযোজন হওয়ায় আগের ফুড-গ্রেড ৪ ফ্রেমের হ্যান্ড এক্সট্রাক্টরটি অতিরিক্ত রয়েছে। এটি একদম নিখুঁত এবং ফ্রেমের কোনো মোম নষ্ট করে না। উল্লাপাড়া, বেলকুচি বা সিরাজগঞ্জ সদর এলাকার কোনো খামারি ভাইয়ের প্রয়োজন হলে স্বল্প মেয়াদী ভাড়ায় অথবা সাধ্যের মধ্যে নিতে পারেন।',
    time: '৫ ঘণ্টা আগে',
    upvotes: 34,
    upvoted: false,
    resourceType: 'ভাড়া / বিক্রয়',
    price: 'স্বল্প ভাড়া / আলোচনা সাপেক্ষে',
    phone: '01913-456789',
    tags: ['মধু নিষ্কাশন', 'যন্ত্রপাতি', 'বেলকুচি'],
    comments: [
      { author: 'সেলিনা বেগম', time: '৩ ঘণ্টা আগে', text: 'মেশিনটা কি ৩ দিনের জন্য ভাড়া নেওয়া সম্ভব? আমাদের প্রথম লটের মধু ভাঙতে হবে।' },
      { author: 'মোস্তফা কামাল', time: '২ ঘণ্টা আগে', text: 'হ্যাঁ আপা, সরাসরি মোবাইলে ফোন দিন, আজই পাঠিয়ে দিতে পারব।' }
    ]
  },
  {
    id: 3,
    author: 'আব্দুল করিম',
    farm: 'মধুকুঞ্জ মৌখামার',
    district: 'সিরাজগঞ্জ',
    upazila: 'উল্লাপাড়া',
    farmerId: 1,
    category: 'resource',
    categoryLabel: 'রানী ও কলোনি',
    title: 'উচ্চ উৎপাদনশীল জাতের মেলিফেরা (Apis mellifera) যুবতী গর্ভবতী রানী সরবরাহ',
    body: 'আমাদের খামারের নিয়ন্ত্রিত ব্রিডিং সেল থেকে ১৫টি পরীক্ষিত, স্বাস্থ্যবান এবং নিয়মিত ডিম পাড়া নতুন রানী সরবরাহযোগ্য। যাঁদের বাক্সে রানীহীন অবস্থা (Queenless) রয়েছে বা পুরনো রানীর ডিম দেওয়ার হার কমে গেছে, তাঁরা এখনই রানী প্রতিস্থাপন করে কলোনি সবল করতে পারেন।',
    time: '১ দিন আগে',
    upvotes: 42,
    upvoted: false,
    resourceType: 'কলোনি সম্পদ',
    price: '৬৫০ টাকা / প্রতিটি রানী',
    phone: '01711-234567',
    tags: ['রানী সরবরাহ', 'মেলিফেরা', 'কলোনি বৃদ্ধি'],
    comments: [
      { author: 'ফারুক আহমেদ', time: '১৮ ঘণ্টা আগে', text: 'করিম ভাই, দিনাজপুরে কি খাঁচায় করে নিরাপদে পাঠানো যাবে?' },
      { author: 'আব্দুল করিম', time: '১৫ ঘণ্টা আগে', text: 'হ্যাঁ, স্পেশাল কুইন ট্রাভেলিং কেজে ক্যান্ডি দিয়ে কুরিয়ারে ২৪ ঘণ্টার মধ্যে পাঠানো যায়।' }
    ]
  },
  {
    id: 4,
    author: 'সেলিনা বেগম',
    farm: 'সোনালী মৌচাক',
    district: 'সিরাজগঞ্জ',
    upazila: 'উল্লাপাড়া',
    farmerId: 2,
    category: 'qa',
    categoryLabel: 'সমস্যা ও সমাধান',
    title: 'শীতের রাতে বাক্সে অতিরিক্ত আর্দ্রতা ও জলীয়বাষ্প রোধে কী উপায় গ্রহণ করছেন?',
    body: 'গত কয়েকদিন ধরে রাতে কুয়াশা বেড়ে যাওয়ায় সকালের দিকে বাক্সের ভেতরের ড্রায়ার ও উপরের ছাদে বিন্দু বিন্দু জলকণা জমছে। আপনারা আর্দ্রতা ২৫%-এর নিচে রাখতে পাটের চটের পাশাপাশি আর কী টেকনিক ব্যবহার করছেন? ড্রপবোর্ডের ভেন্টিলেশন কি পুরোপুরি বন্ধ রাখবেন নাকি হালকা খোলা?',
    time: '১ দিন আগে',
    upvotes: 27,
    upvoted: false,
    resourceType: null,
    phone: '01812-345678',
    tags: ['আর্দ্রতা নিয়ন্ত্রণ', 'শীতকালীন যত্ন', 'ব্রুড সুরক্ষা'],
    comments: [
      { author: 'রহিম উদ্দিন', time: '২০ ঘণ্টা আগে', text: 'উপরের ভেন্টিলেশন স্লিট আধা ইঞ্চি খোলা রাখুন। বাতাস চলাচলের পথ না থাকলে আর্দ্রতা জমে ছত্রাক ও রোগ বালাই হতে পারে।' },
      { author: 'জাহিদ হাসান', time: '১৬ ঘণ্টা আগে', text: 'আমরা ঢাকনার নিচে শুকনো খবরের কাগজের দুটি স্তর দিই, এটি অতিরিক্ত জলীয়বাষ্প শুষে নেয়।' }
    ]
  },
  {
    id: 5,
    author: 'জাহিদ হাসান',
    farm: 'লিচুতলা খামার',
    district: 'দিনাজপুর',
    upazila: 'বিরল',
    farmerId: 7,
    category: 'tips',
    categoryLabel: 'অভিজ্ঞতা ও পরামর্শ',
    title: 'কীটনাশক স্প্রে থেকে মৌমাছি বাঁচাতে স্থানীয় কৃষকদের সাথে সমঝোতার বাস্তব মডেল',
    body: 'আমরা বিরল উপজেলার ২০ জন সরিষা ও ভুট্টা চাষীর সাথে মৌসুমি বৈঠক করেছিলাম। তাঁদেরকে বোঝানো হয়েছে যে মৌমাছির পরাগায়নে তাঁদের ফলন ২০-২৫% বৃদ্ধি পায়। ফলে তাঁরা দিনের বেলা বা সকাল ১০টায় স্প্রে না করে বিকেল ৫টার পর স্প্রে করতে একমত হয়েছেন। এতে গত মৌসুমে আমাদের একটি মৌমাছিও বিষক্রিয়ায় মারা যায়নি। সব খামারিদের অনুরোধ করব মাঠের কৃষকদের সাথে এখনই সুসম্পর্ক গড়ে তুলুন।',
    time: '২ দিন আগে',
    upvotes: 56,
    upvoted: false,
    resourceType: 'সফল অভিজ্ঞতা',
    phone: '01616-789012',
    tags: ['কীটনাশক রক্ষা', 'কৃষক সমঝোতা', 'পরাগায়ন'],
    comments: [
      { author: 'নাসরিন আক্তার', time: '১ দিন আগে', text: 'অসাধারণ উদ্যোগ জাহিদ ভাই! আমরাও পাবনাতে এই পদ্ধতি ফলো করতে চেষ্টা করব।' }
    ]
  }
];

function getStoredCommunityPosts() {
  try {
    const raw = localStorage.getItem('moukhamar_community_posts');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length) return parsed;
    }
  } catch (e) {}
  return DEFAULT_COMMUNITY_POSTS;
}

function saveCommunityPost(post) {
  const posts = getStoredCommunityPosts();
  const nextId = posts.reduce((m, p) => Math.max(m, p.id || 0), 0) + 1;
  const newPost = { ...post, id: nextId, time: 'এইমাত্র', upvotes: 0, upvoted: false, comments: [] };
  posts.unshift(newPost);
  try {
    localStorage.setItem('moukhamar_community_posts', JSON.stringify(posts));
  } catch (e) {}
  return newPost;
}

function togglePostUpvote(postId) {
  const posts = getStoredCommunityPosts();
  const post = posts.find(p => p.id === postId);
  if (post) {
    post.upvoted = !post.upvoted;
    post.upvotes = (post.upvotes || 0) + (post.upvoted ? 1 : -1);
    try {
      localStorage.setItem('moukhamar_community_posts', JSON.stringify(posts));
    } catch (e) {}
    return post;
  }
  return null;
}

function addPostComment(postId, commentObj) {
  const posts = getStoredCommunityPosts();
  const post = posts.find(p => p.id === postId);
  if (post) {
    if (!post.comments) post.comments = [];
    post.comments.push({ ...commentObj, time: 'এইমাত্র' });
    try {
      localStorage.setItem('moukhamar_community_posts', JSON.stringify(posts));
    } catch (e) {}
    return post;
  }
  return null;
}
