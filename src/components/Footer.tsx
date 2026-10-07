import { useApp } from '../context/AppContext';
import { YoutubeIcon } from './SocialIcons';
import { Phone, Mail, MapPin, ShieldCheck, Heart } from 'lucide-react';
import { JhotiDivider } from './JhotiDivider';

export const Footer: React.FC = () => {
  const { language, setIsAdminModalOpen } = useApp();

  return (
    <footer className="bg-[#FFF5E5] text-amber-950 pt-12 pb-8 border-t-2 border-[#D4AF37]/50 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Jhoti Motif */}
        <JhotiDivider className="mb-8 opacity-80" />

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          
          {/* Col 1: Brand Info */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🛕</span>
              <h3 className="text-lg font-bold font-serif-royal royal-gold-heading">
                Jharapada Durga Puja
              </h3>
            </div>
            <p className="text-xs text-amber-950/80 font-medium leading-relaxed">
              {language === 'en'
                ? 'Jharapada Durga Puja Samitee, Bhubaneswar, Odisha. Bringing devotion, heritage, and royal fort illuminations since 1976.'
                : 'ଝାରପଡ଼ା ଦୁର୍ଗା ପୂଜା ସମିତି, ଭୁବନେଶ୍ୱର । ପରମ୍ପରା, ସଂସ୍କୃତି ଓ ଭକ୍ତିର ଅପୂର୍ବ ମିଳନ ।'}
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a href="https://youtube.com" target="_blank" rel="noreferrer" className="p-2 rounded-lg bg-amber-100/90 text-[#B8001F] hover:scale-110 transition-transform shadow-xs border border-amber-300">
                <YoutubeIcon className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-2 text-xs">
            <h4 className="text-sm font-bold text-[#8B0000] font-serif-royal mb-3">
              {language === 'en' ? 'Quick Navigation' : 'ମୁଖ୍ୟ ଲିଙ୍କ୍'}
            </h4>
            <ul className="space-y-2 text-amber-950/80 font-medium">
              <li><a href="#live-darshan" className="hover:text-[#B8001F]">Live 4K HD Darshan</a></li>
              <li><a href="#ground-map" className="hover:text-[#B8001F]">Interactive Ground Map</a></li>
              <li><a href="#schedule" className="hover:text-[#B8001F]">Rituals & Cultural Timings</a></li>
              <li><a href="#passes-donations" className="hover:text-[#B8001F]">Senior Citizen VIP Pass</a></li>
              <li><a href="#passes-donations" className="hover:text-[#B8001F]">80G Tax Exemption Donation</a></li>
              <li><a href="#heritage" className="hover:text-[#B8001F]">Bauda Garh Fort History</a></li>
            </ul>
          </div>

          {/* Col 3: Emergency Contacts */}
          <div className="space-y-2 text-xs">
            <h4 className="text-sm font-bold text-[#8B0000] font-serif-royal mb-3">
              {language === 'en' ? 'Ground Emergency Helpdesk' : 'ଜରୁରୀ ସେବା ସୂଚନା'}
            </h4>
            <div className="space-y-2 text-amber-950/80 font-medium">
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#B8001F]" />
                <span>Control Room: +91 674 2589000</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-red-600" />
                <span>Sanjeevani Ambulance: 108 / 112</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#B8001F]" />
                <span>info@jharapadadurgapuja.com</span>
              </div>
              <div className="flex items-start gap-2 pt-1">
                <MapPin className="w-3.5 h-3.5 text-[#B8001F] shrink-0 mt-0.5" />
                <span>Melan Padia, Cuttack-Puri Road, Jharapada, Bhubaneswar - 751006</span>
              </div>
            </div>
          </div>

          {/* Col 4: Hostinger Admin Portal */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-[#8B0000] font-serif-royal mb-1">
              {language === 'en' ? 'Committee Control Room' : 'ସମିତି ନିୟନ୍ତ୍ରଣ କକ୍ଷ'}
            </h4>
            <p className="text-xs text-amber-950/80 font-medium">
              Authorized committee admins can update live streams, crowd meters, and tickers.
            </p>
            <button
              onClick={() => setIsAdminModalOpen(true)}
              className="w-full crimson-button py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-md"
            >
              <ShieldCheck className="w-4 h-4 text-[#FFD700]" />
              <span>{language === 'en' ? 'Open Admin Control Panel' : 'ଆଡମିନ୍ ପୋର୍ଟାଲ୍'}</span>
            </button>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-amber-300 flex flex-col sm:flex-row items-center justify-between text-xs text-amber-900/80 font-medium gap-3">
          <p>© 2026 Jharapada Durga Puja Samitee. All Rights Reserved.</p>
          <p className="flex items-center gap-1">
            <span>Crafted with devotion & pride in Odisha</span>
            <Heart className="w-3 h-3 text-[#B8001F] fill-[#B8001F]" />
          </p>
        </div>

      </div>
    </footer>
  );
};
