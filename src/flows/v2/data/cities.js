import { getDistanceKm, getDestinationPoint } from '../utils/geo';

// Primary hub cities across all 9 launch regions (placeholders for operations to replace)
const BASE_CITIES = [
  // मध्य प्रदेश
  { id: 'bhopal', name: 'भोपाल', state: 'मध्य प्रदेश', lat: 23.26, lng: 77.41, readers: 103435 },
  { id: 'indore', name: 'इंदौर', state: 'मध्य प्रदेश', lat: 22.72, lng: 75.86, readers: 98200 },
  { id: 'jabalpur', name: 'जबलपुर', state: 'मध्य प्रदेश', lat: 23.18, lng: 79.99, readers: 68400 },
  { id: 'gwalior', name: 'ग्वालियर', state: 'मध्य प्रदेश', lat: 26.22, lng: 78.18, readers: 64500 },
  { id: 'ujjain', name: 'उज्जैन', state: 'मध्य प्रदेश', lat: 23.18, lng: 75.78, readers: 45000 },
  { id: 'sagar', name: 'सागर', state: 'मध्य प्रदेश', lat: 23.84, lng: 78.74, readers: 38000 },

  // छत्तीसगढ़
  { id: 'raipur', name: 'रायपुर', state: 'छत्तीसगढ़', lat: 21.25, lng: 81.63, readers: 89000 },
  { id: 'bilaspur', name: 'बिलासपुर', state: 'छत्तीसगढ़', lat: 22.08, lng: 82.15, readers: 54000 },
  { id: 'durg_bhilai', name: 'दुर्ग-भिलाई', state: 'छत्तीसगढ़', lat: 21.19, lng: 81.35, readers: 62000 },
  { id: 'korba', name: 'कोरबा', state: 'छत्तीसगढ़', lat: 22.36, lng: 82.75, readers: 41000 },
  { id: 'rajnandgaon', name: 'राजनांदगांव', state: 'छत्तीसगढ़', lat: 21.10, lng: 81.03, readers: 32000 },

  // महाराष्ट्र
  { id: 'mumbai', name: 'मुंबई', state: 'महाराष्ट्र', lat: 19.08, lng: 72.88, readers: 210000 },
  { id: 'pune', name: 'पुणे', state: 'महाराष्ट्र', lat: 18.52, lng: 73.86, readers: 145000 },
  { id: 'nagpur', name: 'नागपुर', state: 'महाराष्ट्र', lat: 21.15, lng: 79.09, readers: 92000 },
  { id: 'nashik', name: 'नाशिक', state: 'महाराष्ट्र', lat: 19.99, lng: 73.79, readers: 68000 },
  { id: 'thane', name: 'ठाणे', state: 'महाराष्ट्र', lat: 19.22, lng: 72.98, readers: 78000 },
  { id: 'chhatrapati_sambhajinagar', name: 'छत्रपति संभाजीनगर', state: 'महाराष्ट्र', lat: 19.88, lng: 75.34, readers: 52000 },

  // गुजरात
  { id: 'ahmedabad', name: 'अहमदाबाद', state: 'गुजरात', lat: 23.02, lng: 72.57, readers: 185000 },
  { id: 'surat', name: 'सूरत', state: 'गुजरात', lat: 21.17, lng: 72.83, readers: 142000 },
  { id: 'vadodara', name: 'वडोदरा', state: 'गुजरात', lat: 22.31, lng: 73.18, readers: 84000 },
  { id: 'rajkot', name: 'राजकोट', state: 'गुजरात', lat: 22.30, lng: 70.80, readers: 68000 },
  { id: 'bhavnagar', name: 'भावनगर', state: 'गुजरात', lat: 21.76, lng: 72.15, readers: 42000 },

  // राजस्थान
  { id: 'jaipur', name: 'जयपुर', state: 'राजस्थान', lat: 26.91, lng: 75.79, readers: 125000 },
  { id: 'jodhpur', name: 'जोधपुर', state: 'राजस्थान', lat: 26.24, lng: 73.02, readers: 72000 },
  { id: 'kota', name: 'कोटा', state: 'राजस्थान', lat: 25.21, lng: 75.86, readers: 58000 },
  { id: 'udaipur', name: 'उदयपुर', state: 'राजस्थान', lat: 24.59, lng: 73.71, readers: 49000 },
  { id: 'bikaner', name: 'बीकानेर', state: 'राजस्थान', lat: 28.02, lng: 73.31, readers: 38000 },
  { id: 'ajmer', name: 'अजमेर', state: 'राजस्थान', lat: 26.45, lng: 74.64, readers: 44000 },

  // उत्तर प्रदेश
  { id: 'lucknow', name: 'लखनऊ', state: 'उत्तर प्रदेश', lat: 26.85, lng: 80.95, readers: 96000 },
  { id: 'kanpur', name: 'कानपुर', state: 'उत्तर प्रदेश', lat: 26.45, lng: 80.35, readers: 82000 },
  { id: 'varanasi', name: 'वाराणसी', state: 'उत्तर प्रदेश', lat: 25.32, lng: 82.97, readers: 71000 },
  { id: 'agra', name: 'आगरा', state: 'उत्तर प्रदेश', lat: 27.18, lng: 78.01, readers: 64000 },
  { id: 'prayagraj', name: 'प्रयागराज', state: 'उत्तर प्रदेश', lat: 25.43, lng: 81.85, readers: 58000 },

  // ओडिशा
  { id: 'bhubaneswar', name: 'भुवनेश्वर', state: 'ओडिशा', lat: 20.30, lng: 85.82, readers: 61000 },
  { id: 'cuttack', name: 'कटक', state: 'ओडिशा', lat: 20.46, lng: 85.88, readers: 47000 },
  { id: 'rourkela', name: 'राउरकेला', state: 'ओडिशा', lat: 22.26, lng: 84.85, readers: 28000 },

  // असम
  { id: 'guwahati', name: 'गुवाहाटी', state: 'असम', lat: 26.14, lng: 91.74, readers: 66000 },
  { id: 'dibrugarh', name: 'डिब्रूगढ़', state: 'असम', lat: 27.47, lng: 94.91, readers: 24000 },
  { id: 'silchar', name: 'सिलचर', state: 'असम', lat: 24.83, lng: 92.78, readers: 21000 },

  // दिल्ली-NCR
  { id: 'delhi', name: 'दिल्ली', state: 'दिल्ली-NCR', lat: 28.61, lng: 77.21, readers: 230000 },
  { id: 'noida', name: 'नोएडा', state: 'दिल्ली-NCR', lat: 28.57, lng: 77.32, readers: 88000 },
  { id: 'gurugram', name: 'गुरुग्राम', state: 'दिल्ली-NCR', lat: 28.46, lng: 77.03, readers: 84000 },
  { id: 'ghaziabad', name: 'गाज़ियाबाद', state: 'दिल्ली-NCR', lat: 28.67, lng: 77.42, readers: 76000 },
  { id: 'faridabad', name: 'फ़रीदाबाद', state: 'दिल्ली-NCR', lat: 28.41, lng: 77.31, readers: 52000 },
];

/**
 * Generate synthetic satellite areas (placeholders) at 12km and 22km
 * for hubs that have no nearby city within 25km.
 */
function buildCitiesWithSatellites() {
  const result = [...BASE_CITIES];

  for (const hub of BASE_CITIES) {
    // Check if any other city is within 25km
    const hasNearby = BASE_CITIES.some(
      (c) => c.id !== hub.id && getDistanceKm(hub.lat, hub.lng, c.lat, c.lng) <= 25
    );

    if (!hasNearby) {
      // Generate two satellite areas (placeholder data for operations)
      const p1 = getDestinationPoint(hub.lat, hub.lng, 12, 30); // 12km North-East
      const p2 = getDestinationPoint(hub.lat, hub.lng, 22, 210); // 22km South-West

      result.push({
        id: `${hub.id}_north`,
        name: `${hub.name} – उत्तरी क्षेत्र`,
        state: hub.state,
        lat: p1.lat,
        lng: p1.lng,
        readers: Math.round(hub.readers * 0.07),
        isSatellite: true,
      });

      result.push({
        id: `${hub.id}_south`,
        name: `${hub.name} – दक्षिणी क्षेत्र`,
        state: hub.state,
        lat: p2.lat,
        lng: p2.lng,
        readers: Math.round(hub.readers * 0.05),
        isSatellite: true,
      });
    }
  }

  return result;
}

export const CITIES = buildCitiesWithSatellites();

export const REGIONS = [
  'मध्य प्रदेश',
  'छत्तीसगढ़',
  'महाराष्ट्र',
  'गुजरात',
  'राजस्थान',
  'उत्तर प्रदेश',
  'ओडिशा',
  'असम',
  'दिल्ली-NCR',
];

export const getCityById = (id) => CITIES.find((c) => c.id === id) || CITIES[1]; // default indore

export const getCitiesByState = (state) => CITIES.filter((c) => c.state === state);
