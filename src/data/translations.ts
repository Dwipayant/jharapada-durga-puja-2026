export interface TranslationItem {
  key: string;
  section: 'header' | 'hero' | 'live' | 'map' | 'schedule' | 'passes' | 'heritage' | 'gallery' | 'footer';
  label: string;
  textEn: string;
  defaultOr: string;
}

export const DEFAULT_TRANSLATIONS: TranslationItem[] = [
  // HEADER
  {
    key: 'header_announcement_tag',
    section: 'header',
    label: 'Header Live Announcement Tag',
    textEn: 'LIVE ANNOUNCEMENTS',
    defaultOr: 'ମୁଖ୍ୟ ସୂଚନା'
  },
  {
    key: 'header_nav_live',
    section: 'header',
    label: 'Navigation: Live Darshan',
    textEn: 'Live Darshan',
    defaultOr: 'ଲାଇଭ୍ ଦର୍ଶନ'
  },
  {
    key: 'header_nav_map',
    section: 'header',
    label: 'Navigation: Map',
    textEn: 'Map',
    defaultOr: 'ମଣ୍ଡପ ମାନଚିତ୍ର'
  },
  {
    key: 'header_nav_schedule',
    section: 'header',
    label: 'Navigation: Schedule & Rituals',
    textEn: 'Rituals & Schedule',
    defaultOr: 'କାର୍ଯ୍ୟସୂଚୀ ଓ ପୂଜା ନୀତି'
  },
  {
    key: 'header_nav_passes',
    section: 'header',
    label: 'Navigation: VIP Passes & Donation',
    textEn: 'VIP Pass & E-Seva',
    defaultOr: 'ଭିଆଇପି ପାସ୍ ଓ ଇ-ଦାନ'
  },
  {
    key: 'header_nav_heritage',
    section: 'header',
    label: 'Navigation: Heritage Story',
    textEn: 'Heritage & Legacy',
    defaultOr: 'ଐତିହ୍ୟ ଓ ଇତିହାସ'
  },
  {
    key: 'header_nav_gallery',
    section: 'header',
    label: 'Navigation: Photo & Video Gallery',
    textEn: 'Gallery & VR',
    defaultOr: 'ଫଟୋ ଓ ଭିଡିଓ ଗ୍ୟାଲେରୀ'
  },

  // HERO SECTION
  {
    key: 'hero_top_badge',
    section: 'hero',
    label: 'Hero Top Golden Badge',
    textEn: 'Bhubaneswar Premier Durga Puja Extravaganza',
    defaultOr: 'ଭୁବନେଶ୍ୱରର ସର୍ବଶ୍ରେଷ୍ଠ ଦୁର୍ଗା ପୂଜା ମହୋତ୍ସବ'
  },
  {
    key: 'hero_main_title',
    section: 'hero',
    label: 'Hero Main Title',
    textEn: 'Jharapada Durga Puja 2026',
    defaultOr: 'ଝାରପଡ଼ା ଦୁର୍ଗା ପୂଜା ୨୦୨୬'
  },
  {
    key: 'hero_subtitle',
    section: 'hero',
    label: 'Hero Theme Subtitle',
    textEn: 'Historic Baudha Garh Fort Theme & Gold Sanctum',
    defaultOr: 'ଐତିହାସିକ ବାଉଡ଼ ଗଡ଼ ତୋରଣ ଓ ସୁନା ଚାନ୍ଦି ମେଢ଼'
  },
  {
    key: 'hero_description',
    section: 'hero',
    label: 'Hero Paragraph Description',
    textEn: 'Experience 24x7 4K Ultra HD Live Darshan on YouTube, real-time crowd status, interactive 3D Melan Padia ground map, and digital VIP express QR passes.',
    defaultOr: 'ୟୁଟ୍ୟୁବ୍ ୪K HD ମାଧ୍ୟମରେ ୨୪x୭ ଲାଇଭ୍ ଦର୍ଶନ କରନ୍ତୁ, ମଣ୍ଡପ ମାନଚିତ୍ର ଦେଖନ୍ତୁ ଏବଂ ବରିଷ୍ଠ ନାଗରିକ ଫାଷ୍ଟ-ଟ୍ରାକ୍ QR ପାସ୍ ହାସଲ କରନ୍ତୁ ।'
  },
  {
    key: 'hero_btn_live_darshan',
    section: 'hero',
    label: 'Hero Button: Watch Live',
    textEn: 'Watch Live Darshan',
    defaultOr: 'ସିଧାପ୍ରସାରଣ ଦେଖନ୍ତୁ'
  },
  {
    key: 'hero_btn_vip_pass',
    section: 'hero',
    label: 'Hero Button: VIP Pass',
    textEn: 'Senior Citizen VIP Pass',
    defaultOr: 'ବରିଷ୍ଠ ନାଗରିକ ଭିଆଇପି ପାସ୍'
  },
  {
    key: 'hero_btn_donation',
    section: 'hero',
    label: 'Hero Button: Online Donation',
    textEn: 'Online E-Donation',
    defaultOr: 'ଅନଲାଇନ୍ ଇ-ଦାନ'
  },
  {
    key: 'hero_countdown_title',
    section: 'hero',
    label: 'Hero Countdown Heading',
    textEn: 'Countdown to Sandhi Puja 108 Lamps Muhurat',
    defaultOr: 'ସନ୍ଧି ପୂଜା ୧୦୮ ଦୀପ ମୁହୂର୍ତ୍ତ ସମୟ ଗଣନା'
  },
  {
    key: 'hero_countdown_subtitle',
    section: 'hero',
    label: 'Hero Countdown Subtitle & Date',
    textEn: 'Maha Ashtami Evening | Oct 18, 2026 at 07:45 PM',
    defaultOr: 'ମହା ଅଷ୍ଟମୀ ସନ୍ଧ୍ୟା | ଅକ୍ଟୋବର ୧୮, ୨୦୨୬ ରାତି ୭:୪୫'
  },
  {
    key: 'hero_highlight_1_title',
    section: 'hero',
    label: 'Highlight 1 Title (Torana)',
    textEn: '120ft Bauda Garh',
    defaultOr: '୧୨୦ ଫୁଟ ବାଉଡ଼ ଗଡ଼ ତୋରଣ'
  },
  {
    key: 'hero_highlight_1_desc',
    section: 'hero',
    label: 'Highlight 1 Description',
    textEn: 'Historic fort themed illumination gate',
    defaultOr: 'ଐତିହାସିକ ଦୁର୍ଗ ଆଲୋକସଜ୍ଜା ତୋରଣ'
  },
  {
    key: 'hero_highlight_2_title',
    section: 'hero',
    label: 'Highlight 2 Title (Medha)',
    textEn: '2.5kg Gold Medha',
    defaultOr: 'ସୁନା ଚାନ୍ଦି ମେଢ଼ ଓ ମୁକୁଟ'
  },
  {
    key: 'hero_highlight_2_desc',
    section: 'hero',
    label: 'Highlight 2 Description',
    textEn: 'Pure Gold & Silver ornament crown',
    defaultOr: 'ମା\'ଙ୍କ ମଥାରେ ସୁନା ମୁକୁଟ ଓ ଚାନ୍ଦି ଅଳଙ୍କାର'
  },

  // LIVE DARSHAN SECTION
  {
    key: 'live_section_badge',
    section: 'live',
    label: 'Live Section Badge',
    textEn: '24x7 Multi-Camera Broadcast',
    defaultOr: '୨୪x୭ ଘଣ୍ଟା ସିଧାପ୍ରସାରଣ'
  },
  {
    key: 'live_section_title',
    section: 'live',
    label: 'Live Section Title',
    textEn: 'Official 4K Ultra HD Live Darshan',
    defaultOr: 'ଅଫିସିଆଲ୍ ୪K HD ସିଧାପ୍ରସାରଣ ଦର୍ଶନ'
  },
  {
    key: 'live_section_desc',
    section: 'live',
    label: 'Live Section Description',
    textEn: 'Watch uninterrupted high definition live darshan from the sanctum sanctorum of Jharapada Durga Puja pandal directly on your device.',
    defaultOr: 'ଘରେ ବସି ମା\'ଙ୍କ ଦିବ୍ୟ ଦର୍ଶନ ଓ ଆଳତିର ସିଧାପ୍ରସାରଣ ଉପଭୋଗ କରନ୍ତୁ ।'
  },

  // GROUND MAP & CROWD STATUS
  {
    key: 'map_section_title',
    section: 'map',
    label: 'Map Section Title',
    textEn: 'Interactive 3D Melan Padia Ground Map',
    defaultOr: 'ମଣ୍ଡପ ପରିସର ଇଣ୍ଟରାକ୍ଟିଭ୍ ମାନଚିତ୍ର'
  },
  {
    key: 'map_section_desc',
    section: 'map',
    label: 'Map Section Description',
    textEn: 'Navigate entry gates, wheelchair ramps, food stalls, meena bazar, medical aid & parking zones.',
    defaultOr: 'ପ୍ରବେଶ ଦ୍ୱାର, ପାର୍କିଂ, ମୀନା ବଜାର, ପ୍ରସାଦ କାଉଣ୍ଟର ଓ ଚିକିତ୍ସା କେନ୍ଦ୍ରର ସ୍ଥିତି ଜାଣନ୍ତୁ ।'
  },
  {
    key: 'map_gate_a',
    section: 'map',
    label: 'Gate-A Name',
    textEn: 'Gate-A (Cuttack Road Side)',
    defaultOr: 'ଗେଟ୍-A (କଟକ ରୋଡ୍ ପାର୍ଶ୍ୱ)'
  },
  {
    key: 'map_gate_b',
    section: 'map',
    label: 'Gate-B Name (VIP Gate)',
    textEn: 'Gate-B (Jharapada Jail Side - VIP & Senior)',
    defaultOr: 'ଗେଟ୍-B (ଝାରପଡ଼ା ଜେଲ୍ ପାର୍ଶ୍ୱ - ଭିଆଇପି ଓ ବରିଷ୍ଠ ନାଗରିକ)'
  },
  {
    key: 'map_gate_c',
    section: 'map',
    label: 'Gate-C Name',
    textEn: 'Gate-C (Overbridge Side)',
    defaultOr: 'ଗେଟ୍-C (ଓଭରବ୍ରିଜ୍ ପାର୍ଶ୍ୱ)'
  },

  // SCHEDULE & RITUALS
  {
    key: 'schedule_section_title',
    section: 'schedule',
    label: 'Schedule Section Title',
    textEn: 'Vedic Puja Rituals & Cultural Program Schedule',
    defaultOr: 'ବୈଦିକ ପୂଜା ନୀତି ଓ ସାଂସ୍କୃତିକ କାର୍ଯ୍ୟକ୍ରମ ସୂଚୀ'
  },
  {
    key: 'schedule_section_desc',
    section: 'schedule',
    label: 'Schedule Section Description',
    textEn: 'Exact muhurat timings for Pushpanjali, Sandhi Puja 108 Lamps, Maha Bhog distribution, Ravan Podi fireworks, and Melody Nights.',
    defaultOr: 'ପୁଷ୍ପାଞ୍ଜଳି, ସନ୍ଧି ପୂଜା ୧୦୮ ଦୀପ, ମହାଭୋଗ ବଣ୍ଟନ ଓ ରାବଣ ପୋଡ଼ିର ସଠିକ୍ ସମୟସୂଚୀ ।'
  },

  // VIP PASSES & DONATION
  {
    key: 'pass_tab_title',
    section: 'passes',
    label: 'Pass Tab Name',
    textEn: 'Senior Citizen & VIP Pass',
    defaultOr: 'ବରିଷ୍ଠ ନାଗରିକ ଓ ଭିଆଇପି ପାସ୍'
  },
  {
    key: 'donation_tab_title',
    section: 'passes',
    label: 'Donation Tab Name',
    textEn: 'Instant E-Donation',
    defaultOr: 'ଅନଲାଇନ୍ ଇ-ଦାନ'
  },
  {
    key: 'pass_form_title',
    section: 'passes',
    label: 'Pass Form Heading',
    textEn: 'Senior Citizen / VIP Express Pass Form',
    defaultOr: 'ବରିଷ୍ଠ ନାଗରିକ ଓ ଭିନ୍ନକ୍ଷମ ଫାଷ୍ଟ-ଟ୍ରାକ୍ ପାସ୍'
  },
  {
    key: 'pass_form_desc',
    section: 'passes',
    label: 'Pass Form Subtitle',
    textEn: 'Generates an express QR pass for Gate-B fast-track entry with wheelchair support.',
    defaultOr: 'ଗେଟ୍-B ସ୍ୱତନ୍ତ୍ର ପ୍ରବେଶ ଦ୍ୱାର ପାଇଁ QR ପାସ୍ ହାସଲ କରନ୍ତୁ ।'
  },
  {
    key: 'pass_field_category',
    section: 'passes',
    label: 'Form Field: Pass Category',
    textEn: 'Pass Category',
    defaultOr: 'ପାସ୍ ଶ୍ରେଣୀ'
  },
  {
    key: 'pass_field_fullname',
    section: 'passes',
    label: 'Form Field: Full Name',
    textEn: 'Full Name',
    defaultOr: 'ସମ୍ପୂର୍ଣ୍ଣ ନାମ'
  },
  {
    key: 'pass_field_mobile',
    section: 'passes',
    label: 'Form Field: Mobile Number',
    textEn: 'Mobile Number',
    defaultOr: 'ମୋବାଇଲ୍ ନମ୍ବର'
  },
  {
    key: 'pass_field_date',
    section: 'passes',
    label: 'Form Field: Preferred Visit Date',
    textEn: 'Preferred Visit Date',
    defaultOr: 'ଦର୍ଶନ ତାରିଖ'
  },
  {
    key: 'pass_btn_generate',
    section: 'passes',
    label: 'Button: Generate Digital VIP Pass',
    textEn: 'Generate Digital VIP Pass',
    defaultOr: 'ଡିଜିଟାଲ୍ ଭିଆଇପି ପାସ୍ ପ୍ରସ୍ତୁତ କରନ୍ତୁ'
  },
  {
    key: 'pass_btn_print',
    section: 'passes',
    label: 'Button: Print / Download Pass',
    textEn: 'Print / Download QR Pass',
    defaultOr: 'ପାସ୍ ପ୍ରିଣ୍ଟ କରନ୍ତୁ'
  },
  {
    key: 'donation_form_title',
    section: 'passes',
    label: 'Donation Form Heading',
    textEn: 'Bhog Seva & Festival Welfare E-Donation',
    defaultOr: 'ମହାପ୍ରସାଦ ଭୋଗ ସେବା ଓ ଉନ୍ନୟନ ଦାନ'
  },
  {
    key: 'donation_form_desc',
    section: 'passes',
    label: 'Donation Form Subtitle',
    textEn: 'Support community Mahaprasad distribution & socio-cultural activities. Instant 80G tax benefit receipt generated.',
    defaultOr: 'ମହାପ୍ରସାଦ ବଣ୍ଟନ ଓ ସାମାଜିକ କାର୍ଯ୍ୟକ୍ରମ ପାଇଁ ସହଯୋଗ କରନ୍ତୁ । ତୁରନ୍ତ ରସିଦ ମିଳିବ ।'
  },

  // HERITAGE & LEGACY
  {
    key: 'heritage_section_title',
    section: 'heritage',
    label: 'Heritage Section Title',
    textEn: 'Half a Century of Faith & Grandeur',
    defaultOr: 'ଅର୍ଦ୍ଧ ଶତାବ୍ଦୀର ଭକ୍ତି, ସଂସ୍କୃତି ଓ ଗୌରବମୟ ଇତିହାସ'
  },
  {
    key: 'heritage_section_desc',
    section: 'heritage',
    label: 'Heritage Section Description',
    textEn: 'Founded in 1976, Jharapada Durga Puja Committee has grown to become one of Odisha’s most iconic socio-cultural celebrations.',
    defaultOr: '୧୯୭୬ ମସିହାରେ ଆରମ୍ଭ ହୋଇଥିବା ଝାରପଡ଼ା ଦୁର୍ଗା ପୂଜା ଆଜି ସମଗ୍ର ଓଡ଼ିଶାରେ ଏକ ଅନନ୍ୟ ପରିଚୟ ସୃଷ୍ଟି କରିଛି ।'
  },

  // FOOTER
  {
    key: 'footer_title',
    section: 'footer',
    label: 'Footer Title',
    textEn: 'Jharapada Durga Puja Samiti 2026',
    defaultOr: 'ଝାରପଡ଼ା ଦୁର୍ଗା ପୂଜା ସମିତି ୨୦୨୬'
  },
  {
    key: 'footer_address',
    section: 'footer',
    label: 'Footer Address',
    textEn: 'Jharapada Melan Padia, Near Special Jail, Cuttack-Puri Road, Bhubaneswar, Odisha - 751006',
    defaultOr: 'ଝାରପଡ଼ା ମେଳଣ ପଡ଼ିଆ, ସ୍ପେଶାଲ ଜେଲ୍ ନିକଟ, କଟକ-ପୁରୀ ରୋଡ୍, ଭୁବନେଶ୍ୱର, ଓଡ଼ିଶା - ୭୫୧୦୦୬'
  },
  {
    key: 'footer_helpline',
    section: 'footer',
    label: 'Footer Helpline',
    textEn: 'Emergency Gate Control & Police Assistance 24x7',
    defaultOr: '୨୪x୭ ଜରୁରୀକାଳୀନ ପୋଲିସ ଓ ସୁରକ୍ଷା ସହାୟତା'
  }
];

export const DEFAULT_TRANSLATIONS_MAP: Record<string, { textEn: string; defaultOr: string }> =
  DEFAULT_TRANSLATIONS.reduce((acc, item) => {
    acc[item.key] = { textEn: item.textEn, defaultOr: item.defaultOr };
    return acc;
  }, {} as Record<string, { textEn: string; defaultOr: string }>);
