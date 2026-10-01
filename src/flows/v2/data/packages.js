export const PACKAGES = [
  {
    id: 'trial',
    name: 'ट्रायल',
    dailyAmount: 100,
    days: 3,
    subtotal: 300,
    gst: 54,
    total: 354,
    tagline: 'पहली बार आज़माएँ',
  },
  {
    id: 'standard',
    name: 'स्टैंडर्ड',
    dailyAmount: 250,
    days: 7,
    subtotal: 1750,
    gst: 315,
    total: 2065,
    tagline: 'आम तौर पर सही रहता है',
    badge: 'सुझाया गया',
    isDefault: true,
  },
  {
    id: 'boost',
    name: 'बूस्ट',
    dailyAmount: 500,
    days: 7,
    subtotal: 3500,
    gst: 630,
    total: 4130,
    tagline: 'त्योहार और सीज़न के लिए',
  },
  {
    id: 'custom',
    name: 'अपना चुनें',
    tagline: 'स्लाइडर से तय करें',
  },
];

export const getPackageById = (id) => PACKAGES.find((p) => p.id === id) || PACKAGES[1];
