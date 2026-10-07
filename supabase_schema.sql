-- ==============================================================================
-- JHARAPADA DURGA PUJA 2026 - COMPLETE SUPABASE POSTGRES DATABASE SCHEMA
-- ==============================================================================
-- Run this complete script in Supabase Dashboard -> SQL Editor
-- This creates all 10 tables, sets up Row Level Security (RLS) policies,
-- and seeds the initial dataset from mockData.ts so everything operates live on Supabase DB.
-- ==============================================================================

-- DROP EXISTING TABLES TO RESET INCOMPATIBLE COLUMN TYPES (e.g. UUID vs TEXT)
DROP TABLE IF EXISTS public.tickers CASCADE;
DROP TABLE IF EXISTS public.live_config CASCADE;
DROP TABLE IF EXISTS public.crowd_status CASCADE;
DROP TABLE IF EXISTS public.rituals CASCADE;
DROP TABLE IF EXISTS public.stalls CASCADE;
DROP TABLE IF EXISTS public.passes CASCADE;
DROP TABLE IF EXISTS public.donations CASCADE;
DROP TABLE IF EXISTS public.gallery CASCADE;
DROP TABLE IF EXISTS public.history_stories CASCADE;
DROP TABLE IF EXISTS public.pranam_messages CASCADE;

-- 1. TICKER ANNOUNCEMENTS TABLE
CREATE TABLE public.tickers (
  id TEXT PRIMARY KEY,
  text_en TEXT NOT NULL,
  text_or TEXT,
  type TEXT CHECK (type IN ('INFO', 'IMPORTANT', 'EMERGENCY')) DEFAULT 'INFO',
  active BOOLEAN DEFAULT true,
  timestamp TEXT DEFAULT 'Just now',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. LIVE STREAM CONFIGURATION TABLE
CREATE TABLE public.live_config (
  id INT PRIMARY KEY DEFAULT 1,
  active_platform TEXT CHECK (active_platform IN ('youtube', 'facebook', 'instagram')) DEFAULT 'youtube',
  youtube_id TEXT DEFAULT 'live_jharapada_2026_stream',
  facebook_url TEXT,
  instagram_url TEXT,
  title_en TEXT DEFAULT 'Maha Ashtami Sandhya Aarti & Grand Pandal Darshan Live 4K',
  title_or TEXT DEFAULT 'ମହା ଅଷ୍ଟମୀ ସନ୍ଧ୍ୟା ଆରତୀ ଓ ବାଉଡ଼ ଗଡ଼ ମଣ୍ଡପ ପ୍ରତ୍ୟକ୍ଷ ଲାଇଭ୍ ଦର୍ଶନ',
  is_live BOOLEAN DEFAULT true,
  viewers_count INT DEFAULT 14820,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. CROWD DENSITY & PARKING STATUS TABLE
CREATE TABLE public.crowd_status (
  id INT PRIMARY KEY DEFAULT 1,
  level TEXT CHECK (level IN ('normal', 'moderate', 'heavy')) DEFAULT 'moderate',
  wait_time_mins INT DEFAULT 20,
  gate_a INT DEFAULT 85,
  gate_b INT DEFAULT 45,
  gate_c INT DEFAULT 30,
  last_updated TEXT DEFAULT 'Just now',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. DAILY RITUAL SCHEDULE TABLE
CREATE TABLE public.rituals (
  id TEXT PRIMARY KEY,
  day_key TEXT UNIQUE NOT NULL,
  day_title_en TEXT NOT NULL,
  day_title_or TEXT,
  date DATE NOT NULL,
  events JSONB DEFAULT '[]'::jsonb,
  cultural_programs JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. MEENA BAZAAR STALLS TABLE
CREATE TABLE public.stalls (
  id TEXT PRIMARY KEY,
  stall_no TEXT NOT NULL,
  name_en TEXT NOT NULL,
  name_or TEXT,
  category TEXT CHECK (category IN ('food', 'pandal', 'amusement', 'emergency', 'handicraft', 'helpdesk')),
  description_en TEXT,
  description_or TEXT,
  location_on_map JSONB DEFAULT '{"x":50,"y":50}'::jsonb,
  phone TEXT,
  rating NUMERIC(3,1) DEFAULT 4.8,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. VIP FAST-TRACK DIGITAL QR PASSES TABLE
CREATE TABLE public.passes (
  id TEXT PRIMARY KEY,
  pass_type TEXT NOT NULL,
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  id_proof_number TEXT,
  number_of_guests INT DEFAULT 1,
  visit_date DATE NOT NULL,
  time_slot TEXT NOT NULL,
  qr_code_value TEXT UNIQUE NOT NULL,
  status TEXT DEFAULT 'Approved',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. ONLINE DONATIONS & 80G RECEIPT TABLE
CREATE TABLE public.donations (
  id TEXT PRIMARY KEY,
  donor_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  amount NUMERIC(10,2) NOT NULL,
  category TEXT NOT NULL,
  payment_id TEXT UNIQUE NOT NULL,
  payment_method TEXT DEFAULT 'UPI / Razorpay',
  date TEXT NOT NULL,
  receipt_number TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. PHOTO & VIDEO GALLERY MEDIA TABLE
CREATE TABLE public.gallery (
  id TEXT PRIMARY KEY,
  title_en TEXT NOT NULL,
  title_or TEXT,
  category TEXT CHECK (category IN ('pandal', 'idol', 'lights', 'celebrities', 'bhasani')),
  year INT DEFAULT 2026,
  type TEXT DEFAULT 'image',
  url TEXT NOT NULL,
  thumbnail_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. PRESS RELEASE NOTES & HISTORY STORIES TABLE
CREATE TABLE public.history_stories (
  id TEXT PRIMARY KEY,
  title_en TEXT NOT NULL,
  title_or TEXT,
  author_name TEXT NOT NULL,
  author_role TEXT DEFAULT 'Committee Member',
  category TEXT CHECK (category IN ('press_note', 'member_story', 'achievement', 'milestone')),
  year INT DEFAULT 2026,
  content_en TEXT NOT NULL,
  content_or TEXT,
  media_url TEXT,
  document_url TEXT,
  date_posted DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. PRANAM / PRAYER MESSAGES TABLE
CREATE TABLE public.pranam_messages (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  location TEXT DEFAULT 'Bhubaneswar',
  message TEXT NOT NULL,
  timestamp TEXT DEFAULT 'Just now',
  likes INT DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW()
);


-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES FOR ALL TABLES
-- ==============================================================================
ALTER TABLE public.tickers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.live_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crowd_status ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rituals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stalls ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.passes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.history_stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pranam_messages ENABLE ROW LEVEL SECURITY;

-- PUBLIC READ & WRITE POLICIES (ENABLES WEBSITES & ADMIN PORTAL ACCESS)
CREATE POLICY "Public Read All Tickers" ON public.tickers FOR SELECT USING (true);
CREATE POLICY "Public Write Tickers" ON public.tickers FOR ALL USING (true);

CREATE POLICY "Public Read Live Config" ON public.live_config FOR SELECT USING (true);
CREATE POLICY "Public Write Live Config" ON public.live_config FOR ALL USING (true);

CREATE POLICY "Public Read Crowd Status" ON public.crowd_status FOR SELECT USING (true);
CREATE POLICY "Public Write Crowd Status" ON public.crowd_status FOR ALL USING (true);

CREATE POLICY "Public Read Rituals" ON public.rituals FOR SELECT USING (true);
CREATE POLICY "Public Write Rituals" ON public.rituals FOR ALL USING (true);

CREATE POLICY "Public Read Stalls" ON public.stalls FOR SELECT USING (true);
CREATE POLICY "Public Write Stalls" ON public.stalls FOR ALL USING (true);

CREATE POLICY "Public Read Passes" ON public.passes FOR SELECT USING (true);
CREATE POLICY "Public Insert Passes" ON public.passes FOR INSERT WITH CHECK (true);

CREATE POLICY "Public Read Donations" ON public.donations FOR SELECT USING (true);
CREATE POLICY "Public Insert Donations" ON public.donations FOR INSERT WITH CHECK (true);

CREATE POLICY "Public Read Gallery" ON public.gallery FOR SELECT USING (true);
CREATE POLICY "Public Write Gallery" ON public.gallery FOR ALL USING (true);

CREATE POLICY "Public Read History Stories" ON public.history_stories FOR SELECT USING (true);
CREATE POLICY "Public Write History Stories" ON public.history_stories FOR ALL USING (true);

CREATE POLICY "Public Read Pranam Messages" ON public.pranam_messages FOR SELECT USING (true);
CREATE POLICY "Public Write Pranam Messages" ON public.pranam_messages FOR ALL USING (true);


-- ==============================================================================
-- STORAGE BUCKET POLICIES (FOR "gallery" AND "documents" BUCKETS)
-- ==============================================================================
INSERT INTO storage.buckets (id, name, public) 
VALUES ('gallery', 'gallery', true) 
ON CONFLICT (id) DO UPDATE SET public = true;

INSERT INTO storage.buckets (id, name, public) 
VALUES ('documents', 'documents', true) 
ON CONFLICT (id) DO UPDATE SET public = true;

-- DROP OLD STORAGE POLICIES IF THEY EXIST BEFORE CREATING
DO $$
BEGIN
    DROP POLICY IF EXISTS "Public Storage Select" ON storage.objects;
    DROP POLICY IF EXISTS "Public Storage Insert" ON storage.objects;
    DROP POLICY IF EXISTS "Public Storage Delete" ON storage.objects;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

CREATE POLICY "Public Storage Select" ON storage.objects FOR SELECT USING (bucket_id IN ('gallery', 'documents'));
CREATE POLICY "Public Storage Insert" ON storage.objects FOR INSERT WITH CHECK (bucket_id IN ('gallery', 'documents'));
CREATE POLICY "Public Storage Delete" ON storage.objects FOR DELETE USING (bucket_id IN ('gallery', 'documents'));


-- ==============================================================================
-- SEED INITIAL DATASET FROM MOCKDATA.TS
-- ==============================================================================

-- 1. SEED TICKERS
INSERT INTO public.tickers (id, text_en, text_or, type, active, timestamp) VALUES
('t-1', '✨ Sandhi Puja 108 Lamps ritual starts today at 7:45 PM | Live Pushpanjali stream active on YouTube & FB', '✨ ଆଜି ସନ୍ଧ୍ୟା ୭:୪୫ ରେ ସନ୍ଧି ପୂଜା ୧୦୮ ଦୀପ ମହା ଆରତୀ | ୟୁଟ୍ୟୁବ୍ ଏବଂ ଫେସବୁକରେ ଲାଇଭ୍ ଦର୍ଶନ ଉପଲବ୍ଧ', 'IMPORTANT', true, 'Just now'),
('t-2', '🚗 Parking Zone Gate-A (Cuttack Road) is 85% full. Please use Gate-B near Jharapada Jail ground.', '🚗 ପାର୍କିଂ ଜୋନ୍ ଗେଟ୍-A (କଟକ ରୋଡ୍) ୮୫% ପୂର୍ଣ୍ଣ । ଦୟାକରି ଝାରପଡା ଜେଲ ପଡିଆ ନିକଟ ଗେଟ୍-B ବ୍ୟବହାର କରନ୍ତୁ ।', 'INFO', true, '10 mins ago'),
('t-3', '🚑 Free Sanjeevani Medical Desk & Ambulance service available at Gate-3 with 24x7 doctors.', '🚑 ଗେଟ୍-୩ ନିକଟରେ ମାଗଣା ସଞ୍ଜୀବନୀ ଡାକ୍ତରୀ ସେବା ଏବଂ ଆମ୍ବୁଲାନ୍ସ ଉପଲବ୍ଧ ।', 'INFO', true, '30 mins ago'),
('t-4', '🎟️ Senior Citizens & Differently Abled Fast-Track QR Passes available for direct express entrance.', '🎟️ ବରିଷ୍ଠ ନାଗରିକ ଏବଂ ଭିନ୍ନକ୍ଷମଙ୍କ ପାଇଁ ସ୍ୱତନ୍ତ୍ର ଫାଷ୍ଟ-ଟ୍ରାକ୍ QR ପାସ୍ ମାଗଣାରେ ଉପଲବ୍ଧ ।', 'IMPORTANT', true, '1 hour ago')
ON CONFLICT (id) DO NOTHING;

-- 2. SEED LIVE CONFIG
INSERT INTO public.live_config (id, active_platform, youtube_id, facebook_url, instagram_url, title_en, title_or, is_live, viewers_count) VALUES
(1, 'youtube', 'live_jharapada_2026_stream', 'https://www.facebook.com/plugins/video.php?href=https://www.facebook.com/facebook/videos/10153231379946729/', 'https://www.instagram.com/p/C-jharapada2026/', 'Maha Ashtami Sandhya Aarti & Grand Pandal Darshan Live 4K', 'ମହା ଅଷ୍ଟମୀ ସନ୍ଧ୍ୟା ଆରତୀ ଓ ବାଉଡ଼ ଗଡ଼ ମଣ୍ଡପ ପ୍ରତ୍ୟକ୍ଷ ଲାଇଭ୍ ଦର୍ଶନ', true, 14820)
ON CONFLICT (id) DO NOTHING;

-- 3. SEED CROWD STATUS
INSERT INTO public.crowd_status (id, level, wait_time_mins, gate_a, gate_b, gate_c, last_updated) VALUES
(1, 'moderate', 20, 85, 45, 30, '2 mins ago')
ON CONFLICT (id) DO NOTHING;

-- 4. SEED GALLERY
INSERT INTO public.gallery (id, title_en, title_or, category, year, type, url) VALUES
('g-1', 'Bauda Garh Fort Theme Illumination 2026', 'ବାଉଡ଼ ଗଡ଼ ଆଲୋକସଜ୍ଜା ୨୦୨୬', 'pandal', 2026, 'image', 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=80'),
('g-2', 'Golden Silver Durga Idol Sanctum', 'ମା'' ଦୁର୍ଗାଙ୍କ ସୁନା ଚାନ୍ଦି ମେଢ଼', 'idol', 2026, 'image', 'https://images.unsplash.com/photo-1604580864964-0462f5d5b1a8?auto=format&fit=crop&w=1200&q=80'),
('g-3', 'Meena Bazaar Lights & Crowd Extravaganza', 'ମୀନା ବଜାର ଜନସମୁଦ୍ର', 'lights', 2026, 'image', 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80'),
('g-4', 'Sandhya Aarti & 108 Lamps Ceremony', '୧୦୮ ଦୀପ ସନ୍ଧ୍ୟା ଆରତୀ', 'idol', 2025, 'image', 'https://images.unsplash.com/photo-1609137144813-7d9921338f24?auto=format&fit=crop&w=1200&q=80'),
('g-5', 'Bhasani Procession Light Gates', 'ଭାସାଣି ଶୋଭାଯାତ୍ରା ଆଲୋକ ତୋରଣ', 'bhasani', 2025, 'image', 'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=1200&q=80'),
('g-6', 'Celebrity Visit & Stage Performance', 'ସାଂସ୍କୃତିକ ମଞ୍ଚ କାର୍ଯ୍ୟକ୍ରମ', 'celebrities', 2025, 'image', 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1200&q=80')
ON CONFLICT (id) DO NOTHING;

-- 5. SEED HISTORY STORIES & PRESS NOTES
INSERT INTO public.history_stories (id, title_en, title_or, author_name, author_role, category, year, content_en, content_or, media_url, date_posted) VALUES
('hs-1', 'Official Press Note: Unveiling of 120ft Bauda Garh Fort Theme for 2026', 'ପ୍ରେସ୍ ବିଜ୍ଞପ୍ତି: ୨୦୨୬ ମସିହା ବାଉଡ଼ ଗଡ଼ ସୁବର୍ଣ୍ଣ ତୋରଣ ଉନ୍ମୋଚନ', 'Er. Pramod Kumar Jena', 'President, Jharapada Durga Puja Samitee', 'press_note', 2026, 'The Jharapada Durga Puja Samitee is proud to announce the golden jubilee theme Bauda Garh Fort Extravaganza. Replicating historic Odisha and Indian fort architecture with eco-friendly bamboo, jute and 3D laser projection mapping.', 'ଝାରପଡ଼ା ଦୁର୍ଗା ପୂଜା ସମିତି ପକ୍ଷରୁ ସୁବର୍ଣ୍ଣ ଜୟନ୍ତୀ ଅବସରରେ ୧୨୦ ଫୁଟ୍ ବାଉଡ଼ ଗଡ଼ ତୋରଣ ନିର୍ମାଣ ସମ୍ପର୍କରେ ଆଧିକାରିକ ପ୍ରେସ ବିଜ୍ଞପ୍ତି ଜାରି କରାଯାଇଛି ।', 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=80', '2026-10-01'),
('hs-2', 'Founder Legacy Story: 1976 First Puja Memories by Elder Members', '୧୯୭୬ ପ୍ରଥମ ପୂଜା ସ୍ମୃତି: ପ୍ରତିଷ୍ଠାତା ସଦସ୍ୟଙ୍କ ମୁଖରୁ', 'Shri Rabindra Nath Dash', 'Founder Member & Chief Patron (1976)', 'member_story', 1976, 'Back in 1976, our village elders and youth pooled Rs. 500 to erect a modest bamboo structure. From those humble beginnings, Jharapada has grown to become Odisha’s premier festive destination.', '୧୯୭୬ ମସିହାରେ ଆମ ଝାରପଡ଼ାର ଯୁବକମାନେ ୫୦୦ ଟଙ୍କା ସଂଗ୍ରହ କରି ମା''ଙ୍କର ପ୍ରଥମ ପୂଜା ସ୍ଥାପନା କରିଥିଲେ ।', 'https://images.unsplash.com/photo-1604580864964-0462f5d5b1a8?auto=format&fit=crop&w=1200&q=80', '2026-09-15'),
('hs-3', 'Achievement: State Award for Best Eco-Friendly Pandal & Zero Waste Initiative', 'ରାଜ୍ୟ ସ୍ତରୀୟ ପୁରସ୍କାର: ସର୍ବୋତ୍ତମ ପରିବେଶ ଅନୁକୂଳ ମଣ୍ଡପ', 'Dr. Alok Mohanty', 'General Secretary', 'achievement', 2025, 'Jharapada Puja Committee was awarded the 1st prize for Zero Plastic Usage, Solar Lighting, and Eco-Friendly Clay Idol Crafting by Odisha Tourism.', 'ଓଡ଼ିଶା ପର୍ଯ୍ୟଟନ ବିଭାଗ ପକ୍ଷରୁ ଝାରପଡ଼ା ପୂଜା ସମିତିକୁ ସର୍ବୋତ୍ତମ ପରିବେଶ ଅନୁକୂଳ ପୂଜା ମଣ୍ଡପ ପୁରସ୍କାର ପ୍ରଦାନ କରାଯାଇଛି ।', 'https://images.unsplash.com/photo-1567157577867-05ccb1388e66?auto=format&fit=crop&w=1200&q=80', '2025-10-25')
ON CONFLICT (id) DO NOTHING;

-- 6. SEED PRANAM MESSAGES
INSERT INTO public.pranam_messages (id, name, location, message, timestamp, likes) VALUES
('p-1', 'Soumya Ranjan Mohanty', 'Bhubaneswar', 'Jai Maa Durga! Bless our Odisha with peace and prosperity. 🙏', '2 mins ago', 24),
('p-2', 'Priyanka Tripathy', 'London, UK', 'Watching live from London! The Bauda Garh pandal looks breathtaking. Jai Maa Jagatjanani! ❤️', '5 mins ago', 42),
('p-3', 'Debasish Patnaik', 'Bengaluru', 'Jai Maa Chandi! Missing Jharapada dahibara aloodum so much. Proud of our committee! ✨', '12 mins ago', 18),
('p-4', 'Ankita Dash', 'Cuttack', 'ମା''ଙ୍କ ସୁନା ଚାନ୍ଦି ମେଢ଼ ଅତ୍ୟନ୍ତ ମନୋରମ। ଜୟ ମା'' ଦୁର୍ଗା! 🌸', '18 mins ago', 35)
ON CONFLICT (id) DO NOTHING;

-- 7. SEED STALLS
INSERT INTO public.stalls (id, stall_no, name_en, name_or, category, description_en, description_or, location_on_map, phone, rating) VALUES
('s-1', 'P-01', 'Main Bauda Garh Fort Pandal & Sanctum', 'ମୁଖ୍ୟ ବାଉଡ଼ ଗଡ଼ ତୋରଣ ଓ ମଣ୍ଡପ', 'pandal', 'The 120ft grand gold-plated Bauda Garh Fort replica housing Goddess Durga in 2.5kg Gold Chandi Medha.', '୧୨୦ ଫୁଟ ଉଚ୍ଚ ସୁବର୍ଣ୍ଣ ବାଉଡ଼ ଗଡ଼ ତୋରଣ ଏବଂ ସୁନା ଚାନ୍ଦି ମେଢ଼', '{"x": 50, "y": 25}'::jsonb, null, 5.0),
('s-2', 'F-12', 'Famous Cuttack Dahibara Aloodum Corner', 'କଟକ ପ୍ରସିଦ୍ଧ ଦହିବରା ଆଳଉଦମ୍', 'food', 'Authentic spicy Dahibara, Aloodum, Ghuguni served with fresh coriander chutney & dahi pani.', 'ଖାଣ୍ଟି ସ୍ୱାଦିଷ୍ଟ ଦହିବରା, ଆଳୁଦମ୍, ଘୁଗୁନି', '{"x": 30, "y": 60}'::jsonb, '+91 98610 12345', 4.9),
('s-3', 'F-08', 'Pahala Original Chhena Poda & Rasagola Stall', 'ପାହାଳ ଅରିଜିନାଲ୍ ଛେନାପୋଡ଼ ଓ ରସଗୋଲା', 'food', 'Hot fresh baked Chhena Poda, Rasabali, Rabidi, and Gupchup.', 'ତାଜା ଗରମ ଛେନାପୋଡ଼, ରସଗୋଲା ଓ ରସାବଳି', '{"x": 40, "y": 65}'::jsonb, '+91 94370 54321', 4.8),
('s-4', 'A-01', 'Meena Bazaar Giant Ferris Wheel & Breakdance', 'ମୀନା ବଜାର ବଡ଼ ନାଗରଦୋଳା', 'amusement', '60ft high illuminated Giant Wheel, Columbus Ship, Kids Carousels, and Horror House.', '୬୦ ଫୁଟ ଉଚ୍ଚ ଆଲୋକିତ ନାଗରଦୋଳା, କଲମ୍ବସ ଓ ଖେଳଣା ଝୁଲା', '{"x": 80, "y": 50}'::jsonb, null, 4.7),
('s-5', 'E-01', '24x7 Sanjeevani Medical Camp & Ambulance', 'ସଞ୍ଜୀବନୀ ମାଗଣା ଡାକ୍ତରୀ କ୍ୟାମ୍ପ', 'emergency', 'Free medical aid, oxygen support, first-aid, emergency doctor on standby.', '୨୪ ਘଣ୍ଟିଆ ଆଶୁ ଚିକିତ୍ସା, ପ୍ରାଥମିକ ଚିକିତ୍ସା ଓ ଆମ୍ବୁଲାନ୍ସ', '{"x": 20, "y": 35}'::jsonb, '108 / +91 674 2589000', 5.0),
('s-6', 'H-03', 'Boyanika Odisha Handloom & Dokra Crafts', 'ବୟନିକା ଓଡ଼ିଶା ହସ୍ତତନ୍ତ ଓ ଢୋକ୍ରା ଶିଳ୍ପ', 'handicraft', 'Sambalpuri Sarees, Pipli Applique lamps, Wooden Jagannath Idols & Terracotta.', 'ସମ୍ବଲପୁରୀ ଶାଢ଼ୀ, ପିପିଲି ଚାନ୍ଦୁଆ ଓ କାଠ ତିଆରି ସାମଗ୍ରୀ', '{"x": 65, "y": 70}'::jsonb, null, 4.6),
('s-7', 'G-01', 'Senior Citizen & VIP Express Entrance Gate-B', 'ବରିଷ୍ଠ ନାଗରିକ ଓ ଭିଆଇପି ପ୍ରବେଶ ଦ୍ୱାର', 'helpdesk', 'Fast-track entry gate with wheelchair support and digital QR pass scanning.', 'ହୁଇଲ୍‌ଚେୟାର୍ ଓ QR ପାସ୍ ମାଧ୍ୟମରେ ସ୍ୱତନ୍ତ୍ର ପ୍ରବେଶ', '{"x": 15, "y": 20}'::jsonb, null, 4.9)
ON CONFLICT (id) DO NOTHING;
