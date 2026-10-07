import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import type { GalleryMedia } from '../types';
import { Eye, Download, X, Camera, Upload, Compass } from 'lucide-react';
import { PanoramaViewer } from './PanoramaViewer';

export const GalleryAndVR: React.FC = () => {
  const { language, gallery, setIsAdminModalOpen, registerModalOpen } = useApp();

  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedMedia, setSelectedMedia] = useState<GalleryMedia | null>(null);
  const [is360Active, setIs360Active] = useState<boolean>(true);

  useEffect(() => {
    registerModalOpen('lightbox-modal', !!selectedMedia);
    return () => registerModalOpen('lightbox-modal', false);
  }, [selectedMedia, registerModalOpen]);

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

  const filteredGallery = gallery.filter(item => 
    activeCategory === 'all' || item.category === activeCategory
  );

  return (
    <section id="gallery" className="py-16 bg-[#FFFDF8] relative text-amber-950 border-b border-[#D4AF37]/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-100/80 border border-amber-300 text-[#B8001F] text-xs font-bold uppercase tracking-wider mb-3 shadow-sm">
            <Camera className="w-4 h-4 text-[#B8001F]" />
            <span>{language === 'en' ? 'Media Archives & VR' : 'ଫୋଟୋ ଓ ୩୬୦° ଭର୍ଚୁଆଲ ଟୁର'}</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold font-serif-royal royal-gold-heading mb-3">
            {language === 'en' ? 'Photo Gallery & 360° Pandal Tour' : 'ଫୋଟୋ ଗ୍ୟାଲେରୀ ଓ ୩୬୦° ମଣ୍ଡପ ପରିଦର୍ଶନ'}
          </h2>
          <p className="text-amber-950/80 text-sm sm:text-base font-medium">
            {language === 'en'
              ? 'High-resolution photo gallery of Jharapada Pandal illuminations, Gold Sanctum, and 360-degree interactive virtual tour.'
              : 'ଝାରପଡ଼ା ଦୁର୍ଗା ପୂଜାର ମନୋରମ ଆଲୋକସଜ୍ଜା ଫୋଟୋ ଏବଂ ୩୬୦° ଭର୍ଚୁଆଲ ଟୁର ।'}
          </p>
        </div>

        {/* 360 Virtual Tour Banner Card */}
        <div className="glass-card-gold p-6 rounded-2xl border-2 border-[#D4AF37] mb-12 shadow-xl relative overflow-hidden">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="space-y-2 text-left">
              <span className="px-2.5 py-0.5 rounded-full bg-[#B8001F] text-white text-[10px] font-black uppercase tracking-wider shadow-xs">
                360° INTERACTIVE VR WALKTHROUGH
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold font-serif-royal text-[#7D0000]">
                {language === 'en' ? 'Virtual Reality Pandal Walkthrough' : '୩୬୦° ଡିଜିଟାଲ୍ ମଣ୍ଡପ ଭ୍ରମଣ'}
              </h3>
              <p className="text-xs sm:text-sm text-amber-950 font-medium max-w-xl">
                {language === 'en'
                  ? 'Experience the 120ft Bauda Garh Fort and Gold Sanctum in 360° panoramic view with interactive drag controls & clickable hotspots.'
                  : 'ଘରେ ବସି ବାଉଡ଼ ଗଡ଼ ତୋରଣ ଏବଂ ସୁନା ମେଢ଼ ୩୬୦ ଡିଗ୍ରୀ ଅନୁଭୂତି ପାଆନ୍ତୁ ।'}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => setIsAdminModalOpen(true)}
                className="gold-button px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-sm text-amber-950"
              >
                <Upload className="w-4 h-4 text-[#B8001F]" />
                <span>Upload Actual Pandal Photo</span>
              </button>

              <button
                onClick={() => setIs360Active(!is360Active)}
                className="crimson-button px-5 py-2.5 rounded-xl font-extrabold text-xs flex items-center gap-2 shadow-md shrink-0 text-white"
              >
                <Eye className="w-4 h-4 text-[#FFD700]" />
                <span>{is360Active ? (language === 'en' ? 'Close VR Tour' : 'ବନ୍ଦ କରନ୍ତୁ') : (language === 'en' ? 'Launch 360° VR View' : '୩୬୦° ଟୁର ଚାଲୁ କରନ୍ତୁ')}</span>
              </button>
            </div>
          </div>

          {/* Interactive 360 Panoramic Canvas Viewer */}
          {is360Active && (
            <div className="mt-6 space-y-4 animate-fadeIn">
              
              {/* Preset View Switcher Bar */}
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
                    className={`px-3 py-1.5 rounded-lg shrink-0 transition-all ${
                      active360Url === view.url
                        ? 'bg-[#B8001F] text-white shadow-xs font-bold border border-[#FFD700]'
                        : 'bg-white text-amber-950 border border-amber-300 hover:bg-amber-100'
                    }`}
                  >
                    {language === 'en' ? view.nameEn : view.nameOr}
                  </button>
                ))}

                {/* Option to view user uploaded images in 360 */}
                {gallery.length > 0 && (
                  <select
                    onChange={(e) => {
                      if (e.target.value) {
                        setActive360Url(e.target.value);
                        setActive360Title('Custom Gallery Photo');
                      }
                    }}
                    className="px-3 py-1.5 rounded-lg bg-white border border-amber-300 text-amber-950 text-xs font-medium focus:outline-none shrink-0"
                  >
                    <option value="">📁 Select Uploaded Photo for 360 View...</option>
                    {gallery.map(g => (
                      <option key={g.id} value={g.url}>
                        {g.titleEn} ({g.category})
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {/* 360 Interactive Canvas Container */}
              <div className="aspect-[16/8] min-h-[350px] w-full relative">
                <PanoramaViewer imageUrl={active360Url} title={active360Title} />
              </div>

            </div>
          )}
        </div>

        {/* Gallery Filter Tabs */}
        <div className="flex items-center justify-center gap-2 overflow-x-auto pb-4 mb-8 text-xs font-bold">
          {['all', 'pandal', 'idol', 'lights', 'celebrities', 'bhasani'].map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-xl capitalize transition-all ${
                activeCategory === cat
                  ? 'crimson-button text-white shadow-md'
                  : 'bg-amber-100/70 text-amber-950 hover:bg-amber-200/80 border border-amber-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Media Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredGallery.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedMedia(item)}
              className="glass-card rounded-2xl overflow-hidden border border-amber-300 hover:border-[#B8001F] transition-all cursor-pointer group shadow-md"
            >
              <div className="aspect-[4/3] w-full overflow-hidden relative bg-amber-50">
                <img
                  src={item.url}
                  alt={item.titleEn}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                  <span className="text-xs font-bold text-[#FFD700] flex items-center gap-1">
                    <Eye className="w-4 h-4" /> View Full Image
                  </span>
                </div>
                <span className="absolute top-3 left-3 bg-[#B8001F] text-white text-[10px] font-black px-2 py-0.5 rounded shadow-sm">
                  {item.year}
                </span>
              </div>

              <div className="p-4 bg-white">
                <h4 className="text-sm font-bold text-amber-950 font-serif-royal">
                  {language === 'en' ? item.titleEn : item.titleOr}
                </h4>
              </div>
            </div>
          ))}
        </div>

        {/* Selected Image Lightbox Modal */}
        {selectedMedia && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn">
            <div className="max-w-4xl w-full bg-white rounded-2xl border-2 border-[#D4AF37] overflow-hidden relative shadow-2xl">
              <button
                onClick={() => setSelectedMedia(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-black/60 text-white hover:text-[#FFD700] z-10"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="max-h-[70vh] bg-black flex items-center justify-center">
                <img
                  src={selectedMedia.url}
                  alt={selectedMedia.titleEn}
                  className="max-h-[70vh] w-auto object-contain"
                />
              </div>

              <div className="p-4 bg-amber-50 flex items-center justify-between border-t border-amber-200">
                <div>
                  <h3 className="text-lg font-bold text-[#8B0000] font-serif-royal">
                    {language === 'en' ? selectedMedia.titleEn : selectedMedia.titleOr}
                  </h3>
                  <span className="text-xs text-amber-900/70 font-semibold capitalize">{selectedMedia.category} • Year {selectedMedia.year}</span>
                </div>

                <a
                  href={selectedMedia.url}
                  target="_blank"
                  download
                  className="crimson-button px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 text-white"
                >
                  <Download className="w-4 h-4 text-[#FFD700]" />
                  <span>Download Image</span>
                </a>
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
