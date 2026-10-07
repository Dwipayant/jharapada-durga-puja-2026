import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Sparkles, Shield, Award, Users, Landmark, Flame, BookOpen, Newspaper, UserCheck, FileText, ExternalLink, X, Plus } from 'lucide-react';
import { JhotiDivider } from './JhotiDivider';
import type { HistoryStory } from '../types';

export const HeritageStory: React.FC = () => {
  const { language, historyStories, setIsAdminModalOpen, registerModalOpen } = useApp();
  const [activeTab, setActiveTab] = useState<string>('all');
  const [selectedStory, setSelectedStory] = useState<HistoryStory | null>(null);

  useEffect(() => {
    registerModalOpen('story-modal', !!selectedStory);
    return () => registerModalOpen('story-modal', false);
  }, [selectedStory, registerModalOpen]);

  const timelineEvents = [
    {
      year: '1976',
      titleEn: 'Inception of Jharapada Puja',
      titleOr: 'ଝାରପଡ଼ା ଦୁର୍ଗା ପୂଜାର ଶୁଭାରମ୍ଭ',
      descEn: 'Started as a neighborhood ritual by local youth elders with simple bamboo architecture.',
      descOr: 'ସ୍ଥାନୀୟ ବୃଦ୍ଧ ଓ ଯୁବକମାନଙ୍କ ଦ୍ୱାରା ପ୍ରଥମ ପୂଜା ଆରମ୍ଭ'
    },
    {
      year: '2004',
      titleEn: 'Gold & Silver Medha Crown',
      titleOr: 'ସୁନା ଓ ଚାନ୍ଦି ମେଢ଼ ସ୍ଥାପନ',
      descEn: 'Introduction of 2.5kg Gold Crown & 300kg Pure Silver Tableaux for Goddess Durga.',
      descOr: 'ମା\'ଙ୍କ ପାଇଁ ସୁନା ମୁକୁଟ ଓ ଚାନ୍ଦି ମେଢ଼ ସ୍ଥାପନା'
    },
    {
      year: '2018',
      titleEn: 'Giant Theme Architecture Era',
      titleOr: 'ବିଶାଳ ତୋରଣ ନିର୍ମାଣ ଯୁଗ',
      descEn: 'Famed for replicating historic fort monuments like Mysore Palace, Chittorgarh, and Konark Temple.',
      descOr: 'ମହୀଶୂର ରାଜପ୍ରାସାଦ ଓ କୋଣାର୍କ ମନ୍ଦିର ଆଦୃତି ତୋରଣ'
    },
    {
      year: '2026',
      titleEn: 'Bauda Garh Fort Extravaganza',
      titleOr: 'ଐତିହାସିକ ବାଉଡ଼ ଗଡ଼ ସ୍ୱର୍ଣ୍ଣିମ ତୋରଣ ୨୦୨୬',
      descEn: '120ft high grand fort structure crafted by 80 master artisans over 3 months with 4D projection mapping.',
      descOr: '୧୨୦ ଫୁଟ ଉଚ୍ଚ ସ୍ୱର୍ଣ୍ଣିମ ତୋରଣ ଏବଂ ଲେଜର ଆଲୋକସଜ୍ଜା'
    }
  ];

  const filteredStories = historyStories.filter(story => 
    activeTab === 'all' || story.category === activeTab
  );

  return (
    <section id="heritage" className="py-16 bg-[#FFFDF8] relative text-amber-950 border-b border-[#D4AF37]/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-100/80 border border-amber-300 text-[#B8001F] text-xs font-bold uppercase tracking-wider mb-3 shadow-sm">
            <Landmark className="w-4 h-4 text-[#B8001F]" />
            <span>{language === 'en' ? 'Cultural Heritage & Craftsmanship' : 'ଐତିହ୍ୟ ଓ ଶିଳ୍ପକଳା'}</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold font-serif-royal royal-gold-heading mb-3">
            {language === 'en' ? 'The Legend of Bauda Garh & Jharapada' : 'ଝାରପଡ଼ା ପୂଜା ଓ ବାଉଡ଼ ଗଡ଼ ଗାଥା'}
          </h2>
          <p className="text-amber-950/80 text-sm sm:text-base font-medium">
            {language === 'en'
              ? 'Discover the rich 50-year legacy of Jharapada Durga Puja Samitee, famous across Odisha for royal fort pandals, gold medals, and community feasts.'
              : '୫୦ ବର୍ଷର ଗୌରବମୟ ଇତିହାସ, ସୁନା ଚାନ୍ଦି ମେଢ଼ ଓ ଐତିହାସିକ ତୋରଣ ନିର୍ମାଣର କାହାଣୀ ।'}
          </p>
        </div>

        {/* Feature Story Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center mb-16">
          
          <div className="glass-card-gold p-6 sm:p-8 rounded-2xl border-2 border-[#D4AF37] shadow-xl relative">
            <span className="text-xs font-bold text-[#8B0000] uppercase tracking-widest block mb-2">
              THE 2026 ARCHITECTURAL MARVEL
            </span>
            <h3 className="text-2xl sm:text-3xl font-bold font-serif-royal text-[#7D0000] mb-4">
              {language === 'en' ? 'Bauda Garh Fort Theme Inspiration' : 'ବାଉଡ଼ ଗଡ଼ ତୋରଣ ନିର୍ମାଣ ଆକର୍ଷଣ'}
            </h3>
            <p className="text-sm text-amber-950 font-medium leading-relaxed mb-4">
              {language === 'en'
                ? 'Standing tall at 120 feet, the 2026 Jharapada Pandal replicates the ancient Bauda Garh Fort structure. Crafted meticulously using eco-friendly jute, bamboo, fiberglass, and metallic gold gilding by master artisans from Midnapore and Bengal.'
                : '୧୨୦ ଫୁଟ ଉଚ୍ଚ ବିଶାଳ ବାଉଡ଼ ଗଡ଼ ତୋରଣ ତିଆରି ପାଇଁ ବେଙ୍ଗଲ ଏବଂ ମେଦିନୀପୁରର ୮୦ ଜଣ କାରିଗର ୩ ମାସ ଧରି କାର୍ଯ୍ୟ କରିଛନ୍ତି ।'}
            </p>

            <div className="grid grid-cols-2 gap-3 pt-4 border-t border-amber-200">
              <div className="flex items-center gap-2 text-xs font-bold text-[#8B0000]">
                <Award className="w-4 h-4 text-[#B8001F]" />
                <span>120ft Structure Height</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-[#8B0000]">
                <Flame className="w-4 h-4 text-[#B8001F]" />
                <span>2.5kg Pure Gold Medha</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-[#8B0000]">
                <Users className="w-4 h-4 text-[#B8001F]" />
                <span>150+ Youth Volunteers</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-[#8B0000]">
                <Shield className="w-4 h-4 text-[#B8001F]" />
                <span>24x7 CCTV & Patrol</span>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold font-serif-royal text-[#7D0000] mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#B8001F]" />
              <span>{language === 'en' ? 'Evolution Timeline (1976 - 2026)' : 'ଝାରପଡ଼ା ପୂଜାର ଇତିହାସ କ୍ରମ'}</span>
            </h3>

            <div className="space-y-3 border-l-2 border-amber-300 pl-4">
              {timelineEvents.map((evt) => (
                <div key={evt.year} className="bg-white p-4 rounded-xl border border-amber-200 shadow-sm relative">
                  <div className="absolute -left-[23px] top-4 w-3.5 h-3.5 rounded-full bg-[#B8001F] border-2 border-white ring-2 ring-amber-300" />
                  <div className="flex items-center gap-2 mb-1">
                    <span className="bg-[#B8001F] text-white text-[10px] font-black px-2 py-0.5 rounded shadow-xs">
                      {evt.year}
                    </span>
                    <h4 className="text-sm font-bold text-amber-950 font-serif-royal">
                      {language === 'en' ? evt.titleEn : evt.titleOr}
                    </h4>
                  </div>
                  <p className="text-xs text-amber-950/80 font-medium">
                    {language === 'en' ? evt.descEn : evt.descOr}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* PRESS RELEASE NOTES & MEMBER STORIES ARCHIVE */}
        <div className="mt-16 pt-12 border-t border-amber-200">
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-[#B8001F] text-xs font-bold uppercase tracking-wider mb-2">
                <BookOpen className="w-4 h-4 text-[#B8001F]" />
                <span>{language === 'en' ? 'Press Notes & Member Stories Archive' : 'ପ୍ରେସ ବିଜ୍ଞପ୍ତି ଓ କର୍ମକର୍ତ୍ତା କାହାଣୀ'}</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold font-serif-royal text-[#7D0000]">
                {language === 'en' ? 'Puja Chronicles, Press Notes & Achievements' : 'ଇତିହାସ ପ୍ରେସ ବିଜ୍ଞପ୍ତି ଓ କର୍ମକର୍ତ୍ତାଙ୍କ ସଫଳତା'}
              </h3>
            </div>

            <button
              onClick={() => setIsAdminModalOpen(true)}
              className="crimson-button px-4 py-2.5 rounded-xl font-bold text-xs shadow-md text-white flex items-center gap-1.5 shrink-0"
            >
              <Plus className="w-4 h-4 text-white" />
              <span>Publish Press Note / Story</span>
            </button>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-8 text-xs font-bold">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2 rounded-xl transition-all ${
                activeTab === 'all'
                  ? 'crimson-button text-white shadow-md'
                  : 'bg-white text-amber-950 border border-amber-200 hover:bg-amber-100'
              }`}
            >
              All Archives ({historyStories.length})
            </button>

            <button
              onClick={() => setActiveTab('press_note')}
              className={`px-4 py-2 rounded-xl flex items-center gap-1.5 transition-all ${
                activeTab === 'press_note'
                  ? 'crimson-button text-white shadow-md'
                  : 'bg-white text-amber-950 border border-amber-200 hover:bg-amber-100'
              }`}
            >
              <Newspaper className="w-4 h-4" />
              <span>Press Notes</span>
            </button>

            <button
              onClick={() => setActiveTab('member_story')}
              className={`px-4 py-2 rounded-xl flex items-center gap-1.5 transition-all ${
                activeTab === 'member_story'
                  ? 'crimson-button text-white shadow-md'
                  : 'bg-white text-amber-950 border border-amber-200 hover:bg-amber-100'
              }`}
            >
              <UserCheck className="w-4 h-4" />
              <span>Member & Founder Stories</span>
            </button>

            <button
              onClick={() => setActiveTab('achievement')}
              className={`px-4 py-2 rounded-xl flex items-center gap-1.5 transition-all ${
                activeTab === 'achievement'
                  ? 'crimson-button text-white shadow-md'
                  : 'bg-white text-amber-950 border border-amber-200 hover:bg-amber-100'
              }`}
            >
              <Award className="w-4 h-4" />
              <span>Awards & Milestones</span>
            </button>
          </div>

          {/* Story Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filteredStories.map((story) => (
              <div
                key={story.id}
                onClick={() => setSelectedStory(story)}
                className="bg-white rounded-2xl border border-amber-300 hover:border-[#B8001F] transition-all p-5 shadow-md cursor-pointer group flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-[#B8001F] text-white text-[10px] font-black uppercase tracking-wider shadow-xs">
                      {story.category.replace('_', ' ')}
                    </span>
                    <span className="text-xs text-amber-900/70 font-mono font-bold">Year {story.year}</span>
                  </div>

                  <h4 className="text-base font-bold text-[#7D0000] font-serif-royal group-hover:text-[#B8001F] transition-colors line-clamp-2">
                    {language === 'en' ? story.titleEn : story.titleOr}
                  </h4>

                  <p className="text-xs text-amber-950/80 font-medium line-clamp-3">
                    {language === 'en' ? story.contentEn : story.contentOr}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-amber-200 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-amber-950 block truncate max-w-[170px]">{story.authorName}</span>
                    <span className="text-[10px] text-amber-900/70 font-medium block truncate max-w-[170px]">{story.authorRole}</span>
                  </div>

                  <span className="text-xs font-bold text-[#B8001F] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    Read Story &rarr;
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Selected Story Full Modal */}
        {selectedStory && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn">
            <div className="max-w-2xl w-full bg-white rounded-2xl border-2 border-[#D4AF37] p-6 relative shadow-2xl space-y-4 text-amber-950">
              <button
                onClick={() => setSelectedStory(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-amber-100 text-amber-950 hover:bg-amber-200"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-[#B8001F] text-white text-[10px] font-black uppercase">
                  {selectedStory.category.replace('_', ' ')}
                </span>
                <span className="text-xs text-amber-900 font-mono font-bold">Year {selectedStory.year} • Posted {selectedStory.datePosted}</span>
              </div>

              <h3 className="text-xl font-bold font-serif-royal text-[#7D0000]">
                {language === 'en' ? selectedStory.titleEn : selectedStory.titleOr}
              </h3>

              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs font-bold text-amber-950 flex items-center justify-between">
                <div>
                  <span className="block text-[#7D0000]">{selectedStory.authorName}</span>
                  <span className="text-[10px] text-amber-900/70">{selectedStory.authorRole}</span>
                </div>
              </div>

              {selectedStory.mediaUrl && (
                <div className="max-h-48 w-full rounded-xl overflow-hidden border border-amber-300">
                  <img src={selectedStory.mediaUrl} alt="Story scan" className="w-full h-full object-cover" />
                </div>
              )}

              <p className="text-xs sm:text-sm text-amber-950 font-medium leading-relaxed max-h-56 overflow-y-auto">
                {language === 'en' ? selectedStory.contentEn : selectedStory.contentOr}
              </p>

              {selectedStory.documentUrl && (
                <div className="pt-2">
                  <a
                    href={selectedStory.documentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="crimson-button py-2 px-4 rounded-xl text-xs font-bold text-white inline-flex items-center gap-2 shadow-sm"
                  >
                    <FileText className="w-4 h-4 text-[#FFD700]" />
                    <span>Download Official Press Release Document (PDF)</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}
            </div>
          </div>
        )}

        <JhotiDivider className="mt-12 opacity-80" />

      </div>
    </section>
  );
};
