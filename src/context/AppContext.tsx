import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { 
  Language, 
  TickerAnnouncement, 
  LiveStreamConfig, 
  CrowdStatus, 
  DailyRitual, 
  StallItem, 
  DigitalPass, 
  DonationRecord, 
  GalleryMedia, 
  PranamMessage,
  HistoryStory,
  AdminUser,
  PassScanRecord
} from '../types';
import { 
  initialTicker, 
  initialLiveConfig, 
  initialCrowdStatus, 
  initialRituals, 
  initialStalls, 
  initialGallery, 
  initialPranamMessages,
  initialHistoryStories,
  OFFICIAL_UPI_ID
} from '../data/mockData';
import { 
  fetchGalleryFromSupabase, 
  insertGalleryToSupabase, 
  deleteGalleryFromSupabase,
  fetchHistoryStoriesFromSupabase,
  insertHistoryStoryToSupabase,
  deleteHistoryStoryFromSupabase,
  insertPassToSupabase,
  fetchPassesFromSupabase,
  insertDonationToSupabase,
  fetchDonationsFromSupabase,
  fetchTickersFromSupabase,
  insertTickerToSupabase,
  deleteTickerFromSupabase,
  toggleTickerStatusInSupabase,
  fetchLiveConfigFromSupabase,
  updateLiveConfigInSupabase,
  fetchCrowdStatusFromSupabase,
  updateCrowdStatusInSupabase,
  fetchRitualsFromSupabase,
  updateRitualInSupabase,
  updateCulturalProgramsInSupabase,
  fetchStallsFromSupabase,
  fetchPranamMessagesFromSupabase,
  insertPranamMessageToSupabase,
  likePranamMessageInSupabase,
  authenticateAdminFromSupabase,
  recordPassScanInSupabase,
  fetchPassScansFromSupabase,
  fetchSiteTranslationsFromSupabase,
  upsertSiteTranslationToSupabase,
  bulkUpsertSiteTranslationsToSupabase,
  supabase,
  isSupabaseConfigured
} from '../lib/supabase';
import { 
  DEFAULT_TRANSLATIONS, 
  DEFAULT_TRANSLATIONS_MAP 
} from '../data/translations';

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  
  // Audio state
  isAudioPlaying: boolean;
  toggleAudio: () => void;

  // Admin authentication state
  isAdminLoggedIn: boolean;
  setIsAdminLoggedIn: (status: boolean) => void;
  adminUser: AdminUser | null;
  setAdminUser: (user: AdminUser | null) => void;
  loginAdminWithCredentials: (username: string, password: string) => Promise<{ success: boolean; message: string }>;
  logoutAdmin: () => void;
  isAdminModalOpen: boolean;
  setIsAdminModalOpen: (open: boolean) => void;

  // Pass Scanning & Gate Entry State
  passScans: PassScanRecord[];
  scanPassEntry: (passIdOrValue: string, gate?: string) => Promise<{ success: boolean; pass?: DigitalPass; isDuplicate?: boolean; message: string }>;
  activeScanResult: { success: boolean; pass?: DigitalPass; isDuplicate?: boolean; message: string } | null;
  setActiveScanResult: (result: { success: boolean; pass?: DigitalPass; isDuplicate?: boolean; message: string } | null) => void;
  isCameraScannerOpen: boolean;
  setIsCameraScannerOpen: (open: boolean) => void;

  // Live Stream Landing Modal state
  isLiveModalOpen: boolean;
  setIsLiveModalOpen: (open: boolean) => void;

  // Generic Modal Tracking
  isAnyModalOpen: boolean;
  registerModalOpen: (id: string, isOpen: boolean) => void;

  // Ticker
  tickers: TickerAnnouncement[];
  addTicker: (item: Omit<TickerAnnouncement, 'id' | 'timestamp'>) => void;
  deleteTicker: (id: string) => void;
  toggleTickerStatus: (id: string) => void;

  // Live Stream
  liveConfig: LiveStreamConfig;
  updateLiveConfig: (config: Partial<LiveStreamConfig>) => void;

  // Crowd & Parking
  crowdStatus: CrowdStatus;
  updateCrowdStatus: (status: Partial<CrowdStatus>) => void;

  // Rituals & Cultural Programs
  rituals: DailyRitual[];
  updateRitualEvent: (dayKey: string, eventId: string, updatedTime: string, updatedTitleEn: string, updatedTitleOr: string) => void;
  updateCulturalProgram: (dayKey: string, programId: string, updated: Partial<{ time: string; artistEn: string; artistOr: string; typeEn: string; typeOr: string }>) => void;
  addCulturalProgram: (dayKey: string, program: { time: string; artistEn: string; artistOr: string; typeEn: string; typeOr: string }) => void;
  deleteCulturalProgram: (dayKey: string, programId: string) => void;

  // Passes
  passes: DigitalPass[];
  createPass: (pass: Omit<DigitalPass, 'id' | 'qrCodeValue' | 'status' | 'createdAt'>) => DigitalPass;

  // Donations & UPI Config
  donations: DonationRecord[];
  createDonation: (donation: Omit<DonationRecord, 'id' | 'date' | 'receiptNumber'>) => DonationRecord;
  upiId: string;

  // Gallery
  gallery: GalleryMedia[];
  addGalleryItem: (item: Omit<GalleryMedia, 'id'>) => void;
  deleteGalleryItem: (id: string) => void;

  // History Stories & Press Notes
  historyStories: HistoryStory[];
  addHistoryStory: (story: Omit<HistoryStory, 'id' | 'datePosted'>) => void;
  deleteHistoryStory: (id: string) => void;

  // Pranam / Prayer Messages
  pranamMessages: PranamMessage[];
  addPranamMessage: (name: string, location: string, message: string) => void;
  likePranamMessage: (id: string) => void;

  // Stalls
  stalls: StallItem[];

  // Dynamic Odia Custom Translations Management
  customTranslations: Record<string, string>;
  t: (key: string, defaultEn?: string, defaultOr?: string) => string;
  updateTranslation: (key: string, newOdiaText: string) => Promise<boolean>;
  bulkUpdateTranslations: (newMap: Record<string, string>) => Promise<boolean>;
  resetTranslation: (key: string) => Promise<boolean>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');
  const [isAudioPlaying, setIsAudioPlaying] = useState<boolean>(false);
  const [adminUser, setAdminUser] = useState<AdminUser | null>(() => {
    try {
      const saved = localStorage.getItem('jpuja_admin_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    try {
      return Boolean(localStorage.getItem('jpuja_admin_user'));
    } catch {
      return false;
    }
  });
  const [isAdminModalOpen, setIsAdminModalOpen] = useState<boolean>(false);
  const [isLiveModalOpen, setIsLiveModalOpen] = useState<boolean>(true);
  const [openModals, setOpenModals] = useState<Set<string>>(new Set());

  // Pass Scans State
  const [passScans, setPassScans] = useState<PassScanRecord[]>([]);
  const [isCameraScannerOpen, setIsCameraScannerOpen] = useState<boolean>(false);
  const [activeScanResult, setActiveScanResult] = useState<{
    success: boolean;
    pass?: DigitalPass;
    isDuplicate?: boolean;
    message: string;
  } | null>(null);

  const registerModalOpen = useCallback((id: string, isOpen: boolean) => {
    setOpenModals(prev => {
      const next = new Set(prev);
      if (isOpen) {
        next.add(id);
      } else {
        next.delete(id);
      }
      return next;
    });
  }, []);

  const isAnyModalOpen = isLiveModalOpen || isAdminModalOpen || openModals.size > 0;

  const [tickers, setTickers] = useState<TickerAnnouncement[]>(initialTicker);
  const [liveConfig, setLiveConfig] = useState<LiveStreamConfig>(initialLiveConfig);
  const [crowdStatus, setCrowdStatus] = useState<CrowdStatus>(initialCrowdStatus);
  const [rituals, setRituals] = useState<DailyRitual[]>(() => {
    try {
      const saved = localStorage.getItem('jpuja_rituals_2026');
      return saved ? JSON.parse(saved) : initialRituals;
    } catch {
      return initialRituals;
    }
  });
  const [passes, setPasses] = useState<DigitalPass[]>([]);
  const [donations, setDonations] = useState<DonationRecord[]>([]);
  const [stalls, setStalls] = useState<StallItem[]>(initialStalls);
  const [pranamMessages, setPranamMessages] = useState<PranamMessage[]>(initialPranamMessages);

  const upiId = OFFICIAL_UPI_ID;

  const [gallery, setGallery] = useState<GalleryMedia[]>(() => {
    try {
      const saved = localStorage.getItem('jpuja_gallery_2026');
      if (saved) {
        const parsed: GalleryMedia[] = JSON.parse(saved);
        const existingIds = new Set(parsed.map(p => p.id));
        const missingInitial = initialGallery.filter(item => !existingIds.has(item.id));
        return missingInitial.length > 0 ? [...parsed, ...missingInitial] : parsed;
      }
      return initialGallery;
    } catch {
      return initialGallery;
    }
  });

  const [historyStories, setHistoryStories] = useState<HistoryStory[]>(() => {
    try {
      const saved = localStorage.getItem('jpuja_history_stories_2026');
      return saved ? JSON.parse(saved) : initialHistoryStories;
    } catch {
      return initialHistoryStories;
    }
  });

  // Dynamic Odia Custom Translations State
  const [customTranslations, setCustomTranslations] = useState<Record<string, string>>(() => {
    try {
      const saved = localStorage.getItem('jpuja_custom_translations_2026');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Helper translation resolver: returns custom Odia translation when language === 'or'
  const t = useCallback((key: string, defaultEn?: string, defaultOr?: string): string => {
    const entry = DEFAULT_TRANSLATIONS_MAP[key];
    const fallbackEn = defaultEn || entry?.textEn || key;
    const fallbackOr = defaultOr || entry?.defaultOr || fallbackEn;

    if (language === 'or') {
      return customTranslations[key] || fallbackOr;
    }
    return fallbackEn;
  }, [language, customTranslations]);

  // Update a single Odia translation and sync with Supabase + localStorage
  const updateTranslation = async (key: string, newOdiaText: string): Promise<boolean> => {
    const updated = { ...customTranslations, [key]: newOdiaText };
    setCustomTranslations(updated);
    try {
      localStorage.setItem('jpuja_custom_translations_2026', JSON.stringify(updated));
    } catch (err) {
      console.warn('LocalStorage save error:', err);
    }
    const item = DEFAULT_TRANSLATIONS.find(tr => tr.key === key);
    return await upsertSiteTranslationToSupabase(
      key,
      item?.section || 'general',
      item?.textEn || key,
      newOdiaText
    );
  };

  // Bulk update multiple Odia translations
  const bulkUpdateTranslations = async (newMap: Record<string, string>): Promise<boolean> => {
    const updated = { ...customTranslations, ...newMap };
    setCustomTranslations(updated);
    try {
      localStorage.setItem('jpuja_custom_translations_2026', JSON.stringify(updated));
    } catch (err) {
      console.warn('LocalStorage save error:', err);
    }
    const payload = Object.entries(newMap).map(([k, val]) => {
      const item = DEFAULT_TRANSLATIONS.find(tr => tr.key === k);
      return {
        key: k,
        section: item?.section || 'general',
        textEn: item?.textEn || k,
        textOr: val
      };
    });
    return await bulkUpsertSiteTranslationsToSupabase(payload);
  };

  // Reset a translation back to original default
  const resetTranslation = async (key: string): Promise<boolean> => {
    const item = DEFAULT_TRANSLATIONS.find(tr => tr.key === key);
    const defaultOr = item?.defaultOr || '';
    const updated = { ...customTranslations };
    delete updated[key];
    setCustomTranslations(updated);
    try {
      localStorage.setItem('jpuja_custom_translations_2026', JSON.stringify(updated));
    } catch (err) {
      console.warn('LocalStorage remove error:', err);
    }
    if (item) {
      await upsertSiteTranslationToSupabase(key, item.section, item.textEn, defaultOr);
    }
    return true;
  };

  // Fetch initial data from Supabase DB and setup Realtime synchronization
  useEffect(() => {
    const loadSupabaseData = async () => {
      const dbTickers = await fetchTickersFromSupabase();
      if (dbTickers && dbTickers.length > 0) setTickers(dbTickers);

      const dbLiveConfig = await fetchLiveConfigFromSupabase();
      if (dbLiveConfig) setLiveConfig(dbLiveConfig);

      const dbCrowd = await fetchCrowdStatusFromSupabase();
      if (dbCrowd) setCrowdStatus(dbCrowd);

      const dbRituals = await fetchRitualsFromSupabase();
      if (dbRituals && dbRituals.length > 0) setRituals(dbRituals);

      const dbStalls = await fetchStallsFromSupabase();
      if (dbStalls && dbStalls.length > 0) setStalls(dbStalls);

      const dbGallery = await fetchGalleryFromSupabase();
      if (dbGallery && dbGallery.length > 0) setGallery(dbGallery);

      const dbStories = await fetchHistoryStoriesFromSupabase();
      if (dbStories && dbStories.length > 0) setHistoryStories(dbStories);

      const dbPasses = await fetchPassesFromSupabase();
      if (dbPasses) setPasses(dbPasses);

      const dbScans = await fetchPassScansFromSupabase();
      if (dbScans) setPassScans(dbScans);

      const dbDonations = await fetchDonationsFromSupabase();
      if (dbDonations) setDonations(dbDonations);

      const dbPranam = await fetchPranamMessagesFromSupabase();
      if (dbPranam && dbPranam.length > 0) setPranamMessages(dbPranam);

      const dbTranslations = await fetchSiteTranslationsFromSupabase();
      if (dbTranslations) {
        setCustomTranslations(prev => ({ ...prev, ...dbTranslations }));
      }
    };

    loadSupabaseData();

    // Setup Supabase Realtime WebSocket Channels + Polling Fallback
    let realtimeChannel: any = null;
    let pollTimer: any = null;

    if (isSupabaseConfigured() && supabase) {
      try {
        realtimeChannel = supabase
          .channel('jpuja-live-sync')
          .on(
            'postgres_changes',
            { event: '*', schema: 'public', table: 'site_translations' },
            async () => {
              const updatedTranslations = await fetchSiteTranslationsFromSupabase();
              if (updatedTranslations) {
                setCustomTranslations(prev => ({ ...prev, ...updatedTranslations }));
              }
            }
          )
          .on(
            'postgres_changes',
            { event: '*', schema: 'public', table: 'pass_scans' },
            async () => {
              const updatedScans = await fetchPassScansFromSupabase();
              if (updatedScans) setPassScans(updatedScans);
            }
          )
          .on(
            'postgres_changes',
            { event: '*', schema: 'public', table: 'passes' },
            async () => {
              const updatedPasses = await fetchPassesFromSupabase();
              if (updatedPasses) setPasses(updatedPasses);
            }
          )
          .on(
            'postgres_changes',
            { event: '*', schema: 'public', table: 'crowd_status' },
            async () => {
              const dbCrowd = await fetchCrowdStatusFromSupabase();
              if (dbCrowd) setCrowdStatus(dbCrowd);
            }
          )
          .on(
            'postgres_changes',
            { event: '*', schema: 'public', table: 'announcements' },
            async () => {
              const dbTickers = await fetchTickersFromSupabase();
              if (dbTickers && dbTickers.length > 0) setTickers(dbTickers);
            }
          )
          .subscribe();
      } catch (err) {
        console.warn('Realtime subscription error:', err);
      }

      // 4-second Polling Fallback ensures instant sync across separate devices even if Supabase Realtime replication is disabled
      pollTimer = setInterval(async () => {
        try {
          const updatedScans = await fetchPassScansFromSupabase();
          if (updatedScans) setPassScans(updatedScans);
          const updatedPasses = await fetchPassesFromSupabase();
          if (updatedPasses) setPasses(updatedPasses);
        } catch {
          // silent fail
        }
      }, 4000);
    }

    return () => {
      if (realtimeChannel && supabase) {
        supabase.removeChannel(realtimeChannel);
      }
      if (pollTimer) {
        clearInterval(pollTimer);
      }
    };
  }, []);


  // Save gallery to localStorage on update
  React.useEffect(() => {
    try {
      localStorage.setItem('jpuja_gallery_2026', JSON.stringify(gallery));
    } catch (err) {
      console.warn('Failed to persist gallery to localStorage:', err);
    }
  }, [gallery]);

  // Save history stories to localStorage on update
  useEffect(() => {
    try {
      localStorage.setItem('jpuja_history_stories_2026', JSON.stringify(historyStories));
    } catch (err) {
      console.warn('Failed to persist history stories to localStorage:', err);
    }
  }, [historyStories]);

  // Admin Authentication with Username and Password
  const loginAdminWithCredentials = async (usernameInput: string, passwordInput: string) => {
    const res = await authenticateAdminFromSupabase(usernameInput, passwordInput);
    if (res.success && res.user) {
      setAdminUser(res.user);
      setIsAdminLoggedIn(true);
      try {
        localStorage.setItem('jpuja_admin_user', JSON.stringify(res.user));
      } catch (err) {
        console.warn('LocalStorage save error:', err);
      }
      return { success: true, message: res.message };
    }
    return { success: false, message: res.message };
  };

  const logoutAdmin = () => {
    setAdminUser(null);
    setIsAdminLoggedIn(false);
    try {
      localStorage.removeItem('jpuja_admin_user');
    } catch (err) {
      console.warn('LocalStorage remove error:', err);
    }
  };

  // Record a Gate Entry when QR code is scanned
  const scanPassEntry = async (passIdOrValue: string, gate: string = 'Gate-B (Jharapada Jail Side)') => {
    const scannerName = adminUser ? `${adminUser.fullName} (${adminUser.username})` : 'Gate QR Scanner';
    const res = await recordPassScanInSupabase(passIdOrValue, gate, scannerName);

    // Update passes in memory
    if (res.pass) {
      setPasses(prev => prev.map(p => p.id === res.pass?.id ? { 
        ...p, 
        status: 'Used', 
        scannedAt: res.pass?.scannedAt, 
        scanCount: res.pass?.scanCount 
      } : p));
    }

    // Refresh pass scans list
    const updatedScans = await fetchPassScansFromSupabase();
    if (updatedScans) {
      setPassScans(updatedScans);
    } else {
      const newScan: PassScanRecord = {
        id: 'scan-' + Date.now(),
        passId: res.pass?.id || passIdOrValue,
        fullName: res.pass?.fullName || 'VIP Visitor',
        passType: res.pass?.passType || 'VIP Guest',
        gate,
        status: res.isDuplicate ? 'Duplicate Scan' : 'Entry Granted',
        scannedBy: scannerName,
        scannedAt: new Date().toLocaleTimeString()
      };
      setPassScans(prev => [newScan, ...prev]);
    }

    return res;
  };

  // Listen for ?scan_pass=... in URL (triggered when user/security scans QR code on printed paper)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const scanPassId = params.get('scan_pass');
      if (scanPassId) {
        scanPassEntry(scanPassId).then(res => {
          setActiveScanResult(res);
          // Clean up URL parameter cleanly without page reload
          const cleanUrl = window.location.pathname + window.location.hash;
          window.history.replaceState({}, document.title, cleanUrl);
        });
      }
    }
  }, []);

  // Audio synthesizer / ambient toggle
  const toggleAudio = () => {
    setIsAudioPlaying(prev => !prev);
  };

  // Ticker methods
  const addTicker = (item: Omit<TickerAnnouncement, 'id' | 'timestamp'>) => {
    const newTicker: TickerAnnouncement = {
      ...item,
      id: 't-' + Date.now(),
      timestamp: 'Just now'
    };
    setTickers(prev => [newTicker, ...prev]);
    insertTickerToSupabase(newTicker);
  };

  const deleteTicker = (id: string) => {
    setTickers(prev => prev.filter(t => t.id !== id));
    deleteTickerFromSupabase(id);
  };

  const toggleTickerStatus = (id: string) => {
    setTickers(prev => {
      const updated = prev.map(t => t.id === id ? { ...t, active: !t.active } : t);
      const target = updated.find(t => t.id === id);
      if (target) toggleTickerStatusInSupabase(id, target.active);
      return updated;
    });
  };

  // Live Stream config update
  const updateLiveConfig = (newConfig: Partial<LiveStreamConfig>) => {
    setLiveConfig(prev => {
      const updated = { ...prev, ...newConfig };
      updateLiveConfigInSupabase(updated);
      return updated;
    });
  };

  // Crowd status update
  const updateCrowdStatus = (newStatus: Partial<CrowdStatus>) => {
    setCrowdStatus(prev => {
      const updated = {
        ...prev,
        ...newStatus,
        lastUpdated: 'Just now'
      };
      updateCrowdStatusInSupabase(updated);
      return updated;
    });
  };

  // Ritual update
  const updateRitualEvent = (dayKey: string, eventId: string, updatedTime: string, updatedTitleEn: string, updatedTitleOr: string) => {
    setRituals(prev => {
      const updated = prev.map(day => {
        if (day.dayKey === dayKey) {
          const newEvents = day.events.map(ev => ev.id === eventId ? {
            ...ev,
            time: updatedTime,
            titleEn: updatedTitleEn,
            titleOr: updatedTitleOr
          } : ev);
          updateRitualInSupabase(dayKey, newEvents);
          return { ...day, events: newEvents };
        }
        return day;
      });
      try {
        localStorage.setItem('jpuja_rituals_2026', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  // Cultural program updates
  const updateCulturalProgram = (dayKey: string, programId: string, updatedData: Partial<{ time: string; artistEn: string; artistOr: string; typeEn: string; typeOr: string }>) => {
    setRituals(prev => {
      const updatedList = prev.map(day => {
        if (day.dayKey === dayKey) {
          const newPrograms = day.culturalPrograms.map(prog => prog.id === programId ? { ...prog, ...updatedData } : prog);
          updateCulturalProgramsInSupabase(dayKey, newPrograms);
          return { ...day, culturalPrograms: newPrograms };
        }
        return day;
      });
      try {
        localStorage.setItem('jpuja_rituals_2026', JSON.stringify(updatedList));
      } catch {}
      return updatedList;
    });
  };

  const addCulturalProgram = (dayKey: string, program: { time: string; artistEn: string; artistOr: string; typeEn: string; typeOr: string }) => {
    setRituals(prev => {
      const updatedList = prev.map(day => {
        if (day.dayKey === dayKey) {
          const newProgram = {
            id: 'c-' + Date.now(),
            ...program
          };
          const newPrograms = [...day.culturalPrograms, newProgram];
          updateCulturalProgramsInSupabase(dayKey, newPrograms);
          return { ...day, culturalPrograms: newPrograms };
        }
        return day;
      });
      try {
        localStorage.setItem('jpuja_rituals_2026', JSON.stringify(updatedList));
      } catch {}
      return updatedList;
    });
  };

  const deleteCulturalProgram = (dayKey: string, programId: string) => {
    setRituals(prev => {
      const updatedList = prev.map(day => {
        if (day.dayKey === dayKey) {
          const newPrograms = day.culturalPrograms.filter(prog => prog.id !== programId);
          updateCulturalProgramsInSupabase(dayKey, newPrograms);
          return { ...day, culturalPrograms: newPrograms };
        }
        return day;
      });
      try {
        localStorage.setItem('jpuja_rituals_2026', JSON.stringify(updatedList));
      } catch {}
      return updatedList;
    });
  };

  // Create Pass with verifiable URL in QR code
  const createPass = (passData: Omit<DigitalPass, 'id' | 'qrCodeValue' | 'status' | 'createdAt'>): DigitalPass => {
    const id = 'PASS-' + Math.floor(100000 + Math.random() * 900000);
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    // Embed the live verification link directly in the QR code!
    const qrUrl = `${origin}?scan_pass=${id}`;
    
    const newPass: DigitalPass = {
      ...passData,
      id,
      qrCodeValue: qrUrl,
      status: 'Approved',
      createdAt: new Date().toLocaleString()
    };
    setPasses(prev => [newPass, ...prev]);
    insertPassToSupabase(newPass);
    return newPass;
  };

  // Create Donation
  const createDonation = (donationData: Omit<DonationRecord, 'id' | 'date' | 'receiptNumber'>): DonationRecord => {
    const id = 'DON-' + Date.now();
    const receiptNum = 'JDP-80G-' + Math.floor(1000 + Math.random() * 9000);
    const newDonation: DonationRecord = {
      ...donationData,
      id,
      date: new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' }),
      receiptNumber: receiptNum
    };
    setDonations(prev => [newDonation, ...prev]);
    insertDonationToSupabase(newDonation);
    return newDonation;
  };

  // Add gallery item
  const addGalleryItem = (item: Omit<GalleryMedia, 'id'>) => {
    const newItem: GalleryMedia = {
      ...item,
      id: 'g-' + Date.now()
    };
    setGallery(prev => [newItem, ...prev]);
    insertGalleryToSupabase(newItem);
  };

  const deleteGalleryItem = (id: string) => {
    setGallery(prev => prev.filter(g => g.id !== id));
    deleteGalleryFromSupabase(id);
  };

  // History Stories & Press Release Notes
  const addHistoryStory = (story: Omit<HistoryStory, 'id' | 'datePosted'>) => {
    const newStory: HistoryStory = {
      ...story,
      id: 'hs-' + Date.now(),
      datePosted: new Date().toISOString().split('T')[0]
    };
    setHistoryStories(prev => [newStory, ...prev]);
    insertHistoryStoryToSupabase(newStory);
  };

  const deleteHistoryStory = (id: string) => {
    setHistoryStories(prev => prev.filter(hs => hs.id !== id));
    deleteHistoryStoryFromSupabase(id);
  };

  // Pranam message
  const addPranamMessage = (name: string, location: string, message: string) => {
    const newMessage: PranamMessage = {
      id: 'p-' + Date.now(),
      name: name || 'Devotee',
      location: location || 'Bhubaneswar',
      message,
      timestamp: 'Just now',
      likes: 1
    };
    setPranamMessages(prev => [newMessage, ...prev]);
    insertPranamMessageToSupabase(newMessage);
  };

  const likePranamMessage = (id: string) => {
    setPranamMessages(prev => {
      const updated = prev.map(p => {
        if (p.id === id) {
          const newLikes = p.likes + 1;
          likePranamMessageInSupabase(id, newLikes);
          return { ...p, likes: newLikes };
        }
        return p;
      });
      return updated;
    });
  };

  return (
    <AppContext.Provider value={{
      language,
      setLanguage,
      isAudioPlaying,
      toggleAudio,
      isAdminLoggedIn,
      setIsAdminLoggedIn,
      adminUser,
      setAdminUser,
      loginAdminWithCredentials,
      logoutAdmin,
      isAdminModalOpen,
      setIsAdminModalOpen,
      passScans,
      scanPassEntry,
      activeScanResult,
      setActiveScanResult,
      isCameraScannerOpen,
      setIsCameraScannerOpen,
      isLiveModalOpen,
      setIsLiveModalOpen,
      isAnyModalOpen,
      registerModalOpen,
      tickers,
      addTicker,
      deleteTicker,
      toggleTickerStatus,
      liveConfig,
      updateLiveConfig,
      crowdStatus,
      updateCrowdStatus,
      rituals,
      updateRitualEvent,
      updateCulturalProgram,
      addCulturalProgram,
      deleteCulturalProgram,
      passes,
      createPass,
      donations,
      createDonation,
      upiId,
      gallery,
      addGalleryItem,
      deleteGalleryItem,
      historyStories,
      addHistoryStory,
      deleteHistoryStory,
      pranamMessages,
      addPranamMessage,
      likePranamMessage,
      stalls,
      customTranslations,
      t,
      updateTranslation,
      bulkUpdateTranslations,
      resetTranslation
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

