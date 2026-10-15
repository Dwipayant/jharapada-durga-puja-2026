import React, { useState, useEffect, useCallback } from 'react';
import { useApp } from '../context/AppContext';
import { Tv, Ticket, Heart, Sparkles, Clock } from 'lucide-react';
import { JhotiDivider } from './JhotiDivider';

export const Hero: React.FC = () => {
  const { language, setIsLiveModalOpen, t } = useApp();

  // Exact Target date for Sandhi Puja / Maha Ashtami (Oct 18, 2026 at 07:45 PM IST)
  const calculateTimeLeft = useCallback(() => {
    const targetDate = new Date('2026-10-18T19:45:00+05:30');
    const now = new Date();
    const diff = targetDate.getTime() - now.getTime();

    if (diff <= 0) {
      return { days: 0, hours: 0, mins: 0, secs: 0, isLive: true };
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const secs = Math.floor((diff % (1000 * 60)) / 1000);

    return { days, hours, mins, secs, isLive: false };
  }, []);

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft);

  useEffect(() => {
    // Sync immediately on mount
    setTimeLeft(calculateTimeLeft());

    // Update dynamically every second with actual real-time clock
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [calculateTimeLeft]);

  return (
    <section id="hero" className="relative min-h-[85vh] flex flex-col justify-center overflow-hidden cream-gradient-bg text-[#2D1A24] py-12 lg:py-20 border-b border-[#D4AF37]/30">
      {/* Radiant Background Glows */}
      <div className="absolute top-10 left-1/4 w-80 h-80 bg-amber-200/40 rounded-full blur-3xl pointer-events-none animate-pulse-slow" />
      <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-rose-200/40 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">

        {/* Top Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100/90 border border-amber-300 shadow-md mb-6 animate-bounce">
          <Sparkles className="w-4 h-4 text-[#B8001F]" />
          <span className="text-xs sm:text-sm font-extrabold text-[#7D0000] tracking-wider uppercase">
            {t('hero_top_badge', 'Durga Puja 2026', 'ଦୁର୍ଗା ପୂଜା ୨୦୨୬')}
          </span>
          <span className="w-2 h-2 rounded-full bg-[#B8001F] animate-ping" />
        </div>

        {/* Main Heading */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold font-serif-royal leading-tight tracking-wide mb-4">
          <span className="block gold-gradient-text drop-shadow-sm">
            {t('hero_main_title', 'Jharapada Durga Puja Samiti 2026', 'ଝାରପଡ଼ା ଦୁର୍ଗା ପୂଜା ସମିତି ୨୦୨୬')}
          </span>
          <span className="block text-2xl sm:text-4xl lg:text-5xl text-amber-950 font-sans font-black mt-2">
            {t('hero_subtitle', 'Melana padia, Bhubaneswar', 'ମେଲଣ ପଡିଆ, ଭୁବନେଶ୍ୱର')}
          </span>
        </h1>

        {/* Subtitle */}
        <p className="max-w-3xl mx-auto text-base sm:text-lg text-amber-950/80 font-sans font-medium leading-relaxed mb-8">
          {t('hero_description', 'Experience 24x7 4K Ultra HD Live Darshan on YouTube & VIP express QR passes.', 'ୟୁଟ୍ୟୁବ୍ ୪K HD ମାଧ୍ୟମରେ ୨୪x୭ ଲାଇଭ୍ ଦର୍ଶନ କରନ୍ତୁ, ଏବଂ ବରିଷ୍ଠ ନାଗରିକ ଫାଷ୍ଟ-ଟ୍ରାକ୍ QR ପାସ୍ ହାସଲ କରନ୍ତୁ ।')}
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-12">
          <button
            onClick={() => setIsLiveModalOpen(true)}
            className="crimson-button px-6 py-3.5 rounded-xl flex items-center gap-2.5 text-base shadow-lg group cursor-pointer"
          >
            <Tv className="w-5 h-5 text-[#FFD700] group-hover:scale-110 transition-transform" />
            <span>{t('hero_btn_live_darshan', 'Watch 4K Live Darshan', 'ଲାଇଭ୍ ଦର୍ଶନ ଦେଖନ୍ତୁ')}</span>
            <span className="bg-[#FFD700] text-black text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider animate-pulse">
              LIVE
            </span>
          </button>

          <a
            href="#passes-donations"
            className="gold-button px-6 py-3.5 rounded-xl text-black flex items-center gap-2 text-base font-bold shadow-lg"
          >
            <Ticket className="w-5 h-5 text-[#7D0000]" />
            <span>{t('hero_btn_vip_pass', 'Get VIP / Senior QR Pass', 'ବରିଷ୍ଠ / VIP QR ପାସ୍')}</span>
          </a>

          <a
            href="#passes-donations"
            className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-black font-extrabold flex items-center gap-2 text-base transition-all shadow-md"
          >
            <Heart className="w-5 h-5 text-black fill-black" />
            <span>{t('hero_btn_donation', 'Online E-Donation', 'ଇ-ଦାନ')}</span>
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
                  {t('hero_countdown_title', 'Countdown to Sandhi Puja 108 Lamps Muhurat', 'ସନ୍ଧି ପୂଜା ୧୦୮ ଦୀପ ସମୟ ଗଣନା')}
                </h3>
                <p className="text-xs text-amber-900 font-medium">
                  {t('hero_countdown_subtitle', 'Maha Ashtami Evening | Oct 18, 2026 at 07:45 PM', 'ମହା ଅଷ୍ଟମୀ ସନ୍ଧ୍ୟା ୭:୪୫ ମିନିଟ୍')}
                </p>
              </div>
            </div>

            {/* Timer Digits */}
            <div className="grid grid-cols-4 gap-3 text-center">
              <div className="bg-white/90 border border-amber-300 rounded-xl p-2.5 min-w-[65px] shadow-sm">
                <span className="text-2xl font-black text-[#B8001F]">{String(timeLeft.days).padStart(2, '0')}</span>
                <span className="block text-[10px] text-amber-900 uppercase font-bold">{language === 'en' ? 'Days' : 'ଦିନ'}</span>
              </div>
              <div className="bg-white/90 border border-amber-300 rounded-xl p-2.5 min-w-[65px] shadow-sm">
                <span className="text-2xl font-black text-[#B8001F]">{String(timeLeft.hours).padStart(2, '0')}</span>
                <span className="block text-[10px] text-amber-900 uppercase font-bold">{language === 'en' ? 'Hours' : 'ଘଣ୍ଟା'}</span>
              </div>
              <div className="bg-white/90 border border-amber-300 rounded-xl p-2.5 min-w-[65px] shadow-sm">
                <span className="text-2xl font-black text-[#B8001F]">{String(timeLeft.mins).padStart(2, '0')}</span>
                <span className="block text-[10px] text-amber-900 uppercase font-bold">{language === 'en' ? 'Mins' : 'ମିନିଟ୍'}</span>
              </div>
              <div className="bg-white/90 border border-amber-300 rounded-xl p-2.5 min-w-[65px] shadow-sm">
                <span className="text-2xl font-black text-amber-600 animate-pulse">{String(timeLeft.secs).padStart(2, '0')}</span>
                <span className="block text-[10px] text-amber-900 uppercase font-bold">{language === 'en' ? 'Secs' : 'ସେକେଣ୍ଡ'}</span>
              </div>
            </div>
          </div>
        </div>

        <JhotiDivider className="mt-8 opacity-80" />

      </div>
    </section>
  );
};
