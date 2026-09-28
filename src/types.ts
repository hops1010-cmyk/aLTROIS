export interface SongCut {
  id: string;
  cutNumber: string;
  title: string;
  genreTag: string;
  category: 'hardcore' | 'grindcore' | 'groove' | 'djent' | 'anthem' | 'custom';
  description: string;
  bpm: number;
  tuning: string;
  durationFormatted: string;
  durationSeconds: number;
  breakdownTimestamp: string;
  breakdownSeconds: number;
  stencilQuote?: string;
  vocalSpit?: string;
  lyrics?: string;
  lyriaPrompt: string;
  lyriaAudioUrl?: string;
  isLyriaGenerated?: boolean;
  rigTelemetry?: string;
  audioBufferUrl?: string;
}

export interface TourDate {
  id: string;
  cityCode: string;
  citySubtitle: string;
  venue: string;
  location: string;
  region: 'europe' | 'na' | 'latam' | 'apac';
  dateFormatted: string;
  moshLevel?: string;
  badge?: string;
  tags: string[];
  statusText: string;
  actionText: string;
  actionType: 'pit-pass' | 'waitlist' | 'secure' | 'rsvp';
  statusColor?: string;
  doors?: string;
  isSoldOut?: boolean;
}

export interface MerchItem {
  id: string;
  lot: string;
  title: string;
  subtitle: string;
  price: number;
  description: string;
  sizes: string[];
  badge: string;
  badgeType: 'lot' | 'limited' | 'limit' | 'vip' | 'alloy';
  imageUrl: string;
  category: 'apparel' | 'passes' | 'hardware' | 'wax';
  stockStatus?: string;
  checklist?: string[];
}

export interface CrewMember {
  unitId: string;
  name: string;
  role: string;
  specialty: string;
  photoUrl: string;
}

export interface PitRule {
  article: string;
  title: string;
  level: string;
  content: string;
}

export interface OrderItem {
  id: number;
  name: string;
  price: number;
  size?: string;
}

export interface GeneratedSongTrack {
  id: string;
  title: string;
  prompt: string;
  audioUrl: string;
  lyrics?: string;
  timestamp: number;
  model: string;
  type: string;
}
