export type Language = 'en' | 'or';

export type CrowdLevel = 'normal' | 'moderate' | 'heavy';

export interface TickerAnnouncement {
  id: string;
  textEn: string;
  textOr: string;
  type: 'INFO' | 'IMPORTANT' | 'EMERGENCY';
  active: boolean;
  timestamp: string;
}

export interface LiveStreamConfig {
  activePlatform: 'youtube' | 'facebook' | 'instagram';
  youtubeId: string;
  facebookUrl: string;
  instagramUrl: string;
  titleEn: string;
  titleOr: string;
  isLive: boolean;
  viewersCount: number;
}

export interface GateParkingStatus {
  gateA: number; // 0 - 100%
  gateB: number;
  gateC: number;
}

export interface CrowdStatus {
  level: CrowdLevel;
  waitTimeMins: number;
  lastUpdated: string;
  parking: GateParkingStatus;
}

export interface DailyRitual {
  id: string;
  dayKey: 'shasthi' | 'saptami' | 'ashtami' | 'navami' | 'dashami' | 'bhasani';
  dayTitleEn: string;
  dayTitleOr: string;
  date: string;
  events: {
    id: string;
    time: string;
    titleEn: string;
    titleOr: string;
    descEn: string;
    descOr: string;
    isKeyMuhurat?: boolean;
  }[];
  culturalPrograms: {
    id: string;
    time: string;
    artistEn: string;
    artistOr: string;
    typeEn: string;
    typeOr: string;
  }[];
}

export interface StallItem {
  id: string;
  stallNo: string;
  nameEn: string;
  nameOr: string;
  category: 'food' | 'pandal' | 'amusement' | 'emergency' | 'handicraft' | 'helpdesk';
  descriptionEn: string;
  descriptionOr: string;
  locationOnMap: { x: number; y: number }; // percentage coords
  phone?: string;
  rating?: number;
}

export interface DigitalPass {
  id: string;
  passType: 'Senior Citizen' | 'Differently Abled' | 'VIP Guest' | 'Committee Patron';
  fullName: string;
  phone: string;
  idProofNumber: string;
  numberOfGuests: number;
  visitDate: string;
  timeSlot: string;
  qrCodeValue: string;
  status: 'Approved' | 'Pending';
  createdAt: string;
}

export interface DonationRecord {
  id: string;
  donorName: string;
  email: string;
  phone: string;
  amount: number;
  category: 'Bhog Seva' | 'Pushpanjali' | 'Pandal Patron' | 'General Welfare';
  paymentId: string;
  paymentMethod: string;
  date: string;
  receiptNumber: string;
}

export interface GalleryMedia {
  id: string;
  titleEn: string;
  titleOr: string;
  category: 'pandal' | 'idol' | 'lights' | 'celebrities' | 'bhasani';
  year: number;
  type: 'image' | 'video';
  url: string;
  thumbnailUrl?: string;
}

export interface PranamMessage {
  id: string;
  name: string;
  location: string;
  message: string;
  timestamp: string;
  likes: number;
}

export interface HistoryStory {
  id: string;
  titleEn: string;
  titleOr: string;
  authorName: string;
  authorRole: string; // e.g. "President", "Founder Elder (1976)", "General Secretary", "Media Spokesperson"
  category: 'press_note' | 'member_story' | 'achievement' | 'milestone';
  year: number;
  contentEn: string;
  contentOr: string;
  mediaUrl?: string; // Image / newspaper clipping scan
  documentUrl?: string; // PDF Press release
  datePosted: string;
}

