import React, { createContext, useContext, useState, useCallback } from 'react';
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
  HistoryStory
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
  fetchStallsFromSupabase,
  fetchPranamMessagesFromSupabase,
  insertPranamMessageToSupabase,
  likePranamMessageInSupabase
} from '../lib/supabase';

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  
  // Audio state
  isAudioPlaying: boolean;
  toggleAudio: () => void;

  // Admin state
  isAdminLoggedIn: boolean;
  setIsAdminLoggedIn: (status: boolean) => void;
  isAdminModalOpen: boolean;
  setIsAdminModalOpen: (open: boolean) => void;

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

  // Rituals
  rituals: DailyRitual[];
  updateRitualEvent: (dayKey: string, eventId: string, updatedTime: string, updatedTitleEn: string, updatedTitleOr: string) => void;

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
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');
  const [isAudioPlaying, setIsAudioPlaying] = useState<boolean>(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState<boolean>(false);
  const [isLiveModalOpen, setIsLiveModalOpen] = useState<boolean>(true);
  const [openModals, setOpenModals] = useState<Set<string>>(new Set());

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
  const [rituals, setRituals] = useState<DailyRitual[]>(initialRituals);
  const [passes, setPasses] = useState<DigitalPass[]>([]);
  const [donations, setDonations] = useState<DonationRecord[]>([]);
  const [stalls, setStalls] = useState<StallItem[]>(initialStalls);
  const [pranamMessages, setPranamMessages] = useState<PranamMessage[]>(initialPranamMessages);

  const upiId = OFFICIAL_UPI_ID;

  const [gallery, setGallery] = useState<GalleryMedia[]>(() => {
    try {
      const saved = localStorage.getItem('jpuja_gallery_2026');
      return saved ? JSON.parse(saved) : initialGallery;
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

  // Fetch initial data for ALL 10 tables from Supabase DB if configured
  React.useEffect(() => {
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

      const dbDonations = await fetchDonationsFromSupabase();
      if (dbDonations) setDonations(dbDonations);

      const dbPranam = await fetchPranamMessagesFromSupabase();
      if (dbPranam && dbPranam.length > 0) setPranamMessages(dbPranam);
    };
    loadSupabaseData();
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
  React.useEffect(() => {
    try {
      localStorage.setItem('jpuja_history_stories_2026', JSON.stringify(historyStories));
    } catch (err) {
      console.warn('Failed to persist history stories to localStorage:', err);
    }
  }, [historyStories]);

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
      return updated;
    });
  };

  // Create Pass
  const createPass = (passData: Omit<DigitalPass, 'id' | 'qrCodeValue' | 'status' | 'createdAt'>): DigitalPass => {
    const id = 'PASS-' + Math.floor(100000 + Math.random() * 900000);
    const newPass: DigitalPass = {
      ...passData,
      id,
      qrCodeValue: `JHARAPADA-PUJA-2026|PASS:${id}|NAME:${passData.fullName}|TYPE:${passData.passType}`,
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
      isAdminModalOpen,
      setIsAdminModalOpen,
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
      stalls
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

