import type { 
  TickerAnnouncement, 
  LiveStreamConfig, 
  CrowdStatus, 
  DailyRitual, 
  StallItem, 
  GalleryMedia, 
  PranamMessage,
  HistoryStory
} from '../types';

/** Official UPI VPA ID configured in code / environment */
export const OFFICIAL_UPI_ID = import.meta.env.VITE_UPI_ID || 'jharapada.durga2026@sbi';

export const initialTicker: TickerAnnouncement[] = [
  {
    id: 't-1',
    textEn: '✨ Sandhi Puja 108 Lamps ritual starts today at 7:45 PM | Live Pushpanjali stream active on YouTube & FB',
    textOr: '✨ ଆଜି ସନ୍ଧ୍ୟା ୭:୪୫ ରେ ସନ୍ଧି ପୂଜା ୧୦୮ ଦୀପ ମହା ଆରତୀ | ୟୁଟ୍ୟୁବ୍ ଏବଂ ଫେସବୁକରେ ଲାଇଭ୍ ଦର୍ଶନ ଉପଲବ୍ଧ',
    type: 'IMPORTANT',
    active: true,
    timestamp: 'Just now'
  },
  {
    id: 't-2',
    textEn: '🚗 Parking Zone Gate-A (Cuttack Road) is 85% full. Please use Gate-B near Jharapada Jail ground.',
    textOr: '🚗 ପାର୍କିଂ ଜୋନ୍ ଗେଟ୍-A (କଟକ ରୋଡ୍) ୮୫% ପୂର୍ଣ୍ଣ । ଦୟାକରି ଝାରପଡା ଜେଲ ପଡିଆ ନିକଟ ଗେଟ୍-B ବ୍ୟବହାର କରନ୍ତୁ ।',
    type: 'INFO',
    active: true,
    timestamp: '10 mins ago'
  },
  {
    id: 't-3',
    textEn: '🚑 Free Sanjeevani Medical Desk & Ambulance service available at Gate-3 with 24x7 doctors.',
    textOr: '🚑 ଗେଟ୍-୩ ନିକଟରେ ମାଗଣା ସଞ୍ଜୀବନୀ ଡାକ୍ତରୀ ସେବା ଏବଂ ଆମ୍ବୁଲାନ୍ସ ଉପଲବ୍ଧ ।',
    type: 'INFO',
    active: true,
    timestamp: '30 mins ago'
  },
  {
    id: 't-4',
    textEn: '🎟️ Senior Citizens & Differently Abled Fast-Track QR Passes available for direct express entrance.',
    textOr: '🎟️ ବରିଷ୍ଠ ନାଗରିକ ଏବଂ ଭିନ୍ନକ୍ଷମଙ୍କ ପାଇଁ ସ୍ୱତନ୍ତ୍ର ଫାଷ୍ଟ-ଟ୍ରାକ୍ QR ପାସ୍ ମାଗଣାରେ ଉପଲବ୍ଧ ।',
    type: 'IMPORTANT',
    active: true,
    timestamp: '1 hour ago'
  }
];

export const initialLiveConfig: LiveStreamConfig = {
  activePlatform: 'youtube',
  youtubeId: 'jfKfPfyJRdk', // Default YouTube live stream video id
  facebookUrl: 'https://www.facebook.com/plugins/video.php?href=https://www.facebook.com/facebook/videos/10153231379946729/',
  instagramUrl: 'https://www.instagram.com/p/C-jharapada2026/',
  titleEn: 'Maha Ashtami Sandhya Aarti & Grand Pandal Darshan Live 4K',
  titleOr: 'ମହା ଅଷ୍ଟମୀ ସନ୍ଧ୍ୟା ଆରତୀ ଓ ବାଉଡ଼ ଗଡ଼ ମଣ୍ଡପ ପ୍ରତ୍ୟକ୍ଷ ଲାଇଭ୍ ଦର୍ଶନ',
  isLive: true,
  viewersCount: 14820
};

export const initialCrowdStatus: CrowdStatus = {
  level: 'moderate',
  waitTimeMins: 20,
  lastUpdated: '2 mins ago',
  parking: {
    gateA: 85,
    gateB: 45,
    gateC: 30
  }
};

export const initialRituals: DailyRitual[] = [
  {
    id: 'r-1',
    dayKey: 'shasthi',
    dayTitleEn: 'Maha Shasthi',
    dayTitleOr: 'ମହା ଷଷ୍ଠୀ',
    date: '2026-10-16',
    events: [
      { id: 'e-1', time: '06:00 AM', titleEn: 'Bilva Nimantran & Kalparambha', titleOr: 'ବିଲ୍ୱ ନିମନ୍ତ୍ରଣ ଓ କଳ୍ପାରମ୍ଭ', descEn: 'Welcoming Goddess Durga into the sacred Bilva tree', descOr: 'ବିଲ୍ୱ ବୃକ୍ଷ ମୂଳେ ମା\' ଦୁର୍ଗାଙ୍କ ଆବାହନ', isKeyMuhurat: true },
      { id: 'e-2', time: '10:30 AM', titleEn: 'Bodhan & Adhivas Rituals', titleOr: 'ବୋଧନ ଓ ଅଧିବାସ କର୍ମ', descEn: 'Awakening of the Goddess with Vedic Chants', descOr: 'ବୈଦିକ ମନ୍ତ୍ରୋଚାରଣ ସହ ବୋଧନ' },
      { id: 'e-3', time: '07:00 PM', titleEn: 'Grand Unveiling of Bauda Garh Pandal', titleOr: 'ବାଉଡ଼ ଗଡ଼ ତୋରଣ ଉଦ୍‌ଘାଟନ', descEn: 'Illumination of 120ft historic fort structure', descOr: '୧୨୦ ଫୁଟ୍ ଉଚ୍ଚ ଐତିହାସିକ ତୋରଣ ଉଦ୍‌ଘାଟନ' }
    ],
    culturalPrograms: [
      { id: 'c-1', time: '08:30 PM', artistEn: 'Odisha Dance Academy', artistOr: 'ଓଡ଼ିଶା ଡାନ୍ସ ଏକାଡେମୀ', typeEn: 'Odissi Nritya Performance', typeOr: 'ମଙ୍ଗଳାଚରଣ ଓ ଓଡ଼ିଶୀ ନୃତ୍ୟ' }
    ]
  },
  {
    id: 'r-2',
    dayKey: 'saptami',
    dayTitleEn: 'Maha Saptami',
    dayTitleOr: 'ମହା ସପ୍ତମୀ',
    date: '2026-10-17',
    events: [
      { id: 'e-4', time: '05:30 AM', titleEn: 'Nabapatrika Pravesh & Snan', titleOr: 'ନବପତ୍ରିକା ପ୍ରବେଶ ଓ ସ୍ନାନ', descEn: 'Sacred bath of 9 plants at Kuakhai River', descOr: 'କୁଆଖାଇ ନଦୀରେ ନବପତ୍ରିକା ସ୍ନାନ' },
      { id: 'e-5', time: '09:00 AM', titleEn: 'Public Pushpanjali Batch 1', titleOr: 'ସାର୍ବଜନୀନ ପୁଷ୍ପାଞ୍ଜଳି ପ୍ରଥମ ପର୍ଯ୍ୟାୟ', descEn: 'Devotees offering prayers and fresh flowers', descOr: 'ଶ୍ରଦ୍ଧାଳୁଙ୍କ ଦ୍ୱାରା ଅଞ୍ଜଳି ପ୍ରଦାନ', isKeyMuhurat: true },
      { id: 'e-6', time: '01:00 PM', titleEn: 'Maha Bhog Distribution', titleOr: 'ମହା ପ୍ରସାଦ ସେବନ', descEn: 'Community Khichudi & Prasad for 15,000 devotees', descOr: '୧୫,୦୦୦ ଶ୍ରଦ୍ଧାଳୁଙ୍କ ପାଇଁ ଅନ୍ନପ୍ରସାଦ ସେବନ' },
      { id: 'e-7', time: '07:30 PM', titleEn: 'Grand Sandhya Aarti & Dhunuchi Dance', titleOr: 'ସନ୍ଧ୍ୟା ଆରତୀ ଓ ଧୁନୁଚି ନୃତ୍ୟ', descEn: '108 Lamp Aarti accompanied by Traditional Chandi Beats', descOr: 'ଧୁନୁଚି ନୃତ୍ୟ ସହ ଆରତୀ' }
    ],
    culturalPrograms: [
      { id: 'c-2', time: '08:00 PM', artistEn: 'Namita Agrawal & Band', artistOr: 'ନମିତା ଅଗ୍ରୱାଲ୍ ଓ ସଙ୍ଗୀତ ଗୋଷ୍ଠୀ', typeEn: 'Devotional Bhajan Sandhya', typeOr: 'ଭକ୍ତିରସାମୃତ ଭଜନ ସନ୍ଧ୍ୟା' }
    ]
  },
  {
    id: 'r-3',
    dayKey: 'ashtami',
    dayTitleEn: 'Maha Ashtami',
    dayTitleOr: 'ମହା ଅଷ୍ଟମୀ',
    date: '2026-10-18',
    events: [
      { id: 'e-8', time: '08:00 AM', titleEn: 'Maha Ashtami Chandi Patha', titleOr: 'ମହା ଅଷ୍ଟମୀ ଚଣ୍ଡୀ ପାଠ', descEn: 'Sacred recital of Durga Saptashati', descOr: 'ସମ୍ପୂର୍ଣ୍ଣ ଚଣ୍ଡୀ ପାଠ' },
      { id: 'e-9', time: '10:00 AM', titleEn: 'Maha Ashtami Pushpanjali', titleOr: 'ମହା ଅଷ୍ଟମୀ ପୁଷ୍ପାଞ୍ଜଳି', descEn: 'Main festival offering for all families', descOr: 'ମୁଖ୍ୟ ପୁଷ୍ପାଞ୍ଜଳି ଅର୍ପଣ', isKeyMuhurat: true },
      { id: 'e-10', time: '07:45 PM', titleEn: 'Sandhi Puja 108 Lamps Ritual', titleOr: 'ସନ୍ଧି ପୂଜା ୧୦୮ ଦୀପ ପ୍ରଜ୍ୱଳନ', descEn: 'Crucial juncture between Ashtami and Navami with 108 lotuses', descOr: '୧୦୮ ପଦ୍ମ ଓ ୧୦୮ ଦୀପ ସହ ସନ୍ଧି ପୂଜା', isKeyMuhurat: true }
    ],
    culturalPrograms: [
      { id: 'c-3', time: '09:00 PM', artistEn: 'Bhubaneswar Orchestra Ensemble', artistOr: 'ଭୁବନେଶ୍ୱର ମେଲୋଡି ନାଇଟ୍', typeEn: 'Grand Festival Musical Evening', typeOr: 'ମେଲୋଡି ତାରକା ସନ୍ଧ୍ୟା' }
    ]
  },
  {
    id: 'r-4',
    dayKey: 'navami',
    dayTitleEn: 'Maha Navami',
    dayTitleOr: 'ମହା ନବମୀ',
    date: '2026-10-19',
    events: [
      { id: 'e-11', time: '09:00 AM', titleEn: 'Navami Homa & Sacrificial Fire', titleOr: 'ନବମୀ ମହା ଯଜ୍ଞ ଓ ହୋମ', descEn: 'Vedic Yajna for cosmic peace and family prosperity', descOr: 'ବିଶ୍ୱ ଶାନ୍ତି ପାଇଁ ମହା ଯଜ୍ଞ' },
      { id: 'e-12', time: '01:30 PM', titleEn: 'Special Chhena Poda & Bhog', titleOr: 'ବିଶେଷ ଛେନାପୋଡ଼ ମହାପ୍ରସାଦ', descEn: 'Distribution of Odisha traditional sweets', descOr: 'ପ୍ରସାଦ ବଣ୍ଟନ' },
      { id: 'e-13', time: '08:00 PM', titleEn: 'Special Light & Laser Show', titleOr: 'ବାଉଡ଼ ଗଡ଼ ଲେଜର ଲାଇଟ୍ ଶୋ', descEn: 'Spectacular 3D projection mapping on Bauda Garh gate', descOr: '୩ଡି ଲେଜର ଲାଇଟ୍ ପ୍ରଦର୍ଶନ' }
    ],
    culturalPrograms: [
      { id: 'c-4', time: '08:30 PM', artistEn: 'Sambalpuri Folk Cultural Troupe', artistOr: 'ସମ୍ବଲପୁରୀ ଲୋକନୃତ୍ୟ ଦଳ', typeEn: 'Rangabati Sambalpuri Folk Dance', typeOr: 'ସମ୍ବଲପୁରୀ ନୃତ୍ୟ ଧମାକା' }
    ]
  },
  {
    id: 'r-5',
    dayKey: 'dashami',
    dayTitleEn: 'Vijayadasami',
    dayTitleOr: 'ବିଜୟା ଦଶମୀ',
    date: '2026-10-20',
    events: [
      { id: 'e-14', time: '10:00 AM', titleEn: 'Aparajita Puja & Dashami Rituals', titleOr: 'ଅପରାଜିତା ପୂଜା', descEn: 'Victory rituals and blessing of implements', descOr: 'ଅପରାଜିତା ଦେବୀଙ୍କ ଆରାଧନା' },
      { id: 'e-15', time: '04:00 PM', titleEn: 'Sindoor Khela & Debi Boron', titleOr: 'ସିନ୍ଦୂର ଖେଳ ଓ ଦେବୀ ବରଣ', descEn: 'Women celebrating with vermilion and traditional sweets', descOr: 'ମହିଳାଙ୍କ ଦ୍ୱାରା ସିନ୍ଦୂର ଖେଳ' },
      { id: 'e-16', time: '08:00 PM', titleEn: 'Ravan Podi 60ft Effigy Fireworks', titleOr: 'ରାବଣ ପୋଡ଼ି ଆତସବାଜି', descEn: 'High-altitude eco-friendly firework display at Melan Padia', descOr: 'ମେଲଣ ପଡ଼ିଆରେ ରାବଣ ପୋଡ଼ି ଉତ୍ସବ', isKeyMuhurat: true }
    ],
    culturalPrograms: [
      { id: 'c-5', time: '08:30 PM', artistEn: 'Jharapada Pyrotechnics & Band', artistOr: 'ଝାରପଡ଼ା ଆତସବାଜି ଦଳ', typeEn: 'Grand Fireworks & Musical Fusion', typeOr: 'ମହା ଆତସବାଜି ଓ ସଙ୍ଗୀତ' }
    ]
  },
  {
    id: 'r-6',
    dayKey: 'bhasani',
    dayTitleEn: 'Bhasani & Visarjan Procession',
    dayTitleOr: 'ଭାସାଣି ଓ ବିସର୍ଜନ ଶୋଭାଯାତ୍ରା',
    date: '2026-10-21',
    events: [
      { id: 'e-17', time: '03:00 PM', titleEn: 'Grand Bhasani Carnival Departure', titleOr: 'ମହା ଭାସାଣି ଶୋଭାଯାତ୍ରା ଆରମ୍ଭ', descEn: '25 Brass bands, Ghodanacha, and light Tableau moving to Cuttack Road', descOr: '୨୫ଟି ବ୍ୟାଣ୍ଡ ପାର୍ଟି ଓ ଆଲୋକସଜ୍ଜା ଶୋଭାଯାତ୍ରା' },
      { id: 'e-18', time: '11:30 PM', titleEn: 'Immersion at Kuakhai Ghat', titleOr: 'କୁଆଖାଇ ଘାଟରେ ଦେବୀ ବିସର୍ଜନ', descEn: 'Farewell to Maa Durga with tears and joy', descOr: 'ମା\'ଙ୍କ ନବମୀ ବିଦାୟ ଓ ବିସର୍ଜନ' }
    ],
    culturalPrograms: [
      { id: 'c-6', time: '04:00 PM', artistEn: 'Traditional Dhola-Mahuri & Jodi Sankha', artistOr: 'ଜୋଡ଼ି ଶଙ୍ଖ ଓ ଢୋଲ ମାହୁରୀ', typeEn: 'Odisha Folk Heritage Parade', typeOr: 'ଓଡ଼ିଶୀ ପାରମ୍ପରିକ ଲୋକକଳା' }
    ]
  }
];

export const initialStalls: StallItem[] = [
  {
    id: 's-1',
    stallNo: 'P-01',
    nameEn: 'Main Bauda Garh Fort Pandal & Sanctum',
    nameOr: 'ମୁଖ୍ୟ ବାଉଡ଼ ଗଡ଼ ତୋରଣ ଓ ମଣ୍ଡପ',
    category: 'pandal',
    descriptionEn: 'The 120ft grand gold-plated Bauda Garh Fort replica housing Goddess Durga in 2.5kg Gold Chandi Medha.',
    descriptionOr: '୧୨୦ ଫୁଟ ଉଚ୍ଚ ସୁବର୍ଣ୍ଣ ବାଉଡ଼ ଗଡ଼ ତୋରଣ ଏବଂ ସୁନା ଚାନ୍ଦି ମେଢ଼',
    locationOnMap: { x: 50, y: 25 },
    rating: 5.0
  },
  {
    id: 's-2',
    stallNo: 'F-12',
    nameEn: 'Famous Cuttack Dahibara Aloodum Corner',
    nameOr: 'କଟକ ପ୍ରସିଦ୍ଧ ଦହିବରା ଆଳୁଦମ୍',
    category: 'food',
    descriptionEn: 'Authentic spicy Dahibara, Aloodum, Ghuguni served with fresh coriander chutney & dahi pani.',
    descriptionOr: 'ଖାଣ୍ଟି ସ୍ୱାଦିଷ୍ଟ ଦହିବରା, ଆଳୁଦମ୍, ଘୁଗୁନି',
    locationOnMap: { x: 30, y: 60 },
    phone: '+91 98610 12345',
    rating: 4.9
  },
  {
    id: 's-3',
    stallNo: 'F-08',
    nameEn: 'Pahala Original Chhena Poda & Rasagola Stall',
    nameOr: 'ପାହାଳ ଅରିଜିନାଲ୍ ଛେନାପୋଡ଼ ଓ ରସଗୋଲା',
    category: 'food',
    descriptionEn: 'Hot fresh baked Chhena Poda, Rasabali, Rabidi, and Gupchup.',
    descriptionOr: 'ତାଜା ଗରମ ଛେନାପୋଡ଼, ରସଗୋଲା ଓ ରସାବଳି',
    locationOnMap: { x: 40, y: 65 },
    phone: '+91 94370 54321',
    rating: 4.8
  },
  {
    id: 's-4',
    stallNo: 'A-01',
    nameEn: 'Meena Bazaar Giant Ferris Wheel & Breakdance',
    nameOr: 'ମୀନା ବଜାର ବଡ଼ ନାଗରଦୋଳା',
    category: 'amusement',
    descriptionEn: '60ft high illuminated Giant Wheel, Columbus Ship, Kids Carousels, and Horror House.',
    descriptionOr: '୬୦ ଫୁଟ ଉଚ୍ଚ ଆଲୋକିତ ନାଗରଦୋଳା, କଲମ୍ବସ ଓ ଖେଳଣା ଝୁଲା',
    locationOnMap: { x: 80, y: 50 },
    rating: 4.7
  },
  {
    id: 's-5',
    stallNo: 'E-01',
    nameEn: '24x7 Sanjeevani Medical Camp & Ambulance',
    nameOr: 'ସଞ୍ଜୀବନୀ ମାଗଣା ଡାକ୍ତରୀ କ୍ୟାମ୍ପ',
    category: 'emergency',
    descriptionEn: 'Free medical aid, oxygen support, first-aid, emergency doctor on standby.',
    descriptionOr: '୨୪ ਘଣ୍ଟିଆ ଆଶୁ ଚିକିତ୍ସା, ପ୍ରାଥମିକ ଚିକିତ୍ସା ଓ ଆମ୍ବୁଲାନ୍ସ',
    locationOnMap: { x: 20, y: 35 },
    phone: '108 / +91 674 2589000',
    rating: 5.0
  },
  {
    id: 's-6',
    stallNo: 'H-03',
    nameEn: 'Boyanika Odisha Handloom & Dokra Crafts',
    nameOr: 'ବୟନିକା ଓଡ଼ିଶା ହସ୍ତତନ୍ତ ଓ ଢୋକ୍ରା ଶିଳ୍ପ',
    category: 'handicraft',
    descriptionEn: 'Sambalpuri Sarees, Pipli Applique lamps, Wooden Jagannath Idols & Terracotta.',
    descriptionOr: 'ସମ୍ବଲପୁରୀ ଶାଢ଼ୀ, ପିପିଲି ଚାନ୍ଦୁଆ ଓ କାଠ ତିଆରି ସାମଗ୍ରୀ',
    locationOnMap: { x: 65, y: 70 },
    rating: 4.6
  },
  {
    id: 's-7',
    stallNo: 'G-01',
    nameEn: 'Senior Citizen & VIP Express Entrance Gate-B',
    nameOr: 'ବରିଷ୍ଠ ନାଗରିକ ଓ ଭିଆଇପି ପ୍ରବେଶ ଦ୍ୱାର',
    category: 'helpdesk',
    descriptionEn: 'Fast-track entry gate with wheelchair support and digital QR pass scanning.',
    descriptionOr: 'ହୁଇଲ୍‌ଚେୟାର୍ ଓ QR ପାସ୍ ମାଧ୍ୟମରେ ସ୍ୱତନ୍ତ୍ର ପ୍ରବେଶ',
    locationOnMap: { x: 15, y: 20 },
    rating: 4.9
  }
];

export const initialGallery: GalleryMedia[] = [
  {
    id: 'g-1',
    titleEn: 'Bauda Garh Fort Theme Illumination 2026',
    titleOr: 'ବାଉଡ଼ ଗଡ଼ ଆଲୋକସଜ୍ଜା ୨୦୨୬',
    category: 'pandal',
    year: 2026,
    type: 'image',
    url: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'g-2',
    titleEn: 'Golden Silver Durga Idol Sanctum',
    titleOr: 'ମା\' ଦୁର୍ଗାଙ୍କ ସୁନା ଚାନ୍ଦି ମେଢ଼',
    category: 'idol',
    year: 2026,
    type: 'image',
    url: 'https://images.unsplash.com/photo-1604580864964-0462f5d5b1a8?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'g-3',
    titleEn: 'Meena Bazaar Lights & Crowd Extravaganza',
    titleOr: 'ମୀନା ବଜାର ଜନସମୁଦ୍ର',
    category: 'lights',
    year: 2026,
    type: 'image',
    url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'g-4',
    titleEn: 'Sandhya Aarti & 108 Lamps Ceremony',
    titleOr: '୧୦୮ ଦୀପ ସନ୍ଧ୍ୟା ଆରତୀ',
    category: 'idol',
    year: 2025,
    type: 'image',
    url: 'https://images.unsplash.com/photo-1609137144813-7d9921338f24?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'g-5',
    titleEn: 'Bhasani Procession Light Gates',
    titleOr: 'ଭାସାଣି ଶୋଭାଯାତ୍ରା ଆଲୋକ ତୋରଣ',
    category: 'bhasani',
    year: 2025,
    type: 'image',
    url: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'g-6',
    titleEn: 'Celebrity Visit & Stage Performance',
    titleOr: 'ସାଂସ୍କୃତିକ ମଞ୍ଚ କାର୍ଯ୍ୟକ୍ରମ',
    category: 'celebrities',
    year: 2025,
    type: 'image',
    url: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1200&q=80',
  }
];

export const initialPranamMessages: PranamMessage[] = [
  { id: 'p-1', name: 'Soumya Ranjan Mohanty', location: 'Bhubaneswar', message: 'Jai Maa Durga! Bless our Odisha with peace and prosperity. 🙏', timestamp: '2 mins ago', likes: 24 },
  { id: 'p-2', name: 'Priyanka Tripathy', location: 'London, UK', message: 'Watching live from London! The Bauda Garh pandal looks breathtaking. Jai Maa Jagatjanani! ❤️', timestamp: '5 mins ago', likes: 42 },
  { id: 'p-3', name: 'Debasish Patnaik', location: 'Bengaluru', message: 'Jai Maa Chandi! Missing Jharapada dahibara aloodum so much. Proud of our committee! ✨', timestamp: '12 mins ago', likes: 18 },
  { id: 'p-4', name: 'Ankita Dash', location: 'Cuttack', message: 'ମା\'ଙ୍କ ସୁନା ଚାନ୍ଦି ମେଢ଼ ଅତ୍ୟନ୍ତ ମନୋରମ। ଜୟ ମା\' ଦୁର୍ଗା! 🌸', timestamp: '18 mins ago', likes: 35 }
];

export const initialHistoryStories: HistoryStory[] = [
  {
    id: 'hs-1',
    titleEn: 'Official Press Note: Unveiling of 120ft Bauda Garh Fort Theme for 2026',
    titleOr: 'ପ୍ରେସ୍ ବିଜ୍ଞପ୍ତି: ୨୦୨୬ ମସିହା ବାଉଡ଼ ଗଡ଼ ସୁବର୍ଣ୍ଣ ତୋରଣ ଉନ୍ମୋଚନ',
    authorName: 'Er. Pramod Kumar Jena',
    authorRole: 'President, Jharapada Durga Puja Samitee',
    category: 'press_note',
    year: 2026,
    contentEn: 'The Jharapada Durga Puja Samitee is proud to announce the golden jubilee theme "Bauda Garh Fort Extravaganza". Replicating historic Odisha and Indian fort architecture with eco-friendly bamboo, jute and 3D laser projection mapping.',
    contentOr: 'ଝାରପଡ଼ା ଦୁର୍ଗା ପୂଜା ସମିତି ପକ୍ଷରୁ ସୁବର୍ଣ୍ଣ ଜୟନ୍ତୀ ଅବସରରେ ୧୨୦ ଫୁଟ୍ ବାଉଡ଼ ଗଡ଼ ତୋରଣ ନିର୍ମାଣ ସମ୍ପର୍କରେ ଆଧିକାରିକ ପ୍ରେସ ବିଜ୍ଞପ୍ତି ଜାରି କରାଯାଇଛି ।',
    mediaUrl: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=80',
    datePosted: '2026-10-01'
  },
  {
    id: 'hs-2',
    titleEn: 'Founder Legacy Story: 1976 First Puja Memories by Elder Members',
    titleOr: '୧୯୭୬ ପ୍ରଥମ ପୂଜା ସ୍ମୃତି: ପ୍ରତିଷ୍ଠାତା ସଦସ୍ୟଙ୍କ ମୁଖରୁ',
    authorName: 'Shri Rabindra Nath Dash',
    authorRole: 'Founder Member & Chief Patron (1976)',
    category: 'member_story',
    year: 1976,
    contentEn: 'Back in 1976, our village elders and youth pooled Rs. 500 to erect a modest bamboo structure. From those humble beginnings, Jharapada has grown to become Odisha’s premier festive destination.',
    contentOr: '୧୯୭୬ ମସିହାରେ ଆମ ଝାରପଡ଼ାର ଯୁବକମାନେ ୫୦୦ ଟଙ୍କା ସଂଗ୍ରହ କରି ମା\'ଙ୍କର ପ୍ରଥମ ପୂଜା ସ୍ଥାପନା କରିଥିଲେ ।',
    mediaUrl: 'https://images.unsplash.com/photo-1604580864964-0462f5d5b1a8?auto=format&fit=crop&w=1200&q=80',
    datePosted: '2026-09-15'
  },
  {
    id: 'hs-3',
    titleEn: 'Achievement: State Award for Best Eco-Friendly Pandal & Zero Waste Initiative',
    titleOr: 'ରାଜ୍ୟ ସ୍ତରୀୟ ପୁରସ୍କାର: ସର୍ବୋତ୍ତମ ପରିବେଶ ଅନୁକୂଳ ମଣ୍ଡପ',
    authorName: 'Dr. Alok Mohanty',
    authorRole: 'General Secretary',
    category: 'achievement',
    year: 2025,
    contentEn: 'Jharapada Puja Committee was awarded the 1st prize for Zero Plastic Usage, Solar Lighting, and Eco-Friendly Clay Idol Crafting by Odisha Tourism.',
    contentOr: 'ଓଡ଼ିଶା ପର୍ଯ୍ୟଟନ ବିଭାଗ ପକ୍ଷରୁ ଝାରପଡ଼ା ପୂଜା ସମିତିକୁ ସର୍ବୋତ୍ତମ ପରିବେଶ ଅନୁକୂଳ ପୂଜା ମଣ୍ଡପ ପୁରସ୍କାର ପ୍ରଦାନ କରାଯାଇଛି ।',
    mediaUrl: 'https://images.unsplash.com/photo-1567157577867-05ccb1388e66?auto=format&fit=crop&w=1200&q=80',
    datePosted: '2025-10-25'
  }
];
