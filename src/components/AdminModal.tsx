import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { isSupabaseConfigured, uploadGalleryImageToSupabase, testSupabaseConnection } from '../lib/supabase';
import { 
  ShieldCheck, 
  X, 
  Tv, 
  Radio, 
  Users, 
  Clock, 
  Upload, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  BarChart2, 
  Lock,
  Car,
  FolderPlus,
  Database,
  Loader2,
  RefreshCw,
  BookOpen
} from 'lucide-react';

export const AdminModal: React.FC = () => {
  const { 
    language, 
    isAdminLoggedIn, 
    setIsAdminLoggedIn, 
    isAdminModalOpen, 
    setIsAdminModalOpen,
    liveConfig,
    updateLiveConfig,
    tickers,
    addTicker,
    deleteTicker,
    toggleTickerStatus,
    crowdStatus,
    updateCrowdStatus,
    rituals,
    updateRitualEvent,
    addGalleryItem,
    deleteGalleryItem,
    gallery,
    passes,
    donations,
    historyStories,
    addHistoryStory,
    deleteHistoryStory
  } = useApp();

  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState('');
  const [adminTab, setAdminTab] = useState<'stream' | 'ticker' | 'crowd' | 'rituals' | 'upload' | 'history' | 'analytics'>('stream');

  // History / Press submission form state
  const [storyTitleEn, setStoryTitleEn] = useState('');
  const [storyTitleOr, setStoryTitleOr] = useState('');
  const [storyAuthorName, setStoryAuthorName] = useState('');
  const [storyAuthorRole, setStoryAuthorRole] = useState('Committee Member');
  const [storyCategory, setStoryCategory] = useState<'press_note' | 'member_story' | 'achievement' | 'milestone'>('press_note');
  const [storyYear, setStoryYear] = useState<number>(2026);
  const [storyContentEn, setStoryContentEn] = useState('');
  const [storyContentOr, setStoryContentOr] = useState('');
  const [storyMediaUrl, setStoryMediaUrl] = useState('');
  const [storyDocumentUrl, setStoryDocumentUrl] = useState('');
  const [storySuccess, setStorySuccess] = useState(false);

  // New Ticker state
  const [newTickerEn, setNewTickerEn] = useState('');
  const [newTickerOr, setNewTickerOr] = useState('');
  const [newTickerType, setNewTickerType] = useState<'INFO' | 'IMPORTANT' | 'EMERGENCY'>('IMPORTANT');

  // Stream config form state
  const [streamForm, setStreamForm] = useState({
    activePlatform: liveConfig.activePlatform,
    youtubeId: liveConfig.youtubeId,
    facebookUrl: liveConfig.facebookUrl,
    instagramUrl: liveConfig.instagramUrl,
    titleEn: liveConfig.titleEn,
    titleOr: liveConfig.titleOr
  });

  // Media upload form state
  const [uploadTitleEn, setUploadTitleEn] = useState('');
  const [uploadTitleOr, setUploadTitleOr] = useState('');
  const [uploadCategory, setUploadCategory] = useState<'pandal' | 'idol' | 'lights' | 'celebrities' | 'bhasani'>('pandal');
  const [uploadUrl, setUploadUrl] = useState('');
  const [selectedFileName, setSelectedFileName] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStorageSource, setUploadStorageSource] = useState<'supabase' | 'local'>('local');
  const [uploadErrorMsg, setUploadErrorMsg] = useState('');
  const [isTestingSupabase, setIsTestingSupabase] = useState(false);
  const [diagnosticResult, setDiagnosticResult] = useState<{ success: boolean; message: string } | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  if (!isAdminModalOpen) return null;

  const handleTestSupabase = async () => {
    setIsTestingSupabase(true);
    setDiagnosticResult(null);
    const result = await testSupabaseConnection();
    setDiagnosticResult(result);
    setIsTestingSupabase(false);
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === 'admin2026' || passwordInput === '1234') {
      setIsAdminLoggedIn(true);
      setLoginError('');
    } else {
      setLoginError('Invalid Admin Passcode! Use "admin2026"');
    }
  };

  const handleStreamSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateLiveConfig(streamForm);
    alert('Live Stream Configuration Updated Successfully!');
  };

  const handleAddTickerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTickerEn.trim()) return;
    addTicker({
      textEn: newTickerEn,
      textOr: newTickerOr || newTickerEn,
      type: newTickerType,
      active: true
    });
    setNewTickerEn('');
    setNewTickerOr('');
  };

  // Local File & Supabase Storage Reader Handler
  const handleFileChange = async (file: File) => {
    if (!file) return;
    setSelectedFileName(file.name);
    setIsUploading(true);
    setUploadErrorMsg('');

    if (!uploadTitleEn) {
      const nameWithoutExt = file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");
      setUploadTitleEn(nameWithoutExt);
    }

    // Try Supabase Storage upload if credentials exist
    if (isSupabaseConfigured()) {
      const { publicUrl, error } = await uploadGalleryImageToSupabase(file, 'gallery');
      if (publicUrl && !error) {
        setUploadUrl(publicUrl);
        setUploadStorageSource('supabase');
        setIsUploading(false);
        return;
      }
      console.warn('Supabase upload failed, falling back to local FileReader DataURL:', error);
      setUploadErrorMsg(error || 'Supabase storage error. Check if bucket "gallery" exists.');
    }

    // Local Base64 Data URL fallback
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      if (dataUrl) {
        setUploadUrl(dataUrl);
        setUploadStorageSource('local');
      }
      setIsUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileChange(e.target.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadTitleEn || !uploadUrl) {
      alert('Please select a photo/video file or enter a media URL!');
      return;
    }
    addGalleryItem({
      titleEn: uploadTitleEn,
      titleOr: uploadTitleOr || uploadTitleEn,
      category: uploadCategory,
      year: 2026,
      type: 'image',
      url: uploadUrl
    });
    setUploadTitleEn('');
    setUploadTitleOr('');
    setUploadUrl('');
    setSelectedFileName('');
    setUploadSuccess(true);
    setTimeout(() => setUploadSuccess(false), 3500);
  };

  const handleHistorySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!storyTitleEn || !storyContentEn || !storyAuthorName) {
      alert('Please provide Title, Story Content, and Author Name!');
      return;
    }
    addHistoryStory({
      titleEn: storyTitleEn,
      titleOr: storyTitleOr || storyTitleEn,
      authorName: storyAuthorName,
      authorRole: storyAuthorRole || 'Committee Member',
      category: storyCategory,
      year: Number(storyYear) || 2026,
      contentEn: storyContentEn,
      contentOr: storyContentOr || storyContentEn,
      mediaUrl: storyMediaUrl || undefined,
      documentUrl: storyDocumentUrl || undefined
    });
    setStoryTitleEn('');
    setStoryTitleOr('');
    setStoryAuthorName('');
    setStoryAuthorRole('Committee Member');
    setStoryContentEn('');
    setStoryContentOr('');
    setStoryMediaUrl('');
    setStoryDocumentUrl('');
    setStorySuccess(true);
    setTimeout(() => setStorySuccess(false), 3500);
  };

  const totalDonationAmount = donations.reduce((sum, d) => sum + d.amount, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fadeIn">
      <div className="glass-card-gold p-6 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border-2 border-[#D4AF37] shadow-2xl relative">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between pb-4 border-b border-amber-200 mb-6">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-[#B8001F] flex items-center justify-center text-[#FFD700] shadow-md">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold font-serif-royal text-[#7D0000]">
                {language === 'en' ? 'Hostinger Committee Control Portal' : 'ସମିତି ଆଡମିନ୍ ପୋର୍ଟାଲ୍'}
              </h3>
              <p className="text-xs text-amber-950/70 font-medium">
                Jharapada Durga Puja 2026 Admin Dashboard
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsAdminModalOpen(false)}
            className="p-2 rounded-lg bg-amber-100 text-amber-900 hover:text-black hover:bg-amber-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* LOGIN SCREEN IF NOT AUTHENTICATED */}
        {!isAdminLoggedIn ? (
          <div className="max-w-md mx-auto py-8 text-center">
            <div className="w-16 h-16 rounded-full bg-[#B8001F] border border-[#FFD700] flex items-center justify-center mx-auto mb-4 text-[#FFD700] shadow-md">
              <Lock className="w-8 h-8" />
            </div>
            <h4 className="text-xl font-bold text-[#7D0000] font-serif-royal mb-2">
              Admin Authentication Required
            </h4>
            <p className="text-xs text-amber-950/80 font-medium mb-6">
              Enter official committee security passcode to manage live streams, tickers & crowd status.
            </p>

            <form onSubmit={handleLoginSubmit} className="space-y-4">
              {loginError && (
                <div className="p-2.5 rounded-lg bg-red-100 border border-red-400 text-red-800 text-xs font-bold">
                  {loginError}
                </div>
              )}

              <div>
                <input
                  type="password"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="Enter Admin Passcode (e.g. admin2026)"
                  className="w-full bg-white border border-amber-300 rounded-xl px-4 py-3 text-sm text-amber-950 focus:outline-none focus:border-[#B8001F] text-center tracking-widest font-bold shadow-xs"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full crimson-button py-3 rounded-xl font-extrabold text-sm shadow-md"
              >
                Login to Control Portal
              </button>
            </form>
          </div>
        ) : (
          /* AUTHENTICATED DASHBOARD */
          <div>
            
            {/* Dashboard Sub-Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 border-b border-amber-200 text-xs font-bold">
              <button
                onClick={() => setAdminTab('stream')}
                className={`px-4 py-2 rounded-xl flex items-center gap-1.5 transition-all shadow-xs ${
                  adminTab === 'stream' 
                    ? 'crimson-button text-white font-extrabold border border-[#FFD700]' 
                    : 'bg-white text-amber-950 border border-amber-200 hover:bg-amber-100'
                }`}
              >
                <Tv className="w-4 h-4" />
                <span>Live Streams</span>
              </button>

              <button
                onClick={() => setAdminTab('ticker')}
                className={`px-4 py-2 rounded-xl flex items-center gap-1.5 transition-all shadow-xs ${
                  adminTab === 'ticker' 
                    ? 'crimson-button text-white font-extrabold border border-[#FFD700]' 
                    : 'bg-white text-amber-950 border border-amber-200 hover:bg-amber-100'
                }`}
              >
                <Radio className="w-4 h-4" />
                <span>Live Tickers ({tickers.length})</span>
              </button>

              <button
                onClick={() => setAdminTab('crowd')}
                className={`px-4 py-2 rounded-xl flex items-center gap-1.5 transition-all shadow-xs ${
                  adminTab === 'crowd' 
                    ? 'crimson-button text-white font-extrabold border border-[#FFD700]' 
                    : 'bg-white text-amber-950 border border-amber-200 hover:bg-amber-100'
                }`}
              >
                <Users className="w-4 h-4" />
                <span>Crowd & Parking</span>
              </button>

              <button
                onClick={() => setAdminTab('rituals')}
                className={`px-4 py-2 rounded-xl flex items-center gap-1.5 transition-all shadow-xs ${
                  adminTab === 'rituals' 
                    ? 'crimson-button text-white font-extrabold border border-[#FFD700]' 
                    : 'bg-white text-amber-950 border border-amber-200 hover:bg-amber-100'
                }`}
              >
                <Clock className="w-4 h-4" />
                <span>Ritual Schedule</span>
              </button>

              <button
                onClick={() => setAdminTab('upload')}
                className={`px-4 py-2 rounded-xl flex items-center gap-1.5 transition-all shadow-xs ${
                  adminTab === 'upload' 
                    ? 'crimson-button text-white font-extrabold border border-[#FFD700]' 
                    : 'bg-white text-amber-950 border border-amber-200 hover:bg-amber-100'
                }`}
              >
                <Upload className="w-4 h-4" />
                <span>Browse File & Upload</span>
              </button>

              <button
                onClick={() => setAdminTab('history')}
                className={`px-4 py-2 rounded-xl flex items-center gap-1.5 transition-all shadow-xs ${
                  adminTab === 'history' 
                    ? 'crimson-button text-white font-extrabold border border-[#FFD700]' 
                    : 'bg-white text-amber-950 border border-amber-200 hover:bg-amber-100'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                <span>Press & History ({historyStories.length})</span>
              </button>

              <button
                onClick={() => setAdminTab('analytics')}
                className={`px-4 py-2 rounded-xl flex items-center gap-1.5 transition-all shadow-xs ${
                  adminTab === 'analytics' 
                    ? 'crimson-button text-white font-extrabold border border-[#FFD700]' 
                    : 'bg-white text-amber-950 border border-amber-200 hover:bg-amber-100'
                }`}
              >
                <BarChart2 className="w-4 h-4" />
                <span>Analytics</span>
              </button>
            </div>

            {/* TAB 1: LIVE STREAM SWITCHER */}
            {adminTab === 'stream' && (
              <form onSubmit={handleStreamSave} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-amber-950 mb-1">
                      Default Primary Live Platform
                    </label>
                    <select
                      value={streamForm.activePlatform}
                      onChange={(e) => setStreamForm({ ...streamForm, activePlatform: e.target.value as any })}
                      className="w-full bg-white border border-amber-300 rounded-xl px-3 py-2.5 text-xs text-amber-950 font-medium focus:outline-none focus:border-[#B8001F] shadow-xs"
                    >
                      <option value="youtube">YouTube Live 4K HD</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-amber-950 mb-1">
                      YouTube Video ID / Stream Key
                    </label>
                    <input
                      type="text"
                      value={streamForm.youtubeId}
                      onChange={(e) => setStreamForm({ ...streamForm, youtubeId: e.target.value })}
                      className="w-full bg-white border border-amber-300 rounded-xl px-3 py-2.5 text-xs text-amber-950 font-medium focus:outline-none focus:border-[#B8001F] shadow-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-amber-950 mb-1">
                    Live Stream Title (English)
                  </label>
                  <input
                    type="text"
                    value={streamForm.titleEn}
                    onChange={(e) => setStreamForm({ ...streamForm, titleEn: e.target.value })}
                    className="w-full bg-white border border-amber-300 rounded-xl px-3 py-2.5 text-xs text-amber-950 font-medium focus:outline-none focus:border-[#B8001F] shadow-xs"
                  />
                </div>

                <button
                  type="submit"
                  className="crimson-button py-2.5 px-6 rounded-xl font-bold text-xs shadow-md text-white"
                >
                  Save Live Stream Settings
                </button>
              </form>
            )}

            {/* TAB 2: LIVE TICKER MANAGER */}
            {adminTab === 'ticker' && (
              <div className="space-y-6">
                
                {/* Add New Ticker Form */}
                <form onSubmit={handleAddTickerSubmit} className="bg-amber-50/90 p-4 rounded-xl border border-amber-200 space-y-3 shadow-xs">
                  <h4 className="text-xs font-bold text-[#7D0000] uppercase tracking-wider flex items-center gap-1.5">
                    <Plus className="w-4 h-4 text-[#B8001F]" /> Add New Public Announcement Ticker
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      value={newTickerEn}
                      onChange={(e) => setNewTickerEn(e.target.value)}
                      placeholder="Announcement Text (English)"
                      className="w-full bg-white border border-amber-300 rounded-xl px-3 py-2 text-xs text-amber-950 font-medium focus:outline-none focus:border-[#B8001F]"
                      required
                    />

                    <input
                      type="text"
                      value={newTickerOr}
                      onChange={(e) => setNewTickerOr(e.target.value)}
                      placeholder="Announcement Text (Odia ଓଡ଼ିଆ)"
                      className="w-full bg-white border border-amber-300 rounded-xl px-3 py-2 text-xs text-amber-950 font-medium focus:outline-none focus:border-[#B8001F]"
                    />
                  </div>

                  <div className="flex items-center justify-between gap-3">
                    <select
                      value={newTickerType}
                      onChange={(e) => setNewTickerType(e.target.value as any)}
                      className="bg-white border border-amber-300 rounded-xl px-3 py-1.5 text-xs text-amber-950 font-medium"
                    >
                      <option value="INFO">INFO (Blue Tag)</option>
                      <option value="IMPORTANT">IMPORTANT (Yellow Tag)</option>
                      <option value="EMERGENCY">EMERGENCY (Red Tag)</option>
                    </select>

                    <button
                      type="submit"
                      className="crimson-button px-4 py-2 rounded-xl text-xs font-bold text-white shadow-sm"
                    >
                      Publish Announcement
                    </button>
                  </div>
                </form>

                {/* Ticker List */}
                <div className="space-y-2">
                  {tickers.map((t) => (
                    <div key={t.id} className="p-3 bg-white rounded-xl border border-amber-200 flex items-center justify-between gap-2 shadow-xs">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          t.type === 'EMERGENCY' ? 'bg-red-600 text-white' : t.type === 'IMPORTANT' ? 'bg-amber-400 text-amber-950' : 'bg-blue-600 text-white'
                        }`}>
                          {t.type}
                        </span>
                        <span className="text-xs text-amber-950 font-medium">{t.textEn}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => toggleTickerStatus(t.id)}
                          className={`px-2.5 py-1 rounded text-[10px] font-bold ${
                            t.active ? 'bg-emerald-600 text-white' : 'bg-gray-200 text-gray-700'
                          }`}
                        >
                          {t.active ? 'ACTIVE' : 'PAUSED'}
                        </button>

                        <button
                          onClick={() => deleteTicker(t.id)}
                          className="p-1 rounded text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            )}

            {/* TAB 3: CROWD DENSITY & PARKING */}
            {adminTab === 'crowd' && (
              <div className="space-y-6">
                
                {/* 1-Click Level Selector */}
                <div>
                  <label className="block text-xs font-bold text-amber-950 mb-2">
                    1-Click Ground Crowd Density Status
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    <button
                      onClick={() => updateCrowdStatus({ level: 'normal', waitTimeMins: 10 })}
                      className={`p-4 rounded-xl border text-center transition-all ${
                        crowdStatus.level === 'normal'
                          ? 'bg-emerald-600 text-white border-emerald-500 ring-2 ring-emerald-400'
                          : 'bg-white border-amber-200 text-amber-950 hover:bg-amber-50'
                      }`}
                    >
                      <div className="text-base font-bold">🟢 Normal Crowd</div>
                      <div className="text-xs opacity-90 font-medium">Wait time &lt; 15 mins</div>
                    </button>

                    <button
                      onClick={() => updateCrowdStatus({ level: 'moderate', waitTimeMins: 25 })}
                      className={`p-4 rounded-xl border text-center transition-all ${
                        crowdStatus.level === 'moderate'
                          ? 'bg-amber-500 text-amber-950 font-bold border-amber-600 ring-2 ring-amber-400'
                          : 'bg-white border-amber-200 text-amber-950 hover:bg-amber-50'
                      }`}
                    >
                      <div className="text-base font-bold">🟡 Moderate Surge</div>
                      <div className="text-xs opacity-90 font-medium">Wait time 15-30 mins</div>
                    </button>

                    <button
                      onClick={() => updateCrowdStatus({ level: 'heavy', waitTimeMins: 50 })}
                      className={`p-4 rounded-xl border text-center transition-all ${
                        crowdStatus.level === 'heavy'
                          ? 'bg-red-600 text-white border-red-500 ring-2 ring-red-400'
                          : 'bg-white border-amber-200 text-amber-950 hover:bg-amber-50'
                      }`}
                    >
                      <div className="text-base font-bold">🔴 Heavy Surge</div>
                      <div className="text-xs opacity-90 font-medium">Wait time &gt; 45 mins</div>
                    </button>
                  </div>
                </div>

                {/* Parking Gate Occupancy Sliders */}
                <div className="bg-amber-50/90 p-4 rounded-xl border border-amber-200 space-y-4 shadow-xs">
                  <h4 className="text-xs font-bold text-[#7D0000] uppercase tracking-wider flex items-center gap-1.5">
                    <Car className="w-4 h-4 text-[#B8001F]" /> Parking Gate Occupancy Control (%)
                  </h4>

                  <div>
                    <div className="flex justify-between text-xs font-bold text-amber-950 mb-1">
                      <span>Gate-A (Cuttack Road Side)</span>
                      <span className="text-[#7D0000] font-extrabold">{crowdStatus.parking.gateA}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={crowdStatus.parking.gateA}
                      onChange={(e) => updateCrowdStatus({ parking: { ...crowdStatus.parking, gateA: Number(e.target.value) } })}
                      className="w-full accent-[#B8001F]"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-bold text-amber-950 mb-1">
                      <span>Gate-B (Jharapada Jail Side)</span>
                      <span className="text-[#7D0000] font-extrabold">{crowdStatus.parking.gateB}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={crowdStatus.parking.gateB}
                      onChange={(e) => updateCrowdStatus({ parking: { ...crowdStatus.parking, gateB: Number(e.target.value) } })}
                      className="w-full accent-[#B8001F]"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-bold text-amber-950 mb-1">
                      <span>Gate-C (Overbridge Side)</span>
                      <span className="text-[#7D0000] font-extrabold">{crowdStatus.parking.gateC}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={crowdStatus.parking.gateC}
                      onChange={(e) => updateCrowdStatus({ parking: { ...crowdStatus.parking, gateC: Number(e.target.value) } })}
                      className="w-full accent-[#B8001F]"
                    />
                  </div>
                </div>

              </div>
            )}

            {/* TAB 4: RITUAL SCHEDULE EDITOR */}
            {adminTab === 'rituals' && (
              <div className="space-y-4 max-h-[400px] overflow-y-auto pr-1">
                <h4 className="text-xs font-bold text-[#7D0000] uppercase tracking-wider">
                  Edit Daily Ritual Timings
                </h4>
                {rituals.map((day) => (
                  <div key={day.id} className="bg-amber-50/90 p-3 rounded-xl border border-amber-200 space-y-2 shadow-xs">
                    <div className="text-xs font-bold text-[#7D0000]">{day.dayTitleEn} ({day.date})</div>
                    {day.events.map((ev) => (
                      <div key={ev.id} className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                        <input
                          type="text"
                          defaultValue={ev.time}
                          onBlur={(e) => updateRitualEvent(day.dayKey, ev.id, e.target.value, ev.titleEn, ev.titleOr)}
                          className="bg-white border border-amber-300 rounded px-2 py-1 text-amber-950 font-medium"
                        />
                        <input
                          type="text"
                          defaultValue={ev.titleEn}
                          onBlur={(e) => updateRitualEvent(day.dayKey, ev.id, ev.time, e.target.value, ev.titleOr)}
                          className="bg-white border border-amber-300 rounded px-2 py-1 text-amber-950 font-medium sm:col-span-2"
                        />
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            )}

            {/* TAB 5: BROWSE LOCAL FILE & MEDIA UPLOAD */}
            {adminTab === 'upload' && (
              <div className="space-y-6">
                {/* Supabase Storage Status Header */}
                <div className={`p-3 rounded-xl border text-xs flex flex-col gap-2 ${
                  isSupabaseConfigured() 
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-950' 
                    : 'bg-amber-50 border-amber-300 text-amber-950'
                }`}>
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2 font-bold">
                      <Database className="w-4 h-4 text-[#B8001F]" />
                      <span>
                        {isSupabaseConfigured() 
                          ? '🟢 Supabase Cloud Storage: Configured' 
                          : '⚡ Supabase Credentials Missing in .env'}
                      </span>
                    </div>

                    {isSupabaseConfigured() && (
                      <button
                        type="button"
                        onClick={handleTestSupabase}
                        disabled={isTestingSupabase}
                        className="px-2.5 py-1 rounded crimson-button text-white text-[10px] font-bold flex items-center gap-1 transition-all shadow-xs"
                      >
                        {isTestingSupabase ? <Loader2 className="w-3 h-3 animate-spin" /> : <RefreshCw className="w-3 h-3" />}
                        <span>{isTestingSupabase ? 'Testing Connection...' : 'Test Supabase Bucket Connection'}</span>
                      </button>
                    )}
                  </div>

                  {diagnosticResult && (
                    <div className={`p-2 rounded text-[11px] font-medium border ${
                      diagnosticResult.success 
                        ? 'bg-emerald-100 border-emerald-400 text-emerald-900' 
                        : 'bg-red-100 border-red-400 text-red-900'
                    }`}>
                      {diagnosticResult.message}
                    </div>
                  )}
                </div>

                <form onSubmit={handleUploadSubmit} className="space-y-4">
                  {uploadSuccess && (
                    <div className="p-2.5 rounded-lg bg-emerald-100 border border-emerald-400 text-emerald-900 text-xs font-bold flex items-center gap-2 animate-bounce">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Media File Successfully Uploaded & Published to Live Website Gallery!</span>
                    </div>
                  )}

                  {uploadErrorMsg && (
                    <div className="p-2.5 rounded-lg bg-amber-100 border border-amber-400 text-amber-900 text-xs flex flex-col gap-1">
                      <div className="font-bold flex items-center gap-1.5">
                        <span>⚠️ Supabase Storage Note:</span>
                      </div>
                      <span className="text-[11px] opacity-90">{uploadErrorMsg}</span>
                      <span className="text-[10px] text-amber-950/70">
                        Make sure you created a public bucket named <b>"gallery"</b> in Supabase Dashboard -&gt; Storage. (Fell back to local file load for now).
                      </span>
                    </div>
                  )}

                  {/* Drag-and-Drop Local File Browse Area */}
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-amber-950">
                      Browse & Upload Photo / Video File
                    </label>
                    
                    <div
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      onClick={() => fileInputRef.current?.click()}
                      className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
                        isDragOver
                          ? 'border-[#B8001F] bg-red-50 scale-[1.01]'
                          : uploadUrl
                          ? 'border-emerald-500 bg-emerald-50'
                          : 'border-amber-300 bg-white hover:border-[#B8001F] hover:bg-amber-50/50'
                      }`}
                    >
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*,video/*"
                        onChange={handleFileInput}
                        className="hidden"
                      />

                      {isUploading ? (
                        <div className="py-4 space-y-2">
                          <Loader2 className="w-8 h-8 text-[#B8001F] animate-spin mx-auto" />
                          <p className="text-xs text-[#B8001F] font-bold">
                            {isSupabaseConfigured() ? 'Uploading to Supabase CDN Bucket...' : 'Processing Image File...'}
                          </p>
                        </div>
                      ) : uploadUrl ? (
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                          <div className="w-24 h-24 rounded-xl overflow-hidden border-2 border-[#D4AF37] bg-white shrink-0 shadow-lg">
                            <img src={uploadUrl} alt="Preview" className="w-full h-full object-cover" />
                          </div>
                          <div className="text-left space-y-1">
                            <span className={`px-2 py-0.5 rounded text-white text-[10px] font-bold ${
                              uploadStorageSource === 'supabase' ? 'bg-emerald-600' : 'bg-blue-600'
                            }`}>
                              {uploadStorageSource === 'supabase' ? '☁️ SUPABASE CDN URL' : '📁 LOCAL FILE LOADED'}
                            </span>
                            <h5 className="text-xs font-bold text-[#7D0000] truncate max-w-[260px]">
                              {selectedFileName || 'Image File'}
                            </h5>
                            <p className="text-[10px] text-amber-950/70 font-medium">
                              Click to choose a different photo or drag & drop another file
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <div className="w-12 h-12 rounded-full bg-[#B8001F] border border-[#FFD700] flex items-center justify-center mx-auto text-[#FFD700] shadow-md">
                            <FolderPlus className="w-6 h-6 animate-bounce" />
                          </div>
                          <h5 className="text-sm font-bold text-[#7D0000] font-serif-royal">
                            Click to Browse Computer Files or Drag & Drop Here
                          </h5>
                          <p className="text-xs text-amber-950/80 font-medium">
                            Supports high-res PNG, JPG, WebP photos & MP4 video clips (Up to 25MB)
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-amber-950 mb-1">Media Title (English)</label>
                      <input
                        type="text"
                        value={uploadTitleEn}
                        onChange={(e) => setUploadTitleEn(e.target.value)}
                        placeholder="e.g. Bauda Garh Lighting Gate 2026"
                        className="w-full bg-white border border-amber-300 rounded-xl px-3 py-2.5 text-xs text-amber-950 font-medium focus:outline-none focus:border-[#B8001F]"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-amber-950 mb-1">Media Title (Odia)</label>
                      <input
                        type="text"
                        value={uploadTitleOr}
                        onChange={(e) => setUploadTitleOr(e.target.value)}
                        placeholder="e.g. ଆଲୋକସଜ୍ଜା ୨୦୨୬"
                        className="w-full bg-white border border-amber-300 rounded-xl px-3 py-2.5 text-xs text-amber-950 font-medium focus:outline-none focus:border-[#B8001F]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-amber-950 mb-1">Gallery Category</label>
                      <select
                        value={uploadCategory}
                        onChange={(e) => setUploadCategory(e.target.value as any)}
                        className="w-full bg-white border border-amber-300 rounded-xl px-3 py-2.5 text-xs text-amber-950 font-medium focus:outline-none focus:border-[#B8001F]"
                      >
                        <option value="pandal">Pandal Architecture</option>
                        <option value="idol">Idol Sanctum</option>
                        <option value="lights">Lights & Illuminations</option>
                        <option value="celebrities">VIP / Stage</option>
                        <option value="bhasani">Bhasani Procession</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-amber-950 mb-1">Or Enter Direct Image / Media URL</label>
                      <input
                        type="text"
                        value={uploadUrl}
                        onChange={(e) => setUploadUrl(e.target.value)}
                        placeholder="https://images.unsplash.com/..."
                        className="w-full bg-white border border-amber-300 rounded-xl px-3 py-2.5 text-xs text-amber-950 font-medium focus:outline-none focus:border-[#B8001F]"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="crimson-button py-3 px-6 rounded-xl font-bold text-xs shadow-lg flex items-center justify-center gap-2 w-full sm:w-auto text-white"
                  >
                    <Upload className="w-4 h-4 text-white" />
                    <span>Publish File to Live Website Gallery</span>
                  </button>
                </form>

                {/* Published Gallery Files Delete Manager */}
                <div className="pt-6 border-t border-amber-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-[#7D0000] uppercase tracking-wider flex items-center gap-2">
                      <Trash2 className="w-4 h-4 text-[#B8001F]" />
                      <span>Manage Published Gallery Files ({gallery.length})</span>
                    </h4>
                    <span className="text-[10px] text-amber-950/70 font-medium">Click Trash Icon to Delete Any File</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[250px] overflow-y-auto pr-1">
                    {gallery.map((g) => (
                      <div
                        key={g.id}
                        className="p-2.5 bg-white rounded-xl border border-amber-200 flex items-center justify-between gap-3 hover:border-[#B8001F] transition-all shadow-xs"
                      >
                        <div className="flex items-center gap-2.5 overflow-hidden">
                          <div className="w-12 h-12 rounded-lg bg-amber-50 overflow-hidden border border-amber-200 shrink-0">
                            <img src={g.url} alt={g.titleEn} className="w-full h-full object-cover" />
                          </div>
                          <div className="truncate text-xs">
                            <h5 className="font-bold text-amber-950 truncate">{g.titleEn}</h5>
                            <div className="flex items-center gap-2 text-[10px] text-amber-900/70 font-medium mt-0.5">
                              <span className="px-1.5 py-0.2 rounded bg-[#7D0000] text-[#FFD700] uppercase font-bold text-[9px]">{g.category}</span>
                              <span>{g.year}</span>
                            </div>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            if (confirm(`Are you sure you want to delete "${g.titleEn}" from the live gallery?`)) {
                              deleteGalleryItem(g.id);
                            }
                          }}
                          className="p-2 rounded-lg bg-red-100 hover:bg-red-600 text-red-600 hover:text-white border border-red-300 transition-all shrink-0"
                          title="Delete File"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 6: PRESS RELEASE NOTES & MEMBER HISTORY PORTAL */}
            {adminTab === 'history' && (
              <div className="space-y-6">
                <form onSubmit={handleHistorySubmit} className="space-y-4">
                  {storySuccess && (
                    <div className="p-2.5 rounded-lg bg-emerald-100 border border-emerald-400 text-emerald-900 text-xs font-bold flex items-center gap-2 animate-bounce">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Press Note / History Story Published Successfully!</span>
                    </div>
                  )}

                  <div className="bg-amber-50/90 p-4 rounded-xl border border-amber-200 space-y-4 shadow-xs">
                    <h4 className="text-xs font-bold text-[#7D0000] uppercase tracking-wider flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-[#B8001F]" />
                      <span>Publish Press Release, Member Story, or Achievement</span>
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-amber-950 mb-1">Title (English)</label>
                        <input
                          type="text"
                          value={storyTitleEn}
                          onChange={(e) => setStoryTitleEn(e.target.value)}
                          placeholder="e.g. Unveiling of 120ft Bauda Garh Fort 2026"
                          className="w-full bg-white border border-amber-300 rounded-xl px-3 py-2 text-xs text-amber-950 font-medium focus:outline-none focus:border-[#B8001F]"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-amber-950 mb-1">Title (Odia)</label>
                        <input
                          type="text"
                          value={storyTitleOr}
                          onChange={(e) => setStoryTitleOr(e.target.value)}
                          placeholder="e.g. ୨୦୨୬ ମସିହା ବାଉଡ଼ ଗଡ଼ ସୁବର୍ଣ୍ଣ ତୋରଣ"
                          className="w-full bg-white border border-amber-300 rounded-xl px-3 py-2 text-xs text-amber-950 font-medium focus:outline-none focus:border-[#B8001F]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-amber-950 mb-1">Author / Member Name</label>
                        <input
                          type="text"
                          value={storyAuthorName}
                          onChange={(e) => setStoryAuthorName(e.target.value)}
                          placeholder="e.g. Er. Pramod Kumar Jena"
                          className="w-full bg-white border border-amber-300 rounded-xl px-3 py-2 text-xs text-amber-950 font-medium focus:outline-none focus:border-[#B8001F]"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-amber-950 mb-1">Author Designation / Role</label>
                        <input
                          type="text"
                          value={storyAuthorRole}
                          onChange={(e) => setStoryAuthorRole(e.target.value)}
                          placeholder="e.g. President / Founder (1976) / Secretary"
                          className="w-full bg-white border border-amber-300 rounded-xl px-3 py-2 text-xs text-amber-950 font-medium focus:outline-none focus:border-[#B8001F]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-amber-950 mb-1">Category</label>
                        <select
                          value={storyCategory}
                          onChange={(e) => setStoryCategory(e.target.value as any)}
                          className="w-full bg-white border border-amber-300 rounded-xl px-3 py-2 text-xs text-amber-950 font-medium focus:outline-none focus:border-[#B8001F]"
                        >
                          <option value="press_note">📰 Press Release Note</option>
                          <option value="member_story">👤 Member / Founder Story</option>
                          <option value="achievement">🎖️ Award & Achievement</option>
                          <option value="milestone">🏛️ Historical Milestone</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-amber-950 mb-1">Historical Year</label>
                        <input
                          type="number"
                          value={storyYear}
                          onChange={(e) => setStoryYear(Number(e.target.value))}
                          placeholder="2026"
                          className="w-full bg-white border border-amber-300 rounded-xl px-3 py-2 text-xs text-amber-950 font-medium focus:outline-none focus:border-[#B8001F]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-amber-950 mb-1">Story / Press Note Narrative (English)</label>
                      <textarea
                        rows={3}
                        value={storyContentEn}
                        onChange={(e) => setStoryContentEn(e.target.value)}
                        placeholder="Write the detailed story or press note release body..."
                        className="w-full bg-white border border-amber-300 rounded-xl px-3 py-2 text-xs text-amber-950 font-medium focus:outline-none focus:border-[#B8001F]"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-amber-950 mb-1">Press Clipping / Photo URL</label>
                        <input
                          type="text"
                          value={storyMediaUrl}
                          onChange={(e) => setStoryMediaUrl(e.target.value)}
                          placeholder="https://... image URL or press clipping scan"
                          className="w-full bg-white border border-amber-300 rounded-xl px-3 py-2 text-xs text-amber-950 font-medium focus:outline-none focus:border-[#B8001F]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-amber-950 mb-1">Press Release PDF / Document URL</label>
                        <input
                          type="text"
                          value={storyDocumentUrl}
                          onChange={(e) => setStoryDocumentUrl(e.target.value)}
                          placeholder="https://... PDF URL"
                          className="w-full bg-white border border-amber-300 rounded-xl px-3 py-2 text-xs text-amber-950 font-medium focus:outline-none focus:border-[#B8001F]"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="crimson-button py-2.5 px-6 rounded-xl font-bold text-xs shadow-md text-white flex items-center gap-1.5"
                    >
                      <Plus className="w-4 h-4 text-white" />
                      <span>Publish Story to Live Heritage Section</span>
                    </button>
                  </div>
                </form>

                {/* List Manager for Published History Stories */}
                <div className="pt-4 border-t border-amber-200 space-y-3">
                  <h4 className="text-xs font-bold text-[#7D0000] uppercase tracking-wider flex items-center gap-2">
                    <Trash2 className="w-4 h-4 text-[#B8001F]" />
                    <span>Manage Published Press Notes & Stories ({historyStories.length})</span>
                  </h4>

                  <div className="space-y-2 max-h-[250px] overflow-y-auto pr-1">
                    {historyStories.map((story) => (
                      <div key={story.id} className="p-3 bg-white rounded-xl border border-amber-200 flex items-center justify-between gap-3 shadow-xs">
                        <div className="space-y-0.5 overflow-hidden">
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.2 rounded bg-[#7D0000] text-[#FFD700] text-[9px] font-bold uppercase">
                              {story.category}
                            </span>
                            <span className="text-xs font-bold text-amber-950 truncate">{story.titleEn}</span>
                          </div>
                          <p className="text-[10px] text-amber-900/70 font-medium">
                            By {story.authorName} ({story.authorRole}) • Year {story.year}
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            if (confirm(`Delete "${story.titleEn}"?`)) {
                              deleteHistoryStory(story.id);
                            }
                          }}
                          className="p-1.5 rounded-lg bg-red-100 text-red-600 hover:bg-red-600 hover:text-white border border-red-300 transition-all shrink-0"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 6: ANALYTICS OVERVIEW */}
            {adminTab === 'analytics' && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-amber-50/90 p-4 rounded-xl border border-amber-300 text-center shadow-xs">
                  <div className="text-2xl font-black text-[#7D0000]">{passes.length}</div>
                  <div className="text-xs text-amber-950 font-bold mt-1">Total QR Passes Generated</div>
                </div>

                <div className="bg-emerald-50/90 p-4 rounded-xl border border-emerald-300 text-center shadow-xs">
                  <div className="text-2xl font-black text-emerald-800">₹{totalDonationAmount.toLocaleString('en-IN')}</div>
                  <div className="text-xs text-emerald-950 font-bold mt-1">Total Online Donations</div>
                </div>

                <div className="bg-blue-50/90 p-4 rounded-xl border border-blue-300 text-center shadow-xs">
                  <div className="text-2xl font-black text-blue-800">{liveConfig.viewersCount.toLocaleString('en-IN')}</div>
                  <div className="text-xs text-blue-950 font-bold mt-1">Active Stream Viewers</div>
                </div>
              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
};
