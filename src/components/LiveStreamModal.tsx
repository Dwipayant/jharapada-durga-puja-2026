import React from 'react';
import { useApp } from '../context/AppContext';
import { YoutubeIcon } from './SocialIcons';
import { Radio, Users, X, ArrowRight, Flower2, Sparkles, Volume2, VolumeX } from 'lucide-react';
import confetti from 'canvas-confetti';

export const LiveStreamModal: React.FC = () => {
  const { 
    language, 
    liveConfig, 
    isLiveModalOpen, 
    setIsLiveModalOpen,
    isAudioPlaying,
    toggleAudio
  } = useApp();

  if (!isLiveModalOpen) return null;

  const handleClose = () => {
    confetti({
      particleCount: 50,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#FFD700', '#FF8C00', '#B8001F', '#FFFDF8']
    });
    setIsLiveModalOpen(false);
  };

  const triggerFlowers = () => {
    confetti({
      particleCount: 60,
      spread: 80,
      origin: { y: 0.7 },
      colors: ['#FFD700', '#FF8C00', '#B8001F', '#FFFDF8']
    });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div 
        className="relative w-full max-w-4xl bg-gradient-to-b from-[#FFFDF8] via-[#FFF9F0] to-[#FFF5E5] text-amber-950 rounded-3xl shadow-2xl border-2 border-[#D4AF37] overflow-hidden my-auto transform transition-all scale-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Bar Banner */}
        <div className="bg-gradient-to-r from-[#B8001F] via-[#900018] to-[#8B0000] text-white p-4 sm:p-5 flex items-center justify-between gap-4 border-b-2 border-[#FFD700]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#FFD700]/20 border border-[#FFD700] flex items-center justify-center shrink-0">
              <Radio className="w-5 h-5 text-[#FFD700] animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-500/30 border border-red-300 text-white text-[11px] font-extrabold uppercase tracking-wide">
                  <span className="w-2 h-2 rounded-full bg-red-400 animate-ping" />
                  LIVE 4K DARSHAN
                </span>
                <span className="text-amber-200 text-xs hidden sm:inline">• 2026 Bauda Garh Fort</span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold font-serif-royal text-[#FFD700] tracking-wide mt-0.5">
                {language === 'en' ? 'Live Maha Aarti & Pandal Streaming' : 'ପ୍ରତ୍ୟକ୍ଷ ଲାଇଭ୍ ଆରତୀ ଓ ମଣ୍ଡପ ଦର୍ଶନ'}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleAudio}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all text-xs flex items-center gap-1.5"
              title={isAudioPlaying ? 'Mute Aarti Chants' : 'Play Aarti Chants'}
            >
              {isAudioPlaying ? <Volume2 className="w-4 h-4 text-[#FFD700]" /> : <VolumeX className="w-4 h-4 text-white/70" />}
              <span className="hidden sm:inline">{isAudioPlaying ? 'Aarti Playing' : 'Play Mantra'}</span>
            </button>

            <button
              onClick={handleClose}
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all border border-white/20 hover:rotate-90"
              aria-label="Close Live Stream Modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Main Content Body */}
        <div className="p-4 sm:p-6 space-y-4">

          {/* Stream Header */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-amber-100/50 p-2.5 rounded-2xl border border-amber-300">
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl font-bold text-xs sm:text-sm bg-[#B8001F] text-white shadow-md">
                <YoutubeIcon className="w-4 h-4 text-white" />
                <span>Official YouTube 4K Ultra HD</span>
              </span>
            </div>

            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-200/60 border border-amber-300 text-xs font-bold text-[#8B0000] shrink-0">
              <Users className="w-4 h-4 text-[#B8001F] animate-pulse" />
              <span>{liveConfig.viewersCount.toLocaleString('en-IN')} Devotees Watching</span>
            </div>
          </div>

          {/* Video Player Box */}
          <div className="relative rounded-2xl overflow-hidden shadow-2xl border-2 border-[#D4AF37] bg-black aspect-video max-h-[420px]">
            <iframe
              className="w-full h-full border-0"
              src={`https://www.youtube.com/embed/live_stream?channel=UC_JharapadaDurgaPuja2026&autoplay=1&mute=1`}
              title="Jharapada Durga Puja 2026 Live Stream"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              srcDoc={`
                <style>
                  body { margin:0; background:#FFFDF8; color:#2D1A24; font-family:sans-serif; display:flex; flex-direction:column; align-items:center; justify-content:center; height:100vh; text-align:center; padding:20px; }
                  .banner { background:linear-gradient(135deg, #FFF5E5, #FFFDF8); border:2px solid #D4AF37; padding:25px; border-radius:16px; box-shadow:0 10px 30px rgba(184,0,31,0.1); max-width:90%; }
                  h2 { color:#8B0000; margin-bottom:8px; font-size:22px; font-family:serif; }
                  p { color:#2D1A24; font-size:13px; opacity:0.9; }
                  .badge { background:#B8001F; color:#fff; padding:4px 14px; border-radius:20px; font-weight:bold; font-size:11px; display:inline-block; margin-bottom:12px; }
                  .btn { display:inline-block; margin-top:12px; padding:10px 20px; background:#FFD700; color:#000; text-decoration:none; font-weight:bold; border-radius:8px; }
                </style>
                <div class="banner">
                  <div class="badge">🔴 OFFICIAL 4K YOUTUBE LIVE DARSHAN</div>
                  <h2>${language === 'en' ? 'Jharapada Durga Puja Live Stream 2026' : 'ଝାରପଡ଼ା ଦୁର୍ଗା ପୂଜା ଲାଇଭ୍ ଦର୍ଶନ'}</h2>
                  <p>${language === 'en' ? 'Live Aarti & Bauda Garh Fort Illuminations Broadcasting Active' : 'ଆରତୀ ଓ ସୁବର୍ଣ୍ଣ ମଣ୍ଡପ ପ୍ରତ୍ୟକ୍ଷ ପ୍ରସାରଣ'}</p>
                  <a href="https://youtube.com" target="_blank" class="btn">${language === 'en' ? 'Open YouTube HD Player' : 'ୟୁଟ୍ୟୁବରେ ଦେଖନ୍ତୁ'}</a>
                </div>
              `}
            />

            {/* Live Camera Tag */}
            <div className="absolute top-3 left-3 bg-red-600/90 backdrop-blur-md text-white px-3 py-1 rounded-full text-[11px] font-bold shadow-md flex items-center gap-1.5 border border-red-300">
              <span className="w-2 h-2 rounded-full bg-white animate-ping" />
              <span>{language === 'en' ? 'CAMERA 1: SANCTUM IDOL DARSHAN' : 'କ୍ୟାମେରା ୧: ମୁଖ୍ୟ ମଣ୍ଡପ'}</span>
            </div>
          </div>

          {/* Modal Bottom CTA Bar */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
            <button
              onClick={triggerFlowers}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-amber-100 hover:bg-amber-200 border border-amber-300 text-amber-950 text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-sm"
            >
              <Flower2 className="w-4 h-4 text-[#B8001F] animate-spin" style={{ animationDuration: '8s' }} />
              <span>{language === 'en' ? '🌸 Offer Digital Flowers' : '🌸 ପୁଷ୍ପାର୍ପଣ କରନ୍ତୁ'}</span>
            </button>

            <button
              onClick={handleClose}
              className="w-full sm:w-auto crimson-button px-6 py-3 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg hover:scale-105 transition-all"
            >
              <Sparkles className="w-4 h-4 text-[#FFD700]" />
              <span>{language === 'en' ? 'Enter Website & Explore Puja' : 'ମୁଖ୍ୟ ପୃଷ୍ଠାକୁ ପ୍ରବେଶ କରନ୍ତୁ'}</span>
              <ArrowRight className="w-4 h-4 text-[#FFD700]" />
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
