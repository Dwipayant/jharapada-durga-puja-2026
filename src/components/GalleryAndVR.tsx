import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import type { GalleryMedia } from '../types';
import {
  Eye,
  Download,
  X,
  Camera,
  Upload,
  Compass,
  Play,
  Film,
  Calendar,
  Sparkles,
  Layers,
  Search,
  Tag
} from 'lucide-react';
import { PanoramaViewer } from './PanoramaViewer';

/** Helper to extract YouTube video ID from various URL formats */
const getYouTubeId = (url: string): string | null => {
  if (!url) return null;
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
  return match ? match[1] : null;
};

// Main category definitions
const MAIN_CATEGORIES = [
  { id: 'all', labelEn: 'All Categories', labelOr: 'ସମସ୍ତ ବିଭାଗ', icon: '🌟' },
  { id: 'day1', labelEn: 'Day 1 (Shasthi)', labelOr: 'ପ୍ରଥମ ଦିନ (ଷଷ୍ଠୀ)', icon: '📅', isDay: true },
  { id: 'day2', labelEn: 'Day 2 (Saptami)', labelOr: 'ଦ୍ୱିତୀୟ ଦିନ (ସପ୍ତମୀ)', icon: '📅', isDay: true },
  { id: 'day3', labelEn: 'Day 3 (Ashtami)', labelOr: 'ତୃତୀୟ ଦିନ (ଅଷ୍ଟମୀ)', icon: '📅', isDay: true },
  { id: 'day4', labelEn: 'Day 4 (Navami / Dashami)', labelOr: 'ଚତୁର୍ଥ ଦିନ (ନବମୀ/ଦଶମୀ)', icon: '📅', isDay: true },
  { id: 'bhasani', labelEn: 'Bhasani (Immersion)', labelOr: 'ଭାସାଣି ଶୋଭାଯାତ୍ରା', icon: '🎆', isDay: false },
  { id: 'emergency', labelEn: 'Emergency Service', labelOr: 'ଜରୁରୀକାଳୀନ ସେବା', icon: '🚨', isDay: false },
  { id: 'minabazar', labelEn: 'Minabazar', labelOr: 'ମୀନା ବଜାର ଓ ଆନନ୍ଦମେଳା', icon: '🎡', isDay: false },
] as const;

// Subcategories under Day 1, Day 2, Day 3, Day 4
const DAY_SUBCATEGORIES = [
  { id: 'all', labelEn: 'All Day Events', labelOr: 'ଦିନର ସମସ୍ତ ବିଭାଗ', icon: '✨' },
  { id: 'cultural', labelEn: 'Cultural Program', labelOr: 'ସାଂସ୍କୃତିକ କାର୍ଯ୍ୟକ୍ରମ', icon: '🎭' },
  { id: 'vip', labelEn: 'VIP Guests', labelOr: 'VIP ଅତିଥି', icon: '🎖️' },
  { id: 'rituals', labelEn: 'Rituals', labelOr: 'ରୀତିନୀତି ଓ ଆଳତି', icon: '🪔' },
] as const;

export const GalleryAndVR: React.FC = () => {
  const { language, gallery, setIsAdminModalOpen, registerModalOpen } = useApp();

  // Primary Session Switcher: Photos vs Videos
  const [activeMediaType, setActiveMediaType] = useState<'image' | 'video'>('image');

  // Year Filter: 'all' or specific year (2026, 2025, 2024...)
  const [activeYear, setActiveYear] = useState<number | 'all'>('all');

  // Main Category Filter: 'all' | 'day1' | 'day2' | 'day3' | 'day4' | 'bhasani' | 'emergency' | 'minabazar'
  const [activeCategory, setActiveCategory] = useState<string>('all');

  // Sub-Category Filter (for Day 1 - Day 4): 'all' | 'cultural' | 'vip' | 'rituals'
  const [activeSubCategory, setActiveSubCategory] = useState<string>('all');

  // Text search query
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modal Lightbox states
  const [selectedPhoto, setSelectedPhoto] = useState<GalleryMedia | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<GalleryMedia | null>(null);

  // 360 Panorama Tour state
  const [is360Active, setIs360Active] = useState<boolean>(false);

  useEffect(() => {
    registerModalOpen('gallery-media-modal', !!selectedPhoto || !!selectedVideo);
    return () => registerModalOpen('gallery-media-modal', false);
  }, [selectedPhoto, selectedVideo, registerModalOpen]);

  // Preset 360° views
  const preset360Views = [
    {
      id: 'fort',
      nameEn: '🏰 Bauda Garh 120ft Gate 360°',
      nameOr: '🏰 ବାଉଡ଼ ଗଡ଼ ତୋରଣ ୩୬୦°',
      url: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1600&q=80'
    },
    {
      id: 'sanctum',
      nameEn: '🛕 Goddess Durga Gold Sanctum 360°',
      nameOr: '🛕 ମା\' ଦୁର୍ଗା ସୁନା ଚାନ୍ଦି ମେଢ଼ ୩୬୦°',
      url: 'https://images.unsplash.com/photo-1604580864964-0462f5d5b1a8?auto=format&fit=crop&w=1600&q=80'
    },
    {
      id: 'lights',
      nameEn: '🎡 Meena Bazaar & Carnival 360°',
      nameOr: '🎡 ମୀନା ବଜାର ଓ ଆଲୋକସଜ୍ଜା ୩୬୦°',
      url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1600&q=80'
    }
  ];

  const [active360Url, setActive360Url] = useState<string>(preset360Views[0].url);
  const [active360Title, setActive360Title] = useState<string>(preset360Views[0].nameEn);

  // All distinct years sorted descending
  const availableYears = useMemo(() => {
    const years = Array.from(new Set(gallery.map(item => item.year || 2026)));
    if (!years.includes(2026)) years.push(2026);
    return years.sort((a, b) => b - a);
  }, [gallery]);

  // Counts for top-level switcher
  const totalPhotosCount = useMemo(() => {
    return gallery.filter(item => (item.type || 'image') === 'image').length;
  }, [gallery]);

  const totalVideosCount = useMemo(() => {
    return gallery.filter(item => item.type === 'video').length;
  }, [gallery]);

  // Check if a media item matches a main category
  const matchesCategory = (item: GalleryMedia, cat: string) => {
    if (cat === 'all') return true;
    if (item.category === cat) return true;
    // Legacy compatibility fallbacks
    if (cat === 'day3' && (item.category as string) === 'idol') return true;
    if (cat === 'minabazar' && ((item.category as string) === 'lights' || (item.category as string) === 'pandal')) return true;
    if (cat === 'day3' && (item.category as string) === 'celebrities') return true;
    if (cat === 'bhasani' && (item.category as string) === 'bhasani') return true;
    return false;
  };

  // Check if a media item matches a subcategory
  const matchesSubCategory = (item: GalleryMedia, subCat: string) => {
    if (subCat === 'all') return true;
    if (item.subCategory === subCat) return true;
    // Legacy compatibility fallbacks
    if (subCat === 'rituals' && (item.category as string) === 'idol') return true;
    if (subCat === 'vip' && (item.category as string) === 'celebrities') return true;
    return false;
  };

  // Check if active category is one of the Days
  const isDaySelected = ['day1', 'day2', 'day3', 'day4'].includes(activeCategory);

  // Filter items
  const filteredGallery = useMemo(() => {
    return gallery.filter(item => {
      const type = item.type || 'image';
      if (type !== activeMediaType) return false;
      if (activeYear !== 'all' && item.year !== activeYear) return false;
      if (!matchesCategory(item, activeCategory)) return false;
      if (isDaySelected && activeSubCategory !== 'all') {
        if (!matchesSubCategory(item, activeSubCategory)) return false;
      }
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const titleMatch = (item.titleEn?.toLowerCase() || '').includes(query) ||
          (item.titleOr?.toLowerCase() || '').includes(query);
        if (!titleMatch) return false;
      }
      return true;
    });
  }, [gallery, activeMediaType, activeYear, activeCategory, activeSubCategory, isDaySelected, searchQuery]);

  // Compute item count for year pills under current media type
  const getYearCount = (yr: number | 'all') => {
    return gallery.filter(item => {
      const type = item.type || 'image';
      if (type !== activeMediaType) return false;
      if (yr !== 'all' && item.year !== yr) return false;
      if (!matchesCategory(item, activeCategory)) return false;
      if (isDaySelected && activeSubCategory !== 'all') {
        if (!matchesSubCategory(item, activeSubCategory)) return false;
      }
      return true;
    }).length;
  };

  // Compute item count for category pills
  const getCategoryCount = (catId: string) => {
    return gallery.filter(item => {
      const type = item.type || 'image';
      if (type !== activeMediaType) return false;
      if (activeYear !== 'all' && item.year !== activeYear) return false;
      return matchesCategory(item, catId);
    }).length;
  };

  // Compute item count for subcategory pills under selected day
  const getSubCategoryCount = (subId: string) => {
    return gallery.filter(item => {
      const type = item.type || 'image';
      if (type !== activeMediaType) return false;
      if (activeYear !== 'all' && item.year !== activeYear) return false;
      if (!matchesCategory(item, activeCategory)) return false;
      return matchesSubCategory(item, subId);
    }).length;
  };

  // Group years to render
  const yearsToDisplay = useMemo(() => {
    if (activeYear !== 'all') {
      return [activeYear];
    }
    return availableYears;
  }, [activeYear, availableYears]);

  // Year title metadata helper
  const getYearSubtitle = (yr: number) => {
    switch (yr) {
      case 2026:
        return language === 'en'
          ? '16th Golden Jubilee Celebration Edition'
          : '16ତମ ସୁବର୍ଣ୍ଣ ଜୟନ୍ତୀ ମହୋତ୍ସବ ସଂସ୍କରଣ';
      case 2025:
        return language === 'en'
          ? 'Grand Festival & 108 Lotuses Sandhi Puja'
          : 'ମହାପୂଜା ଓ ୧୦୮ ପଦ୍ମ ସନ୍ଧି ପୂଜା ସ୍ମୃତି';
      case 2024:
        return language === 'en'
          ? 'Mysore Palace Architecture Heritage'
          : 'ମହୀଶୂର ରାଜପ୍ରାସାଦ ତୋରଣ ଓ ଧୁନୁଚି ଆରତୀ';
      default:
        return language === 'en' ? `Festive Archives of ${yr}` : `${yr} ମସିହାର ସ୍ମରଣୀୟ ମୁହୂର୍ତ୍ତ`;
    }
  };

  // Category labels helper
  const getCategoryDisplayLabel = (cat: string) => {
    const found = MAIN_CATEGORIES.find(c => c.id === cat);
    if (found) return language === 'en' ? found.labelEn : found.labelOr;
    return cat;
  };

  // Subcategory labels helper
  const getSubcategoryDisplayLabel = (subcat?: string) => {
    if (!subcat) return null;
    const found = DAY_SUBCATEGORIES.find(s => s.id === subcat && s.id !== 'all');
    if (found) return `${found.icon} ${language === 'en' ? found.labelEn : found.labelOr}`;
    return subcat;
  };

  // Reset all filters
  const handleResetFilters = () => {
    setActiveYear('all');
    setActiveCategory('all');
    setActiveSubCategory('all');
    setSearchQuery('');
  };

  return (
    <section id="gallery" className="py-16 bg-[#FFFDF8] relative text-amber-950 border-b border-[#D4AF37]/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100/90 border border-[#D4AF37] text-[#B8001F] text-xs font-bold uppercase tracking-wider mb-3 shadow-xs">
            <Camera className="w-4 h-4 text-[#B8001F]" />
            <span>{language === 'en' ? 'Festival Archives & Virtual Tour' : 'ଉତ୍ସବ ଅଭିଲେଖ ଓ ୩୬୦° ଭର୍ଚୁଆଲ ଟୁର'}</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold font-serif-royal royal-gold-heading mb-3">
            {language === 'en' ? 'Photo & Video Gallery' : 'ଫଟୋ ଓ ଭିଡିଓ ଗ୍ୟାଲେରୀ'}
          </h2>
          <p className="text-amber-950/80 text-sm sm:text-base font-medium">
            {language === 'en'
              ? 'Browse high-resolution photographs & 4K videos sorted year-wise, day-wise (Cultural Programs, VIP Guests, Rituals) plus Bhasani, Emergency Services, and Minabazar.'
              : 'ବର୍ଷ (୨୦୨୬, ୨୦୨୫), ପ୍ରତ୍ୟେକ ଦିନ (ସାଂସ୍କୃତିକ କାର୍ଯ୍ୟକ୍ରମ, VIP ଅତିଥି, ରୀତିନୀତି), ଭାସାଣି, ଜରୁରୀକାଳୀନ ସେବା ଓ ମୀନା ବଜାର ଅନୁଯାୟୀ ଫଟୋ ଓ ଭିଡିଓ ଦେଖନ୍ତୁ ।'}
          </p>
        </div>

        {/* 360 Virtual Tour Banner Card */}
        <div className="glass-card-gold p-5 sm:p-6 rounded-2xl border-2 border-[#D4AF37] mb-10 shadow-xl relative overflow-hidden">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5">
            <div className="space-y-1.5 text-left">
              <span className="px-2.5 py-0.5 rounded-full bg-[#B8001F] text-white text-[10px] font-black uppercase tracking-wider shadow-xs inline-flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-[#FFD700]" /> 360° INTERACTIVE VR WALKTHROUGH
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold font-serif-royal text-[#7D0000]">
                {language === 'en' ? 'Virtual Reality Pandal Walkthrough' : '୩୬୦° ଡିଜିଟାଲ୍ ମଣ୍ଡପ ଭ୍ରମଣ'}
              </h3>
              <p className="text-xs sm:text-sm text-amber-950/90 font-medium max-w-xl">
                {language === 'en'
                  ? 'Experience the 120ft Bauda Garh Fort and Gold Sanctum in 360° panoramic view with interactive drag controls & clickable hotspots.'
                  : 'ଘରେ ବସି ବାଉଡ଼ ଗଡ଼ ତୋରଣ ଏବଂ ସୁନା ମେଢ଼ ୩୬୦ ଡିଗ୍ରୀ ଅନୁଭୂତି ପାଆନ୍ତୁ ।'}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => setIsAdminModalOpen(true)}
                className="gold-button px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-sm text-amber-950 hover:bg-amber-300 transition-all cursor-pointer"
              >
                <Upload className="w-4 h-4 text-[#B8001F]" />
                <span>Upload Media (Admin)</span>
              </button>

              <button
                onClick={() => setIs360Active(!is360Active)}
                className="crimson-button px-5 py-2.5 rounded-xl font-extrabold text-xs flex items-center gap-2 shadow-md shrink-0 text-white cursor-pointer transition-all"
              >
                <Compass className="w-4 h-4 text-[#FFD700]" />
                <span>{is360Active ? (language === 'en' ? 'Hide 360° VR View' : '୩୬୦° ବନ୍ଦ କରନ୍ତୁ') : (language === 'en' ? 'Launch 360° VR View' : '୩୬୦° ଟୁର ଚାଲୁ କରନ୍ତୁ')}</span>
              </button>
            </div>
          </div>

          {/* Interactive 360 Panoramic Canvas Viewer */}
          {is360Active && (
            <div className="mt-6 space-y-4 animate-fadeIn border-t border-amber-300 pt-5">
              <div className="flex items-center gap-2 overflow-x-auto pb-2 text-xs font-bold">
                <span className="text-[#7D0000] font-extrabold shrink-0 flex items-center gap-1">
                  <Compass className="w-4 h-4" /> 360 Camera Angle:
                </span>

                {preset360Views.map(view => (
                  <button
                    key={view.id}
                    onClick={() => {
                      setActive360Url(view.url);
                      setActive360Title(view.nameEn);
                    }}
                    className={`px-3 py-1.5 rounded-lg shrink-0 transition-all cursor-pointer ${active360Url === view.url
                        ? 'bg-[#B8001F] text-white shadow-xs font-bold border border-[#FFD700]'
                        : 'bg-white text-amber-950 border border-amber-300 hover:bg-amber-100'
                      }`}
                  >
                    {language === 'en' ? view.nameEn : view.nameOr}
                  </button>
                ))}
              </div>

              <div className="aspect-[16/8] min-h-[350px] w-full relative rounded-xl overflow-hidden border-2 border-[#D4AF37] shadow-inner">
                <PanoramaViewer imageUrl={active360Url} title={active360Title} />
              </div>
            </div>
          )}
        </div>

        {/* ======================================================== */}
        {/* LEVEL 1: MEDIA TYPE SWITCHER (PHOTOS VS VIDEOS) */}
        {/* ======================================================== */}
        <div className="flex flex-col items-center justify-center mb-8">
          <div className="inline-flex p-1.5 rounded-2xl bg-amber-100/90 border-2 border-[#D4AF37] shadow-lg max-w-md w-full">
            <button
              onClick={() => setActiveMediaType('image')}
              className={`flex-1 flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl font-bold text-sm sm:text-base transition-all cursor-pointer ${activeMediaType === 'image'
                  ? 'crimson-button text-white shadow-md border border-[#FFD700]'
                  : 'text-amber-950 hover:bg-amber-200/60'
                }`}
            >
              <Camera className={`w-5 h-5 ${activeMediaType === 'image' ? 'text-[#FFD700]' : 'text-[#B8001F]'}`} />
              <span>{language === 'en' ? 'Photos' : 'ଫଟୋ ଗ୍ୟାଲେରୀ'}</span>
              <span className={`text-xs px-2 py-0.5 rounded-full font-black ${activeMediaType === 'image' ? 'bg-[#FFD700] text-[#7D0000]' : 'bg-amber-200 text-amber-900'
                }`}>
                {totalPhotosCount}
              </span>
            </button>

            <button
              onClick={() => setActiveMediaType('video')}
              className={`flex-1 flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl font-bold text-sm sm:text-base transition-all cursor-pointer ${activeMediaType === 'video'
                  ? 'crimson-button text-white shadow-md border border-[#FFD700]'
                  : 'text-amber-950 hover:bg-amber-200/60'
                }`}
            >
              <Film className={`w-5 h-5 ${activeMediaType === 'video' ? 'text-[#FFD700]' : 'text-[#B8001F]'}`} />
              <span>{language === 'en' ? 'Videos' : 'ଭିଡିଓ ଗ୍ୟାଲେରୀ'}</span>
              <span className={`text-xs px-2 py-0.5 rounded-full font-black ${activeMediaType === 'video' ? 'bg-[#FFD700] text-[#7D0000]' : 'bg-amber-200 text-amber-900'
                }`}>
                {totalVideosCount}
              </span>
            </button>
          </div>
        </div>

        {/* ======================================================== */}
        {/* HIERARCHICAL FILTER CONTAINER */}
        {/* ======================================================== */}
        <div className="bg-amber-50/80 p-5 rounded-2xl border border-amber-300 mb-8 shadow-sm space-y-4">

          {/* LEVEL 2: YEAR SELECTOR */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-amber-200/80">
            <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
              <span className="text-xs font-bold text-[#7D0000] uppercase tracking-wider shrink-0 flex items-center gap-1.5 mr-1">
                <Calendar className="w-4 h-4 text-[#B8001F]" />
                {language === 'en' ? 'Festival Year:' : 'ଉତ୍ସବ ବର୍ଷ:'}
              </span>

              {/* All Years Tab */}
              <button
                onClick={() => setActiveYear('all')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${activeYear === 'all'
                    ? 'bg-[#B8001F] text-white shadow-sm border border-[#FFD700]'
                    : 'bg-white text-amber-950 border border-amber-300 hover:bg-amber-100'
                  }`}
              >
                <span>{language === 'en' ? 'All Years' : 'ସମସ୍ତ ବର୍ଷ'}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${activeYear === 'all' ? 'bg-amber-300 text-[#7D0000]' : 'bg-amber-100 text-amber-800'
                  }`}>
                  {getYearCount('all')}
                </span>
              </button>

              {/* Specific Year Tabs */}
              {availableYears.map(yr => (
                <button
                  key={yr}
                  onClick={() => setActiveYear(yr)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${activeYear === yr
                      ? 'bg-[#B8001F] text-white shadow-sm border border-[#FFD700]'
                      : 'bg-white text-amber-950 border border-amber-300 hover:bg-amber-100'
                    }`}
                >
                  <span>{yr}</span>
                  {yr === 2026 && (
                    <span className="text-[9px] bg-[#FFD700] text-[#7D0000] px-1.5 py-0.2 rounded-full font-black uppercase tracking-tight">
                      16th
                    </span>
                  )}
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${activeYear === yr ? 'bg-amber-300 text-[#7D0000]' : 'bg-amber-100 text-amber-800'
                    }`}>
                    {getYearCount(yr)}
                  </span>
                </button>
              ))}
            </div>

            {/* Quick Title Search */}
            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 text-amber-700 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={language === 'en' ? 'Search photos/videos...' : 'ଖୋଜନ୍ତୁ...'}
                className="w-full bg-white border border-amber-300 rounded-xl pl-8 pr-3 py-1.5 text-xs text-amber-950 font-medium focus:outline-none focus:border-[#B8001F]"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-amber-700 hover:text-[#B8001F]"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* LEVEL 3: MAIN CATEGORIES (Day 1, Day 2, Day 3, Day 4, Bhasani, Emergency Service, Minabazar) */}
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#7D0000] uppercase tracking-wider">
              <Layers className="w-3.5 h-3.5 text-[#B8001F]" />
              <span>{language === 'en' ? 'Category / Day:' : 'ବିଭାଗ / ଦିବସ:'}</span>
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-bold">
              {MAIN_CATEGORIES.map((cat) => {
                const count = getCategoryCount(cat.id);
                const isSelected = activeCategory === cat.id;

                return (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setActiveCategory(cat.id);
                      setActiveSubCategory('all'); // Reset subcategory when main category changes
                    }}
                    className={`px-3 py-2 rounded-xl transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${isSelected
                        ? 'bg-[#7D0000] text-white shadow-md font-extrabold border border-[#FFD700]'
                        : 'bg-white text-amber-950 hover:bg-amber-100 border border-amber-300'
                      }`}
                  >
                    <span>{cat.icon}</span>
                    <span>{language === 'en' ? cat.labelEn : cat.labelOr}</span>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${isSelected ? 'bg-[#FFD700] text-[#7D0000]' : 'bg-amber-100 text-amber-800'
                      }`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* LEVEL 4: DAY SUBCATEGORIES (Only shown when Day 1, Day 2, Day 3, or Day 4 is selected) */}
          {isDaySelected && (
            <div className="p-3 bg-amber-100/70 rounded-xl border border-amber-300/80 animate-fadeIn space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-[#8B0000] uppercase tracking-wider flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-[#B8001F]" />
                  <span>
                    {language === 'en'
                      ? `${getCategoryDisplayLabel(activeCategory)} Events & Categories:`
                      : `${getCategoryDisplayLabel(activeCategory)} କାର୍ଯ୍ୟକ୍ରମ:`}
                  </span>
                </span>
                <span className="text-[10px] text-amber-950/70 font-semibold">
                  {language === 'en' ? 'Filter by program type' : 'ବିଭାଗ ଅନୁସାରେ ଫିଲ୍ଟର କରନ୍ତୁ'}
                </span>
              </div>

              <div className="flex items-center gap-2 overflow-x-auto text-xs font-bold pb-0.5">
                {DAY_SUBCATEGORIES.map((sub) => {
                  const subCount = getSubCategoryCount(sub.id);
                  const isSelected = activeSubCategory === sub.id;

                  return (
                    <button
                      key={sub.id}
                      onClick={() => setActiveSubCategory(sub.id)}
                      className={`px-3 py-1.5 rounded-lg transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${isSelected
                          ? 'bg-[#B8001F] text-white shadow-xs font-black border border-[#FFD700]'
                          : 'bg-white text-amber-950 hover:bg-amber-200/70 border border-amber-300'
                        }`}
                    >
                      <span>{sub.icon}</span>
                      <span>{language === 'en' ? sub.labelEn : sub.labelOr}</span>
                      <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${isSelected ? 'bg-amber-300 text-[#7D0000]' : 'bg-amber-100 text-amber-800'
                        }`}>
                        {subCount}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* ACTIVE FILTER SUMMARY & RESET BAR */}
          {(activeYear !== 'all' || activeCategory !== 'all' || activeSubCategory !== 'all' || searchQuery) && (
            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-amber-200/80 text-xs">
              <div className="flex flex-wrap items-center gap-1.5 text-amber-900 font-semibold">
                <span className="text-[11px] text-amber-900/70 uppercase tracking-wider font-bold">Applied:</span>
                {activeYear !== 'all' && (
                  <span className="px-2 py-0.5 rounded-md bg-amber-200 text-amber-950 font-bold text-[11px]">
                    Year: {activeYear}
                  </span>
                )}
                {activeCategory !== 'all' && (
                  <span className="px-2 py-0.5 rounded-md bg-amber-200 text-amber-950 font-bold text-[11px]">
                    Category: {getCategoryDisplayLabel(activeCategory)}
                  </span>
                )}
                {isDaySelected && activeSubCategory !== 'all' && (
                  <span className="px-2 py-0.5 rounded-md bg-amber-200 text-amber-950 font-bold text-[11px]">
                    Sub: {getSubcategoryDisplayLabel(activeSubCategory)}
                  </span>
                )}
                {searchQuery && (
                  <span className="px-2 py-0.5 rounded-md bg-amber-200 text-amber-950 font-bold text-[11px]">
                    Query: "{searchQuery}"
                  </span>
                )}
                <span className="text-[11px] font-bold text-[#8B0000] ml-1">
                  ({filteredGallery.length} {activeMediaType === 'image' ? 'photos' : 'videos'})
                </span>
              </div>

              <button
                onClick={handleResetFilters}
                className="px-3 py-1 rounded-lg bg-amber-200 hover:bg-amber-300 text-amber-950 font-bold transition-all flex items-center gap-1 cursor-pointer shrink-0"
              >
                <X className="w-3.5 h-3.5 text-[#B8001F]" />
                <span>{language === 'en' ? 'Clear All Filters' : 'ଫିଲ୍ଟର ହଟାନ୍ତୁ'}</span>
              </button>
            </div>
          )}
        </div>

        {/* ======================================================== */}
        {/* MEDIA DISPLAY (YEAR-WISE SECTIONS WITH METADATA TAGS) */}
        {/* ======================================================== */}
        {filteredGallery.length === 0 ? (
          /* Empty State */
          <div className="text-center py-16 px-4 bg-amber-50/50 rounded-2xl border-2 border-dashed border-amber-300 my-8">
            <div className="w-16 h-16 rounded-full bg-amber-100 border border-amber-300 flex items-center justify-center mx-auto mb-3 text-[#B8001F]">
              {activeMediaType === 'image' ? <Camera className="w-8 h-8" /> : <Film className="w-8 h-8" />}
            </div>
            <h4 className="text-lg font-bold font-serif-royal text-[#7D0000] mb-1">
              {language === 'en'
                ? `No ${activeMediaType === 'image' ? 'Photos' : 'Videos'} Found for Selected Category`
                : `ବାଛିଥିବା ବିଭାଗ ପାଇଁ କୌଣସି ${activeMediaType === 'image' ? 'ଫଟୋ' : 'ଭିଡିଓ'} ମିଳିଲା ନାହିଁ`}
            </h4>
            <p className="text-xs text-amber-950/70 max-w-md mx-auto mb-4">
              {language === 'en'
                ? `Try switching between Day 1 - Day 4, Bhasani, Minabazar, or select 'All Categories'.`
                : `ଦୟାକରି ଅନ୍ୟ ଏକ ବିଭାଗ ବାଛନ୍ତୁ କିମ୍ବା ସମସ୍ତ ବିଭାଗ ଦେଖନ୍ତୁ ।`}
            </p>
            <button
              onClick={handleResetFilters}
              className="gold-button px-4 py-2 rounded-xl text-xs font-bold text-amber-950 shadow-sm cursor-pointer"
            >
              {language === 'en' ? 'Show All Media' : 'ସମସ୍ତ ଫାଇଲ ଦେଖନ୍ତୁ'}
            </button>
          </div>
        ) : (
          <div className="space-y-12">
            {yearsToDisplay.map((year) => {
              const yearItems = filteredGallery.filter(item => item.year === year);
              if (yearItems.length === 0) return null;

              return (
                <div key={year} className="space-y-5 animate-fadeIn">

                  {/* Year Section Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b-2 border-[#D4AF37]/50 gap-2">
                    <div className="flex items-center gap-3">
                      <div className="px-3 py-1 rounded-xl bg-linear-to-r from-[#B8001F] to-[#7D0000] text-[#FFD700] text-sm font-black border border-[#FFD700] shadow-md flex items-center gap-1.5">
                        <Calendar className="w-4 h-4 text-[#FFD700]" />
                        <span>{year}</span>
                      </div>
                      <div>
                        <h3 className="text-xl sm:text-2xl font-bold font-serif-royal text-[#7D0000]">
                          {language === 'en'
                            ? `${year} Festive ${activeMediaType === 'image' ? 'Photo' : 'Video'} Collection`
                            : `${year} ମସିହାର ${activeMediaType === 'image' ? 'ଫଟୋ' : 'ଭିଡିଓ'} ସଂଗ୍ରହ`}
                        </h3>
                        <p className="text-xs text-amber-950/75 font-medium">
                          {getYearSubtitle(year)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-[#8B0000] bg-amber-100/90 border border-amber-300 px-3 py-1 rounded-lg">
                        {yearItems.length} {activeMediaType === 'image' ? (language === 'en' ? 'Photos' : 'ଫଟୋ') : (language === 'en' ? 'Videos' : 'ଭିଡିଓ')}
                      </span>
                    </div>
                  </div>

                  {/* PHOTOS GRID */}
                  {activeMediaType === 'image' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                      {yearItems.map((item) => (
                        <div
                          key={item.id}
                          onClick={() => setSelectedPhoto(item)}
                          className="glass-card rounded-2xl overflow-hidden border border-amber-300 hover:border-[#B8001F] hover:shadow-xl transition-all duration-300 cursor-pointer group flex flex-col bg-white"
                        >
                          <div className="aspect-[4/3] w-full overflow-hidden relative bg-amber-50">
                            <img
                              src={item.url}
                              alt={item.titleEn}
                              loading="lazy"
                              className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                            />
                            {/* Hover Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
                              <span className="text-xs font-bold text-[#FFD700] flex items-center gap-1.5 drop-shadow-md">
                                <Eye className="w-4 h-4 text-[#FFD700]" />
                                {language === 'en' ? 'View High-Res Photo' : 'ପୂର୍ଣ୍ଣ ଫଟୋ ଦେଖନ୍ତୁ'}
                              </span>
                            </div>

                            {/* Year Badge */}
                            <span className="absolute top-2.5 left-2.5 bg-[#B8001F] text-[#FFD700] text-[10px] font-black px-2 py-0.5 rounded shadow-sm border border-[#FFD700]/40">
                              {item.year}
                            </span>

                            {/* Main Category Badge */}
                            <span className="absolute top-2.5 right-2.5 bg-black/75 text-amber-200 text-[10px] font-bold px-2 py-0.5 rounded backdrop-blur-xs capitalize border border-amber-400/30">
                              {getCategoryDisplayLabel(item.category)}
                            </span>

                            {/* SubCategory Badge if available */}
                            {item.subCategory && (
                              <span className="absolute bottom-2.5 left-2.5 bg-[#7D0000]/90 text-[#FFD700] text-[10px] font-bold px-2 py-0.5 rounded backdrop-blur-xs border border-[#FFD700]/40">
                                {getSubcategoryDisplayLabel(item.subCategory)}
                              </span>
                            )}
                          </div>

                          <div className="p-3.5 bg-white flex-1 flex flex-col justify-between">
                            <h4 className="text-xs sm:text-sm font-bold text-amber-950 font-serif-royal line-clamp-2 group-hover:text-[#8B0000] transition-colors">
                              {language === 'en' ? item.titleEn : item.titleOr}
                            </h4>
                            <div className="pt-2 mt-2 border-t border-amber-100 flex items-center justify-between text-[11px] text-amber-900/60 font-medium">
                              <span className="capitalize">{getCategoryDisplayLabel(item.category)}</span>
                              <span className="text-[#B8001F] font-bold group-hover:underline">Click to Expand</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* VIDEOS GRID */}
                  {activeMediaType === 'video' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                      {yearItems.map((item) => (
                        <div
                          key={item.id}
                          onClick={() => setSelectedVideo(item)}
                          className="glass-card rounded-2xl overflow-hidden border-2 border-amber-300 hover:border-[#B8001F] hover:shadow-2xl transition-all duration-300 cursor-pointer group flex flex-col bg-white relative"
                        >
                          <div className="aspect-[16/10] w-full overflow-hidden relative bg-black">
                            <img
                              src={item.thumbnailUrl || item.url}
                              alt={item.titleEn}
                              loading="lazy"
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                            />
                            {/* Dark Gradient Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

                            {/* Center Play Button Pulse */}
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="w-14 h-14 rounded-full bg-[#B8001F]/90 group-hover:bg-[#B8001F] border-2 border-[#FFD700] text-white flex items-center justify-center shadow-2xl group-hover:scale-115 transition-all duration-300">
                                <Play className="w-7 h-7 text-[#FFD700] fill-[#FFD700] ml-1" />
                              </div>
                            </div>

                            {/* Year Badge */}
                            <span className="absolute top-3 left-3 bg-[#B8001F] text-[#FFD700] text-[10px] font-black px-2.5 py-0.5 rounded-full shadow-md border border-[#FFD700]/50 flex items-center gap-1">
                              <Calendar className="w-3 h-3" /> {item.year}
                            </span>

                            {/* Video 4K Badge */}
                            <span className="absolute top-3 right-3 bg-black/80 text-white text-[10px] font-bold px-2 py-0.5 rounded-md backdrop-blur-xs flex items-center gap-1 border border-amber-500/30">
                              <Film className="w-3 h-3 text-[#FFD700]" /> 4K VIDEO
                            </span>

                            {/* Category Pill */}
                            <div className="absolute bottom-3 left-3 flex items-center gap-1.5 flex-wrap">
                              <span className="bg-[#7D0000]/90 text-[#FFD700] text-[10px] font-bold px-2 py-0.5 rounded backdrop-blur-xs border border-[#FFD700]/30">
                                {getCategoryDisplayLabel(item.category)}
                              </span>
                              {item.subCategory && (
                                <span className="bg-black/75 text-amber-200 text-[10px] font-bold px-2 py-0.5 rounded backdrop-blur-xs border border-amber-400/30">
                                  {getSubcategoryDisplayLabel(item.subCategory)}
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="p-4 bg-white flex-1 flex flex-col justify-between">
                            <h4 className="text-sm font-bold text-amber-950 font-serif-royal line-clamp-2 mb-2 group-hover:text-[#8B0000] transition-colors">
                              {language === 'en' ? item.titleEn : item.titleOr}
                            </h4>

                            <div className="flex items-center justify-between text-xs font-bold text-[#8B0000] pt-2 border-t border-amber-100">
                              <span className="flex items-center gap-1.5">
                                <Play className="w-3.5 h-3.5 text-[#B8001F] fill-[#B8001F]" />
                                {language === 'en' ? 'Watch Full Video' : 'ଭିଡିଓ ଦେଖନ୍ତୁ'}
                              </span>
                              <span className="text-[11px] text-amber-900/60 font-semibold">
                                Click to Play
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                </div>
              );
            })}
          </div>
        )}

        {/* SELECTED PHOTO LIGHTBOX MODAL */}
        {selectedPhoto && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
            <div className="max-w-4xl w-full bg-white rounded-2xl border-2 border-[#D4AF37] overflow-hidden relative shadow-2xl flex flex-col">

              {/* Modal Top Bar */}
              <div className="p-3.5 bg-amber-50 border-b border-amber-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="bg-[#B8001F] text-[#FFD700] text-xs font-black px-2.5 py-0.5 rounded shadow-xs">
                    {selectedPhoto.year}
                  </span>
                  <span className="text-xs font-bold text-amber-900 bg-white px-2.5 py-0.5 rounded border border-amber-200">
                    {getCategoryDisplayLabel(selectedPhoto.category)}
                  </span>
                  {selectedPhoto.subCategory && (
                    <span className="text-xs font-bold text-[#7D0000] bg-amber-100 px-2.5 py-0.5 rounded border border-amber-300">
                      {getSubcategoryDisplayLabel(selectedPhoto.subCategory)}
                    </span>
                  )}
                </div>
                <button
                  onClick={() => setSelectedPhoto(null)}
                  className="p-1.5 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-950 hover:text-[#B8001F] transition-colors cursor-pointer"
                  title="Close Preview"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Photo Display */}
              <div className="max-h-[70vh] bg-black flex items-center justify-center overflow-hidden">
                <img
                  src={selectedPhoto.url}
                  alt={selectedPhoto.titleEn}
                  className="max-h-[70vh] w-auto object-contain"
                />
              </div>

              {/* Modal Footer */}
              <div className="p-4 bg-amber-50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-t border-amber-200">
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-[#8B0000] font-serif-royal">
                    {language === 'en' ? selectedPhoto.titleEn : selectedPhoto.titleOr}
                  </h3>
                  <span className="text-xs text-amber-900/70 font-medium">
                    Jharapada Durga Puja Committee • Archive {selectedPhoto.year}
                  </span>
                </div>

                <a
                  href={selectedPhoto.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  download
                  className="crimson-button px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 text-white shrink-0 cursor-pointer shadow-md"
                >
                  <Download className="w-4 h-4 text-[#FFD700]" />
                  <span>Download High-Res Photo</span>
                </a>
              </div>
            </div>
          </div>
        )}

        {/* SELECTED VIDEO PLAYER MODAL */}
        {selectedVideo && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fadeIn">
            <div className="max-w-4xl w-full bg-stone-900 rounded-2xl border-2 border-[#D4AF37] overflow-hidden relative shadow-2xl flex flex-col">

              {/* Modal Top Bar */}
              <div className="p-3.5 bg-black/80 border-b border-amber-500/30 flex items-center justify-between text-white">
                <div className="flex items-center gap-2 overflow-hidden pr-2">
                  <span className="bg-[#B8001F] text-[#FFD700] text-xs font-black px-2 py-0.5 rounded shrink-0">
                    {selectedVideo.year}
                  </span>
                  <span className="text-xs font-bold text-amber-300 bg-stone-800 px-2 py-0.5 rounded shrink-0">
                    {getCategoryDisplayLabel(selectedVideo.category)}
                  </span>
                  {selectedVideo.subCategory && (
                    <span className="text-xs font-bold text-[#FFD700] bg-[#7D0000] px-2 py-0.5 rounded shrink-0">
                      {getSubcategoryDisplayLabel(selectedVideo.subCategory)}
                    </span>
                  )}
                  <h3 className="text-sm sm:text-base font-bold font-serif-royal text-amber-100 truncate">
                    {language === 'en' ? selectedVideo.titleEn : selectedVideo.titleOr}
                  </h3>
                </div>

                <button
                  onClick={() => setSelectedVideo(null)}
                  className="p-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-white hover:text-[#FFD700] transition-colors cursor-pointer shrink-0"
                  title="Close Video"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Video Player Container */}
              <div className="aspect-[16/9] w-full bg-black flex items-center justify-center">
                {getYouTubeId(selectedVideo.url) ? (
                  <iframe
                    src={`https://www.youtube-nocookie.com/embed/${getYouTubeId(selectedVideo.url)}?autoplay=1&rel=0&modestbranding=1`}
                    title={selectedVideo.titleEn}
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <video
                    src={selectedVideo.url}
                    controls
                    autoPlay
                    className="w-full h-full object-contain"
                  />
                )}
              </div>

              {/* Modal Footer */}
              <div className="p-3.5 bg-stone-900 border-t border-amber-500/20 text-white flex items-center justify-between text-xs">
                <div className="truncate">
                  <span className="font-bold text-amber-200">
                    {language === 'en' ? selectedVideo.titleEn : selectedVideo.titleOr}
                  </span>
                </div>
                {selectedVideo.url && (
                  <a
                    href={selectedVideo.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-amber-400 hover:text-amber-300 underline font-bold shrink-0 ml-3"
                  >
                    Open Source Video Link ↗
                  </a>
                )}
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
