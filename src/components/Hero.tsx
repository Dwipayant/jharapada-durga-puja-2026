import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Tv, Ticket, MapPin, Heart, Sparkles, Clock, Flame, ShieldAlert, Award } from 'lucide-react';
import { JhotiDivider } from './JhotiDivider';

export const Hero: React.FC = () => {
  const { language, setIsLiveModalOpen } = useApp();

  // Target date for Sandhi Puja / Maha Ashtami (Oct 18, 2026)
  const [timeLeft, setTimeLeft] = useState({ days: 12, hours: 8, mins: 42, secs: 15 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.secs > 0) return { ...prev, secs: prev.secs - 1 };
        if (prev.mins > 0) return { ...prev, mins: 59, secs: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, mins: 59, secs: 59 };
        if (prev.days > 0) return { ...prev, days: prev.days - 1, hours: 23, mins: 59, secs: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative min-h-[85vh] flex flex-col justify-center overflow-hidden cream-gradient-bg text-[#2D1A24] py-12 lg:py-20 border-b border-[#D4AF37]/30">
      {/* Radiant Background Glows */}
      <div className="absolute top-10 left-1/4 w-80 h-80 bg-amber-200/40 rounded-full blur-3xl pointer-events-none animate-pulse-slow" />
      <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-rose-200/40 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        {/* Top Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100/90 border border-amber-300 shadow-md mb-6 animate-bounce">
          <Sparkles className="w-4 h-4 text-[#B8001F]" />
          <span className="text-xs sm:text-sm font-extrabold text-[#7D0000] tracking-wider uppercase">
            {language === 'en' ? 'Bhubaneswar Premier Durga Puja Extravaganza' : 'ଭୁବନେଶ୍ୱରର ସର୍ବଶ୍ରେଷ୍ଠ ଦୁର୍ଗା ପୂଜା ମହୋତ୍ସବ'}
          </span>
          <span className="w-2 h-2 rounded-full bg-[#B8001F] animate-ping" />
        </div>

        {/* Main Heading */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold font-serif-royal leading-tight tracking-wide mb-4">
          <span className="block gold-gradient-text drop-shadow-sm">
            {language === 'en' ? 'Jharapada Durga Puja 2026' : 'ଝାରପଡ଼ା ଦୁର୍ଗା ପୂଜା ୨୦୨୬'}
          </span>
          <span className="block text-2xl sm:text-4xl lg:text-5xl text-amber-950 font-sans font-black mt-2">
            {language === 'en' ? 'Historic Bauda Garh Fort Theme & Gold Sanctum' : 'ଐତିହାସିକ ବାଉଡ଼ ଗଡ଼ ତୋରଣ ଓ ସୁନା ଚାନ୍ଦି ମେଢ଼'}
          </span>
        </h1>

        {/* Subtitle */}
        <p className="max-w-3xl mx-auto text-base sm:text-lg text-amber-950/80 font-sans font-medium leading-relaxed mb-8">
          {language === 'en' 
            ? 'Experience 24x7 4K Ultra HD Live Darshan on YouTube, real-time crowd status, interactive 3D Melan Padia ground map, and digital VIP express QR passes.'
            : 'ୟୁଟ୍ୟୁବ୍ ୪K HD ମାଧ୍ୟମରେ ୨୪x୭ ଲାଇଭ୍ ଦର୍ଶନ କରନ୍ତୁ, ମଣ୍ଡପ ମାନଚିତ୍ର ଦେଖନ୍ତୁ ଏବଂ ବରିଷ୍ଠ ନାଗରିକ ଫାଷ୍ଟ-ଟ୍ରାକ୍ QR ପାସ୍ ହାସଲ କରନ୍ତୁ ।'}
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-12">
          <button
            onClick={() => setIsLiveModalOpen(true)}
            className="crimson-button px-6 py-3.5 rounded-xl flex items-center gap-2.5 text-base shadow-lg group cursor-pointer"
          >
            <Tv className="w-5 h-5 text-[#FFD700] group-hover:scale-110 transition-transform" />
            <span>{language === 'en' ? 'Watch 4K Live Darshan' : 'ଲାଇଭ୍ ଦର୍ଶନ ଦେଖନ୍ତୁ'}</span>
            <span className="bg-[#FFD700] text-black text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider animate-pulse">
              LIVE
            </span>
          </button>

          <a
            href="#passes-donations"
            className="gold-button px-6 py-3.5 rounded-xl text-black flex items-center gap-2 text-base font-bold shadow-lg"
          >
            <Ticket className="w-5 h-5 text-[#7D0000]" />
            <span>{language === 'en' ? 'Get VIP / Senior QR Pass' : 'ବରିଷ୍ଠ / VIP QR ପାସ୍'}</span>
          </a>

          <a
            href="#ground-map"
            className="px-6 py-3.5 rounded-xl bg-white hover:bg-amber-50 text-amber-950 border border-amber-300 flex items-center gap-2 text-base font-bold transition-all shadow-md"
          >
            <MapPin className="w-5 h-5 text-[#B8001F]" />
            <span>{language === 'en' ? 'Melan Padia Map' : 'ମାନଚିତ୍ର'}</span>
          </a>

          <a
            href="#passes-donations"
            className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-black font-extrabold flex items-center gap-2 text-base transition-all shadow-md"
          >
            <Heart className="w-5 h-5 text-black fill-black" />
            <span>{language === 'en' ? 'Online E-Donation' : 'ଇ-ଦାନ'}</span>
          </a>
        </div>

        {/* Live Countdown Timer to Sandhi Puja */}
        <div className="max-w-4xl mx-auto glass-card-gold p-6 rounded-2xl relative overflow-hidden mb-12 shadow-xl">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-left">
              <div className="w-12 h-12 rounded-xl bg-[#B8001F] flex items-center justify-center text-[#FFD700] shadow-md">
                <Clock className="w-6 h-6 animate-spin" style={{ animationDuration: '10s' }} />
              </div>
              <div>
                <h3 className="text-lg font-bold font-serif-royal text-[#7D0000]">
                  {language === 'en' ? 'Countdown to Sandhi Puja 108 Lamps Muhurat' : 'ସନ୍ଧି ପୂଜା ୧୦୮ ଦୀପ ସମୟ ଗଣନା'}
                </h3>
                <p className="text-xs text-amber-900 font-medium">
                  {language === 'en' ? 'Maha Ashtami Evening | Oct 18, 2026 at 07:45 PM' : 'ମହା ଅଷ୍ଟମୀ ସନ୍ଧ୍ୟା ୭:୪୫ ମିନିଟ୍'}
                </p>
              </div>
            </div>

            {/* Timer Digits */}
            <div className="grid grid-cols-4 gap-3 text-center">
              <div className="bg-white/90 border border-amber-300 rounded-xl p-2.5 min-w-[65px] shadow-sm">
                <span className="text-2xl font-black text-[#B8001F]">{timeLeft.days}</span>
                <span className="block text-[10px] text-amber-900 uppercase font-bold">{language === 'en' ? 'Days' : 'ଦିନ'}</span>
              </div>
              <div className="bg-white/90 border border-amber-300 rounded-xl p-2.5 min-w-[65px] shadow-sm">
                <span className="text-2xl font-black text-[#B8001F]">{timeLeft.hours}</span>
                <span className="block text-[10px] text-amber-900 uppercase font-bold">{language === 'en' ? 'Hours' : 'ଘଣ୍ଟା'}</span>
              </div>
              <div className="bg-white/90 border border-amber-300 rounded-xl p-2.5 min-w-[65px] shadow-sm">
                <span className="text-2xl font-black text-[#B8001F]">{timeLeft.mins}</span>
                <span className="block text-[10px] text-amber-900 uppercase font-bold">{language === 'en' ? 'Mins' : 'ମିନିଟ୍'}</span>
              </div>
              <div className="bg-white/90 border border-amber-300 rounded-xl p-2.5 min-w-[65px] shadow-sm">
                <span className="text-2xl font-black text-amber-600 animate-pulse">{timeLeft.secs}</span>
                <span className="block text-[10px] text-amber-900 uppercase font-bold">{language === 'en' ? 'Secs' : 'ସେକେଣ୍ଡ'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Highlights Banner */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto text-left">
          <div className="glass-card p-4 rounded-xl border-l-4 border-l-[#B8001F]">
            <div className="flex items-center gap-2 text-[#B8001F] font-bold text-sm mb-1">
              <Award className="w-4 h-4" />
              <span>{language === 'en' ? '120ft Bauda Garh' : '୧୨୦ ଫୁଟ ତୋରଣ'}</span>
            </div>
            <p className="text-xs text-amber-950 font-medium">
              {language === 'en' ? 'Historic fort themed illumination gate' : 'ଐତିହାସିକ ବାଉଡ଼ ଗଡ଼ ସ୍ୱର୍ଣ୍ଣିମ ତୋରଣ'}
            </p>
          </div>

          <div className="glass-card p-4 rounded-xl border-l-4 border-l-amber-500">
            <div className="flex items-center gap-2 text-amber-700 font-bold text-sm mb-1">
              <Flame className="w-4 h-4" />
              <span>{language === 'en' ? '2.5kg Gold Medha' : 'ସୁନା ଚାନ୍ଦି ମେଢ଼'}</span>
            </div>
            <p className="text-xs text-amber-950 font-medium">
              {language === 'en' ? 'Pure Gold & Silver ornament crown' : 'ମା\'ଙ୍କ ମଥାରେ ସୁନା ମୁକୁଟ ଓ ଚାନ୍ଦି ଅଳଙ୍କାର'}
            </p>
          </div>

          <div className="glass-card p-4 rounded-xl border-l-4 border-l-emerald-600">
            <div className="flex items-center gap-2 text-emerald-700 font-bold text-sm mb-1">
              <Tv className="w-4 h-4" />
              <span>{language === 'en' ? 'Live Stream 24x7' : '୨୪x୭ ଲାଇଭ୍ ଦର୍ଶନ'}</span>
            </div>
            <p className="text-xs text-amber-950 font-medium">
              {language === 'en' ? 'Official YouTube 4K Ultra HD' : 'ୟୁଟ୍ୟୁବ୍ ୪K HD ସ୍ପଷ୍ଟ ପ୍ରସାରଣ'}
            </p>
          </div>

          <div className="glass-card p-4 rounded-xl border-l-4 border-l-rose-600">
            <div className="flex items-center gap-2 text-rose-700 font-bold text-sm mb-1">
              <ShieldAlert className="w-4 h-4" />
              <span>{language === 'en' ? 'Smart Crowd Gauge' : 'ଗହଳି ନିୟନ୍ତ୍ରଣ'}</span>
            </div>
            <p className="text-xs text-amber-950 font-medium">
              {language === 'en' ? 'Real-time wait times & gate parking status' : 'ଲାଇଭ୍ ପାର୍କିଂ ଏବଂ ପ୍ରବେଶ ସୂଚନା'}
            </p>
          </div>
        </div>

        <JhotiDivider className="mt-12 opacity-80" />

      </div>
    </section>
  );
};
