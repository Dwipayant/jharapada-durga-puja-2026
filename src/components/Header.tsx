import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import bannerLogo from '../assets/banner-logo.gif';
import {
  Tv,
  MapPin,
  Calendar,
  Ticket,
  ShieldCheck,
  Globe,
  Menu,
  X,
  Sparkles,
  Radio,
  Clock
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    language,
    setLanguage,
    tickers,
    setIsAdminModalOpen,
    isAdminLoggedIn,
    crowdStatus,
    setIsLiveModalOpen
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const activeTickers = tickers.filter(t => t.active);

  const crowdBadgeColor = {
    normal: 'bg-emerald-50 text-emerald-800 border-emerald-300',
    moderate: 'bg-amber-50 text-amber-900 border-amber-300',
    heavy: 'bg-rose-50 text-rose-900 border-rose-300'
  }[crowdStatus.level];

  const crowdText = {
    normal: language === 'en' ? 'Normal (<15m)' : 'ସ୍ୱାଭାବିକ (<୧୫ମି)',
    moderate: language === 'en' ? 'Moderate (15-30m)' : 'ମଧ୍ୟମ (୧୫-୩୦ମି)',
    heavy: language === 'en' ? 'Heavy Surge (>45m)' : 'ପ୍ରବଳ (>୪୫ମି)'
  }[crowdStatus.level];

  return (
    <header className="sticky top-0 z-40 bg-[#FFFDF8]/95 backdrop-blur-xl border-b border-[#D4AF37]/40 shadow-md transition-all">
      {/* Real-time Admin Controlled Announcement Ticker */}
      {activeTickers.length > 0 && (
        <div className="bg-gradient-to-r from-[#B8001F] via-[#8B0000] to-[#B8001F] text-[#FFFFFF] py-1.5 px-4 text-xs font-semibold overflow-hidden border-b border-[#FFD700]/40 flex items-center shadow-inner">
          <div className="flex items-center gap-1.5 bg-[#FFD700] text-[#4A000B] px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider shrink-0 z-10 shadow-sm mr-2 whitespace-nowrap">
            <Radio className="w-3 h-3 animate-pulse shrink-0" />
            <span>{language === 'en' ? 'LIVE ANNOUNCEMENTS' : 'ମୁଖ୍ୟ ସୂଚନା'}</span>
          </div>
          <div className="relative w-full overflow-hidden">
            <div className="animate-marquee whitespace-nowrap flex gap-12">
              {activeTickers.map(t => (
                <span key={t.id} className="inline-flex items-center gap-2 whitespace-nowrap">
                  <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold shrink-0 ${t.type === 'EMERGENCY' ? 'bg-amber-400 text-black font-black animate-bounce' :
                    t.type === 'IMPORTANT' ? 'bg-[#FFD700] text-black font-black' : 'bg-white/20 text-white'
                    }`}>
                    {t.type}
                  </span>
                  <span>{language === 'en' ? t.textEn : t.textOr}</span>
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main Navigation Bar */}
      <div className="max-w-[98%] 2xl:max-w-7xl mx-auto px-2 sm:px-4 lg:px-6">
        <div className="flex items-center justify-between h-20 gap-2 xl:gap-4">

          {/* Brand Logo & Name */}
          <a href="#" className="flex items-center gap-2.5 shrink-0 group">
            <div className="relative w-11 h-11 rounded-full bg-gradient-to-tr from-[#B8001F] via-[#FFD700] to-[#D4AF37] p-[2px] shadow-md shadow-amber-500/20 group-hover:scale-105 transition-transform duration-300 shrink-0">
              <div className="w-full h-full rounded-full bg-[#FFFDF8] flex items-center justify-center border border-[#D4AF37] overflow-hidden">
                <img src={bannerLogo} alt="Jharapada Durga Puja Logo" className="w-full h-full object-cover rounded-full" />
              </div>
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-[#B8001F]"></span>
              </span>
            </div>

            <div className="flex flex-col">
              <div className="flex items-center gap-1.5 whitespace-nowrap">
                <h1 className="text-base sm:text-lg xl:text-xl font-bold font-serif-royal royal-gold-heading tracking-wide whitespace-nowrap">
                  Jharapada Durga Puja
                </h1>
                <span className="bg-[#B8001F] text-white border border-[#FFD700]/60 text-[10px] px-1.5 py-0.5 rounded font-extrabold whitespace-nowrap shrink-0 shadow-sm">
                  2026
                </span>
              </div>
              <p className="text-[11px] text-amber-950/70 font-sans font-medium whitespace-nowrap truncate max-w-[220px] xl:max-w-none">
                {language === 'en' ? 'Jharapada Durga Puja Samitee, Bhubaneswar' : 'ଝାରପଡ଼ା ଦୁର୍ଗା ପୂଜା ସମିତି, ଭୁବନେଶ୍ୱର'}
              </p>
            </div>
          </a>

          {/* Center Navigation Links (Desktop) */}
          <nav className="hidden xl:flex items-center space-x-3 2xl:space-x-5 text-xs 2xl:text-sm font-bold text-gray-800 shrink-0">
            <button
              onClick={() => setIsLiveModalOpen(true)}
              className="flex items-center gap-1.5 text-gray-800 hover:text-[#B8001F] transition-colors whitespace-nowrap shrink-0"
            >
              <Tv className="w-4 h-4 text-[#B8001F] shrink-0" />
              <span className="whitespace-nowrap">{language === 'en' ? 'Live Darshan' : 'ଲାଇଭ୍ ଦର୍ଶନ'}</span>
              <span className="relative flex h-2 w-2 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#B8001F]"></span>
              </span>
            </button>

            <a href="#ground-map" className="flex items-center gap-1.5 text-gray-800 hover:text-[#B8001F] transition-colors whitespace-nowrap shrink-0">
              <MapPin className="w-4 h-4 text-[#B8001F] shrink-0" />
              <span className="whitespace-nowrap">{language === 'en' ? 'Melan Padia Map' : 'ମଣ୍ଡପ ମାନଚିତ୍ର'}</span>
            </a>

            <a href="#schedule" className="flex items-center gap-1.5 text-gray-800 hover:text-[#B8001F] transition-colors whitespace-nowrap shrink-0">
              <Calendar className="w-4 h-4 text-[#B8001F] shrink-0" />
              <span className="whitespace-nowrap">{language === 'en' ? 'Rituals & Shows' : 'ପୂଜା ନୀତି କାନ୍ତି'}</span>
            </a>

            <a href="#passes-donations" className="flex items-center gap-1.5 text-gray-800 hover:text-[#B8001F] transition-colors whitespace-nowrap shrink-0">
              <Ticket className="w-4 h-4 text-[#B8001F] shrink-0" />
              <span className="whitespace-nowrap">{language === 'en' ? 'VIP Pass & Donate' : 'ଇ-ପାସ୍ ଓ ଦାନ'}</span>
            </a>

            <a href="#heritage" className="flex items-center gap-1.5 text-gray-800 hover:text-[#B8001F] transition-colors whitespace-nowrap shrink-0">
              <Sparkles className="w-4 h-4 text-[#B8001F] shrink-0" />
              <span className="whitespace-nowrap">{language === 'en' ? 'History' : 'ଐତିହ୍ୟ'}</span>
            </a>
          </nav>

          {/* Right Action Tools */}
          <div className="hidden lg:flex items-center gap-2 2xl:gap-3 shrink-0">
            {/* Language Switcher Toggle */}
            <button
              onClick={() => setLanguage(language === 'en' ? 'or' : 'en')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-100/70 border border-amber-300 text-amber-950 text-xs font-bold hover:bg-amber-200/80 transition-all whitespace-nowrap shrink-0 shadow-sm"
              title="Toggle Odia / English Language"
            >
              <Globe className="w-3.5 h-3.5 text-[#B8001F] shrink-0" />
              <span className="whitespace-nowrap">{language === 'en' ? 'ଓଡ଼ିଆ' : 'English'}</span>
            </button>

            {/* Admin Portal Button */}
            <button
              onClick={() => setIsAdminModalOpen(true)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap shrink-0 ${isAdminLoggedIn
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md'
                : 'crimson-button text-white'
                }`}
            >
              <ShieldCheck className="w-4 h-4 shrink-0 text-[#FFD700]" />
              <span className="whitespace-nowrap">{isAdminLoggedIn ? (language === 'en' ? 'Admin Active' : 'ଆଡମିନ୍ ସକ୍ରିୟ') : (language === 'en' ? 'Admin Portal' : 'ଆଡମିନ୍')}</span>
            </button>
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex xl:hidden items-center gap-2 shrink-0">
            <button
              onClick={() => setLanguage(language === 'en' ? 'or' : 'en')}
              className="px-2.5 py-1.5 rounded-lg bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold whitespace-nowrap"
            >
              {language === 'en' ? 'ଓଡ଼ିଆ' : 'EN'}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-amber-50 text-[#B8001F] border border-amber-300 shrink-0 shadow-sm"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-[#FFFDF8] border-b border-amber-200 px-4 pt-3 pb-6 space-y-3 animate-fadeIn shadow-xl">
          <div className="flex items-center justify-between pb-3 border-b border-amber-200">
            <div className={`px-3 py-1 rounded-full text-xs font-semibold border flex items-center gap-1.5 whitespace-nowrap ${crowdBadgeColor}`}>
              <Clock className="w-3.5 h-3.5 shrink-0" />
              <span className="whitespace-nowrap">{crowdText}</span>
            </div>
            <button
              onClick={() => {
                setIsAdminModalOpen(true);
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg crimson-button text-xs font-bold whitespace-nowrap"
            >
              <ShieldCheck className="w-4 h-4 shrink-0 text-[#FFD700]" />
              <span className="whitespace-nowrap">{isAdminLoggedIn ? 'Admin Active' : 'Admin Login'}</span>
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2 text-sm font-semibold pt-2">
            <a
              href="#live-darshan"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 p-3 rounded-lg bg-amber-50/80 border border-amber-200 text-amber-950 whitespace-nowrap"
            >
              <Tv className="w-4 h-4 text-[#B8001F] shrink-0" />
              <span className="whitespace-nowrap">{language === 'en' ? 'Live Darshan' : 'ଲାଇଭ୍ ଦର୍ଶନ'}</span>
            </a>
            <a
              href="#ground-map"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 p-3 rounded-lg bg-amber-50/80 border border-amber-200 text-amber-950 whitespace-nowrap"
            >
              <MapPin className="w-4 h-4 text-[#B8001F] shrink-0" />
              <span className="whitespace-nowrap">{language === 'en' ? 'Ground Map' : 'ମାନଚିତ୍ର'}</span>
            </a>
            <a
              href="#schedule"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 p-3 rounded-lg bg-amber-50/80 border border-amber-200 text-amber-950 whitespace-nowrap"
            >
              <Calendar className="w-4 h-4 text-[#B8001F] shrink-0" />
              <span className="whitespace-nowrap">{language === 'en' ? 'Rituals' : 'ପୂଜା ନୀତି'}</span>
            </a>
            <a
              href="#passes-donations"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 p-3 rounded-lg bg-amber-50/80 border border-amber-200 text-amber-950 whitespace-nowrap"
            >
              <Ticket className="w-4 h-4 text-[#B8001F] shrink-0" />
              <span className="whitespace-nowrap">{language === 'en' ? 'Pass & Donate' : 'ଇ-ପାସ୍'}</span>
            </a>
            <a
              href="#heritage"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 p-3 rounded-lg bg-amber-50/80 border border-amber-200 text-amber-950 col-span-2 whitespace-nowrap"
            >
              <Sparkles className="w-4 h-4 text-[#B8001F] shrink-0" />
              <span className="whitespace-nowrap">{language === 'en' ? 'Bauda Garh Fort History' : 'ଐତିହ୍ୟ ବାଉଡ଼ ଗଡ଼'}</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
