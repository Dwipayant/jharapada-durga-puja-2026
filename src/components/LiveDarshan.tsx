import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { YoutubeIcon } from './SocialIcons';
import { 
  Users, 
  Heart, 
  Send, 
  Flower2, 
  Radio, 
  Car, 
  CheckCircle2, 
  Share2
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const LiveDarshan: React.FC = () => {
  const { 
    language, 
    liveConfig, 
    crowdStatus, 
    pranamMessages, 
    addPranamMessage, 
    likePranamMessage 
  } = useApp();

  // Form states for Pranam Box
  const [donorName, setDonorName] = useState('');
  const [location, setLocation] = useState('');
  const [message, setMessage] = useState('');
  const [pranamSent, setPranamSent] = useState(false);

  const triggerMarigoldConfetti = () => {
    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.8 },
      colors: ['#FFD700', '#FF8C00', '#B8001F', '#FFFDF8']
    });
  };

  const handlePranamSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    addPranamMessage(donorName, location, message);
    setMessage('');
    setPranamSent(true);
    triggerMarigoldConfetti();
    setTimeout(() => setPranamSent(false), 3000);
  };

  const crowdGaugeColor = {
    normal: 'text-emerald-800 border-emerald-300 bg-emerald-50',
    moderate: 'text-amber-900 border-amber-300 bg-amber-50',
    heavy: 'text-rose-900 border-rose-300 bg-rose-50'
  }[crowdStatus.level];

  return (
    <section id="live-darshan" className="py-16 bg-[#FFFDF8] relative text-amber-950 border-b border-[#D4AF37]/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-rose-50 border border-rose-200 text-[#B8001F] text-xs font-extrabold uppercase tracking-wider mb-3 shadow-sm">
            <Radio className="w-4 h-4 animate-pulse text-[#B8001F]" />
            <span>{language === 'en' ? '24x7 Live Stream' : '୨୪x୭ ଲାଇଭ୍ ପ୍ରସାରଣ'}</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold font-serif-royal royal-gold-heading mb-3">
            {language === 'en' ? 'Live 4K HD Darshan & Pranam' : 'ପ୍ରତ୍ୟକ୍ଷ ଲାଇଭ୍ ଦର୍ଶନ ଓ ପ୍ରଣାମ'}
          </h2>
          <p className="text-amber-950/80 text-sm sm:text-base font-medium">
            {language === 'en'
              ? 'Watch Maa Durga Aarti & Bauda Garh Fort illuminations live on YouTube 4K HD. Offer your digital prayers from anywhere in the world.'
              : 'ୟୁଟ୍ୟୁବ୍ ମାଧ୍ୟମରେ ମା\'ଙ୍କ ଦର୍ଶନ କରନ୍ତୁ ଏବଂ ନିଜର ଶ୍ରଦ୍ଧା ସୁମନ ଅର୍ପଣ କରନ୍ତୁ ।'}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Video Stream Container */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Header Stats Bar */}
            <div className="glass-card p-3 rounded-2xl flex items-center justify-between gap-2 overflow-x-auto shadow-md">
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm bg-[#B8001F] text-white shadow-md">
                  <YoutubeIcon className="w-4 h-4 text-white" />
                  <span>Official YouTube 4K Ultra HD</span>
                  <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                </span>
              </div>

              {/* Viewers Stats */}
              <div className="flex items-center gap-2 text-xs font-bold text-amber-950 px-3 py-1.5 rounded-lg bg-amber-100/70 border border-amber-300 shrink-0 shadow-sm">
                <Users className="w-4 h-4 text-[#B8001F]" />
                <span>{liveConfig.viewersCount.toLocaleString('en-IN')} {language === 'en' ? 'Watching Now' : 'ଦେଖୁଛନ୍ତି'}</span>
              </div>
            </div>

            {/* Video Player Display Screen */}
            <div className="glass-card-gold rounded-2xl overflow-hidden shadow-xl relative border-2 border-[#D4AF37]">
              <div className="aspect-video w-full bg-black relative flex items-center justify-center">
                <iframe
                  className="w-full h-full border-0"
                  src={`https://www.youtube.com/embed/live_stream?channel=UC_JharapadaDurgaPuja2026&autoplay=1&mute=1`}
                  title="Jharapada Durga Puja 2026 YouTube Live"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  onError={() => console.warn('YouTube embed fallback')}
                  srcDoc={`
                    <style>
                      body { margin:0; background:#FFFDF8; color:#2D1A24; font-family:sans-serif; display:flex; flex-direction:column; align-items:center; justify-content:center; height:100vh; text-align:center; padding:20px; }
                      .banner { background:linear-gradient(135deg, #FFF5E5, #FFFDF8); border:2px solid #D4AF37; padding:30px; border-radius:16px; box-shadow:0 10px 30px rgba(184,0,31,0.1); }
                      h2 { color:#8B0000; margin-bottom:10px; font-size:24px; font-family:serif; }
                      p { color:#2D1A24; font-size:14px; opacity:0.9; }
                      .badge { background:#B8001F; color:#fff; padding:6px 16px; border-radius:20px; font-weight:bold; font-size:12px; display:inline-block; margin-bottom:15px; }
                      .btn { display:inline-block; margin-top:15px; padding:10px 20px; background:#FFD700; color:#000; text-decoration:none; font-weight:bold; border-radius:8px; }
                    </style>
                    <div class="banner">
                      <div class="badge">🔴 OFFICIAL 4K YOUTUBE LIVE DARSHAN</div>
                      <h2>${language === 'en' ? 'Jharapada Durga Puja Live Stream 2026' : 'ଝାରପଡ଼ା ଦୁର୍ଗା ପୂଜା ଲାଇଭ୍ ଦର୍ଶନ'}</h2>
                      <p>${language === 'en' ? 'Live Aarti & Bauda Garh Fort Illuminations Broadcasting Active' : 'ଆରତୀ ଓ ସୁବର୍ଣ୍ଣ ମଣ୍ଡପ ପ୍ରତ୍ୟକ୍ଷ ପ୍ରସାରଣ'}</p>
                      <a href="https://youtube.com" target="_blank" class="btn">${language === 'en' ? 'Open YouTube HD Player' : 'ୟୁଟ୍ୟୁବରେ ଦେଖନ୍ତୁ'}</a>
                    </div>
                  `}
                />

                {/* Overlay Stream Info */}
                <div className="absolute top-4 left-4 flex items-center gap-2 bg-white/90 backdrop-blur-md border border-amber-300 px-3 py-1.5 rounded-full text-xs font-bold text-[#8B0000] shadow-sm">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#B8001F] animate-ping" />
                  <span>{language === 'en' ? 'LIVE FROM MELAN PADIA' : 'ମେଲଣ ପଡ଼ିଆରୁ ଲାଇଭ୍'}</span>
                </div>
              </div>

              {/* Video Title Bar */}
              <div className="p-4 bg-amber-50/70 border-t border-[#D4AF37]/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-base font-bold text-[#8B0000] font-serif-royal">
                    {language === 'en' ? liveConfig.titleEn : liveConfig.titleOr}
                  </h3>
                  <p className="text-xs text-amber-950/70 font-medium">
                    {language === 'en' ? 'Camera 1: Sanctum Idol | Camera 2: Bauda Garh Gate | Camera 3: Cultural Stage' : 'କ୍ୟାମେରା ୧: ମୁଖ୍ୟ ମଣ୍ଡପ | କ୍ୟାମେରା ୨: ବାଉଡ଼ ଗଡ଼ ତୋରଣ'}
                  </p>
                </div>

                <button
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({
                        title: 'Jharapada Durga Puja 2026 Live Darshan',
                        url: window.location.href
                      }).catch(() => {});
                    } else {
                      triggerMarigoldConfetti();
                      alert('Live stream link copied to clipboard!');
                    }
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg crimson-button text-xs font-bold shrink-0"
                >
                  <Share2 className="w-4 h-4 text-[#FFD700]" />
                  <span>{language === 'en' ? 'Share Live Stream' : 'ସେୟାର କରନ୍ତୁ'}</span>
                </button>
              </div>
            </div>

            {/* Real-time Crowd Density & Parking Gauge Component */}
            <div className="glass-card p-6 rounded-2xl border-t-4 border-t-[#B8001F] shadow-md">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div>
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-[#B8001F]" />
                    <h3 className="text-lg font-bold font-serif-royal text-[#7D0000]">
                      {language === 'en' ? 'Smart Crowd Density & Parking Meter' : 'ଗହଳି ଓ ପାର୍କିଂ ସୂଚକ'}
                    </h3>
                  </div>
                  <p className="text-xs text-amber-950/70 font-medium mt-0.5">
                    {language === 'en' ? 'Updated live by Control Room ground team' : 'ନିୟନ୍ତ୍ରଣ କକ୍ଷ ଦ୍ୱାରା ପ୍ରତ୍ୟକ୍ଷ ଆପଡେଟ୍'} • {crowdStatus.lastUpdated}
                  </p>
                </div>

                {/* Status Indicator Pill */}
                <div className={`px-4 py-2 rounded-xl border flex items-center gap-2 text-sm font-bold shadow-sm ${crowdGaugeColor}`}>
                  <span className="w-3 h-3 rounded-full bg-current animate-ping" />
                  <span>
                    {crowdStatus.level === 'normal' && (language === 'en' ? '🟢 Normal Crowd (<15m Wait)' : '🟢 ସ୍ୱାଭାବିକ ଗହଳି (<୧୫ମି)')}
                    {crowdStatus.level === 'moderate' && (language === 'en' ? '🟡 Moderate Surge (15-30m Wait)' : '🟡 ମଧ୍ୟମ ଗହଳି (୧୫-୩୦ମି)')}
                    {crowdStatus.level === 'heavy' && (language === 'en' ? '🔴 Heavy Surge (>45m Wait)' : '🔴 ପ୍ରବଳ ଗହଳି (>୪୫ମି)')}
                  </span>
                </div>
              </div>

              {/* Parking Lot Status Bars */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Gate A */}
                <div className="bg-amber-50/70 p-3.5 rounded-xl border border-amber-200">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-semibold text-amber-950 flex items-center gap-1">
                      <Car className="w-3.5 h-3.5 text-[#B8001F]" />
                      {language === 'en' ? 'Gate-A (Cuttack Road)' : 'ଗେଟ୍-A (କଟକ ରୋଡ୍)'}
                    </span>
                    <span className="font-bold text-[#8B0000]">{crowdStatus.parking.gateA}%</span>
                  </div>
                  <div className="w-full bg-amber-200/60 h-2 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${crowdStatus.parking.gateA > 80 ? 'bg-red-600' : crowdStatus.parking.gateA > 50 ? 'bg-amber-500' : 'bg-emerald-600'}`}
                      style={{ width: `${crowdStatus.parking.gateA}%` }}
                    />
                  </div>
                </div>

                {/* Gate B */}
                <div className="bg-amber-50/70 p-3.5 rounded-xl border border-amber-200">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-semibold text-amber-950 flex items-center gap-1">
                      <Car className="w-3.5 h-3.5 text-[#B8001F]" />
                      {language === 'en' ? 'Gate-B (Jhar. Jail Ground)' : 'ଗେଟ୍-B (ଝାରପଡା ଜେଲ)'}
                    </span>
                    <span className="font-bold text-[#8B0000]">{crowdStatus.parking.gateB}%</span>
                  </div>
                  <div className="w-full bg-amber-200/60 h-2 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${crowdStatus.parking.gateB > 80 ? 'bg-red-600' : crowdStatus.parking.gateB > 50 ? 'bg-amber-500' : 'bg-emerald-600'}`}
                      style={{ width: `${crowdStatus.parking.gateB}%` }}
                    />
                  </div>
                </div>

                {/* Gate C */}
                <div className="bg-amber-50/70 p-3.5 rounded-xl border border-amber-200">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-semibold text-amber-950 flex items-center gap-1">
                      <Car className="w-3.5 h-3.5 text-[#B8001F]" />
                      {language === 'en' ? 'Gate-C (Overbridge Side)' : 'ଗେଟ୍-C (ଓଭରବ୍ରିଜ୍)'}
                    </span>
                    <span className="font-bold text-[#8B0000]">{crowdStatus.parking.gateC}%</span>
                  </div>
                  <div className="w-full bg-amber-200/60 h-2 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${crowdStatus.parking.gateC > 80 ? 'bg-red-600' : crowdStatus.parking.gateC > 50 ? 'bg-amber-500' : 'bg-emerald-600'}`}
                      style={{ width: `${crowdStatus.parking.gateC}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Interactive Digital Pranam Box & Prayers Feed */}
          <div className="lg:col-span-4 space-y-6">
            <div className="glass-card-gold p-6 rounded-2xl border-2 border-[#D4AF37] shadow-xl flex flex-col h-full min-h-[520px]">
              
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[#D4AF37]/30">
                <Flower2 className="w-6 h-6 text-[#B8001F] animate-spin" style={{ animationDuration: '12s' }} />
                <div>
                  <h3 className="text-lg font-bold font-serif-royal text-[#7D0000]">
                    {language === 'en' ? 'Digital Pranam & Prayer Box' : 'ଇ-ପ୍ରଣାମ ଓ ପୁଷ୍ପାଞ୍ଜଳି'}
                  </h3>
                  <p className="text-xs text-amber-950/70 font-medium">
                    {language === 'en' ? 'Post your live digital prayer on screen' : 'ମା\'ଙ୍କ ପାଖରେ ମନସ୍କାମନା ଜଣାନ୍ତୁ'}
                  </p>
                </div>
              </div>

              {/* Prayer Form */}
              <form onSubmit={handlePranamSubmit} className="space-y-3 mb-6">
                {pranamSent && (
                  <div className="p-2.5 rounded-lg bg-emerald-100 border border-emerald-400 text-emerald-900 text-xs font-bold flex items-center gap-2 animate-bounce">
                    <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                    <span>{language === 'en' ? 'Your prayer has been offered to Maa Durga! 🙏' : 'ମା\'ଙ୍କ ପାଦପଦ୍ମରେ ଆପଣଙ୍କ ପ୍ରଣାମ ପହଞ୍ଚିଲା! 🙏'}</span>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={donorName}
                    onChange={(e) => setDonorName(e.target.value)}
                    placeholder={language === 'en' ? 'Your Name' : 'ଆପଣଙ୍କ ନାମ'}
                    className="w-full bg-white border border-amber-300 rounded-xl px-3 py-2 text-xs text-amber-950 focus:outline-none focus:border-[#B8001F]"
                    required
                  />
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder={language === 'en' ? 'City / Country' : 'ସହର / ଦେଶ'}
                    className="w-full bg-white border border-amber-300 rounded-xl px-3 py-2 text-xs text-amber-950 focus:outline-none focus:border-[#B8001F]"
                  />
                </div>

                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={language === 'en' ? 'Write your prayer or wish (e.g. Jai Maa Durga! Bless our family...)' : 'ଶ୍ରଦ୍ଧା ସୁମନ ଜଣାନ୍ତୁ (ଯଥା: ଜୟ ମା\' ଦୁର୍ଗା!)...'}
                  className="w-full bg-white border border-amber-300 rounded-xl px-3 py-2 text-xs text-amber-950 h-20 resize-none focus:outline-none focus:border-[#B8001F]"
                  required
                />

                <button
                  type="submit"
                  className="w-full crimson-button py-2.5 rounded-xl flex items-center justify-center gap-2 text-xs font-bold shadow-md"
                >
                  <Send className="w-3.5 h-3.5 text-[#FFD700]" />
                  <span>{language === 'en' ? 'Offer Digital Flower & Prayer' : 'ପୁଷ୍ପାର୍ପଣ ଓ ପ୍ରଣାମ'}</span>
                </button>
              </form>

              {/* Live Prayers Feed List */}
              <div className="flex-1 overflow-y-auto space-y-3 max-h-[300px] pr-1">
                <div className="text-[11px] font-bold text-amber-900 uppercase tracking-wider mb-2 flex items-center justify-between">
                  <span>{language === 'en' ? 'Recent Global Devotee Prayers' : 'ସାମ୍ପ୍ରତିକ ଭକ୍ତଙ୍କ ପ୍ରଣାମ'}</span>
                  <span className="text-[#8B0000]">{pranamMessages.length} {language === 'en' ? 'Prayers' : 'ପ୍ରଣାମ'}</span>
                </div>

                {pranamMessages.map((p) => (
                  <div key={p.id} className="bg-white/90 p-3 rounded-xl border border-amber-200 hover:border-amber-400 transition-all shadow-sm">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-[#8B0000]">{p.name}</span>
                      <span className="text-[10px] text-amber-900/70">{p.location}</span>
                    </div>
                    <p className="text-xs text-amber-950 font-medium mb-2">"{p.message}"</p>
                    <div className="flex items-center justify-between text-[10px] text-amber-900/70 pt-1 border-t border-amber-100">
                      <span>{p.timestamp}</span>
                      <button
                        onClick={() => {
                          likePranamMessage(p.id);
                          triggerMarigoldConfetti();
                        }}
                        className="flex items-center gap-1 text-[#B8001F] font-bold hover:text-red-700 transition-colors"
                      >
                        <Heart className="w-3 h-3 fill-[#B8001F]" />
                        <span>{p.likes} {language === 'en' ? 'Flowers Offered' : 'ପୁଷ୍ପ'}</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
