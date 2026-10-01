import { getCityById } from './cities';

// Exact pincode to city mapping
export const PINCODE_MAP = {
  '452001': 'indore',
  '462001': 'bhopal',
  '482001': 'jabalpur',
  '474001': 'gwalior',
  '456001': 'ujjain',
  '470001': 'sagar',
  '492001': 'raipur',
  '495001': 'bilaspur',
  '491001': 'durg_bhilai',
  '440001': 'nagpur',
  '411001': 'pune',
  '400001': 'mumbai',
  '400601': 'thane',
  '422001': 'nashik',
  '431001': 'chhatrapati_sambhajinagar',
  '302001': 'jaipur',
  '342001': 'jodhpur',
  '324001': 'kota',
  '313001': 'udaipur',
  '380001': 'ahmedabad',
  '395003': 'surat',
  '390001': 'vadodara',
  '360001': 'rajkot',
  '226001': 'lucknow',
  '208001': 'kanpur',
  '221001': 'varanasi',
  '282001': 'agra',
  '211001': 'prayagraj',
  '751001': 'bhubaneswar',
  '753001': 'cuttack',
  '769001': 'rourkela',
  '781001': 'guwahati',
  '786001': 'dibrugarh',
  '788001': 'silchar',
  '110001': 'delhi',
  '201301': 'noida',
  '122001': 'gurugram',
  '201001': 'ghaziabad',
  '121001': 'faridabad',
};

// 3-digit prefix fallbacks
export const PREFIX_FALLBACK = {
  '452': 'indore',
  '462': 'bhopal',
  '482': 'jabalpur',
  '474': 'gwalior',
  '456': 'ujjain',
  '470': 'sagar',
  '492': 'raipur',
  '495': 'bilaspur',
  '491': 'durg_bhilai',
  '440': 'nagpur',
  '411': 'pune',
  '400': 'mumbai',
  '422': 'nashik',
  '431': 'chhatrapati_sambhajinagar',
  '302': 'jaipur',
  '342': 'jodhpur',
  '324': 'kota',
  '313': 'udaipur',
  '380': 'ahmedabad',
  '395': 'surat',
  '390': 'vadodara',
  '360': 'rajkot',
  '226': 'lucknow',
  '208': 'kanpur',
  '221': 'varanasi',
  '282': 'agra',
  '211': 'prayagraj',
  '751': 'bhubaneswar',
  '753': 'cuttack',
  '769': 'rourkela',
  '781': 'guwahati',
  '786': 'dibrugarh',
  '788': 'silchar',
  '110': 'delhi',
  '201': 'noida',
  '122': 'gurugram',
  '121': 'faridabad',
};

/**
 * Looks up a city by 6-digit pincode.
 * 1. Checks exact map.
 * 2. Checks 3-digit prefix fallback.
 * 3. Returns null if not found.
 */
export function lookupCityByPincode(pincode) {
  if (!pincode || String(pincode).length !== 6) return null;
  const pinStr = String(pincode).trim();

  const exactCityId = PINCODE_MAP[pinStr];
  if (exactCityId) {
    return getCityById(exactCityId);
  }

  const prefix = pinStr.slice(0, 3);
  const fallbackCityId = PREFIX_FALLBACK[prefix];
  if (fallbackCityId) {
    return getCityById(fallbackCityId);
  }

  return null;
}
