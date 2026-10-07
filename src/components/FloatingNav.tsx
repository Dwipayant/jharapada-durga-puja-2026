import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Tv, MapPin, Calendar, Ticket, Sparkles, Image, ArrowUp } from 'lucide-react';

export const FloatingNav: React.FC = () => {
  const { language, setIsLiveModalOpen, isLiveModalOpen, isAdminModalOpen, isAnyModalOpen } = useApp();
  const [activeSection, setActiveSection] = useState<string>('hero');
  const [showScrollTop, setShowScrollTop] = useState<boolean>(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);

      const sections = ['live-darshan', 'ground-map', 'schedule', 'passes-donations', 'heritage', 'gallery'];
      const scrollPosition = window.scrollY + 250;

      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(sectionId);
            return;
          }
        }
      }
      if (window.scrollY < 300) {
        setActiveSection('hero');
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // If any modal is active (Live landing modal, Admin modal, or custom modals), hide floating nav
  if (isAnyModalOpen || isLiveModalOpen || isAdminModalOpen) {
    return null;
  }

  const navItems = [
    {
      id: 'live-darshan',
      labelEn: 'Live',
      labelOr: 'ଲାଇଭ୍',
      icon: Tv,
      onClick: () => setIsLiveModalOpen(true),
      isLive: true
    },
    {
      id: 'ground-map',
      labelEn: 'Map',
      labelOr: 'ମାନଚିତ୍ର',
      icon: MapPin,
      href: '#ground-map'
    },
    {
      id: 'schedule',
      labelEn: 'Rituals',
      labelOr: 'ନୀତି',
      icon: Calendar,
      href: '#schedule'
    },
    {
      id: 'passes-donations',
      labelEn: 'Pass & Donate',
      labelOr: 'ପାସ୍/ଦାନ',
      icon: Ticket,
      href: '#passes-donations'
    },
    {
      id: 'heritage',
      labelEn: 'History',
      labelOr: 'ଐତିହ୍ୟ',
      icon: Sparkles,
      href: '#heritage'
    },
    {
      id: 'gallery',
      labelEn: 'Gallery 360',
      labelOr: 'ଗ୍ୟାଲେରୀ',
      icon: Image,
      href: '#gallery'
    }
  ];

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 max-w-[95vw] sm:max-w-auto">
      {/* Floating Glass Navigation Dock */}
      <nav className="glass-card-gold px-3 sm:px-5 py-2.5 rounded-full border-2 border-[#D4AF37] shadow-2xl flex items-center gap-1.5 sm:gap-3 backdrop-blur-xl bg-white/95">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;

          if (item.onClick) {
            return (
              <button
                key={item.id}
                onClick={item.onClick}
                className={`relative group flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-300 ${
                  isActive
                    ? 'bg-[#B8001F] text-white shadow-md shadow-red-900/30'
                    : 'text-amber-950 hover:bg-amber-100/80'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#FFD700]' : 'text-[#B8001F]'}`} />
                <span className="hidden md:inline whitespace-nowrap">
                  {language === 'en' ? item.labelEn : item.labelOr}
                </span>
                {item.isLive && (
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#B8001F]"></span>
                  </span>
                )}
              </button>
            );
          }

          return (
            <a
              key={item.id}
              href={item.href}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 rounded-full text-xs font-bold transition-all duration-300 ${
                isActive
                  ? 'bg-[#B8001F] text-white shadow-md shadow-red-900/30 scale-105'
                  : 'text-amber-950 hover:bg-amber-100/80 hover:text-[#B8001F]'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#FFD700]' : 'text-[#B8001F]'}`} />
              <span className="hidden md:inline whitespace-nowrap">
                {language === 'en' ? item.labelEn : item.labelOr}
              </span>
            </a>
          );
        })}
      </nav>

      {/* Back to Top Diya Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#B8001F] via-[#FFD700] to-[#D4AF37] p-[2px] shadow-xl hover:scale-110 transition-all duration-300 shrink-0 group"
          title="Scroll to Top"
        >
          <div className="w-full h-full rounded-full bg-[#FFFDF8] flex items-center justify-center border border-[#D4AF37]">
            <ArrowUp className="w-4 h-4 text-[#B8001F] group-hover:-translate-y-0.5 transition-transform" />
          </div>
        </button>
      )}
    </div>
  );
};
