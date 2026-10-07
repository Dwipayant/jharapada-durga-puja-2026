import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Sparkles, 
  Share2, 
  Flame, 
  Music
} from 'lucide-react';
import { JhotiDivider } from './JhotiDivider';

export const Schedule: React.FC = () => {
  const { language, rituals } = useApp();
  const [selectedDayKey, setSelectedDayKey] = useState<string>('ashtami'); // Default Maha Ashtami

  const activeDay = rituals.find(r => r.dayKey === selectedDayKey) || rituals[2];

  const handleShareWhatsApp = (eventTitle: string, eventTime: string) => {
    const text = encodeURIComponent(
      `✨ *Jharapada Durga Puja 2026 Event Alert* ✨\n\n📌 *${eventTitle}*\n⏰ Time: ${eventTime}\n📍 Venue: Melan Padia, Jharapada, Bhubaneswar\n\nWatch Live Darshan: https://jharapadadurgapuja.com`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  return (
    <section id="schedule" className="py-16 bg-[#FFFDF8] relative text-amber-950 border-b border-[#D4AF37]/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-100/80 border border-amber-300 text-[#B8001F] text-xs font-bold uppercase tracking-wider mb-3 shadow-sm">
            <CalendarIcon className="w-4 h-4 text-[#B8001F]" />
            <span>{language === 'en' ? '5-Day Festival Itinerary' : 'ପୂଜା ନୀତି ସମୟସୂଚୀ'}</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold font-serif-royal royal-gold-heading mb-3">
            {language === 'en' ? 'Daily Ritual Timings & Shows' : 'ଦୈନନ୍ଦିନ ନୀତି କାନ୍ତି ଓ ସାଂସ୍କୃତିକ ସନ୍ଧ୍ୟା'}
          </h2>
          <p className="text-amber-950/80 text-sm sm:text-base font-medium">
            {language === 'en'
              ? 'Exact muhurat timings for Pushpanjali, Sandhi Puja 108 Lamps, Maha Bhog distribution, Ravan Podi fireworks, and Melody Nights.'
              : 'ପୁଷ୍ପାଞ୍ଜଳି, ସନ୍ଧି ପୂଜା ୧୦୮ ଦୀପ ଦାନ, ମହାପ୍ରସାଦ ବଣ୍ଟନ, ରାବଣ ପୋଡ଼ି ଓ ସାଂସ୍କୃତିକ କାର୍ଯ୍ୟକ୍ରମର ନିର୍ଦ୍ଧାରିତ ସମୟ ।'}
          </p>
        </div>

        {/* Tabbed Calendar Buttons */}
        <div className="flex items-center justify-center gap-2 overflow-x-auto pb-4 mb-8">
          {rituals.map((r) => (
            <button
              key={r.dayKey}
              onClick={() => setSelectedDayKey(r.dayKey)}
              className={`px-4 py-3 rounded-2xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all duration-300 border ${
                selectedDayKey === r.dayKey
                  ? 'crimson-button text-white border-[#FFD700] shadow-md scale-105'
                  : 'bg-amber-50/80 text-amber-950 border-amber-300 hover:bg-amber-100/80'
              }`}
            >
              <div className="font-serif-royal">{language === 'en' ? r.dayTitleEn : r.dayTitleOr}</div>
              <div className="text-[10px] opacity-90">{r.date}</div>
            </button>
          ))}
        </div>

        {/* Selected Day Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Ritual Timeline */}
          <div className="lg:col-span-7 glass-card p-6 rounded-2xl border-t-4 border-t-[#B8001F] shadow-md">
            <div className="flex items-center justify-between mb-6 pb-3 border-b border-amber-200">
              <h3 className="text-xl font-bold font-serif-royal text-[#7D0000] flex items-center gap-2">
                <Flame className="w-5 h-5 text-[#B8001F]" />
                <span>{language === 'en' ? activeDay.dayTitleEn + ' Ritual Schedule' : activeDay.dayTitleOr + ' ନୀତି କ୍ରାନ୍ତି'}</span>
              </h3>
              <span className="text-xs bg-[#B8001F] text-white px-2.5 py-1 rounded-full font-bold shadow-sm">
                {activeDay.date}
              </span>
            </div>

            {/* Timeline List */}
            <div className="space-y-4">
              {activeDay.events.map((ev) => (
                <div
                  key={ev.id}
                  className={`p-4 rounded-xl border transition-all ${
                    ev.isKeyMuhurat
                      ? 'bg-amber-100/90 border-[#D4AF37] shadow-md'
                      : 'bg-white border-amber-200 shadow-sm'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded-lg bg-[#B8001F] text-white text-xs font-black flex items-center gap-1 shadow-xs">
                        <Clock className="w-3.5 h-3.5" />
                        {ev.time}
                      </span>
                      {ev.isKeyMuhurat && (
                        <span className="px-2 py-0.5 rounded bg-amber-400 text-amber-950 text-[10px] font-black uppercase tracking-wider animate-pulse shadow-xs">
                          ✨ KEY MUHURAT
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => handleShareWhatsApp(ev.titleEn, ev.time)}
                      className="text-xs text-emerald-700 font-bold hover:underline flex items-center gap-1"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      <span>{language === 'en' ? 'WhatsApp Reminder' : 'ହ୍ୱାଟ୍ସଆପ୍ ସେୟାର'}</span>
                    </button>
                  </div>

                  <h4 className="text-base font-bold text-[#7D0000] font-serif-royal mb-1">
                    {language === 'en' ? ev.titleEn : ev.titleOr}
                  </h4>
                  <p className="text-xs text-amber-950/80 font-medium">
                    {language === 'en' ? ev.descEn : ev.descOr}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Cultural Program Stage Lineup */}
          <div className="lg:col-span-5 glass-card-gold p-6 rounded-2xl border-2 border-[#D4AF37] shadow-xl">
            <div className="flex items-center gap-2 mb-6 pb-3 border-b border-amber-200">
              <Music className="w-6 h-6 text-[#B8001F] animate-bounce" />
              <div>
                <h3 className="text-xl font-bold font-serif-royal text-[#7D0000]">
                  {language === 'en' ? 'Cultural Stage Evening Lineup' : 'ସାଂସ୍କୃତିକ ମଞ୍ଚ ଆକର୍ଷଣ'}
                </h3>
                <p className="text-xs text-amber-950/70 font-medium">
                  {language === 'en' ? 'Melody Nights & Odissi Folk Dances' : 'ମେଲୋଡି ନାଇଟ୍ସ ଓ ଲୋକନୃତ୍ୟ'}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {activeDay.culturalPrograms.map((prog) => (
                <div key={prog.id} className="bg-white/90 p-4 rounded-xl border border-amber-200 shadow-sm">
                  <div className="flex items-center justify-between text-xs text-[#B8001F] font-bold mb-1">
                    <span>{prog.time}</span>
                    <span className="bg-amber-100 px-2 py-0.5 rounded border border-amber-300 text-[10px] text-amber-950 font-bold">
                      {language === 'en' ? prog.typeEn : prog.typeOr}
                    </span>
                  </div>
                  <h4 className="text-base font-bold text-amber-950 font-serif-royal">
                    {language === 'en' ? prog.artistEn : prog.artistOr}
                  </h4>
                  <p className="text-xs text-amber-900/70 mt-1 font-medium">
                    {language === 'en' ? 'Live on Main Cultural Stage Melan Padia' : 'ମେଲଣ ପଡ଼ିଆ ମୁଖ୍ୟ ସାଂସ୍କୃତିକ ମଞ୍ଚ'}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-6 p-3 rounded-xl bg-amber-100/80 border border-amber-300 text-xs text-amber-950 flex items-center gap-2 font-medium">
              <Sparkles className="w-5 h-5 text-[#B8001F] shrink-0" />
              <span>
                {language === 'en'
                  ? 'All timing schedules are monitored and updated live by the committee control room.'
                  : 'ସମସ୍ତ ପୂଜା ସମୟ ନିୟନ୍ତ୍ରଣ କକ୍ଷ ଦ୍ୱାରା ନିୟନ୍ତ୍ରିତ ।'}
              </span>
            </div>
          </div>

        </div>

        <JhotiDivider className="mt-12 opacity-80" />

      </div>
    </section>
  );
};
