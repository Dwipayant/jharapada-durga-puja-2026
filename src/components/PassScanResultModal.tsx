import React from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle2, AlertTriangle, XCircle, ShieldCheck, X, Clock, MapPin, User, Ticket } from 'lucide-react';

export const PassScanResultModal: React.FC = () => {
  const { activeScanResult, setActiveScanResult, language } = useApp();

  if (!activeScanResult) return null;

  const { success, pass, isDuplicate, message } = activeScanResult;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn"
      onClick={(e) => {
        if (e.target === e.currentTarget) setActiveScanResult(null);
      }}
    >
      <div className="bg-[#FFFDF8] max-w-md w-full rounded-2xl border-2 border-[#D4AF37] shadow-2xl p-6 text-center space-y-4 relative overflow-hidden animate-slideUp">
        
        {/* Top Gold Foil Accent */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#B8001F] via-[#FFD700] to-[#B8001F]" />

        {/* Close Button */}
        <button
          onClick={() => setActiveScanResult(null)}
          className="absolute top-4 right-4 p-1.5 rounded-full bg-amber-100 text-amber-900 hover:bg-amber-200 transition-all cursor-pointer"
          title="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Status Icon */}
        <div className="pt-2">
          {success && !isDuplicate && (
            <div className="w-16 h-16 rounded-full bg-emerald-100 border-2 border-emerald-500 text-emerald-600 flex items-center justify-center mx-auto shadow-md">
              <CheckCircle2 className="w-10 h-10 animate-bounce" />
            </div>
          )}
          {success && isDuplicate && (
            <div className="w-16 h-16 rounded-full bg-amber-100 border-2 border-amber-500 text-amber-600 flex items-center justify-center mx-auto shadow-md">
              <AlertTriangle className="w-10 h-10 animate-pulse" />
            </div>
          )}
          {!success && (
            <div className="w-16 h-16 rounded-full bg-red-100 border-2 border-red-500 text-red-600 flex items-center justify-center mx-auto shadow-md">
              <XCircle className="w-10 h-10" />
            </div>
          )}
        </div>

        {/* Status Header */}
        <div>
          <span className="text-[10px] font-black tracking-widest uppercase px-3 py-1 rounded-full bg-amber-100 text-[#8B0000] border border-amber-300">
            {language === 'en' ? 'Jharapada Durga Puja 2026' : 'ଝାରପଡ଼ା ଦୁର୍ଗା ପୂଜା ୨୦୨୬'}
          </span>
          <h3 className="text-xl font-bold font-serif-royal text-[#7D0000] mt-2">
            {success && !isDuplicate && (language === 'en' ? 'Gate Entry Verified & Recorded!' : 'ପ୍ରବେଶ ଅନୁମୋଦିତ ଓ ଡାଟାବେସ୍‌ରେ ସଂରକ୍ଷିତ !')}
            {success && isDuplicate && (language === 'en' ? 'Notice: Duplicate Scan Detected' : 'ସତର୍କତା: ପୂର୍ବରୁ ପ୍ରବେଶ ହୋଇସାରିଛି')}
            {!success && (language === 'en' ? 'Invalid QR Pass' : 'ଅବୈଧ QR ପାସ୍')}
          </h3>
          <p className="text-xs text-amber-950/80 font-medium mt-1">
            {message}
          </p>
        </div>

        {/* Pass Details Card */}
        {pass && (
          <div className="bg-white/95 p-4 rounded-xl border border-amber-300 text-left text-xs space-y-2 shadow-inner">
            <div className="flex items-center justify-between pb-2 border-b border-amber-200">
              <span className="text-amber-900/70 font-semibold flex items-center gap-1.5">
                <Ticket className="w-3.5 h-3.5 text-[#B8001F]" />
                <span>Pass ID:</span>
              </span>
              <span className="font-mono font-bold text-[#8B0000] bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                {pass.id}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-amber-900/70 font-semibold flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-amber-700" />
                <span>Visitor Name:</span>
              </span>
              <span className="font-bold text-amber-950 text-sm">
                {pass.fullName}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-amber-900/70 font-semibold">Category:</span>
              <span className="font-bold text-amber-700 bg-amber-100/60 px-2 py-0.5 rounded">
                {pass.passType}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-amber-900/70 font-semibold flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                <span>Assigned Gate:</span>
              </span>
              <span className="font-bold text-emerald-800">
                Gate-B (Jharapada Jail Side)
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-amber-900/70 font-semibold flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-700" />
                <span>Valid Time Slot:</span>
              </span>
              <span className="font-semibold text-amber-950">
                {pass.visitDate} ({pass.timeSlot})
              </span>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-amber-200 text-[11px]">
              <span className="text-amber-900/70 font-semibold">Total Entry Scans:</span>
              <span className={`font-bold px-2 py-0.5 rounded ${pass.scanCount && pass.scanCount > 1 ? 'bg-amber-100 text-amber-900' : 'bg-emerald-100 text-emerald-800'}`}>
                {pass.scanCount || 1} time(s)
              </span>
            </div>
          </div>
        )}

        {/* Database Stored Status Badge */}
        <div className="bg-emerald-50 border border-emerald-300 p-2.5 rounded-xl text-emerald-900 text-xs font-semibold flex items-center justify-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>
            {language === 'en' 
              ? 'Live entry logged into Supabase (passes & pass_scans tables)' 
              : 'ଡାଟାବେସ୍‌ରେ ସଫଳତାର ସହ ପ୍ରବେଶ ରେକର୍ଡ ହେଲା ।'}
          </span>
        </div>

        {/* Action Button */}
        <button
          onClick={() => setActiveScanResult(null)}
          className="w-full crimson-button py-2.5 rounded-xl font-bold text-xs shadow-md cursor-pointer"
        >
          {language === 'en' ? 'Confirm & Close' : 'ପ୍ରମାଣିତ ହେଲା / ବନ୍ଦ କରନ୍ତୁ'}
        </button>
      </div>
    </div>
  );
};
