import { Map, Drop, Flash, Trash, Car, Danger, Star, More } from 'iconsax-react';

/**
 * Citizen report categories.
 * - `suggestion` is offered as an optional ghost suggestion in the upload sheet;
 *   it never overwrites what the user has typed.
 * - Colours follow the muted editorial palette used by CATEGORY_PALETTES.
 */
export const CITIZEN_CATEGORIES = [
  { id: 'road', label: 'सड़क', icon: Map, color: '#8A5A3B', suggestion: 'सड़क पर गड्ढों से हादसे का डर, मरम्मत की मांग' },
  { id: 'water', label: 'पानी', icon: Drop, color: '#3E6E8E', suggestion: 'पाइपलाइन फटने से पानी भरा, बर्बादी जारी' },
  { id: 'power', label: 'बिजली', icon: Flash, color: '#B7791F', suggestion: 'बिना बताए घंटों बिजली गुल, लोग परेशान' },
  { id: 'clean', label: 'सफ़ाई', icon: Trash, color: '#4F7A55', suggestion: 'कचरा नहीं उठा, गंदगी व बदबू से परेशानी' },
  { id: 'traffic', label: 'ट्रैफिक', icon: Car, color: '#596776', suggestion: 'चौराहे पर जाम, गाड़ियां फंसी रहीं' },
  { id: 'safety', label: 'सुरक्षा', icon: Danger, color: '#A23B3B', suggestion: 'स्ट्रीट लाइट बंद, सुरक्षा का खतरा' },
  { id: 'event', label: 'आयोजन', icon: Star, color: '#805D76', suggestion: 'इलाके में बड़ा आयोजन, भारी भीड़' },
  { id: 'other', label: 'अन्य', icon: More, color: '#2B2437', suggestion: 'अन्य समस्या या खबर' },
];

export const getCitizenCategory = (id) =>
  CITIZEN_CATEGORIES.find((c) => c.id === id) || CITIZEN_CATEGORIES[CITIZEN_CATEGORIES.length - 1];

export const CITIZEN_RULES = {
  maxVideoSeconds: 60,
  maxVideoMB: 80,
  minHeadlineChars: 4,
  maxHeadlineChars: 100,
};

/** Fallback clip used when a locally-picked video (blob URL) is no longer available after reload. */
export const CITIZEN_FALLBACK_VIDEO = '/videos/reel-waterlogging.webm';

export const CATEGORY_FALLBACK_VIDEOS = {
  water: '/videos/reel-waterlogging.webm',
  road: '/videos/reel-potholes.webm',
  traffic: '/videos/reel-traffic-jam.webm',
  safety: '/videos/reel-jabalpur-flyover.webm',
  power: '/videos/reel-raipur-solar.webm',
  clean: '/videos/reel-waterlogging.webm',
  event: '/videos/reel-ujjain-mahakal.webm',
  other: '/videos/reel-waterlogging.webm',
};

export const CATEGORY_FALLBACK_POSTERS = {
  water: 'https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=800&q=80',
  road: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80',
  traffic: 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=800&q=80',
  safety: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80',
  power: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=800&q=80',
  clean: 'https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?auto=format&fit=crop&w=800&q=80',
  event: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80',
  other: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80',
};

export const getCategoryVideo = (catId) => CATEGORY_FALLBACK_VIDEOS[catId] || CATEGORY_FALLBACK_VIDEOS.other;
export const getCategoryPoster = (catId) => CATEGORY_FALLBACK_POSTERS[catId] || CATEGORY_FALLBACK_POSTERS.other;
