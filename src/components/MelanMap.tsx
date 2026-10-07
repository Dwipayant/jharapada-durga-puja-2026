import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import type { StallItem } from '../types';
import { 
  MapPin, 
  Search, 
  Phone, 
  Star, 
  X,
  Navigation
} from 'lucide-react';

export const MelanMap: React.FC = () => {
  const { language, stalls, registerModalOpen } = useApp();

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeStall, setActiveStall] = useState<StallItem | null>(null);

  useEffect(() => {
    registerModalOpen('stall-modal', !!activeStall);
    return () => registerModalOpen('stall-modal', false);
  }, [activeStall, registerModalOpen]);

  const filteredStalls = stalls.filter(s => {
    const matchesCategory = selectedCategory === 'all' || s.category === selectedCategory;
    const matchesSearch = 
      s.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.nameOr.includes(searchQuery) ||
      s.stallNo.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <section id="ground-map" className="py-16 bg-[#FFFDF8] relative text-amber-950 border-b border-[#D4AF37]/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-100/80 border border-amber-300 text-[#B8001F] text-xs font-bold uppercase tracking-wider mb-3 shadow-sm">
            <MapPin className="w-4 h-4 text-[#B8001F]" />
            <span>{language === 'en' ? '5-Acre Festival Ground Map' : '୫ ଏକର ମେଲଣ ପଡ଼ିଆ ମାନଚିତ୍ର'}</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold font-serif-royal royal-gold-heading mb-3">
            {language === 'en' ? 'Interactive Ground Map & Stalls' : 'ମଣ୍ଡପ ନକ୍ସା ଓ ଦୋକାନ ସୂଚୀ'}
          </h2>
          <p className="text-amber-950/80 text-sm sm:text-base font-medium">
            {language === 'en' 
              ? 'Navigate through Jharapada Melan Padia ground, find Dahibara & Chhena Poda food stalls, Meena Bazaar rides, first-aid camps, and VIP gates.'
              : 'ମେଲଣ ପଡ଼ିଆରେ ଥିବା ସମସ୍ତ ଖାଦ୍ୟ ଷ୍ଟଲ୍, ମୀନା ବଜାର ନାଗରଦୋଳା, ସଞ୍ଜୀବନୀ ମେଡିକାଲ କ୍ୟାମ୍ପ ଓ ପ୍ରବେଶ ଦ୍ୱାରର ଅବସ୍ଥିତି ଦେଖନ୍ତୁ ।'}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Interactive 2D SVG Ground Map Container */}
          <div className="lg:col-span-7 glass-card-gold p-4 sm:p-6 rounded-2xl relative shadow-xl border-2 border-[#D4AF37]">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-[#7D0000] uppercase tracking-wider flex items-center gap-1.5">
                <Navigation className="w-4 h-4 text-[#B8001F] animate-spin" style={{ animationDuration: '8s' }} />
                {language === 'en' ? 'Interactive Layout Map (Click Pins)' : 'ଇଣ୍ଟରାକ୍ଟିଭ୍ ମ୍ୟାପ୍ (ପିନ୍‌ରେ କ୍ଲିକ୍ କରନ୍ତୁ)'}
              </span>
              <span className="text-[10px] bg-[#B8001F] text-white px-2 py-0.5 rounded font-bold shadow-sm">
                Jharapada Melan Padia 2026
              </span>
            </div>

            {/* SVG Visual Map Area */}
            <div className="relative w-full aspect-[4/3] bg-[#FFF5E5] border-2 border-[#D4AF37]/50 rounded-xl overflow-hidden shadow-inner group">
              {/* Ground Background Blueprint Graphics */}
              <svg className="absolute inset-0 w-full h-full opacity-40" viewBox="0 0 500 375" fill="none">
                <rect width="500" height="375" fill="#FFF5E5" />
                {/* Pathways */}
                <path d="M50 375 L50 100 L450 100 L450 375" stroke="#C59B27" strokeWidth="12" strokeDasharray="10 5" />
                <path d="M250 100 L250 375" stroke="#C59B27" strokeWidth="10" strokeDasharray="10 5" />
                {/* Main Gate A */}
                <rect x="220" y="350" width="60" height="25" fill="#B8001F" rx="4" />
                <text x="250" y="367" fill="#FFFFFF" fontSize="10" fontWeight="bold" textAnchor="middle">GATE A</text>
                {/* Main Pandal Circle */}
                <circle cx="250" cy="90" r="50" fill="#B8001F" opacity="0.3" stroke="#B8001F" strokeWidth="2" />
              </svg>

              {/* Map Nodes / Stalls Interactive Pins */}
              {stalls.map((s) => {
                const isSelected = activeStall?.id === s.id;
                return (
                  <button
                    key={s.id}
                    onClick={() => setActiveStall(s)}
                    style={{ left: `${s.locationOnMap.x}%`, top: `${s.locationOnMap.y}%` }}
                    className={`absolute -translate-x-1/2 -translate-y-1/2 p-2 rounded-full transition-all duration-300 transform hover:scale-125 z-20 ${
                      isSelected
                        ? 'bg-[#B8001F] text-white shadow-lg scale-125 ring-4 ring-[#FFD700]'
                        : s.category === 'pandal'
                        ? 'bg-amber-500 text-black shadow-md'
                        : s.category === 'emergency'
                        ? 'bg-red-600 text-white animate-pulse'
                        : 'bg-white text-[#B8001F] border border-amber-400 shadow-sm'
                    }`}
                    title={language === 'en' ? s.nameEn : s.nameOr}
                  >
                    <div className="flex items-center gap-1 text-[11px] font-bold">
                      <MapPin className="w-4 h-4 fill-current" />
                      <span className="hidden sm:inline-block max-w-[80px] truncate text-[9px] px-1 rounded bg-black/80 text-white">
                        {s.stallNo}
                      </span>
                    </div>
                  </button>
                );
              })}

              {/* Map Key Legend */}
              <div className="absolute bottom-2 left-2 bg-white/90 backdrop-blur-md p-2 rounded-lg border border-amber-300 text-[10px] space-y-1 z-10 shadow-md font-semibold text-amber-950">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  <span>{language === 'en' ? 'Pandal & Sanctum' : 'ମଣ୍ଡପ ଓ ସୁନା ମେଢ଼'}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-orange-500" />
                  <span>{language === 'en' ? 'Food Stalls' : 'ଖାଦ୍ୟ ଷ୍ଟଲ୍'}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-600" />
                  <span>{language === 'en' ? 'Medical Camp' : 'ଡାକ୍ତରୀ କ୍ୟାମ୍ପ'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Searchable Stall Directory & Filters */}
          <div className="lg:col-span-5 space-y-4">
            
            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-amber-700 absolute left-3 top-3.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={language === 'en' ? 'Search stall (Dahibara, Chhena Poda, Medical...)' : 'ଷ୍ଟଲ୍ ଖୋଜନ୍ତୁ (ଦହିବରା, ଡାକ୍ତରୀ...)'}
                className="w-full bg-white border border-amber-300 rounded-xl pl-9 pr-4 py-2.5 text-xs text-amber-950 placeholder-amber-800/60 focus:outline-none focus:border-[#B8001F] shadow-sm"
              />
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
              {['all', 'pandal', 'food', 'amusement', 'emergency', 'handicraft', 'helpdesk'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg font-bold capitalize whitespace-nowrap transition-all ${
                    selectedCategory === cat
                      ? 'crimson-button text-white shadow-sm'
                      : 'bg-amber-100/70 text-amber-950 hover:bg-amber-200/80 border border-amber-300'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Filtered Stalls List */}
            <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
              {filteredStalls.map((s) => (
                <div
                  key={s.id}
                  onClick={() => setActiveStall(s)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                    activeStall?.id === s.id
                      ? 'bg-amber-100/90 border-[#B8001F] shadow-md'
                      : 'bg-white border-amber-200 hover:border-amber-400 shadow-sm'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="bg-[#B8001F] text-white text-[10px] font-black px-2 py-0.5 rounded shadow-xs">
                        {s.stallNo}
                      </span>
                      <h4 className="text-sm font-bold text-amber-950 font-serif-royal">
                        {language === 'en' ? s.nameEn : s.nameOr}
                      </h4>
                    </div>
                    {s.rating && (
                      <span className="flex items-center gap-1 text-[11px] text-amber-700 font-bold">
                        <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                        {s.rating}
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-amber-950/80 font-medium line-clamp-2">
                    {language === 'en' ? s.descriptionEn : s.descriptionOr}
                  </p>
                </div>
              ))}
            </div>

          </div>

        </div>

        {/* Selected Stall Modal Detail */}
        {activeStall && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
            <div className="glass-card-gold p-6 rounded-2xl max-w-lg w-full border-2 border-[#D4AF37] shadow-2xl relative">
              
              <button
                onClick={() => setActiveStall(null)}
                className="absolute top-4 right-4 text-amber-900 hover:text-black p-1 rounded-lg bg-amber-200/50"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2 mb-3">
                <span className="bg-[#B8001F] text-white text-xs font-black px-2.5 py-1 rounded">
                  {activeStall.stallNo}
                </span>
                <span className="text-xs font-bold uppercase text-[#8B0000] tracking-wider">
                  {activeStall.category}
                </span>
              </div>

              <h3 className="text-xl font-bold font-serif-royal text-[#7D0000] mb-2">
                {language === 'en' ? activeStall.nameEn : activeStall.nameOr}
              </h3>

              <p className="text-sm text-amber-950 font-medium mb-4 leading-relaxed">
                {language === 'en' ? activeStall.descriptionEn : activeStall.descriptionOr}
              </p>

              {activeStall.phone && (
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 mb-4 bg-emerald-50 p-2.5 rounded-lg border border-emerald-300">
                  <Phone className="w-4 h-4 text-emerald-700" />
                  <span>Contact: {activeStall.phone}</span>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2 border-t border-amber-200">
                <button
                  onClick={() => setActiveStall(null)}
                  className="crimson-button px-5 py-2 rounded-xl text-xs font-bold"
                >
                  {language === 'en' ? 'Close Map Info' : 'ବନ୍ଦ କରନ୍ତୁ'}
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
    </section>
  );
};
