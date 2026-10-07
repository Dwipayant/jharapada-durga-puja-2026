import { createClient } from '@supabase/supabase-js';
import type { 
  GalleryMedia, 
  HistoryStory, 
  DigitalPass, 
  DonationRecord,
  TickerAnnouncement,
  LiveStreamConfig,
  CrowdStatus,
  DailyRitual,
  StallItem,
  PranamMessage
} from '../types';

const rawSupabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const rawSupabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Automatically sanitize URL to ensure base domain format
const sanitizeUrl = (url: string) => url.trim().replace(/\/rest\/v1\/?$/i, '').replace(/\/+$/, '');

export const supabaseUrl = sanitizeUrl(rawSupabaseUrl);
export const supabaseAnonKey = rawSupabaseAnonKey.trim();

export const isSupabaseConfigured = (): boolean => {
  return Boolean(
    supabaseUrl && 
    supabaseAnonKey && 
    supabaseUrl !== 'YOUR_SUPABASE_PROJECT_URL' && 
    supabaseAnonKey !== 'YOUR_SUPABASE_ANON_KEY' &&
    supabaseUrl.startsWith('https://')
  );
};

export const supabase = isSupabaseConfigured()
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

/**
 * Diagnostic helper to test Supabase connection & bucket availability
 */
export const testSupabaseConnection = async (): Promise<{
  success: boolean;
  message: string;
  availableBuckets?: string[];
}> => {
  if (!isSupabaseConfigured() || !supabase) {
    return {
      success: false,
      message: 'Supabase credentials missing or invalid in .env file.'
    };
  }

  try {
    const { data: files, error } = await supabase.storage.from('gallery').list('', { limit: 1 });
    
    if (error) {
      if (error.message.toLowerCase().includes('not found') || error.message.toLowerCase().includes('bucket')) {
        return {
          success: false,
          message: 'Connected to Supabase! However, bucket "gallery" was not found or is not marked Public. Please verify bucket name is "gallery" in lower-case.'
        };
      }
      return {
        success: false,
        message: `Supabase Storage Error for bucket "gallery": ${error.message}`
      };
    }

    return {
      success: true,
      message: `🟢 Supabase connected & bucket "gallery" verified! (${files?.length || 0} items listed). Ready for photo uploads & live database sync.`
    };
  } catch (err: any) {
    return {
      success: false,
      message: `Diagnostic test failed: ${err.message || err}`
    };
  }
};

/**
 * Uploads an image file to Supabase Storage bucket
 */
export const uploadGalleryImageToSupabase = async (
  file: File, 
  preferredBucket: string = 'gallery'
): Promise<{ publicUrl: string | null; error: string | null }> => {
  if (!isSupabaseConfigured() || !supabase) {
    return { 
      publicUrl: null, 
      error: 'Supabase URL & Anon Key missing in .env file.' 
    };
  }

  try {
    const fileExt = file.name.split('.').pop() || 'jpg';
    const cleanFileName = file.name.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
    const filePath = `${Date.now()}_${cleanFileName}.${fileExt}`;

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(preferredBucket)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true
      });

    if (uploadError) {
      console.error(`Supabase Storage Upload Error (bucket: ${preferredBucket}):`, uploadError);
      return { publicUrl: null, error: uploadError.message };
    }

    const { data: publicUrlData } = supabase.storage
      .from(preferredBucket)
      .getPublicUrl(uploadData.path);

    return { publicUrl: publicUrlData.publicUrl, error: null };
  } catch (err: any) {
    console.error('Unexpected Supabase upload exception:', err);
    return { publicUrl: null, error: err.message || 'Image upload failed unexpectedly.' };
  }
};


// ==============================================================================
// SUPABASE DATABASE API SYNC HELPERS (ALL 10 ENTITIES)
// ==============================================================================

/** Fetch Tickers from Supabase DB */
export const fetchTickersFromSupabase = async (): Promise<TickerAnnouncement[] | null> => {
  if (!isSupabaseConfigured() || !supabase) return null;
  try {
    const { data, error } = await supabase
      .from('tickers')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !data) return null;
    return data.map((item: any) => ({
      id: item.id,
      textEn: item.text_en,
      textOr: item.text_or || item.text_en,
      type: item.type || 'INFO',
      active: item.active !== false,
      timestamp: item.timestamp || 'Just now'
    }));
  } catch {
    return null;
  }
};

/** Insert Ticker into Supabase DB */
export const insertTickerToSupabase = async (ticker: TickerAnnouncement): Promise<boolean> => {
  if (!isSupabaseConfigured() || !supabase) return false;
  try {
    const { error } = await supabase.from('tickers').insert([{
      id: ticker.id,
      text_en: ticker.textEn,
      text_or: ticker.textOr,
      type: ticker.type,
      active: ticker.active,
      timestamp: ticker.timestamp
    }]);
    return !error;
  } catch {
    return false;
  }
};

/** Delete Ticker from Supabase DB */
export const deleteTickerFromSupabase = async (id: string): Promise<boolean> => {
  if (!isSupabaseConfigured() || !supabase) return false;
  try {
    const { error } = await supabase.from('tickers').delete().eq('id', id);
    return !error;
  } catch {
    return false;
  }
};

/** Toggle Ticker active status in Supabase DB */
export const toggleTickerStatusInSupabase = async (id: string, active: boolean): Promise<boolean> => {
  if (!isSupabaseConfigured() || !supabase) return false;
  try {
    const { error } = await supabase.from('tickers').update({ active }).eq('id', id);
    return !error;
  } catch {
    return false;
  }
};

/** Fetch Live Config from Supabase DB */
export const fetchLiveConfigFromSupabase = async (): Promise<LiveStreamConfig | null> => {
  if (!isSupabaseConfigured() || !supabase) return null;
  try {
    const { data, error } = await supabase
      .from('live_config')
      .select('*')
      .eq('id', 1)
      .maybeSingle();

    if (error || !data) return null;
    return {
      activePlatform: data.active_platform || 'youtube',
      youtubeId: data.youtube_id || 'live_jharapada_2026_stream',
      facebookUrl: data.facebook_url || '',
      instagramUrl: data.instagram_url || '',
      titleEn: data.title_en || '',
      titleOr: data.title_or || data.title_en || '',
      isLive: data.is_live !== false,
      viewersCount: data.viewers_count || 14820
    };
  } catch {
    return null;
  }
};

/** Update Live Config in Supabase DB */
export const updateLiveConfigInSupabase = async (config: Partial<LiveStreamConfig>): Promise<boolean> => {
  if (!isSupabaseConfigured() || !supabase) return false;
  try {
    const updateObj: Record<string, any> = {};
    if (config.activePlatform !== undefined) updateObj.active_platform = config.activePlatform;
    if (config.youtubeId !== undefined) updateObj.youtube_id = config.youtubeId;
    if (config.facebookUrl !== undefined) updateObj.facebook_url = config.facebookUrl;
    if (config.instagramUrl !== undefined) updateObj.instagram_url = config.instagramUrl;
    if (config.titleEn !== undefined) updateObj.title_en = config.titleEn;
    if (config.titleOr !== undefined) updateObj.title_or = config.titleOr;
    if (config.isLive !== undefined) updateObj.is_live = config.isLive;
    if (config.viewersCount !== undefined) updateObj.viewers_count = config.viewersCount;
    updateObj.updated_at = new Date().toISOString();

    const { error } = await supabase.from('live_config').update(updateObj).eq('id', 1);
    return !error;
  } catch {
    return false;
  }
};

/** Fetch Crowd Status from Supabase DB */
export const fetchCrowdStatusFromSupabase = async (): Promise<CrowdStatus | null> => {
  if (!isSupabaseConfigured() || !supabase) return null;
  try {
    const { data, error } = await supabase
      .from('crowd_status')
      .select('*')
      .eq('id', 1)
      .maybeSingle();

    if (error || !data) return null;
    return {
      level: data.level || 'moderate',
      waitTimeMins: data.wait_time_mins || 20,
      lastUpdated: data.last_updated || 'Just now',
      parking: {
        gateA: data.gate_a || 85,
        gateB: data.gate_b || 45,
        gateC: data.gate_c || 30
      }
    };
  } catch {
    return null;
  }
};

/** Update Crowd Status in Supabase DB */
export const updateCrowdStatusInSupabase = async (status: Partial<CrowdStatus>): Promise<boolean> => {
  if (!isSupabaseConfigured() || !supabase) return false;
  try {
    const updateObj: Record<string, any> = {
      last_updated: 'Just now',
      updated_at: new Date().toISOString()
    };
    if (status.level !== undefined) updateObj.level = status.level;
    if (status.waitTimeMins !== undefined) updateObj.wait_time_mins = status.waitTimeMins;
    if (status.parking?.gateA !== undefined) updateObj.gate_a = status.parking.gateA;
    if (status.parking?.gateB !== undefined) updateObj.gate_b = status.parking.gateB;
    if (status.parking?.gateC !== undefined) updateObj.gate_c = status.parking.gateC;

    const { error } = await supabase.from('crowd_status').update(updateObj).eq('id', 1);
    return !error;
  } catch {
    return false;
  }
};

/** Fetch Rituals from Supabase DB */
export const fetchRitualsFromSupabase = async (): Promise<DailyRitual[] | null> => {
  if (!isSupabaseConfigured() || !supabase) return null;
  try {
    const { data, error } = await supabase
      .from('rituals')
      .select('*')
      .order('date', { ascending: true });

    if (error || !data || data.length === 0) return null;
    return data.map((item: any) => ({
      id: item.id,
      dayKey: item.day_key,
      dayTitleEn: item.day_title_en,
      dayTitleOr: item.day_title_or || item.day_title_en,
      date: item.date,
      events: typeof item.events === 'string' ? JSON.parse(item.events) : (item.events || []),
      culturalPrograms: typeof item.cultural_programs === 'string' ? JSON.parse(item.cultural_programs) : (item.cultural_programs || [])
    }));
  } catch {
    return null;
  }
};

/** Update Ritual Events in Supabase DB */
export const updateRitualInSupabase = async (dayKey: string, events: any[]): Promise<boolean> => {
  if (!isSupabaseConfigured() || !supabase) return false;
  try {
    const { error } = await supabase
      .from('rituals')
      .update({ events })
      .eq('day_key', dayKey);
    return !error;
  } catch {
    return false;
  }
};

/** Fetch Stalls from Supabase DB */
export const fetchStallsFromSupabase = async (): Promise<StallItem[] | null> => {
  if (!isSupabaseConfigured() || !supabase) return null;
  try {
    const { data, error } = await supabase
      .from('stalls')
      .select('*')
      .order('stall_no', { ascending: true });

    if (error || !data || data.length === 0) return null;
    return data.map((item: any) => ({
      id: item.id,
      stallNo: item.stall_no,
      nameEn: item.name_en,
      nameOr: item.name_or || item.name_en,
      category: item.category,
      descriptionEn: item.description_en,
      descriptionOr: item.description_or || item.description_en,
      locationOnMap: typeof item.location_on_map === 'string' ? JSON.parse(item.location_on_map) : item.location_on_map,
      phone: item.phone,
      rating: parseFloat(item.rating) || 4.8
    }));
  } catch {
    return null;
  }
};

/** Fetch Gallery Media items from Supabase DB */
export const fetchGalleryFromSupabase = async (): Promise<GalleryMedia[] | null> => {
  if (!isSupabaseConfigured() || !supabase) return null;
  try {
    const { data, error } = await supabase
      .from('gallery')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !data) return null;
    return data.map((item: any) => ({
      id: item.id,
      titleEn: item.title_en,
      titleOr: item.title_or || item.title_en,
      category: item.category,
      year: item.year,
      type: item.type || 'image',
      url: item.url,
      thumbnailUrl: item.thumbnail_url
    }));
  } catch {
    return null;
  }
};

/** Insert new Gallery Item into Supabase DB */
export const insertGalleryToSupabase = async (item: GalleryMedia): Promise<boolean> => {
  if (!isSupabaseConfigured() || !supabase) return false;
  try {
    const { error } = await supabase.from('gallery').insert([{
      id: item.id,
      title_en: item.titleEn,
      title_or: item.titleOr,
      category: item.category,
      year: item.year,
      type: item.type,
      url: item.url
    }]);
    return !error;
  } catch {
    return false;
  }
};

/** Delete Gallery Item from Supabase DB */
export const deleteGalleryFromSupabase = async (id: string): Promise<boolean> => {
  if (!isSupabaseConfigured() || !supabase) return false;
  try {
    const { error } = await supabase.from('gallery').delete().eq('id', id);
    return !error;
  } catch {
    return false;
  }
};

/** Fetch History Stories & Press Notes from Supabase DB */
export const fetchHistoryStoriesFromSupabase = async (): Promise<HistoryStory[] | null> => {
  if (!isSupabaseConfigured() || !supabase) return null;
  try {
    const { data, error } = await supabase
      .from('history_stories')
      .select('*')
      .order('year', { ascending: false });

    if (error || !data) return null;
    return data.map((item: any) => ({
      id: item.id,
      titleEn: item.title_en,
      titleOr: item.title_or || item.title_en,
      authorName: item.author_name,
      authorRole: item.author_role,
      category: item.category,
      year: item.year,
      contentEn: item.content_en,
      contentOr: item.content_or || item.content_en,
      mediaUrl: item.media_url,
      documentUrl: item.document_url,
      datePosted: item.date_posted
    }));
  } catch {
    return null;
  }
};

/** Insert History Story into Supabase DB */
export const insertHistoryStoryToSupabase = async (story: HistoryStory): Promise<boolean> => {
  if (!isSupabaseConfigured() || !supabase) return false;
  try {
    const { error } = await supabase.from('history_stories').insert([{
      id: story.id,
      title_en: story.titleEn,
      title_or: story.titleOr,
      author_name: story.authorName,
      author_role: story.authorRole,
      category: story.category,
      year: story.year,
      content_en: story.contentEn,
      content_or: story.contentOr,
      media_url: story.mediaUrl,
      document_url: story.documentUrl,
      date_posted: story.datePosted
    }]);
    return !error;
  } catch {
    return false;
  }
};

/** Delete History Story from Supabase DB */
export const deleteHistoryStoryFromSupabase = async (id: string): Promise<boolean> => {
  if (!isSupabaseConfigured() || !supabase) return false;
  try {
    const { error } = await supabase.from('history_stories').delete().eq('id', id);
    return !error;
  } catch {
    return false;
  }
};

/** Fetch Digital Passes from Supabase DB */
export const fetchPassesFromSupabase = async (): Promise<DigitalPass[] | null> => {
  if (!isSupabaseConfigured() || !supabase) return null;
  try {
    const { data, error } = await supabase
      .from('passes')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !data) return null;
    return data.map((item: any) => ({
      id: item.id,
      passType: item.pass_type,
      fullName: item.full_name,
      phone: item.phone,
      idProofNumber: item.id_proof_number,
      numberOfGuests: item.number_of_guests,
      visitDate: item.visit_date,
      timeSlot: item.time_slot,
      qrCodeValue: item.qr_code_value,
      status: item.status,
      createdAt: item.created_at
    }));
  } catch {
    return null;
  }
};

/** Insert Digital QR Pass into Supabase DB */
export const insertPassToSupabase = async (pass: DigitalPass): Promise<boolean> => {
  if (!isSupabaseConfigured() || !supabase) return false;
  try {
    const { error } = await supabase.from('passes').insert([{
      id: pass.id,
      pass_type: pass.passType,
      full_name: pass.fullName,
      phone: pass.phone,
      id_proof_number: pass.idProofNumber,
      number_of_guests: pass.numberOfGuests,
      visit_date: pass.visitDate,
      time_slot: pass.timeSlot,
      qr_code_value: pass.qrCodeValue,
      status: pass.status
    }]);
    return !error;
  } catch {
    return false;
  }
};

/** Fetch Donation Records from Supabase DB */
export const fetchDonationsFromSupabase = async (): Promise<DonationRecord[] | null> => {
  if (!isSupabaseConfigured() || !supabase) return null;
  try {
    const { data, error } = await supabase
      .from('donations')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !data) return null;
    return data.map((item: any) => ({
      id: item.id,
      donorName: item.donor_name,
      email: item.email,
      phone: item.phone,
      amount: parseFloat(item.amount),
      category: item.category,
      paymentId: item.payment_id,
      paymentMethod: item.payment_method,
      date: item.date,
      receiptNumber: item.receipt_number
    }));
  } catch {
    return null;
  }
};

/** Insert Donation Record into Supabase DB */
export const insertDonationToSupabase = async (donation: DonationRecord): Promise<boolean> => {
  if (!isSupabaseConfigured() || !supabase) return false;
  try {
    const { error } = await supabase.from('donations').insert([{
      id: donation.id,
      donor_name: donation.donorName,
      email: donation.email,
      phone: donation.phone,
      amount: donation.amount,
      category: donation.category,
      payment_id: donation.paymentId,
      payment_method: donation.paymentMethod,
      date: donation.date,
      receipt_number: donation.receiptNumber
    }]);
    return !error;
  } catch {
    return false;
  }
};

/** Fetch Pranam Messages from Supabase DB */
export const fetchPranamMessagesFromSupabase = async (): Promise<PranamMessage[] | null> => {
  if (!isSupabaseConfigured() || !supabase) return null;
  try {
    const { data, error } = await supabase
      .from('pranam_messages')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !data) return null;
    return data.map((item: any) => ({
      id: item.id,
      name: item.name,
      location: item.location || 'Bhubaneswar',
      message: item.message,
      timestamp: item.timestamp || 'Just now',
      likes: item.likes || 1
    }));
  } catch {
    return null;
  }
};

/** Insert Pranam Message into Supabase DB */
export const insertPranamMessageToSupabase = async (msg: PranamMessage): Promise<boolean> => {
  if (!isSupabaseConfigured() || !supabase) return false;
  try {
    const { error } = await supabase.from('pranam_messages').insert([{
      id: msg.id,
      name: msg.name,
      location: msg.location,
      message: msg.message,
      timestamp: msg.timestamp,
      likes: msg.likes
    }]);
    return !error;
  } catch {
    return false;
  }
};

/** Like Pranam Message in Supabase DB */
export const likePranamMessageInSupabase = async (id: string, newLikesCount: number): Promise<boolean> => {
  if (!isSupabaseConfigured() || !supabase) return false;
  try {
    const { error } = await supabase
      .from('pranam_messages')
      .update({ likes: newLikesCount })
      .eq('id', id);
    return !error;
  } catch {
    return false;
  }
};

